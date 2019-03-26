package com.operasolutions.rl.service.diagnose;

import java.net.URI;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriInfo;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.inject.Inject;
import com.operasolutions.rl.schema.enums.TPermission;
import com.operasolutions.rl.schema.tables.TDiagCodes;
import com.operasolutions.rl.schema.tables.records.TDiagCodesRecord;
import com.operasolutions.rl.service.physician.charges.PhysicianLookupChargeMasterResource.SearchCriteria;
import com.operasolutions.rl.service.physician.charges.SearchTypeEnum;
import com.sun.jersey.api.NotFoundException;
import com.sun.jersey.api.core.InjectParam;
import java.util.ArrayList;
import java.util.List;
import javax.ws.rs.QueryParam;

@Path("/" + DiagnoseResource.URL_DIAGNOSES)
@Produces(MediaType.APPLICATION_JSON)
@RequiresAuthentication
public class DiagnoseResource {

    public static final String URL_DIAGNOSES = "diagnoses";

    protected static final Logger log = LoggerFactory.getLogger(DiagnoseResource.class);

    private final DiagnoseDao diagnoseDao;

    @Context
    UriInfo uriInfo;

    @Inject
    public DiagnoseResource(DiagnoseDao diagnoseDao) {
        this.diagnoseDao = diagnoseDao;
    }

    @GET
    public List<DiagnoseResult> findCharges(@InjectParam MyInput params) {

        log.debug("findCharges() - start, params = " + params);

        SecurityUtils.getSubject().checkPermission(TPermission.LOOKUP_CHARGES.getPermission());

        if (params == null) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        log.debug("Converting input into internal representation...");

        List<SearchCriteria> searchCriteria = new ArrayList<SearchCriteria>();

        // if value is not present or empty or not valid operation, ignore search criteria
        if (params.diagCodeValue != null && !params.diagCodeValue.isEmpty() && SearchTypeEnum.getSearchType(params.diagCodeType) != null) {
            SearchCriteria searchInputObject = new SearchCriteria();
            searchInputObject.searchType = SearchTypeEnum.getSearchType(params.diagCodeType);
            searchInputObject.value = params.diagCodeValue;
            searchInputObject.field = TDiagCodes.T_DIAG_CODES.CODE_VALUE;
            searchCriteria.add(searchInputObject);
        }

        if (params.descriptionValue != null && !params.descriptionValue.isEmpty() && SearchTypeEnum.getSearchType(params.descriptionType) != null) {
            SearchCriteria searchInputObject = new SearchCriteria();
            searchInputObject.searchType = SearchTypeEnum.getSearchType(params.descriptionType);
            searchInputObject.value = params.descriptionValue;
            searchInputObject.field = TDiagCodes.T_DIAG_CODES.DESCRIPTION;
            searchCriteria.add(searchInputObject);
        }
        return diagnoseDao.searchForCharges(searchCriteria);

    }

    @GET
    @Path("/{diagnoseCode}")
    public DiagnoseRepresentation getDiagnose(@PathParam("diagnoseCode") String diagnoseCode) {

        log.debug("getDiagnose() - start, diagnoseCode = " + diagnoseCode);

        SecurityUtils.getSubject().checkPermission(TPermission.READ_DIAGNOSE.getPermission());

        if (diagnoseCode == null || diagnoseCode.isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        TDiagCodesRecord record = diagnoseDao.getDiagnoseByCode(diagnoseCode);

        if (record == null) {
            throw new NotFoundException("Diagnose not found.");
        }

        return getRepresentation(record);
    }

    public DiagnoseRepresentation getRepresentation(TDiagCodesRecord record) {
        DiagnoseRepresentation result = new DiagnoseRepresentation();

        result.uri = uriInfo.getBaseUriBuilder().path(DiagnoseResource.class).path(record.getCodeValue()).build();
        result.diagCode = record.getCodeValue();
        result.description = record.getDescription();

        return result;
    }

    /**
     * DiagnoseRepresentation - message class
     */
    public static class DiagnoseRepresentation {

        public URI uri;

        public String diagCode;
        public String description;
    }

    public static class DiagnoseResult {

        public String diagCode;
        public String description;
    }

    public static class MyInput {

        @QueryParam("diagCodeValue")
        public String diagCodeValue;

        @QueryParam("diagCodeType")
        public String diagCodeType;

        @QueryParam(value = "descriptionType")
        public String descriptionType;

        @QueryParam(value = "descriptionValue")
        public String descriptionValue;

        @Override
        public String toString() {
            return "MyInput{" + "diagCodeValue=" + diagCodeValue + ", diagCodeType=" + diagCodeType + ", descriptionType=" + descriptionType + ", descriptionValue=" + descriptionValue + '}';
        }

    }
}
