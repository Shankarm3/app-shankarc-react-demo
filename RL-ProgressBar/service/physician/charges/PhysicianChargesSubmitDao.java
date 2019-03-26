/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.operasolutions.rl.service.physician.charges;

import com.google.inject.Inject;
import com.operasolutions.rl.common.DateUtils;
import com.operasolutions.rl.common.DbConstants;
import com.operasolutions.rl.common.NumberConstants;
import com.operasolutions.rl.schema.tables.TCostcenterRuleMapping;
import com.operasolutions.rl.schema.tables.TPatient;
import com.operasolutions.rl.schema.tables.TPhysChargeMasterLookup;
import com.operasolutions.rl.schema.tables.TPhysCharges;
import com.operasolutions.rl.schema.tables.TPhysPatGuarantorMap;
import com.operasolutions.rl.schema.tables.TPhysPredictions;
import com.operasolutions.rl.schema.tables.TSavePhysDiscoveredcode;
import com.operasolutions.rl.schema.tables.TSavePhysExisitngcode;
import com.operasolutions.rl.schema.tables.TSavePhysPossMissingcode;
import com.operasolutions.rl.schema.tables.records.TPhysPredictionsRecord;
import com.operasolutions.rl.schema.tables.records.TSavePhysDiscoveredcodeRecord;
import com.operasolutions.rl.schema.tables.records.TSavePhysExisitngcodeRecord;
import com.operasolutions.rl.schema.tables.records.TSavePhysPossMissingcodeRecord;
import com.operasolutions.rl.service.physician.charges.PhysicianChargesResource.ExistingChargeRepresentation;
import com.operasolutions.rl.service.physician.charges.PhysicianChargesResource.MissingChargeRepresentation;
import com.operasolutions.rl.service.physician.charges.PhysicianChargesResource.OtherSavedDiscoveredChargeRepresentation;
import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Timestamp;
import java.text.ParseException;
import java.util.List;
import java.util.Map;
import org.jooq.FactoryOperations;
import org.jooq.Record;
import org.jooq.impl.Factory;
import static org.jooq.impl.Factory.max;

/**
 *
 * @author nirmal.kumar
 */
public class PhysicianChargesSubmitDao {
    
    private final FactoryOperations create;
    
    @Inject
    public PhysicianChargesSubmitDao(FactoryOperations jooqFactory) {
        this.create = jooqFactory;
    }

    /**
     * Saves existing charges into T_SAVE table
     *
     * @param charges
     */
    @SuppressWarnings("unchecked")
    public void saveExistingCharges(List<TSavePhysExisitngcodeRecord> charges) {
        if (charges != null) {
            for (TSavePhysExisitngcodeRecord charge : charges) {
                charge.attach(create);
                charge.storeUsing();
            }
        }
    }

    /**
     * Deletes existing saved records
     *
     * @param hospitalId
     * @param accountId
     * @param userName
     */
    public void deleteExistingSavedCharges(String hospitalId, String accountId, String userName) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalId' cannot be null.");
        }
        if (accountId == null) {
            throw new IllegalArgumentException("Input parameter 'accountId' cannot be null.");
        }
        create.delete(TSavePhysExisitngcode.T_SAVE_PHYS_EXISITNGCODE)
                .where(TSavePhysExisitngcode.T_SAVE_PHYS_EXISITNGCODE.HOSPITAL_ID.equal(hospitalId))
                .and(TSavePhysExisitngcode.T_SAVE_PHYS_EXISITNGCODE.ACCOUNT_ID.equal(accountId))
                .and(TSavePhysExisitngcode.T_SAVE_PHYS_EXISITNGCODE.USER_ID.equal(userName))
                .execute();
    }

    /**
     * Saves missing charges into T_SAVE table
     *
     * @param charges
     */
    @SuppressWarnings("unchecked")
    public void saveMissingCharges(List<TSavePhysPossMissingcodeRecord> charges) {
        if (charges != null) {
            for (TSavePhysPossMissingcodeRecord charge : charges) {
                charge.attach(create);
                charge.storeUsing();
            }
        }
    }

    /**
     * Deletes missing saved records
     *
     * @param hospitalId
     * @param accountId
     * @param userName
     */
    public void deleteMissingSavedCharges(String hospitalId, String accountId, String userName) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalId' cannot be null.");
        }
        if (accountId == null) {
            throw new IllegalArgumentException("Input parameter 'accountId' cannot be null.");
        }
        create.delete(TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE)
                .where(TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.HOSPITAL_ID.equal(hospitalId))
                .and(TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.ACCOUNT_ID.equal(accountId))
                .and(TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.USER_ID.equal(userName))
                .execute();
    }

    /**
     * Saves other charges into T_SAVE table
     *
     * @param charges
     */
    @SuppressWarnings("unchecked")
    public void saveOtherCharges(List<TSavePhysDiscoveredcodeRecord> charges) {
        if (charges != null) {
            for (TSavePhysDiscoveredcodeRecord charge : charges) {
                charge.attach(create);
                charge.storeUsing();
            }
        }
    }

    /**
     * Deletes other saved records
     *
     * @param hospitalId
     * @param accountId
     * @param userName
     */
    public void deleteOtherSavedCharges(String hospitalId, String accountId, String userName) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalId' cannot be null.");
        }
        if (accountId == null) {
            throw new IllegalArgumentException("Input parameter 'accountId' cannot be null.");
        }
        
        create.delete(TSavePhysDiscoveredcode.T_SAVE_PHYS_DISCOVEREDCODE)
                .where(TSavePhysDiscoveredcode.T_SAVE_PHYS_DISCOVEREDCODE.HOSPITAL_ID.equal(hospitalId))
                .and(TSavePhysDiscoveredcode.T_SAVE_PHYS_DISCOVEREDCODE.ACCOUNT_ID.equal(accountId))
                .and(TSavePhysDiscoveredcode.T_SAVE_PHYS_DISCOVEREDCODE.USER_ID.equal(userName))
                .execute();
    }

    /**
     * Updates T_PREDICTIONS_PRE records, this method is used for possibly
     * missing charges
     *
     * @param one
     * @param hospitalId
     * @param accountId
     * @param dchgCode
     * @param flag
     * @param qty
     * @param confirmTime
     * @param userId
     * @return Integer - number of updated records
     */
    public Integer updatePredictionRecords(MissingChargeRepresentation one, String hospitalId, String accountId, String dchgCode, String flag, Integer qty, Timestamp confirmTime, String userId) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hostpidalId' cannot be null.");
        }
        if (accountId == null) {
            throw new IllegalArgumentException("Input parameter 'accountId' cannot be null.");
        }
        if (one.hcpcCode == null) {
            throw new IllegalArgumentException("Input parameter 'hcpcCode' cannot be null.");
        }
        if (one.predKey == null) {
            throw new IllegalArgumentException("Input parameter 'predkey' cannot be null.");
        }
        
        return create.update(TPhysPredictions.T_PHYS_PREDICTIONS)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.VAL, one.price)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG, flag)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_QTY, qty)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_COMMENTS, one.comments)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITING_TIME, confirmTime)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.HCPC_CODE, one.hcpcCode)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.DCHG_CODE, dchgCode)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.SOURCE, one.source)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.GUARANTOR_ID, one.guarantorId)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.DATE_OF_SERVICE, one.dateOfService)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.POS, one.pos)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.DIAG, one.diag)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.PRIMARY_DIAG, one.primaryDiag)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.MODIFIER, one.modifier)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.NPI, one.npi)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.CLAIM_NUMBER, one.claimNumber)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.DEPT_PHYS, one.deptPhys)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.BILL_PHYS, one.billPhys)
                .where(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(hospitalId))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID.equal(accountId))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_KEY.equal(one.predKey))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.FOUND.eq(DbConstants.FOUND))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.eq(DbConstants.YES_VALUE))
                .execute();
    }

    /*--exiting block---*/
    /**
     * Count of predictions
     *
     * @param hospitalId
     * @param accountId
     * @param hcpcCode
     * @param dchgCode
     * @param chargeNumber
     * @param charDate
     * @return Long
     */
    public Integer getPredictionPreCount(String hospitalId, String accountId, String hcpcCode, String dchgCode, Long chargeNumber, Date charDate) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hostpidalId' cannot be null.");
        }
        if (accountId == null) {
            throw new IllegalArgumentException("Input parameter 'accountId' cannot be null.");
        }
        if (hcpcCode == null) {
            throw new IllegalArgumentException("Input parameter 'hcpcCode' cannot be null.");
        }
        if (dchgCode == null) {
            throw new IllegalArgumentException("Input parameter 'dchgCode' cannot be null.");
        }
        
        Record record = create.select(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_KEY).from(TPhysPredictions.T_PHYS_PREDICTIONS)
                .where(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(hospitalId))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID.equal(accountId))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.HCPC_CODE.equal(hcpcCode))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.CHARGE_NUMBER.equal(chargeNumber))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.DATE_OF_SERVICE.equal(charDate))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.DCHG_CODE.equal(dchgCode))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_CODE.equal(dchgCode))
                .limit(1)
                .fetchOne();
        if (record != null) {
            return record.getValue("PRED_KEY", Integer.class);
        }
        return 0;
    }

    /**
     * Gets max date
     *
     * @param hospitalId
     * @param accountId
     * @return Date
     */
    public Date getMaxPredictionDate(String hospitalId, String accountId) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hostpidalId' cannot be null.");
        }
        if (accountId == null) {
            throw new IllegalArgumentException("Input parameter 'accountId' cannot be null.");
        }
        Record record = null;
        record = create.select(max(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_DATE).as("maxDate"))
                .from(TPhysPredictions.T_PHYS_PREDICTIONS)
                .where(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(hospitalId))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID.equal(accountId))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.equal(DbConstants.YES_VALUE))
                .fetchOne();
        
        return record.getValue("maxDate", Date.class);
    }

    /**
     * Creates new record in T_PREDICTIONS_PRE
     *
     * @param record
     */
    public void saveNewPreRecord(TPhysPredictionsRecord record) {
        if (record == null) {
            throw new IllegalArgumentException("Input parameter 'record' cannot be null.");
        }
        
        record.attach(create);
        record.store();
    }

    /**
     * Updates T_PREDICTIONS_PRE records, this method is used for existing
     * charges
     *
     * @param hospitalId
     * @param accountId
     * @param predValue
     * @param flag
     * @param qty
     * @param comments
     * @param one
     * @param costCenter
     * @param confirmTime
     * @param userId
     * @return Integer - number of updated records
     */
    public Integer updatePredictionPreRecords(String hospitalId, String accountId, BigDecimal predValue, String flag, Integer qty, String comments, Timestamp confirmTime, String userId, ExistingChargeRepresentation one, String costCenter) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hostpidalId' cannot be null.");
        }
        if (accountId == null) {
            throw new IllegalArgumentException("Input parameter 'accountId' cannot be null.");
        }
        if (one.predKey == null) {
            throw new IllegalArgumentException("Input parameter 'hcpcCode' cannot be null.");
        }
        
        return create.update(TPhysPredictions.T_PHYS_PREDICTIONS)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.VAL, predValue)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG, flag)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_QTY, qty)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_COMMENTS, comments)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITING_TIME, confirmTime)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.GUARANTOR_ID, one.guarantorId)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.DATE_OF_SERVICE, one.chargeDate)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG, DbConstants.YES_VALUE)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.NPI, one.npi)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.CLAIM_NUMBER, one.claim)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER, costCenter)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG, DbConstants.YES_VALUE)
                .where(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(hospitalId))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID.equal(accountId))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_KEY.equal(one.predKey))
                .execute();
        
    }
    
    public void updatePreRecordExist(String hospitalId, String accountId, String userName) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalId' cannot be null.");
        }
        if (accountId == null) {
            throw new IllegalArgumentException("Input parameter 'accountId' cannot be null.");
        }
        Timestamp cuurntTime = null;
        try {
            cuurntTime = DateUtils.getCuurentDateTimeStamp();
        } catch (ParseException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        create.update(TPhysPredictions.T_PHYS_PREDICTIONS).set(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG, DbConstants.SENT_FLAG_DELETE)
                .where(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(hospitalId))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID.equal(accountId))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.METHOD.eq(DbConstants.METHOD_MANUAL))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_NBR.eq(NumberConstants.ZERO))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.FOUND.eq(DbConstants.FOUND))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.eq(DbConstants.YES_VALUE))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID.eq(userName))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITING_TIME.greaterOrEqual(cuurntTime)).execute();
    }

    /*  * Gets max prediction number
     *
     * @param hospitalId
     * @param accountId
     * @param billType
     * @return Integer
     */
    public Integer getMaxPredictionNumber(String hospitalId, String accountId) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hostpidalId' cannot be null.");
        }
        if (accountId == null) {
            throw new IllegalArgumentException("Input parameter 'accountId' cannot be null.");
        }
        
        Record record = create.select(max(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_NBR).as("maxNumber"))
                .from(TPhysPredictions.T_PHYS_PREDICTIONS)
                .where(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(hospitalId))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID.equal(accountId))
                .fetchOne();
        
        return record.getValue("maxNumber", Integer.class);
    }
    
    public Long getPredictionPreCount(String hospitalId, String accountId, OtherSavedDiscoveredChargeRepresentation one, String dchgCode) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hostpidalId' cannot be null.");
        }
        if (accountId == null) {
            throw new IllegalArgumentException("Input parameter 'accountId' cannot be null.");
        }
        if (one.hcpcCode == null) {
            throw new IllegalArgumentException("Input parameter 'hcpcCode' cannot be null.");
        }
        if (dchgCode == null) {
            throw new IllegalArgumentException("Input parameter 'dchgCode' cannot be null.");
        }
        
        Record record = create.selectCount().from(TPhysPredictions.T_PHYS_PREDICTIONS)
                .where(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(hospitalId))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID.equal(accountId))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.HCPC_CODE.equal(one.hcpcCode))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.CHARGE_NUMBER.equal(NumberConstants.ZEROL))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_NBR.equal(one.predNbr))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.DCHG_CODE.equal(dchgCode))
                .fetchOne();
        
        return record.getValue("count", Long.class);
    }
    
    public String getCostCenter(String hcpc) {
        Record record = create.selectDistinct(TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING.COSTCENTER)
                .from(TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING).where(TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING.PHY_HCPC_CODE.eq(hcpc), TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING.IS_OTHER_DISCOVERED.isTrue()).groupBy(TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING.PHY_HCPC_CODE).limit(1).fetchOne();
        if (record != null) {
            return record.getValue("COSTCENTER", String.class);
        }
        return DbConstants.BLANK;
    }
    
    public String getGuarantorId(String hospitalId, String accountId) {
        Record record = create.selectDistinct(TPhysPatGuarantorMap.T_PHYS_PAT_GUARANTOR_MAP.GUARANTOR_ID)
                .from(TPhysPatGuarantorMap.T_PHYS_PAT_GUARANTOR_MAP)
                .where(TPhysPatGuarantorMap.T_PHYS_PAT_GUARANTOR_MAP.HOSPITAL_ID.eq(hospitalId), TPhysPatGuarantorMap.T_PHYS_PAT_GUARANTOR_MAP.ACCOUNT_ID.eq(accountId), TPhysPatGuarantorMap.T_PHYS_PAT_GUARANTOR_MAP.GUARANTOR_ID.isNotNull().or(TPhysPatGuarantorMap.T_PHYS_PAT_GUARANTOR_MAP.GUARANTOR_ID.ne(DbConstants.BLANK)))
                .groupBy(TPhysPatGuarantorMap.T_PHYS_PAT_GUARANTOR_MAP.HOSPITAL_ID, TPhysPatGuarantorMap.T_PHYS_PAT_GUARANTOR_MAP.ACCOUNT_ID, TPhysPatGuarantorMap.T_PHYS_PAT_GUARANTOR_MAP.PATIENT_ID).limit(1).fetchOne();
        if (record != null) {
            return record.getValue("GUARANTOR_ID", String.class);
        }
        return DbConstants.BLANK;
    }
    
    public BigDecimal getMaxPrice(String hospitalId, String hcpc, String modifier) {
        String[] modifierArray = modifier.split(DbConstants.COMMA);
        Record record = create.select(Factory.nvl(TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.PRICE.max(), BigDecimal.ZERO).as("PRICE"))
                .from(TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP)
                .where(TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.HOSPITAL_ID.eq(hospitalId), TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.HCPC.eq(hcpc), TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.MODIFIER.in(modifierArray))
                .fetchOne();
        if (record != null) {
            return record.getValue("PRICE", BigDecimal.class);
        }
        return BigDecimal.ZERO;
    }
    
    public BigDecimal getHcpcPrice(String hospitalId, String hcpc) {
        
        Record record = create.select(Factory.nvl(TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.PRICE, BigDecimal.ZERO).as("PRICE"))
                .from(TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP)
                .where(TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.HOSPITAL_ID.eq(hospitalId), TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.HCPC.eq(hcpc), TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.MODIFIER.eq(DbConstants.BLANK))
                .fetchOne();
        if (record != null) {
            return record.getValue("PRICE", BigDecimal.class);
        }
        return BigDecimal.ZERO;
    }
    
    public BigDecimal getMinPrice(String hospitalId, String hcpc, String modifier) {
        String[] modifierArray = modifier.split(DbConstants.COMMA);
        Record record = create.select(Factory.nvl(TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.PRICE.min(), BigDecimal.ZERO).as("PRICE"))
                .from(TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP)
                .where(TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.HOSPITAL_ID.eq(hospitalId), TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.HCPC.eq(hcpc), TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.MODIFIER.in(modifierArray), TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.PRICE.ne(BigDecimal.ZERO))
                .fetchOne();
        if (record != null) {
            return record.getValue("PRICE", BigDecimal.class);
        }
        return BigDecimal.ZERO;
    }
    
    public Map<String, BigDecimal> getPrice(String hospitalId, String hcpc, String modifier) {
        String[] modifierArray = modifier.split(DbConstants.COMMA);
        Map<String, BigDecimal> map = create.selectDistinct(TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.MODIFIER, Factory.nvl(TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.PRICE, BigDecimal.ZERO).as("PRICE"))
                .from(TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP)
                .where(TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.HOSPITAL_ID.eq(hospitalId), TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.HCPC.eq(hcpc), TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.MODIFIER.in(modifierArray), TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.PRICE.ne(BigDecimal.ZERO))
                .groupBy(TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.MODIFIER)
                .fetchMap(TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.MODIFIER, Factory.nvl(TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.PRICE, BigDecimal.ZERO).as("PRICE"));
        return map;
    }
    
    Integer updatePredictionPreRecordsOthers(String hospitalId, String accountId, String dchgCode, BigDecimal predValue, Date predDate, String flag, Timestamp now, String currentUser, OtherSavedDiscoveredChargeRepresentation one) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hostpidalId' cannot be null.");
        }
        if (accountId == null) {
            throw new IllegalArgumentException("Input parameter 'accountId' cannot be null.");
        }
        if (one.hcpcCode == null) {
            throw new IllegalArgumentException("Input parameter 'hcpcCode' cannot be null.");
        }
        if (dchgCode == null) {
            throw new IllegalArgumentException("Input parameter 'dchgCode' cannot be null.");
        }
        
        return create.update(TPhysPredictions.T_PHYS_PREDICTIONS)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.HCPC_CODE, one.hcpcCode)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.VAL, one.price)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG, flag)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG, DbConstants.YES_VALUE)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_QTY, one.quantity)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_COMMENTS, one.comments)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITING_TIME, now)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.GUARANTOR_ID, one.guarantorId)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.DATE_OF_SERVICE, one.dateOfService1)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.SOURCE, one.source)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER, one.costCenter)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.POS, one.pos)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.DIAG, one.diag)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.PRIMARY_DIAG, one.primaryDiag)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.MODIFIER, one.modifier)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.NPI, one.npi)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.CLAIM_NUMBER, one.claimNumber)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.DEPT_PHYS, one.deptPhys)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.BILL_PHYS, one.billPhys)
                .where(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(hospitalId))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID.equal(accountId))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_KEY.equal(one.predKey))
                .execute();
    }
    
    public void updatePreRecord(String hospitalId, String accountId, String userName) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalId' cannot be null.");
        }
        if (accountId == null) {
            throw new IllegalArgumentException("Input parameter 'accountId' cannot be null.");
        }
        Timestamp cuurntTime = null;
        try {
            cuurntTime = DateUtils.getCuurentDateTimeStamp();
        } catch (ParseException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        create.update(TPhysPredictions.T_PHYS_PREDICTIONS)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG, DbConstants.SENT_FLAG_DELETE)
                .where(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(hospitalId))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID.equal(accountId))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.METHOD.eq(DbConstants.METHOD_MANUAL))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_NBR.notEqual(NumberConstants.ZERO))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.FOUND.eq(DbConstants.FOUND))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.eq(DbConstants.YES_VALUE))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID.eq(userName))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITING_TIME.greaterOrEqual(cuurntTime))
                .execute();
    }
    
}
