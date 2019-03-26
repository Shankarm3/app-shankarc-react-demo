package com.operasolutions.rl.service.physician.charges;

import static com.operasolutions.rl.common.ActivityLogUtils.MODIFIER_WORKFLOW;
import java.sql.Timestamp;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.operasolutions.rl.common.DbConstants;
import com.operasolutions.rl.common.DbUtils;
import com.operasolutions.rl.service.physician.charges.PhysicianChargesResource.MissingChargeRepresentation;
import java.math.BigDecimal;
import java.util.Map;

/**
 * Processor for possibly missing charge
 *
 * @author Nirmal Kumar
 */
public class PossiblyMissingChargeProcessor {

    protected static final Logger log = LoggerFactory.getLogger(PossiblyMissingChargeProcessor.class);

    private final PhysicianChargesSubmitDao submittedChargeDao;

    /**
     * Constructor
     *
     * @param submittedChargeDao
     */
    PossiblyMissingChargeProcessor(PhysicianChargesSubmitDao submittedChargeDao) {
        this.submittedChargeDao = submittedChargeDao;
    }

    /**
     * Processes possibly missing charge
     *
     * @param one
     * @param hospitalId
     * @param accountId
     * @param currentUser
     * @param now
     */
    public void processPossiblyMissingCharge(MissingChargeRepresentation one, String hospitalId, String accountId, String currentUser, Timestamp now) {
        log.debug("processPossiblyMissingCharge() - start");
        log.debug("date of service " + one.dateOfService);
        String dchgCode = DbUtils.mergeDchgCode(one.dept, one.chargeCode);
        log.debug("dchgCode = " + dchgCode);
        log.debug("Checkin responseCode, responseCode = " + one.responseCode);

        String flag = one.responseCode;
        Integer qty = one.qty;
        if (one.qty == null) {
            if (one.responseCode != null && one.responseCode.equals(DbConstants.RESPONSE_AGREE)) {
                qty = 1;
            } else {
                qty = 0;
            }
        }

        log.debug("qty = " + qty);

        Integer updatedCount = 0;
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
                    } else {
                        maxPrices = submittedChargeDao.getHcpcPrice(hospitalId, one.hcpcCode);
                        if (maxPrices.compareTo(BigDecimal.ZERO) != 0) {
                            one.price = maxPrices;
                        }
                    }
                }
            } else {
                BigDecimal maxPrices = submittedChargeDao.getMaxPrice(hospitalId, one.hcpcCode, one.modifier);
                if (maxPrices.compareTo(BigDecimal.ZERO) != 0) {
                    one.price = maxPrices;
                } else {
                    maxPrices = submittedChargeDao.getHcpcPrice(hospitalId, one.hcpcCode);
                    if (maxPrices.compareTo(BigDecimal.ZERO) != 0) {
                        one.price = maxPrices;
                    }
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
        updatedCount = submittedChargeDao.updatePredictionRecords(one, hospitalId, accountId, dchgCode, flag, qty, now, currentUser);

        log.debug("Count of updated records = " + updatedCount);
        log.debug("Records have been updated.");
    }
}
