package com.operasolutions.rl.service.physician.charges;

import static com.operasolutions.rl.common.ActivityLogUtils.MODIFIER_WORKFLOW;
import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Timestamp;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.operasolutions.rl.common.DbConstants;
import static com.operasolutions.rl.common.NumberConstants.ZEROL;
import com.operasolutions.rl.schema.tables.records.TPhysPredictionsRecord;
import com.operasolutions.rl.service.physician.charges.PhysicianChargesResource.OtherSavedDiscoveredChargeRepresentation;
import java.util.Map;

/**
 * Processor for other charge
 *
 * @author Nirmal Kumar
 */
public class OtherChargeProcessor {

    protected static final Logger log = LoggerFactory.getLogger(OtherChargeProcessor.class);

    private final PhysicianChargesSubmitDao submittedChargeDao;

    /**
     * Constructor
     *
     * @param submittedChargeDao
     */
    OtherChargeProcessor(PhysicianChargesSubmitDao submittedChargeDao) {
        this.submittedChargeDao = submittedChargeDao;
    }

    /**
     * Processes other charge
     *
     * @param one
     * @param hospitalId
     * @param accountId
     * @param currentUser
     * @param now
     */
    public void processOtherCharge(OtherSavedDiscoveredChargeRepresentation one, String hospitalId, String accountId, String currentUser, Timestamp now) {
        log.debug("processOtherCharge() - start");
        log.debug("date of service " + one.dateOfService1);
        if (one.quantity != null && one.quantity != 0) {
            String flag = DbConstants.YES_VALUE;

            String emptyPredCode = "";
            String dchgCode = "";
            BigDecimal predValue = one.price;
            log.debug("emptyPredCode = " + emptyPredCode);
            log.debug("dchgCode = " + dchgCode);

            log.debug("Reading predDate...");
            Date predDate = submittedChargeDao.getMaxPredictionDate(hospitalId, accountId);
            Integer maxNumber = submittedChargeDao.getMaxPredictionNumber(hospitalId, accountId);
            if (maxNumber != null) {
                maxNumber++;
            } else {
                maxNumber = 1;
            }
            log.debug("predDate = " + predDate + ", incremented maxNumber = " + maxNumber);
            log.debug("Preparing record...");

            Long recordsCount = new Long(0);
            if (one.predKey != null) {
                // recordsCount = submittedChargeDao.getPredictionPreCount(hospitalId, accountId, one, emptyPredCode);
                recordsCount = 1L;
            }
            if (one.costCenter == null || one.costCenter.trim().length() == 0) {
                one.costCenter = submittedChargeDao.getCostCenter(one.hcpcCode);
            }
            if (one.hcpcCode != null && !one.hcpcCode.trim().equals("") && one.modifier != null && !one.modifier.trim().equals("")) {
                if (MODIFIER_WORKFLOW.equals("1")) {
                    Map<String, BigDecimal> map = submittedChargeDao.getPrice(hospitalId, one.hcpcCode, one.modifier);
                    if (map.containsKey("26")) {
                        one.price = map.get("26");
                    } else if (map.containsKey("TC")) {
                        one.price = map.get("TC");
                    } else if (map.containsKey("50")) {
                        one.price = map.get("50");
                    } else if (map.containsKey("54")) {
                        one.price = map.get("54");
                    } else if (map.containsKey("55")) {
                        one.price = map.get("55");
                    } else {
                        BigDecimal maxPrices = submittedChargeDao.getMinPrice(hospitalId, one.hcpcCode, one.modifier);
                        if (maxPrices.compareTo(BigDecimal.ZERO) != 0) {
                            one.price = maxPrices;
                        }
                    }
                } else {
                    BigDecimal maxPrices = submittedChargeDao.getMaxPrice(hospitalId, one.hcpcCode, one.modifier);
                    if (maxPrices.compareTo(BigDecimal.ZERO) != 0) {
                        one.price = maxPrices;
                    }
                }
            } else if (one.hcpcCode != null && !one.hcpcCode.trim().equals("")) {
                BigDecimal maxPrices = submittedChargeDao.getHcpcPrice(hospitalId, one.hcpcCode);
                if (maxPrices.compareTo(BigDecimal.ZERO) != 0) {
                    one.price = maxPrices;
                }
            }
            if (one.guarantorId == null || one.guarantorId.trim().equals(DbConstants.BLANK)) {
                String guarantorId = submittedChargeDao.getGuarantorId(hospitalId, accountId);
                one.guarantorId = guarantorId;
            }
            if (recordsCount == 0) {

                TPhysPredictionsRecord record = new TPhysPredictionsRecord();
                record.setHospitalId(hospitalId);
                record.setAccountId(accountId);
                record.setPredCode(emptyPredCode);
                record.setPredDate(predDate);
                record.setPredNbr(maxNumber);
                record.setSentFlag(DbConstants.YES_VALUE);
                record.setCenAuditorFlag(flag);
                record.setCenAuditorQty(one.quantity);
                record.setCenAuditorComments(one.comments);
                record.setDchgCode(dchgCode);
                record.setHcpcCode(one.hcpcCode);
                record.setEvScore(0.0);
                record.setFound((byte) 0);
                record.setVal(one.price);
                record.setCenAuditorId(currentUser);
                record.setGuarantorId(one.guarantorId);
                record.setCenAuditingTime(now);
                record.setDateOfService(one.dateOfService1);
                record.setChargeNumber(ZEROL);
                if (one.source != null && !one.source.equals(DbConstants.BLANK)) {
                    record.setSource(one.source);
                }
                record.setCostCenter(one.costCenter);
                record.setPos(one.pos);
                record.setModifier(one.modifier);
                record.setNpi(one.npi);
                record.setDiag(one.diag);
                record.setDeptPhys(one.deptPhys);
                record.setBillPhys(one.billPhys);
                record.setPrimaryDiag(one.primaryDiag);
                record.setClaimNumber(one.claimNumber);
                if (one.method == null || one.method.trim().equals(DbConstants.BLANK)) {
                    record.setMethod(DbConstants.METHOD_MANUAL);
                } else {
                    record.setMethod(one.method);
                }

                submittedChargeDao.saveNewPreRecord(record);

                log.debug("Record saved.");
            } else {
                log.debug("TPredictionsPreRecord record found.");
                log.debug("Updating existing records...");

                Integer updated = new Integer(0);

                updated = submittedChargeDao.updatePredictionPreRecordsOthers(hospitalId, accountId, emptyPredCode, predValue, predDate, flag, now, currentUser, one);

                log.debug("Number of updated records = " + updated);
            }

        }
    }

    public void processOtherChargeUpdate(String hospitalId, String accountId, String userName) {
        submittedChargeDao.updatePreRecord(hospitalId, accountId, userName);
    }
}
