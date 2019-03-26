package com.operasolutions.rl.service.physician.charges;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response.Status;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.jooq.Field;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.inject.Inject;
import com.operasolutions.rl.schema.enums.TPermission;
import com.operasolutions.rl.schema.tables.TPhysChargeMasterLookup;
import com.sun.jersey.api.core.InjectParam;

/**
 * LookupMasterChargeResource
 *
 * @author Nirmal Kumar
 * @author Ravi Teja
 */
@Path("/" + PhysicianLookupChargeMasterResource.URL_CHARGES)
@Produces(MediaType.APPLICATION_JSON)
@RequiresAuthentication
public class PhysicianLookupChargeMasterResource {

    public static final String URL_CHARGES = "physicianChargesMasterLookup";
    public static final String URL_CHARGES_PRICE = "chargePrice";
    protected static final Logger log = LoggerFactory.getLogger(PhysicianLookupChargeMasterResource.class);

    private final PhysicianLookupChargeDao chargeDao;

    @Inject
    public PhysicianLookupChargeMasterResource(PhysicianLookupChargeDao chargeDao) {
        this.chargeDao = chargeDao;
    }

    @GET
    public List<LookupChargeMasterRepresentation> findCharges(@InjectParam MyInput params) {

        log.debug("findCharges() - start, params = " + params);

        SecurityUtils.getSubject().checkPermission(TPermission.LOOKUP_CHARGES.getPermission());

        if (params == null) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        List<LookupChargeMasterRepresentation> result = new ArrayList<LookupChargeMasterRepresentation>();

        log.debug("Converting input into internal representation...");

        List<SearchCriteria> searchCriteria = new ArrayList<SearchCriteria>();

        // if value is not present or empty or not valid operation, ignore search criteria
        if (params.hospitalIdValue != null && !params.hospitalIdValue.isEmpty() && SearchTypeEnum.getSearchType(params.hospitalIdType) != null) {
            SearchCriteria searchInputObject = new SearchCriteria();
            searchInputObject.searchType = SearchTypeEnum.getSearchType(params.hospitalIdType);
            searchInputObject.value = params.hospitalIdValue;
            searchInputObject.field = TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.HOSPITAL_ID;
            searchCriteria.add(searchInputObject);
        }
        if (params.hcpcValue != null && !params.hcpcValue.isEmpty() && SearchTypeEnum.getSearchType(params.hcpcType) != null) {
            SearchCriteria searchInputObject = new SearchCriteria();
            searchInputObject.searchType = SearchTypeEnum.getSearchType(params.hcpcType);
            searchInputObject.value = params.hcpcValue;
            searchInputObject.field = TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.HCPC;
            searchCriteria.add(searchInputObject);
        }
        if (params.revenueValue != null && !params.revenueValue.isEmpty() && SearchTypeEnum.getSearchType(params.revenueType) != null) {
            SearchCriteria searchInputObject = new SearchCriteria();
            searchInputObject.searchType = SearchTypeEnum.getSearchType(params.revenueType);
            searchInputObject.value = params.revenueValue;
            searchInputObject.field = TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.REVENUE_CODE;
            searchCriteria.add(searchInputObject);
        }
        if (params.descriptionValue != null && !params.descriptionValue.isEmpty() && SearchTypeEnum.getSearchType(params.descriptionType) != null) {
            SearchCriteria searchInputObject = new SearchCriteria();
            searchInputObject.searchType = SearchTypeEnum.getSearchType(params.descriptionType);
            searchInputObject.value = params.descriptionValue;
            searchInputObject.field = TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.DESCRIPTION;
            searchCriteria.add(searchInputObject);
        }
        if (params.modifierValue != null && !params.modifierValue.isEmpty() && SearchTypeEnum.getSearchType(params.modifierType) != null) {
            SearchCriteria searchInputObject = new SearchCriteria();
            searchInputObject.searchType = SearchTypeEnum.getSearchType(params.modifierType);
            searchInputObject.value = params.modifierValue;
            searchInputObject.field = TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.MODIFIER;
            searchCriteria.add(searchInputObject);
        }

        List<LookupChargeMasterResult> oneRecord = chargeDao.searchForCharges(searchCriteria);

        for (LookupChargeMasterResult one : oneRecord) {
            result.add(getRepresentation(one));
        }

        return result;
    }

    public static class MyInput {

        @QueryParam("hospitalIdValue")
        public String hospitalIdValue;

        @QueryParam("hospitalIdType")
        public String hospitalIdType;

        @QueryParam(value = "hcpcType")
        public String hcpcType;

        @QueryParam(value = "hcpcValue")
        public String hcpcValue;

        @QueryParam(value = "descriptionType")
        public String descriptionType;

        @QueryParam(value = "descriptionValue")
        public String descriptionValue;

        @QueryParam(value = "revenueType")
        public String revenueType;

        @QueryParam(value = "revenueValue")
        public String revenueValue;

        @QueryParam(value = "modifierType")
        public String modifierType;

        @QueryParam(value = "modifierValue")
        public String modifierValue;

        @Override
        public String toString() {
            StringBuilder result = new StringBuilder();
            result
                    .append("hospitalIdValue = ").append(hospitalIdValue).append(", hospitalIdType = ").append(hospitalIdType)
                    .append(", hcpcType = ").append(hcpcType).append(", hcpcValue = ").append(hcpcValue)
                    .append(", revenueType = ").append(revenueType).append(", revenueValue = ").append(revenueValue);

            return result.toString();
        }
    }

    /**
     * Gets representation from a record
     *
     * @param oneRecord
     * @return LookupChargeRepresentation
     */
    private LookupChargeMasterRepresentation getRepresentation(LookupChargeMasterResult oneRecord) {
        LookupChargeMasterRepresentation result = new LookupChargeMasterRepresentation();

        result.hcpcCode = oneRecord.hcpc;
        result.revenueCode = oneRecord.revenueCode;
        result.price = oneRecord.price;
        result.description = oneRecord.description;
        result.modifier = oneRecord.modifier;
        result.modDesc = oneRecord.modDesc;
        return result;
    }

    /**
     * Message class
     *
     */
    public static class LookupChargeMasterRepresentation {

        public String hcpcCode;
        public String revenueCode;
        public BigDecimal price;
        public String modifier;
        public String description;
        public String modDesc;
    }

    public static class SearchCriteria {

        public SearchTypeEnum searchType;
        public String value;
        public Field<String> field;
    }

    /**
     * JOOQ Record Result Mapping Class
     */
    public static class LookupChargeMasterResult {

        public String hcpc;
        public String revenueCode;
        public BigDecimal price;
        public String modifier;
        public String description;
        public String modDesc;
    }
}
