/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.operasolutions.rl.service.physician.confirmed.search;

import com.google.inject.Inject;
import com.operasolutions.rl.auth.AuthUtils;
import com.operasolutions.rl.common.ActivityLogUtils;
import com.operasolutions.rl.common.DateUtils;
import com.operasolutions.rl.common.DbUtils;
import com.operasolutions.rl.schema.enums.TPermission;
import static com.operasolutions.rl.service.diagnose.DiagnoseResource.URL_DIAGNOSES;
import com.operasolutions.rl.service.physician.PhysicianAccountResource;
import com.operasolutions.rl.service.physician.PhysicianAccountViewResource;
import static com.operasolutions.rl.service.physician.PhysicianAccountViewResource.URL_HCPCS;
import static com.operasolutions.rl.service.physician.PhysicianAccountViewResource.URL_PROCEDURES;
import com.operasolutions.rl.service.physician.charges.PhysicianChargesResource;
import static com.operasolutions.rl.service.physician.charges.PhysicianChargesResource.URL_PHYSICIAN_DETAIL;
import com.sun.jersey.api.core.ResourceContext;
import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriInfo;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.AuthorizationException;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.text.ParseException;

/**
 *
 * @author nirmal.kumar
 */
@Path("/" + GlobalChargeResource.URL_CHARGES)
@Produces(MediaType.APPLICATION_JSON)
@RequiresAuthentication
public class GlobalChargeResource {

    public static final String URL_CHARGES = "globalCharges";
    public static final String URL_EXISTING_PHYSICIAN_CHARGES = "existingPhysicianCharges";
    public static final String URL_MISSING_PHYSICIAN_CHARGES = "missingPhysicianCharges";
    public static final String URL_OTHER_PHYSICIAN_CHARGES = "otherDiscoverCharges";
    public static final String URL_PHYSICIAN_STATS_PANEL = "physicianAccountStatsPanel";
    public static final String HOSPITAL_ID = "hospitalId";
    public static final String ACCOUNT_ID = "accountId";
    protected static final Logger log = LoggerFactory.getLogger(GlobalChargeResource.class);
    @Context
    UriInfo uriInfo;

    @Context
    ResourceContext rc;

    private final GlobalChargeDao globalChargeDao;
    protected final ActivityLogUtils activityLogUtils;

    @Inject
    public GlobalChargeResource(GlobalChargeDao globalChargeDao, ActivityLogUtils activityLogUtils) {
        this.globalChargeDao = globalChargeDao;
        this.activityLogUtils = activityLogUtils;
    }

    /**
     * GlobalChargeRepresentation message class
     *
     * @param hospitalId
     * @param accountId
     * @return
     */
    @GET
    public Map getAllChargesForAccount(@QueryParam(HOSPITAL_ID) String hospitalId, @QueryParam(ACCOUNT_ID) String accountId) {
        log.debug("getAllChargesForAccount() - start, hospitalId = " + hospitalId + ", accountId = " + accountId);

        SecurityUtils.getSubject().checkPermission(TPermission.READ_ALL_CHARGES.getPermission());

        if (hospitalId == null || hospitalId.trim().isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }
        if (accountId == null || accountId.trim().isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }
        Map map = new HashMap<String, Object>();
        map.put("uriExistingCharges", uriInfo.getBaseUriBuilder().path(PhysicianChargesResource.class).path(PhysicianChargesResource.URL_EXISTING_CHARGES).build(hospitalId, accountId));
        map.put("uriExistingPhysicianCharges", uriInfo.getBaseUriBuilder().path(GlobalChargeResource.class).path(GlobalChargeResource.URL_EXISTING_PHYSICIAN_CHARGES).queryParam(HOSPITAL_ID, hospitalId).queryParam(ACCOUNT_ID, accountId).build(hospitalId, accountId));
        map.put("uriMissingPhysicianCharges", uriInfo.getBaseUriBuilder().path(GlobalChargeResource.class).path(GlobalChargeResource.URL_MISSING_PHYSICIAN_CHARGES).queryParam(HOSPITAL_ID, hospitalId).queryParam(ACCOUNT_ID, accountId).build(hospitalId, accountId));
        map.put("uriOtherDiscoverCharges", uriInfo.getBaseUriBuilder().path(GlobalChargeResource.class).path(GlobalChargeResource.URL_OTHER_PHYSICIAN_CHARGES).queryParam(HOSPITAL_ID, hospitalId).queryParam(ACCOUNT_ID, accountId).build(hospitalId, accountId));
        map.put("uriPhysicianAccountDetail", uriInfo.getBaseUriBuilder().path(PhysicianAccountResource.class).path(accountId).path(URL_PHYSICIAN_DETAIL).build(hospitalId));
        map.put("uriPhysicianAccountStatsPanel", uriInfo.getBaseUriBuilder().path(PhysicianAccountResource.class).path(accountId).path(URL_PHYSICIAN_STATS_PANEL).build(hospitalId));
        map.put("uriDiagnoses", uriInfo.getBaseUriBuilder().path(PhysicianAccountViewResource.class).path(hospitalId).path(accountId).path(URL_DIAGNOSES).build());
        map.put("uriProcedures", uriInfo.getBaseUriBuilder().path(PhysicianAccountViewResource.class).path(hospitalId).path(accountId).path(URL_PROCEDURES).build());
        map.put("uriHcpcs", uriInfo.getBaseUriBuilder().path(PhysicianAccountViewResource.class).path(hospitalId).path(accountId).path(URL_HCPCS).build());
        return map;
    }

    @GET
    @Path(URL_EXISTING_PHYSICIAN_CHARGES)
    public List<ExistingChargeRepresentation> getPhysicianExistingCharges(@QueryParam("hospitalId") String hospitalId, @QueryParam("accountId") String accountId) {
        if (hospitalId == null || hospitalId.trim().isEmpty()) {
            throw new WebApplicationException(Response.Status.BAD_REQUEST);
        }
        if (accountId == null || accountId.trim().isEmpty()) {
            throw new WebApplicationException(Response.Status.BAD_REQUEST);
        }
        String userName = null;
        if (SecurityUtils.getSubject().isPermitted(TPermission.READ_EXISTING_CHARGES.getPermission())) {
            userName = AuthUtils.getLoggedUserName();
        } else if (SecurityUtils.getSubject().isPermitted(TPermission.READ_ALL_EXISTING_CHARGES.getPermission())) {
            // do nothing, I need to have userName = null;
        } else {
            throw new AuthorizationException();
        }
        Timestamp cuurntTime = null;
        try {
            cuurntTime = activityLogUtils.getCuurentDateTimeStamp(userName);
        } catch (ParseException ex) {
            log.info(ex.toString());
        }
        List<ExistingChargeRepresentation> existingPhysicianCharges = new ArrayList<ExistingChargeRepresentation>();
        log.debug("No existing saved charges, loading not saved charges...");
        for (ExistingChargeResult oneRecord : globalChargeDao.getPhysicianExistingCharges(hospitalId, accountId)) {
            existingPhysicianCharges.add(getRepresentation(oneRecord));
        }
        for (MissingSavedPhyChargePredictionResult oneRecord : globalChargeDao.getSubmittedExistingPhysicianCharges(hospitalId, accountId)) {
            for (ExistingChargeRepresentation existingChargeRepresentation : existingPhysicianCharges) {
                if (oneRecord.hcpcCode.trim().equals(existingChargeRepresentation.hcpcCode.trim())
                        && oneRecord.chargeNumber.equals(existingChargeRepresentation.chargeNumber)) {
                    existingChargeRepresentation.comments = oneRecord.cenAuditorComments;
                    existingChargeRepresentation.qty = oneRecord.cenAuditorQty;
                    existingChargeRepresentation.predKey = oneRecord.predKey;
                    existingChargeRepresentation.rowEditable = DateUtils.getRowEditable(oneRecord.cenAuditingTime, oneRecord.cenAuditorFlag, oneRecord.cenAuditorId, userName, cuurntTime);
                    existingChargeRepresentation.cenAuditorId = oneRecord.cenAuditorId;
                    existingChargeRepresentation.cenAuditingTime = DateUtils.getDateTimeString(oneRecord.cenAuditingTime);
                }
            }
        }

        return existingPhysicianCharges;
    }

    @GET
    @Path(URL_MISSING_PHYSICIAN_CHARGES)
    public List<MissingChargeRepresentation> getPossiblyMissingCharges(@QueryParam("hospitalId") String hospitalId, @QueryParam("accountId") String accountId) {
        if (hospitalId == null || hospitalId.trim().isEmpty()) {
            throw new WebApplicationException(Response.Status.BAD_REQUEST);
        }
        if (accountId == null || accountId.trim().isEmpty()) {
            throw new WebApplicationException(Response.Status.BAD_REQUEST);
        }
        String userName = null;
        if (SecurityUtils.getSubject().isPermitted(TPermission.READ_MISSING_CHARGES.getPermission())) {
            userName = AuthUtils.getLoggedUserName();
        } else if (SecurityUtils.getSubject().isPermitted(TPermission.READ_ALL_MISSING_CHARGES.getPermission())) {
            // do nothing, I need to have userName = null;
        } else {
            throw new AuthorizationException();
        }
        Timestamp cuurntTime = null;
        try {
            cuurntTime = activityLogUtils.getCuurentDateTimeStamp(userName);
        } catch (ParseException ex) {
            log.info(ex.toString());
        }
        List<MissingChargeRepresentation> missingPhysicianCharges = new ArrayList<MissingChargeRepresentation>();
        for (MissingSavedPhyChargePredictionResult oneRecord : globalChargeDao.getPossiblyMissingCharges(hospitalId, accountId)) {
            missingPhysicianCharges.add(getRepresentationFromPrediction(oneRecord, cuurntTime));
        }
        return missingPhysicianCharges;
    }

    @GET
    @Path(URL_OTHER_PHYSICIAN_CHARGES)
    public List<OtherSavedDiscoveredChargeRepresentation> getOtherDiscoveredCharges(@QueryParam("hospitalId") String hospitalId, @QueryParam("accountId") String accountId) {
        if (hospitalId == null || hospitalId.trim().isEmpty()) {
            throw new WebApplicationException(Response.Status.BAD_REQUEST);
        }
        if (accountId == null || accountId.trim().isEmpty()) {
            throw new WebApplicationException(Response.Status.BAD_REQUEST);
        }
        String userName = null;
        if (SecurityUtils.getSubject().isPermitted(TPermission.READ_OTHER_CHARGES.getPermission())) {
            userName = AuthUtils.getLoggedUserName();
        } else if (SecurityUtils.getSubject().isPermitted(TPermission.READ_ALL_OTHER_CHARGES.getPermission())) {
            // do nothing, I need to have userName = null;
        } else {
            throw new AuthorizationException();
        }
        Timestamp cuurntTime = null;
        try {
            cuurntTime = activityLogUtils.getCuurentDateTimeStamp(userName);
        } catch (ParseException ex) {
            log.info(ex.toString());
        }
        List<OtherSavedDiscoveredChargeRepresentation> otherPhysicianCharges = new ArrayList<OtherSavedDiscoveredChargeRepresentation>();
        for (MissingSavedPhyChargePredictionResult oneRecord : globalChargeDao.getSubmittedOtherDiscoveredCharges(hospitalId, accountId)) {
            otherPhysicianCharges.add(getRepresentation(oneRecord, cuurntTime));
        }

        return otherPhysicianCharges;
    }

    /**
     * Transforms record into representation object
     *
     * @param oneRecord
     * @return submmited charges
     */
    private OtherSavedDiscoveredChargeRepresentation getRepresentation(MissingSavedPhyChargePredictionResult oneRecord, Timestamp cuurntTime) {
        String userName = AuthUtils.getLoggedUserName();
        OtherSavedDiscoveredChargeRepresentation result = new OtherSavedDiscoveredChargeRepresentation();
        result.hcpcCode = oneRecord.hcpcCode;
        result.guarantorId = oneRecord.guarantorId;
        result.quantity = oneRecord.cenAuditorQty;
        result.comments = oneRecord.cenAuditorComments;
        result.chargeDescription = oneRecord.description;
        result.dateOfService1 = oneRecord.dateOfService;
        result.price = oneRecord.price;
        result.predNbr = oneRecord.predNbr;
        result.method = oneRecord.method;
        result.predKey = oneRecord.predKey;
        result.rowEditable = DateUtils.getRowEditable(oneRecord.cenAuditingTime, oneRecord.cenAuditorFlag, oneRecord.cenAuditorId, userName, cuurntTime);
        result.cenAuditorId = oneRecord.cenAuditorId;
        result.cenAuditingTime = DateUtils.getDateTimeString(oneRecord.cenAuditingTime);
        result.costCenter = oneRecord.costCenter;
        result.source = oneRecord.source;
        result.diag = oneRecord.diag;
        result.primaryDiag = oneRecord.primaryDiag;
        result.npi = oneRecord.npi;
        result.pos = oneRecord.pos;
        result.deptPhys = oneRecord.deptPhys;
        result.billPhys = oneRecord.billPhys;
        result.modifier = oneRecord.modifier;
        result.claimNumber = oneRecord.claimNumber;
        return result;
    }

    /**
     * Transforms record into representation object
     *
     * @param oneRecord
     * @return ExistingChargeRepresentation
     */
    protected ExistingChargeRepresentation getRepresentation(ExistingChargeResult oneRecord) {
        ExistingChargeRepresentation result = new ExistingChargeRepresentation();
        if (oneRecord.hcpcCode != null) {
            result.hcpcCode = oneRecord.hcpcCode;
        } else {
            result.hcpcCode = "";
        }
        result.dept = oneRecord.dept;
        result.guarantorId = oneRecord.guarantorId;
        result.chargeCode = oneRecord.chargeCode;
        result.quantity = oneRecord.quantity;
        result.chargeDate = oneRecord.chargeDate;
        result.chargeAmount = oneRecord.amount;
        result.revenueCode = oneRecord.revenueCode;
        result.chargeDesc = oneRecord.chargeDescription;
        result.claim = oneRecord.claimNumber;
        result.doctor = oneRecord.name;
        result.doctorId = oneRecord.doctorId;
        result.npi = oneRecord.npi;
        result.code = oneRecord.code;
        result.type = oneRecord.type;
        result.startDate = oneRecord.startDate;
        result.terminationDate = oneRecord.terminationDate;
        result.chargeNumber = oneRecord.chargeNumber;
        result.source = oneRecord.source;
        result.predKey = oneRecord.predKey;
        result.firstName = oneRecord.firstName;
        result.lastName = oneRecord.lastName;
        result.dob = oneRecord.dob;

        return result;
    }

    public static class AccountDetailRepresentation {

        public String shortName;
        public String hospitalName;
        public Integer age;
        public String genderDescription;
        public String admitDate;
        public String dischargeDate;
        public String patientType;
        public String patientSubtype;
        public String patTypeWithDescription;
        public String payerCode;
        public String payerDesc;
        public String patSubTypeWithDescription;
        public String patientId;
        public String transferDate;
        public String hospitalId;
        public String accountId;
        public String financialClass;
        public String dob;
    }

    /**
     * Message class
     */
    public static class ExistingChargeResult {

        public String hospitalId;
        public String accountId;
        public String hcpcCode;
        public String dept;
        public String chargeCode;
        public Integer quantity;
        public BigDecimal amount;
        public Date chargeDate;
        public String chargeDescription;
        public String comments;
        public String claimNumber;
        public String doctorId;
        public String name;
        public String npi;
        public String type;
        public Date terminationDate;
        public Date startDate;
        public Long chargeNumber;
        public String revenueCode;
        public String source;
        public Integer predKey;
        public String guarantorId;
        public String firstName;
        public String lastName;
        public Date dob;
        public String cenAuditingTime;
        public String cenAuditorId;
        public String code;
    }

    /**
     * Message class
     */
    public static class ExistingChargeRepresentation implements Comparable<ExistingChargeRepresentation> {

        public String claim;
        public String hcpcCode;
        public String dept;
        public String chargeCode;
        public Integer quantity;
        public Integer qty;
        public BigDecimal chargeAmount;
        public Date chargeDate;
        public String chargeDesc;
        public String comments;
        public String doctor;
        public String doctorId;
        public String npi;
        public String type;
        public Date terminationDate;
        public Date startDate;
        public boolean isExist;
        public Long chargeNumber;
        public String revenueCode;
        public String source;
        public Integer predKey;
        public boolean rowEditable = true;
        public String guarantorId;
        public String firstName;
        public String lastName;
        public Date dob;
        public String cenAuditingTime;
        public String cenAuditorId;
        public String code;

        @Override
        public int compareTo(ExistingChargeRepresentation o) {
            if (o.isExist && isExist) {
                return hcpcCode.compareTo(o.hcpcCode);
            } else if (o.isExist) {
                return 1;
            } else if (isExist) {
                return -1;
            } else if (!o.isExist && !isExist) {
                return hcpcCode.compareTo(o.hcpcCode);
            } else {
                return -1;
            }
        }
    }

    public static class MissingSavedPhyChargePredictionResult {

        public String dchgCode;
        public String hcpcCode;
        public String chargeDescription;
        public String description;
        public Integer intAuditorQty;
        public Integer cenAuditorQty;
        public String cenAuditorComments;
        public String predCode;
        public Date dateOfService;
        public String cenAuditorFlag;
        public String response;
        public Long chargeNumber;
        public BigDecimal price;
        public Integer predNbr;
        public String method;
        public String modifier;
        public Integer predKey;
        public Timestamp cenAuditingTime;
        public String guarantorId;
        public String source;
        public String cenAuditorId;
        public String hspCodeType;
        public String costCenter;
        public String pos;
        public String diag;
        public String primaryDiag;
        public String npi;
        public String claimNumber;
        public String deptPhys;
        public String billPhys;
        public String sentFlag;
    }

    public static class MissingChargeRepresentation {

        public String hcpcCode;
        public BigDecimal price;
        public Integer qty;
        public Date dateOfService;
        public String chargeDesc;
        public String response;
        public String responseCode;
        public String comments;
        public String dept;
        public String chargeCode;
        public boolean isNew;
        public boolean isComment;
        public boolean isPublish;
        public Long chargeNumber;
        public String predCode;
        public Integer predKey;
        public boolean rowEditable = true;
        public String guarantorId;
        public String source;
        public String costCenter;
        public String cenAuditingTime;
        public String cenAuditorId;
        public String pos;
        public String modifier;
        public String diag;
        public String primaryDiag;
        public String npi;
        public String claimNumber;
        public String deptPhys;
        public String billPhys;
        public String sentFlag;

    }

    public static class OtherSavedDiscoveredChargeRepresentation {

        public String hcpcCode;
        public String dept;
        public String chargeCode;
        public Integer quantity;
        public String comments;
        public String chargeDescription;
        public Long chargeNumber;
        public Date dateOfService1;
        public BigDecimal price;
        public Integer predNbr;
        public String method;
        public String predCode;
        public Integer predKey;
        public boolean rowEditable = true;
        public String guarantorId;
        public String cenAuditingTime;
        public String cenAuditorId;
        public String costCenter;
        public String source;
        public String pos;
        public String modifier;
        public String diag;
        public String primaryDiag;
        public String npi;
        public Integer rowId;
        public String claimNumber;
        public String deptPhys;
        public String billPhys;
    }

    /**
     * Transforms record into representation object - preBill
     *
     * @param oneRecord
     * @return PossiblyMissingChargeRepresentation
     */
    private MissingChargeRepresentation getRepresentationFromPrediction(MissingSavedPhyChargePredictionResult oneRecord, Timestamp cuurntTime) {
        MissingChargeRepresentation result = new MissingChargeRepresentation();
        String[] converted = DbUtils.splitDchgCode(oneRecord.dchgCode);
        String userName = AuthUtils.getLoggedUserName();
        result.hcpcCode = oneRecord.hcpcCode;
        result.guarantorId = oneRecord.guarantorId;
        result.dept = converted[0];
        result.chargeDesc = DbUtils.getDescriptionFromChargeMasterOrHcpcCode(oneRecord.chargeDescription, oneRecord.description);
        result.chargeCode = converted[1];
        result.predCode = oneRecord.predCode;
        //if(isSubmitted){
        result.qty = oneRecord.cenAuditorQty == null ? 0 : oneRecord.cenAuditorQty;
        result.response = oneRecord.response;
        result.responseCode = oneRecord.cenAuditorFlag;
        //}else{
        //	result.qty = oneRecord.intAuditorQty == null ? 0 : oneRecord.intAuditorQty;	
        //}
        result.comments = oneRecord.cenAuditorComments;
        result.dateOfService = oneRecord.dateOfService;
        result.price = oneRecord.price;
        result.predKey = oneRecord.predKey;
        result.source = oneRecord.source;
        result.costCenter = oneRecord.costCenter;
        result.rowEditable = DateUtils.getRowEditable(oneRecord.cenAuditingTime, oneRecord.cenAuditorFlag, oneRecord.cenAuditorId, userName, cuurntTime);
        result.cenAuditorId = oneRecord.cenAuditorId;
        result.diag = oneRecord.diag;
        result.primaryDiag = oneRecord.primaryDiag;
        result.npi = oneRecord.npi;
        result.pos = oneRecord.pos;
        result.deptPhys = oneRecord.deptPhys;
        result.billPhys = oneRecord.billPhys;
        result.modifier = oneRecord.modifier;
        result.claimNumber = oneRecord.claimNumber;
        result.sentFlag = oneRecord.sentFlag;
        result.cenAuditingTime = DateUtils.getDateTimeString(oneRecord.cenAuditingTime);
        if (oneRecord.cenAuditorFlag == null || oneRecord.cenAuditorFlag.equals("")) {
            result.isNew = true;
        }
        return result;
    }

}
