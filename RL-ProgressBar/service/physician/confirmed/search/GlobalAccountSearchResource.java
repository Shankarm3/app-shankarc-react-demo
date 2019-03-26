/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.operasolutions.rl.service.physician.confirmed.search;

import com.google.inject.Inject;
import com.operasolutions.rl.common.LookupTypes;
import com.operasolutions.rl.schema.enums.TPermission;
import com.sun.jersey.api.core.InjectParam;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriInfo;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author nirmal.kumar
 */
@Path("/" + GlobalAccountSearchResource.URL_GLOBAL_SERACH_ACCOUNT)
@RequiresAuthentication
@Produces(MediaType.APPLICATION_JSON)
public class GlobalAccountSearchResource {

    public static final String URL_GLOBAL_SERACH_ACCOUNT = "globalSearchByAccount";
    public static final String URL_GLOBAL_SERACH_FILTER = "globalSearchByAccount";
    public static final String URL_FILTER_PARAMETER = "getFilterParamer";
    public static final String URL_GET_ADDITIONAL_ACCOUNTS = "getAdditionalAccount";
    protected static final Logger log = LoggerFactory.getLogger(GlobalAccountSearchResource.class);
    private final GlobalAccountSearchDao globalAccountSearchDao;
    @Context
    UriInfo uriInfo;

    @Inject
    public GlobalAccountSearchResource(GlobalAccountSearchDao globalAccountSearchDao) {
        this.globalAccountSearchDao = globalAccountSearchDao;
    }

    @GET
    public List<GlobalSearchRepresentation> getGlobalSearchAccountById(@QueryParam("accountId") String accountId) {
        log.debug("getGlobalSearchAccountById() - start, accountId = " + accountId);

        if (accountId == null || accountId.trim().isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }
        SecurityUtils.getSubject().checkPermission(TPermission.READ_CONFIRMED_CHARGES.getPermission());
        String uriCharges = uriInfo.getBaseUriBuilder().path(GlobalChargeResource.class).queryParam(GlobalChargeResource.HOSPITAL_ID, "HOSPITAL_ID").queryParam(GlobalChargeResource.ACCOUNT_ID, "ACCOUNT_ID").build().toString();
        return globalAccountSearchDao.getGlobalSearchAccountById(accountId, uriCharges);
    }

    @GET
    @Path(URL_GLOBAL_SERACH_FILTER)
    public List<GlobalSearchRepresentation> getGlobalSearchAccountByFilter(@InjectParam MyInput params) {

        if (params == null) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }
        log.debug("getGlobalSearchAccountByFilter() - start," + params.toString());

//        if (!isInputParameterValid(params)) {
//            throw new WebApplicationException(Status.BAD_REQUEST);
//        }
        SecurityUtils.getSubject().checkPermission(TPermission.READ_CONFIRMED_CHARGES.getPermission());
        String uriCharges = uriInfo.getBaseUriBuilder().path(GlobalChargeResource.class).queryParam(GlobalChargeResource.HOSPITAL_ID, "HOSPITAL_ID").queryParam(GlobalChargeResource.ACCOUNT_ID, "ACCOUNT_ID").build().toString();
        return globalAccountSearchDao.getGlobalSearchAccountByFilter(params, uriCharges);
    }

    @GET
    @Path(URL_FILTER_PARAMETER)
    public Map getFilterParamer() {
        log.debug("getFilterParamer() - start,");
        SecurityUtils.getSubject().checkPermission(TPermission.READ_CONFIRMED_CHARGES.getPermission());
        Map map = new HashMap();
        map.put(LookupTypes.TYPE_PATTYPE, globalAccountSearchDao.getLookupType(LookupTypes.TYPE_PATTYPE));
        map.put(LookupTypes.TYPE_PATSUBTYPE, globalAccountSearchDao.getLookupType(LookupTypes.TYPE_PATSUBTYPE));
        map.put("FACILITY", globalAccountSearchDao.getHospitalList());
        return map;
    }

    /**
     * Message class
     */
    public static class GlobalSearchRepresentation {

        public String uriCharges;
        public String hospitalId;
        public Integer age;
        public String gender;
        public String name;
        public String accountId;
        public String shortName;
        public String patientId;
        public String patType;
        public String patTypeWithDescription;
        public String patSubType;
        public String patSubTypeWithDescription;
        public String dischargeDate;
        public String admitDate;
        public String transferDate;
        public String financialClass;
        public String sumOfPredValue;
        public String insurance;
        public String insuranceName;
        public String dob;
        public String custom1;
        public String custom2;
        public String custom3;
        public String custom4;
    }

    /**
     * Checks input parameters
     *
     * @param params
     * @return result - true/false
     */
    private boolean isInputParameterValid(MyInput params) {
        boolean result = true;

        // I don't care about previous results, I check all parameters
//        if (params.hospitalId == null || params.hospitalId.trim().isEmpty()) {
//            result = false;
//        }
//        if (params.patType == null || params.patType.trim().isEmpty()) {
//            result = false;
//        }
//        if (params.patSubType == null || params.patSubType.trim().isEmpty()) {
//            result = false;
//        }
        if (params.admitStartDate == null || params.admitStartDate.trim().isEmpty()) {
            result = false;
        }
        if (params.admitEndDate == null || params.admitEndDate.trim().isEmpty()) {
            result = false;
        }
        if (params.dischargeStartDate == null || params.dischargeStartDate.trim().isEmpty()) {
            result = false;
        }
        if (params.dischargeEndDate == null || params.dischargeEndDate.trim().isEmpty()) {
            result = false;
        }
        if (params.unBilledAccounts == null) {
            if (params.transferStartDate == null || params.transferStartDate.trim().isEmpty()) {
                result = false;
            }
            if (params.transferEndDate == null || params.transferEndDate.trim().isEmpty()) {
                result = false;
            }
        }
        return result;
    }

    public static class MyInput {

        @QueryParam(value = "hospitalId")
        public List<String> hospitalId;

        @QueryParam(value = "patType")
        public List<String> patType;

        @QueryParam(value = "patSubType")
        public List<String> patSubType;

        @QueryParam(value = "admitStartDate")
        public String admitStartDate;

        @QueryParam(value = "admitEndDate")
        public String admitEndDate;

        @QueryParam(value = "dischargeStartDate")
        public String dischargeStartDate;

        @QueryParam(value = "dischargeEndDate")
        public String dischargeEndDate;

        @QueryParam(value = "transferStartDate")
        public String transferStartDate;

        @QueryParam(value = "transferEndDate")
        public String transferEndDate;

        @QueryParam(value = "unBilledAccounts")
        public String unBilledAccounts;

        @Override
        public String toString() {
            return "MyInput{" + "hospitalId=" + hospitalId + ", patType=" + patType + ", patSubType=" + patSubType + ", admitStartDate=" + admitStartDate + ", admitEndDate=" + admitEndDate + ", dischargeStartDate=" + dischargeStartDate + ", dischargeEndDate=" + dischargeEndDate + ", transferStartDate=" + transferStartDate + ", transferEndDate=" + transferEndDate + ", unBilledAccounts=" + unBilledAccounts + '}';
        }

    }

}
