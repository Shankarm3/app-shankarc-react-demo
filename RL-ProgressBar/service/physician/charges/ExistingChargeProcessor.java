package com.operasolutions.rl.service.physician.charges;

import java.sql.Date;
import java.sql.Timestamp;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.operasolutions.rl.common.DbConstants;
import com.operasolutions.rl.schema.tables.records.TPhysPredictionsRecord;
import com.operasolutions.rl.service.physician.charges.PhysicianChargesResource.ExistingChargeRepresentation;

/**
 * Processor for existing charge
 *
 * @author Nirmal Kumar
 */
public class ExistingChargeProcessor {

    protected static final Logger log = LoggerFactory.getLogger(ExistingChargeProcessor.class);

    private final PhysicianChargesSubmitDao submittedChargeDao;
    public int predictionType;

    /**
     * Constructor
     *
     * @param submittedChargeDao
     */
    ExistingChargeProcessor(PhysicianChargesSubmitDao submittedChargeDao) {
        this.submittedChargeDao = submittedChargeDao;
    }

    /**
     * Processes existing charge
     *
     * @param one
     * @param hospitalId
     * @param accountId
     * @param currentUser
     * @param now
     */
    public void processExistingCharge(ExistingChargeRepresentation one, String hospitalId, String accountId, String currentUser, Timestamp now) {
        log.debug("processExistingCharge() - start");
        log.debug("date of service " + one.chargeDate);
        if (one.qty != null && one.qty != 0) {
            String flag = DbConstants.YES_VALUE;

            String manual_method = DbConstants.METHOD_MANUAL;
            String emptyPredCode = one.hcpcCode;
            Long recordsCount = new Long(0);
            //if (one.predKey != null) {
            Integer pred = submittedChargeDao.getPredictionPreCount(hospitalId, accountId, one.hcpcCode, emptyPredCode, one.chargeNumber, one.chargeDate);
            // recordsCount = 1L;
            //}
            if (pred != 0) {
                one.predKey = pred;
                recordsCount = 1L;
            }
            String costCenter = submittedChargeDao.getCostCenter(one.hcpcCode);
            if (recordsCount == 0) {
                log.debug("TPredictions Pre/Post Record record not found.");

                log.debug("Reading predDate...");
                Date predDate = null;
                if (predictionType == 0 || predictionType == 1) {
                    predDate = submittedChargeDao.getMaxPredictionDate(hospitalId, accountId);
                }
                log.debug("predDate = " + predDate);
                log.debug("Preparing record...");

                TPhysPredictionsRecord record = new TPhysPredictionsRecord();
                record.setHospitalId(hospitalId);
                record.setAccountId(accountId);
                record.setPredCode(emptyPredCode);
                record.setChargeNumber(one.chargeNumber);
                record.setPredNbr(0);
                record.setPredDate(predDate);
                record.setEvScore(0.0);
                record.setMethod(manual_method);
//					record.setMethod(DbConstants.METHOD_MANUAL);
                record.setSentFlag(DbConstants.YES_VALUE);
                record.setCenAuditorFlag(flag);
                record.setCenAuditorQty(one.qty);
                record.setCenAuditorComments(one.comments);
                record.setDchgCode(emptyPredCode);
                record.setHcpcCode(one.hcpcCode);
                record.setFound((byte) 0);
                record.setVal(one.chargeAmount);
                if (one.source != null && !one.source.equals(DbConstants.BLANK)) {
                    record.setSource(one.source);
                }
                record.setCenAuditorId(currentUser);
                record.setGuarantorId(one.guarantorId);
                record.setCenAuditingTime(now);
                record.setDateOfService(one.chargeDate);
                record.setClaimNumber(one.claim);
                record.setNpi(one.npi);
                record.setCostCenter(costCenter);
                submittedChargeDao.saveNewPreRecord(record);

                log.debug("Record saved.");
            } else {
                log.debug("TPredictionsPreRecord record found.");
                log.debug("Updating existing records...");

                Integer updated = new Integer(0);
                updated = submittedChargeDao.updatePredictionPreRecords(hospitalId, accountId, one.chargeAmount, flag, one.qty, one.comments, now, currentUser, one, costCenter);
                log.debug("Number of updated records = " + updated);
            }
        }
    }

    public void processExistingChargeUpdate(String hospitalId, String accountId, String userName) {
        submittedChargeDao.updatePreRecordExist(hospitalId, accountId, userName);
    }

}
