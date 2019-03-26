/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.operasolutions.rl.service.physician.charges;

import com.google.inject.Inject;
import com.operasolutions.rl.auth.AuthUtils;
import com.operasolutions.rl.common.ActivityLogUtils;
import com.operasolutions.rl.common.DateUtils;
import com.operasolutions.rl.common.DbUtils;
import com.operasolutions.rl.schema.enums.TPermission;
import com.operasolutions.rl.schema.tables.records.TSavePhysDiscoveredcodeRecord;
import com.operasolutions.rl.service.physician.PhysicianAccountResource;
import static com.operasolutions.rl.service.physician.PhysicianAccountResource.ISCONFIRM;
import com.operasolutions.rl.service.physician.PhysicianAccountViewResource;
import static com.operasolutions.rl.service.physician.PhysicianAccountViewResource.URL_DIAGNOSES;
import static com.operasolutions.rl.service.physician.PhysicianAccountViewResource.URL_HCPCS;
import static com.operasolutions.rl.service.physician.PhysicianAccountViewResource.URL_PROCEDURES;
import com.operasolutions.rl.service.physician.hospital.PhysicianHospitalResource;
import com.operasolutions.rl.service.pos.PosResource;
import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Timestamp;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.AuthorizationException;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author nirmal.kumar
 */
@Path("/" + PhysicianHospitalResource.URL_HOSPITALS + "/{hospitalId:.*}/" + PhysicianAccountResource.URL_ACCOUNTS + "/{accountId:.*}/" + PhysicianChargesResource.URL_CHARGES)
@Produces(MediaType.APPLICATION_JSON)
@RequiresAuthentication
public class PhysicianChargesResource {

    public static final String URL_CHARGES = "charges";
    public static final String URL_EXISTING_CHARGES = "existingCharges";
    public static final String URL_EXISTING_PHYSICIAN_CHARGES = "existingPhysicianCharges";
    public static final String URL_MISSING_PHYSICIAN_CHARGES = "missingPhysicianCharges";
    public static final String URL_OTHER_PHYSICIAN_CHARGES = "otherDiscoverCharges";
    public static final String URL_PHY_HCPC = "getPhyHcpc";
    public static final String URL_PHY_COST_CENTER = "getPhyCostCenter";
    public static final String URL_PHYSICIAN_DETAIL = "physicianAccountDetail";
    public static final String URL_PHYSICIAN_STATS_PANEL = "physicianAccountStatsPanel";
    public static final String ISSUBMITTED = "isSubmitted";
    protected static final Logger log = LoggerFactory.getLogger(PhysicianChargesResource.class);

    private final PhysicianChargesDao physicianChargesDao;
    protected final ActivityLogUtils activityLogUtils;
    @Context
    UriInfo uriInfo;

    @Inject
    public PhysicianChargesResource(PhysicianChargesDao physicianChargesDao, ActivityLogUtils activityLogUtils) {
        this.physicianChargesDao = physicianChargesDao;
        this.activityLogUtils = activityLogUtils;
    }

    @GET
    public Map getAllChargesForAccount(@PathParam("hospitalId") String hospitalId, @PathParam("accountId") String accountId,
            @DefaultValue("false") @QueryParam(ISSUBMITTED) boolean isSubmitted, @DefaultValue("false") @QueryParam(ISCONFIRM) boolean isConfirm) {
        log.debug("getAllChargesForAccount() - start, hospitalId = " + hospitalId + ", accountId = " + accountId);

        if (hospitalId == null || hospitalId.trim().isEmpty()) {
            throw new WebApplicationException(Response.Status.BAD_REQUEST);
        }
        if (accountId == null || accountId.trim().isEmpty()) {
            throw new WebApplicationException(Response.Status.BAD_REQUEST);
        }
        SecurityUtils.getSubject().checkPermission(TPermission.READ_ALL_CHARGES.getPermission());
        Map map = new HashMap<String, Object>();
        map.put("uriExistingCharges", uriInfo.getBaseUriBuilder().path(PhysicianChargesResource.class).path(PhysicianChargesResource.URL_EXISTING_CHARGES).build(hospitalId, accountId));
        map.put("uriExistingPhysicianCharges", uriInfo.getBaseUriBuilder().path(PhysicianChargesResource.class).path(PhysicianChargesResource.URL_EXISTING_PHYSICIAN_CHARGES).queryParam(ISCONFIRM, isConfirm).queryParam(ISSUBMITTED, isSubmitted).build(hospitalId, accountId));
        map.put("uriMissingPhysicianCharges", uriInfo.getBaseUriBuilder().path(PhysicianChargesResource.class).path(PhysicianChargesResource.URL_MISSING_PHYSICIAN_CHARGES).queryParam(ISCONFIRM, isConfirm).queryParam(ISSUBMITTED, isSubmitted).build(hospitalId, accountId));
        map.put("uriOtherDiscoverCharges", uriInfo.getBaseUriBuilder().path(PhysicianChargesResource.class).path(PhysicianChargesResource.URL_OTHER_PHYSICIAN_CHARGES).queryParam(ISCONFIRM, isConfirm).queryParam(ISSUBMITTED, isSubmitted).build(hospitalId, accountId));
        map.put("uriGetPhyHcpc", uriInfo.getBaseUriBuilder().path(PhysicianChargesResource.class).path(PhysicianChargesResource.URL_PHY_HCPC).build(hospitalId, accountId));
        map.put("uriPhysicianAccountDetail", uriInfo.getBaseUriBuilder().path(PhysicianAccountResource.class).path(accountId).path(URL_PHYSICIAN_DETAIL).build(hospitalId));
        map.put("uriPhysicianAccountStatsPanel", uriInfo.getBaseUriBuilder().path(PhysicianAccountResource.class).path(accountId).path(URL_PHYSICIAN_STATS_PANEL).build(hospitalId));
        map.put("savedChargesUri", uriInfo.getBaseUriBuilder().path(PhysicianChargesSubmitResource.class).build(hospitalId, accountId));
        map.put("submittedChargesUri", uriInfo.getBaseUriBuilder().path(PhysicianChargesSubmitResource.class).path(PhysicianChargesSubmitResource.URL_SUBMITTED_CHARGES).build(hospitalId, accountId));
        map.put("chargesMasterLookupUri", uriInfo.getBaseUriBuilder().path(PhysicianLookupChargeMasterResource.class).build(hospitalId));
        map.put("getPhyCostCenterUri", uriInfo.getBaseUriBuilder().path(PhysicianChargesResource.class).path(URL_PHY_COST_CENTER).build(hospitalId, accountId));
        map.put("uriDiagnoses", uriInfo.getBaseUriBuilder().path(PhysicianAccountViewResource.class).path(hospitalId).path(accountId).path(URL_DIAGNOSES).build());
        map.put("uriProcedures", uriInfo.getBaseUriBuilder().path(PhysicianAccountViewResource.class).path(hospitalId).path(accountId).path(URL_PROCEDURES).build());
        map.put("uriHcpcs", uriInfo.getBaseUriBuilder().path(PhysicianAccountViewResource.class).path(hospitalId).path(accountId).path(URL_HCPCS).build());
        map.put("getPhysModifierDaigUri", uriInfo.getBaseUriBuilder().path(PosResource.class).path(hospitalId).path(accountId).path(PosResource.URL_PHYS_MODIFIER_DIAG).build());
        map.put("getPhysUri", uriInfo.getBaseUriBuilder().path(PosResource.class).path(hospitalId).path(accountId).path(PosResource.URL_PHYS).build());
        map.put("getModifierUri", uriInfo.getBaseUriBuilder().path(PosResource.class).path(hospitalId).path(accountId).path(PosResource.URL_MODIFIER).build());
        map.put("getDaigUri", uriInfo.getBaseUriBuilder().path(PosResource.class).path(hospitalId).path(accountId).path(PosResource.URL_DIAG).build());
        map.put("getDeptUri", uriInfo.getBaseUriBuilder().path(PosResource.class).path(hospitalId).path(PosResource.URL_DEPT).build());
        return map;
    }

    @GET
    @Path(URL_EXISTING_CHARGES)
    public List<ExistingChargeRepresentation> getExistingCharges(@PathParam("hospitalId") String hospitalId, @PathParam("accountId") String accountId) {
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

        List<ExistingChargeRepresentation> existingHospitalCharges = new ArrayList<ExistingChargeRepresentation>();
        log.debug("No existing saved charges, loading not saved charges...");
        for (ExistingChargeResult oneRecord : physicianChargesDao.getExistingCharges(hospitalId, accountId)) {
            existingHospitalCharges.add(getRepresentation(oneRecord));
        }
        log.debug("Loading possibly missing saved charges...");
        for (MissingSavedPhyChargePredictionResult oneRecord : physicianChargesDao.getExistingPossiblyMissingCharges(hospitalId, accountId)) {
            for (ExistingChargeRepresentation existingChargeRepresentation : existingHospitalCharges) {
                if (existingChargeRepresentation.hcpcCode.equals(oneRecord.hcpcCode) && oneRecord.hspCodeType.equalsIgnoreCase("HCPC")) {
                    existingChargeRepresentation.isExist = true;
                }
                if (existingChargeRepresentation.revenueCode.equals(oneRecord.hcpcCode) && oneRecord.hspCodeType.equalsIgnoreCase("REV")) {
                    existingChargeRepresentation.isExist = true;
                }
            }
        }
        Collections.sort(existingHospitalCharges);
        return existingHospitalCharges;
    }

    @GET
    @Path(URL_EXISTING_PHYSICIAN_CHARGES)
    public List<ExistingChargeRepresentation> getPhysicianExistingCharges(@PathParam("hospitalId") String hospitalId, @PathParam("accountId") String accountId,
            @DefaultValue("false") @QueryParam(ISSUBMITTED) boolean isSubmitted, @DefaultValue("false") @QueryParam(ISCONFIRM) boolean isConfirm) {
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
        for (ExistingChargeResult oneRecord : physicianChargesDao.getPhysicianExistingCharges(hospitalId, accountId)) {
            existingPhysicianCharges.add(getRepresentation(oneRecord));
        }
        for (MissingSavedPhyChargePredictionResult oneRecord : physicianChargesDao.getSubmittedExistingPhysicianCharges(hospitalId, accountId, isConfirm)) {
            for (ExistingChargeRepresentation existingChargeRepresentation : existingPhysicianCharges) {
                if (oneRecord.hcpcCode.trim().equals(existingChargeRepresentation.hcpcCode.trim())
                        && oneRecord.chargeNumber.equals(existingChargeRepresentation.chargeNumber) && oneRecord.guarantorId.equals(existingChargeRepresentation.guarantorId) && oneRecord.claimNumber.equals(existingChargeRepresentation.claim)) {
                    existingChargeRepresentation.comments = oneRecord.cenAuditorComments;
                    existingChargeRepresentation.qty = oneRecord.cenAuditorQty;
                    existingChargeRepresentation.predKey = oneRecord.predKey;
                    existingChargeRepresentation.rowEditable = DateUtils.getRowEditable(oneRecord.cenAuditingTime, oneRecord.cenAuditorFlag, oneRecord.cenAuditorId, userName, cuurntTime);
                    existingChargeRepresentation.cenAuditorId = oneRecord.cenAuditorId;
                    existingChargeRepresentation.cenAuditingTime = DateUtils.getDateTimeString(oneRecord.cenAuditingTime);
                }
            }
        }
        if (!isSubmitted) {
            log.debug("Loading existing saved charges...");
            for (ExistingChargeSaveResult oneRecord : physicianChargesDao.getPhysicianExistingSavedCharges(hospitalId, accountId, userName)) {
                for (ExistingChargeRepresentation existingChargeRepresentation : existingPhysicianCharges) {
                    if (oneRecord.hcpcCode.trim().equals(existingChargeRepresentation.hcpcCode.trim())
                            && oneRecord.chargeNumber.equals(existingChargeRepresentation.chargeNumber) && oneRecord.guarantorId.equals(existingChargeRepresentation.guarantorId) && oneRecord.claimNumber.equals(existingChargeRepresentation.claim)) {
                        existingChargeRepresentation.comments = oneRecord.comments;
                        existingChargeRepresentation.qty = oneRecord.newQuantity;
                        existingChargeRepresentation.predKey = oneRecord.predKey;
                        existingChargeRepresentation.rowEditable = oneRecord.isNew;;
                    }
                }
            }
        }
        return existingPhysicianCharges;
    }

    @GET
    @Path(URL_MISSING_PHYSICIAN_CHARGES)
    public List<MissingChargeRepresentation> getPossiblyMissingCharges(@PathParam("hospitalId") String hospitalId, @PathParam("accountId") String accountId,
            @DefaultValue("false") @QueryParam(ISSUBMITTED) boolean isSubmitted, @DefaultValue("false") @QueryParam(ISCONFIRM) boolean isConfirm) {
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
        if (isSubmitted) {
            for (MissingSavedPhyChargePredictionResult oneRecord : physicianChargesDao.getPossiblyMissingCharges(hospitalId, accountId, isConfirm)) {
                missingPhysicianCharges.add(getRepresentationFromPrediction(oneRecord, cuurntTime));
            }
        } else {
            for (MissingSavedPhyChargePredictionResult oneRecord : physicianChargesDao.getPossiblyMissingCharges(hospitalId, accountId, isConfirm)) {
                missingPhysicianCharges.add(getRepresentationFromPrediction(oneRecord, cuurntTime));
            }
            log.debug("Loading possibly missing saved charges...");
            for (MissingSavedChargeResult oneRecord : physicianChargesDao.getMissingSavedCharges(hospitalId, accountId, userName)) {
                for (MissingChargeRepresentation one : missingPhysicianCharges) {
                    if (one.predCode.equalsIgnoreCase(oneRecord.predCode) && one.costCenter.equalsIgnoreCase(oneRecord.costCenter) && ((one.dateOfService != null) ? one.dateOfService.equals(oneRecord.dateOfService) : true)) {
                        one.hcpcCode = oneRecord.hcpcCode;
                        one.dept = oneRecord.dept;
                        one.chargeCode = oneRecord.chargeCode;
                        one.qty = oneRecord.quantity;
                        one.dateOfService = oneRecord.dateOfService;
                        one.price = oneRecord.price;
                        one.response = oneRecord.description;
                        one.responseCode = oneRecord.value;
                        one.comments = oneRecord.comments;
                        one.source = oneRecord.source;
                        one.guarantorId = oneRecord.guarantorId;
                        one.diag = oneRecord.diag;
                        one.primaryDiag = oneRecord.primaryDiag;
                        one.npi = oneRecord.npi;
                        one.pos = oneRecord.pos;
                        one.modifier = oneRecord.modifier;
                        one.claimNumber = oneRecord.claimNumber;
                        one.deptPhys = oneRecord.deptPhys;
                        one.billPhys = oneRecord.billPhys;
                        one.chargeDesc = oneRecord.chargeDesc;
                    }
                }
            }
        }
        return missingPhysicianCharges;
    }

    @GET
    @Path(URL_OTHER_PHYSICIAN_CHARGES)
    public List<OtherSavedDiscoveredChargeRepresentation> getOtherDiscoveredCharges(@PathParam("hospitalId") String hospitalId, @PathParam("accountId") String accountId,
            @DefaultValue("false") @QueryParam(ISSUBMITTED) boolean isSubmitted, @DefaultValue("false") @QueryParam(ISCONFIRM) boolean isConfirm) {
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
        for (MissingSavedPhyChargePredictionResult oneRecord : physicianChargesDao.getSubmittedOtherDiscoveredCharges(hospitalId, accountId, isConfirm)) {
            otherPhysicianCharges.add(getRepresentation(oneRecord, cuurntTime));
        }
        if (!isSubmitted) {
            for (TSavePhysDiscoveredcodeRecord oneRecord : physicianChargesDao.getOtherDiscoveredCharges(hospitalId, accountId, userName)) {
                if (oneRecord.getPredKey() != null) {
                    for (OtherSavedDiscoveredChargeRepresentation one : otherPhysicianCharges) {
                        if (one.predKey.equals(oneRecord.getPredKey())) {
                            one.hcpcCode = oneRecord.getHcpcCode();
                            one.quantity = oneRecord.getQuantity();
                            one.dateOfService1 = oneRecord.getDateOfService();
                            one.price = oneRecord.getPrice();
                            one.comments = oneRecord.getComments();
                            one.method = oneRecord.getMethod();
                            one.guarantorId = oneRecord.getGuarantorId();
                            one.costCenter = oneRecord.getCostCenter();
                            one.source = oneRecord.getSource();
                            one.diag = oneRecord.getDiag();
                            one.primaryDiag = oneRecord.getPrimaryDiag();
                            one.npi = oneRecord.getNpi();
                            one.pos = oneRecord.getPos();
                            one.modifier = oneRecord.getModifier();
                            one.claimNumber = oneRecord.getClaimNumber();
                            one.deptPhys = oneRecord.getDeptPhys();
                            one.billPhys = oneRecord.getBillPhys();

                        }
                    }
                } else {
                    otherPhysicianCharges.add(getRepresentation(oneRecord));
                }
            }
        }
        return otherPhysicianCharges;
    }

    @GET
    @Path(URL_PHY_HCPC)
    public List<HcpcResult> getPhyHcpc(@PathParam("hospitalId") String hospitalId, @PathParam("accountId") String accountId,
            @QueryParam("ruleId") String ruleId) {
        Boolean all = null;
        if (SecurityUtils.getSubject().isPermitted(TPermission.READ_HCPC.getPermission())) {
            all = true;
        } else if (SecurityUtils.getSubject().isPermitted(TPermission.READ_HCPC.getPermission())) {
            all = false;
        } else {
            throw new AuthorizationException();
        }
        return physicianChargesDao.getPhyHcpc(ruleId, hospitalId);
    }

    @GET
    @Path(URL_PHY_COST_CENTER)
    public List<String> getPhyCostCenter() {
        Boolean all = null;
        if (SecurityUtils.getSubject().isPermitted(TPermission.READ_HCPC.getPermission())) {
            all = true;
        } else if (SecurityUtils.getSubject().isPermitted(TPermission.READ_HCPC.getPermission())) {
            all = false;
        } else {
            throw new AuthorizationException();
        }
        return physicianChargesDao.getPhyCostCenter();
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
     * @return OtherSavedDiscoveredChargeRepresentation
     */
    private OtherSavedDiscoveredChargeRepresentation getRepresentation(TSavePhysDiscoveredcodeRecord oneRecord) {

        OtherSavedDiscoveredChargeRepresentation result = new OtherSavedDiscoveredChargeRepresentation();
        result.hcpcCode = oneRecord.getHcpcCode();
        result.guarantorId = oneRecord.getGuarantorId();
        result.quantity = oneRecord.getQuantity();
        result.comments = oneRecord.getComments();
        result.chargeDescription = oneRecord.getChargeDescription();
        result.dateOfService1 = oneRecord.getDateOfService();
        result.price = oneRecord.getPrice();
        result.method = oneRecord.getMethod();
        result.predNbr = oneRecord.getPredNbr();
        result.predKey = oneRecord.getPredKey();
        result.costCenter = oneRecord.getCostCenter();
        result.source = oneRecord.getSource();
        result.rowEditable = (oneRecord.getIsNew() != 0);
        result.diag = oneRecord.getDiag();
        result.primaryDiag = oneRecord.getPrimaryDiag();
        result.npi = oneRecord.getNpi();
        result.pos = oneRecord.getPos();
        result.modifier = oneRecord.getModifier();
        result.rowId = oneRecord.getRowId();
        result.claimNumber = oneRecord.getClaimNumber();
        result.deptPhys = oneRecord.getDeptPhys();
        result.billPhys = oneRecord.getBillPhys();
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

    /**
     * Message class
     */
    public static class ExistingChargeSaveResult {

        public String hospitalId;
        public String accountId;
        public String hcpcCode;
        public String dept;
        public String chargeCode;
        public String billType;
        public Integer quantity;
        public Integer newQuantity;
        public BigDecimal chargeAmount;
        public String userId;
        public Date chargeDate;
        public String chargeDesc;
        public String claimNumber;
        public String comments;
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
        public boolean isNew;
        public String guarantorId;
        public String cenAuditingTime;
        public String cenAuditorId;

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

    public static class MissingSavedChargeResult {

        public String hcpcCode;
        public String dept;
        public String chargeDesc;
        public String chargeCode;
        public Integer quantity;
        public String comments;
        public String description;
        public String response;
        public String value;
        public String predCode;
        public Date dateOfService;
        public BigDecimal price;
        public Integer predKey;
        public boolean isNew;
        public String guarantorId;
        public String source;
        public String cenAuditingTime;
        public String cenAuditorId;
        public String hspCodeType;
        public String pos;
        public String modifier;
        public String diag;
        public String primaryDiag;
        public String npi;
        public String claimNumber;
        public String deptPhys;
        public String billPhys;
        public String costCenter;
    }

    public static class HcpcResult {

        public String phyHcpcCode;
        public BigDecimal price;
        public String description;
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
        result.cenAuditingTime = DateUtils.getDateTimeString(oneRecord.cenAuditingTime);
        if (oneRecord.cenAuditorFlag == null || oneRecord.cenAuditorFlag.equals("")) {
            result.isNew = true;
        }
        return result;
    }

}
