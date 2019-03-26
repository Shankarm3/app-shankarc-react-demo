/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.operasolutions.rl.service.physnpilookup;

import com.google.inject.Inject;
import com.operasolutions.rl.schema.enums.TPermission;
import com.operasolutions.rl.schema.tables.TPhysMaster;
import com.operasolutions.rl.service.physician.charges.PhysicianLookupChargeMasterResource.SearchCriteria;
import com.operasolutions.rl.service.physician.charges.SearchTypeEnum;
import com.sun.jersey.api.core.InjectParam;
import java.util.ArrayList;
import java.util.List;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author nirmal.kumar
 */
@Path("/" + PhysicianLookupResource.URL_CHARGES)
@Produces(MediaType.APPLICATION_JSON)
@RequiresAuthentication
public class PhysicianLookupResource {

    public static final String URL_CHARGES = "physicianLookup";
    protected static final Logger log = LoggerFactory.getLogger(PhysicianLookupResource.class);

    private final PhysicianLookupDao chargeDao;

    @Inject
    public PhysicianLookupResource(PhysicianLookupDao chargeDao) {
        this.chargeDao = chargeDao;
    }

    @GET
    public List<TPhysMasterRepresentation> findCharges(@InjectParam MyInput params) {

        log.debug("findCharges() - start, params = " + params);

        SecurityUtils.getSubject().checkPermission(TPermission.LOOKUP_CHARGES.getPermission());

        if (params == null) {
            throw new WebApplicationException(Response.Status.BAD_REQUEST);
        }

        log.debug("Converting input into internal representation...");

        List<SearchCriteria> searchCriteria = new ArrayList<SearchCriteria>();
        // if value is not present or empty or not valid operation, ignore search criteria
        if (params.hospitalIdValue != null && !params.hospitalIdValue.isEmpty() && SearchTypeEnum.getSearchType(params.hospitalIdType) != null) {
            SearchCriteria searchInputObject = new SearchCriteria();
            searchInputObject.searchType = SearchTypeEnum.getSearchType(params.hospitalIdType);
            searchInputObject.value = params.hospitalIdValue;
            searchInputObject.field = TPhysMaster.T_PHYS_MASTER.HOSPITAL_ID;
            searchCriteria.add(searchInputObject);
        }
        if (params.physicianTypeValue != null && !params.physicianTypeValue.isEmpty() && SearchTypeEnum.getSearchType(params.physicianTypeType) != null) {
            SearchCriteria searchInputObject = new SearchCriteria();
            searchInputObject.searchType = SearchTypeEnum.getSearchType(params.physicianTypeType);
            searchInputObject.value = params.physicianTypeValue;
            searchInputObject.field = TPhysMaster.T_PHYS_MASTER.TYPE;
            searchCriteria.add(searchInputObject);
        }
        if (params.npiValue != null && !params.npiValue.isEmpty() && SearchTypeEnum.getSearchType(params.npiType) != null) {
            SearchCriteria searchInputObject = new SearchCriteria();
            searchInputObject.searchType = SearchTypeEnum.getSearchType(params.npiType);
            searchInputObject.value = params.npiValue;
            searchInputObject.field = TPhysMaster.T_PHYS_MASTER.NPI;
            searchCriteria.add(searchInputObject);
        }
        if (params.codeValue != null && !params.codeValue.isEmpty() && SearchTypeEnum.getSearchType(params.codeType) != null) {
            SearchCriteria searchInputObject = new SearchCriteria();
            searchInputObject.searchType = SearchTypeEnum.getSearchType(params.codeType);
            searchInputObject.value = params.codeValue;
            searchInputObject.field = TPhysMaster.T_PHYS_MASTER.CODE;
            searchCriteria.add(searchInputObject);
        }
        if (params.nameValue != null && !params.nameValue.isEmpty() && SearchTypeEnum.getSearchType(params.nameType) != null) {
            SearchCriteria searchInputObject = new SearchCriteria();
            searchInputObject.searchType = SearchTypeEnum.getSearchType(params.nameType);
            searchInputObject.value = params.nameValue;
            searchInputObject.field = TPhysMaster.T_PHYS_MASTER.NAME;
            searchCriteria.add(searchInputObject);
        }

        return chargeDao.searchForCharges(searchCriteria);

    }

    public static class MyInput {

        @QueryParam("hospitalIdValue")
        public String hospitalIdValue;

        @QueryParam("hospitalIdType")
        public String hospitalIdType;

        @QueryParam(value = "physicianTypeType")
        public String physicianTypeType;

        @QueryParam(value = "physicianTypeValue")
        public String physicianTypeValue;

        @QueryParam(value = "npiType")
        public String npiType;

        @QueryParam(value = "npiValue")
        public String npiValue;

        @QueryParam(value = "codeType")
        public String codeType;

        @QueryParam(value = "codeValue")
        public String codeValue;

        @QueryParam(value = "nameType")
        public String nameType;

        @QueryParam(value = "nameValue")
        public String nameValue;

    }

    public static class TPhysMasterRepresentation {

        public String name;
        public String npi;
        public String physicianType;
        public String code;
        public java.sql.Date terminationDate;
        public java.sql.Date startDate;
        public boolean isEmployed;
        public String type;
    }
}
