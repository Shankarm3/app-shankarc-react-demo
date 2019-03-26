/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.operasolutions.rl.service.physician.charges;

import com.google.inject.Inject;
import com.google.inject.persist.Transactional;
import com.operasolutions.rl.auth.AuthUtils;
import com.operasolutions.rl.common.DateUtils;
import com.operasolutions.rl.common.DbConstants;
import com.operasolutions.rl.exception.RevenueLeakageException;
import com.operasolutions.rl.schema.enums.TPermission;
import com.operasolutions.rl.schema.tables.records.TSavePhysDiscoveredcodeRecord;
import com.operasolutions.rl.schema.tables.records.TSavePhysExisitngcodeRecord;
import com.operasolutions.rl.schema.tables.records.TSavePhysPossMissingcodeRecord;
import com.operasolutions.rl.service.physician.PhysicianAccountResource;
import com.operasolutions.rl.service.physician.charges.PhysicianChargesResource.ExistingChargeRepresentation;
import com.operasolutions.rl.service.physician.charges.PhysicianChargesResource.MissingChargeRepresentation;
import com.operasolutions.rl.service.physician.charges.PhysicianChargesResource.OtherSavedDiscoveredChargeRepresentation;
import com.operasolutions.rl.service.physician.hospital.PhysicianHospitalResource;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
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
@Path("/" + PhysicianHospitalResource.URL_HOSPITALS + "/{hospitalId:.*}/" + PhysicianAccountResource.URL_ACCOUNTS + "/{accountId:.*}/" + PhysicianChargesSubmitResource.URL_SAVED_CHARGES)
@Produces(MediaType.APPLICATION_JSON)
@RequiresAuthentication
public class PhysicianChargesSubmitResource {

    public static final String URL_SAVED_CHARGES = "saved";
    public static final String URL_SUBMITTED_CHARGES = "submit";
    protected static final Logger log = LoggerFactory.getLogger(PhysicianChargesSubmitResource.class);

    private final PhysicianChargesSubmitDao physicianChargesSubmitDao;

    @Inject
    public PhysicianChargesSubmitResource(PhysicianChargesSubmitDao physicianChargesSubmitDao) {
        this.physicianChargesSubmitDao = physicianChargesSubmitDao;

    }

    /**
     * Saves all charges into SAVE tables
     *
     * @param hospitalId
     * @param accountId
     * @param data
     * @return Response status code
     * @throws RevenueLeakageException
     */
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response saveAllCharges(@PathParam("hospitalId") String hospitalId, @PathParam("accountId") String accountId, SavedChargesInput data) throws RevenueLeakageException {
        log.debug("saveAllCharges() - start");

        SecurityUtils.getSubject().checkPermission(TPermission.SAVE_ALL_CHARGES.getPermission());
        String userName = AuthUtils.getLoggedUserName();
        if (data == null) {
            throw new WebApplicationException(Response.Status.BAD_REQUEST);
        }
        if (hospitalId == null || hospitalId.trim().isEmpty()) {
            throw new WebApplicationException(Response.Status.BAD_REQUEST);
        }
        if (accountId == null || accountId.trim().isEmpty()) {
            throw new WebApplicationException(Response.Status.BAD_REQUEST);
        }
        if (data.existingPhysicianCharges == null) {
            throw new WebApplicationException(Response.Status.BAD_REQUEST);
        }
        if (data.missingPhysicianCharges == null) {
            throw new WebApplicationException(Response.Status.BAD_REQUEST);
        }
        if (data.otherPhysicianCharges == null) {
            throw new WebApplicationException(Response.Status.BAD_REQUEST);
        }

        log.debug("Input structure for possibly missing charges is valid.");

        log.debug("Filtering other charges...");
        //OtherChargesFilter.filterOtherCharges(data.others);

        log.debug("Validating input structure for other charges...");

        log.debug("Input structure for other charges is valid.");

        log.debug("Converting existing charges...");
        List<TSavePhysExisitngcodeRecord> existingRecords = new ArrayList<TSavePhysExisitngcodeRecord>();
        for (ExistingChargeRepresentation one : data.existingPhysicianCharges) {
            if (one.rowEditable && (one.qty != null && one.qty != 0)) {
                TSavePhysExisitngcodeRecord record = new TSavePhysExisitngcodeRecord();
                record.setUserId(AuthUtils.getLoggedUserName());
                record.setAccountId(accountId);
                record.setHospitalId(hospitalId);
                record.setHcpcCode(one.hcpcCode);
                record.setChargeCode(one.chargeCode);
                record.setDept(one.dept);
                record.setQuantity(one.quantity);
                record.setChargeAmount(one.chargeAmount);
                record.setChargeNumber(one.chargeNumber);
                record.setClaimNumber(one.claim);
                record.setRevenueCode(one.revenueCode);
                record.setGuarantorId(one.guarantorId);
                // convert java.utilDate to java.sql.Date
                if (one.chargeDate != null) {
                    record.setChargeDate(DateUtils.convertToGMT(one.chargeDate));
                }

                record.setChargeDesc(one.chargeDesc);
                record.setComments(one.comments);
                record.setNewQuantity(one.qty);
                record.setDoctorId(one.doctorId);
                record.setSource(one.source);
                if (one.predKey != null) {
                    record.setPredKey(one.predKey);
                }
                record.setIsNew((byte) ((one.rowEditable) ? 1 : 0));
                existingRecords.add(record);
            }
        }

        log.debug("Converting possibly missing charges...");

        List<TSavePhysPossMissingcodeRecord> missingRecords = new ArrayList<TSavePhysPossMissingcodeRecord>();
        for (MissingChargeRepresentation one : data.missingPhysicianCharges) {
            if (one.rowEditable) {
                TSavePhysPossMissingcodeRecord record = new TSavePhysPossMissingcodeRecord();
                record.setUserId(AuthUtils.getLoggedUserName());
                record.setAccountId(accountId);
                record.setHospitalId(hospitalId);
                record.setHcpcCode(one.hcpcCode);
                record.setDept(one.dept);
                record.setChargeCode(one.chargeCode);
                record.setQuantity(one.qty);

                // convert java.utilDate to java.sql.Date
                if (one.dateOfService != null) {
                    record.setDateOfService(DateUtils.convertToGMT(one.dateOfService));
                }
                record.setPredCode(one.predCode);
                record.setPrice(one.price);
                record.setChargeDesc(one.chargeDesc);
                record.setResponse(one.responseCode);
                record.setComments(one.comments);
                record.setSource(one.source);
                record.setCostCenter(one.costCenter);
                record.setGuarantorId(one.guarantorId);
                if (one.predKey != null) {
                    record.setPredKey(one.predKey);
                }
                record.setIsNew((byte) ((one.rowEditable) ? 1 : 0));
                record.setPos(one.pos);
                record.setModifier(one.modifier);
                record.setNpi(one.npi);
                record.setDiag(one.diag);
                record.setPrimaryDiag(one.primaryDiag);
                record.setClaimNumber(one.claimNumber);
                record.setDeptPhys(one.deptPhys);
                record.setBillPhys(one.billPhys);
                missingRecords.add(record);
            }
        }

        log.debug("Converting other charges...");

        List<TSavePhysDiscoveredcodeRecord> othersRecords = new ArrayList<TSavePhysDiscoveredcodeRecord>();
        for (OtherSavedDiscoveredChargeRepresentation one : data.otherPhysicianCharges) {
            if (one.rowEditable) {
                if (one.method == null || one.method.trim().equals(DbConstants.BLANK)) {
                    one = findMethod(data, one);
                }

                TSavePhysDiscoveredcodeRecord record = new TSavePhysDiscoveredcodeRecord();
                record.setUserId(AuthUtils.getLoggedUserName());
                record.setAccountId(accountId);
                record.setHospitalId(hospitalId);
                record.setHcpcCode(one.hcpcCode);
                record.setChargeCode(one.chargeCode);
                record.setDept(one.dept);
                record.setChargeDescription(one.chargeDescription);
                record.setQuantity(one.quantity);
                record.setComments(one.comments);
                record.setGuarantorId(one.guarantorId);
                record.setPrice(one.price);
                record.setSource(one.source);
                record.setCostCenter(one.costCenter);
                if (one.dateOfService1 != null) {
                    record.setDateOfService(DateUtils.convertToGMT(one.dateOfService1));
                }
                if (one.predNbr != null) {
                    record.setPredNbr(one.predNbr);
                }
                record.setMethod(one.method);
                if (one.predKey != null) {
                    record.setPredKey(one.predKey);
                }
                record.setIsNew((byte) ((one.rowEditable) ? 1 : 0));
                record.setPos(one.pos);
                record.setModifier(one.modifier);
                record.setNpi(one.npi);
                record.setDiag(one.diag);
                record.setPrimaryDiag(one.primaryDiag);
                record.setClaimNumber(one.claimNumber);
                record.setDeptPhys(one.deptPhys);
                record.setBillPhys(one.billPhys);
                othersRecords.add(record);
            }
        }

        log.debug("Deleting existing charges...");
        physicianChargesSubmitDao.deleteExistingSavedCharges(hospitalId, accountId, userName);

        log.debug("Saving existing charges...");
        physicianChargesSubmitDao.saveExistingCharges(existingRecords);

        log.debug("Deleting possibly missing charges...");
        physicianChargesSubmitDao.deleteMissingSavedCharges(hospitalId, accountId, userName);

        log.debug("Saving possibly missing charges...");
        physicianChargesSubmitDao.saveMissingCharges(missingRecords);

        log.debug("Deleting other charges...");
        physicianChargesSubmitDao.deleteOtherSavedCharges(hospitalId, accountId, userName);

        log.debug("Saving other charges...");
        physicianChargesSubmitDao.saveOtherCharges(othersRecords);

        return Response.status(Response.Status.ACCEPTED).build();
    }

    @POST
    @Path(URL_SUBMITTED_CHARGES)
    @Transactional
    public Response submitCharges(@PathParam("hospitalId") String hospitalId, @PathParam("accountId") String accountId, SavedChargesInput data) throws RevenueLeakageException {
        log.debug("submitCharges() - start, hospitalId = " + hospitalId + ", accountId = " + accountId);

        SecurityUtils.getSubject().checkPermission(TPermission.SUBMIT_CHARGES.getPermission());
        String userName = AuthUtils.getLoggedUserName();
        if (data == null) {
            throw new WebApplicationException(Response.Status.BAD_REQUEST);
        }
        if (hospitalId == null || hospitalId.trim().isEmpty()) {
            throw new WebApplicationException(Response.Status.BAD_REQUEST);
        }
        if (accountId == null || accountId.trim().isEmpty()) {
            throw new WebApplicationException(Response.Status.BAD_REQUEST);
        }
        if (data.existingPhysicianCharges == null) {
            throw new WebApplicationException(Response.Status.BAD_REQUEST);
        }
        if (data.missingPhysicianCharges == null) {
            throw new WebApplicationException(Response.Status.BAD_REQUEST);
        }
        if (data.otherPhysicianCharges == null) {
            throw new WebApplicationException(Response.Status.BAD_REQUEST);
        }

        Timestamp now = new Timestamp(Calendar.getInstance().getTimeInMillis());
        String currentUser = AuthUtils.getLoggedUserName();

        log.debug("Filtering other charges...");
        //OtherChargesFilter.filterOtherCharges(data.otherPhysicianCharges);

        log.debug("Input structure for other charges is valid.");
        log.debug("Initializing processors...");

        ExistingChargeProcessor existingProcessor = new ExistingChargeProcessor(physicianChargesSubmitDao);
        PossiblyMissingChargeProcessor missingProcessor = new PossiblyMissingChargeProcessor(physicianChargesSubmitDao);
        OtherChargeProcessor otherProcessor = new OtherChargeProcessor(physicianChargesSubmitDao);
        if (!data.missingPhysicianCharges.isEmpty()) {
            existingProcessor.predictionType = 1;
        } else {
            existingProcessor.predictionType = 0;
        }
        log.debug("Processing possibly missing charges...");
        for (MissingChargeRepresentation one : data.missingPhysicianCharges) {
            if (one.dateOfService != null) {
                one.dateOfService = DateUtils.convertToGMT(one.dateOfService);
            }
            if (one.rowEditable && !one.responseCode.equals(DbConstants.BLANK)) {
                missingProcessor.processPossiblyMissingCharge(one, hospitalId, accountId, currentUser, now);
            }
        }

        log.debug("Deleting possibly missing saved record...");
        physicianChargesSubmitDao.deleteMissingSavedCharges(hospitalId, accountId, userName);
        log.debug("Possibly missing saved records have been deleted.");

        log.debug("Processing other charges records ...");
        otherProcessor.processOtherChargeUpdate(hospitalId, accountId, userName);
        log.debug("Processing other charges records have been updated D flag.");

        log.debug("Processing other charges...");
        for (OtherSavedDiscoveredChargeRepresentation one : data.otherPhysicianCharges) {
            if (one.dateOfService1 != null) {
                one.dateOfService1 = DateUtils.convertToGMT(one.dateOfService1);
            }

            if (one.method == null || one.method.trim().equals(DbConstants.BLANK)) {
                one = findMethod(data, one);
            }
            if (one.rowEditable) {
                otherProcessor.processOtherCharge(one, hospitalId, accountId, currentUser, now);
            }
        }

        log.debug("Deleting other saved records...");
        physicianChargesSubmitDao.deleteOtherSavedCharges(hospitalId, accountId, userName);
        log.debug("Other saved records have been deleted.");

        log.debug("Processing existing charges records ...");
        existingProcessor.processExistingChargeUpdate(hospitalId, accountId, userName);
        log.debug("Processing existing charge have been update D flag.");

        log.debug("Processing existing charges...");
        for (ExistingChargeRepresentation one : data.existingPhysicianCharges) {
            if (one.chargeDate != null) {
                one.chargeDate = DateUtils.convertToGMT(one.chargeDate);
            }
            if (one.rowEditable) {
                existingProcessor.processExistingCharge(one, hospitalId, accountId, currentUser, now);
            }
        }

        log.debug("Deleting existing saved records...");
        physicianChargesSubmitDao.deleteExistingSavedCharges(hospitalId, accountId, userName);
        log.debug("Existing saved records have been deleted.");

        return Response.status(Response.Status.CREATED).build();
    }

    private OtherSavedDiscoveredChargeRepresentation findMethod(SavedChargesInput data, OtherSavedDiscoveredChargeRepresentation one) {

        if (!data.missingPhysicianCharges.isEmpty()) {
            one.method = DbConstants.METHOD_MANUAL;
        } else {
            one.method = DbConstants.METHOD_MANUAL;
        }
        return one;
    }

    /**
     * Input objects for saveAllCharges
     *
     */
    public static class SavedChargesInput {

        //public List<ExistingChargeRepresentation> existingHospitalCharges;
        public List<ExistingChargeRepresentation> existingPhysicianCharges;
        public List<MissingChargeRepresentation> missingPhysicianCharges;
        public List<OtherSavedDiscoveredChargeRepresentation> otherPhysicianCharges;
    }
}
