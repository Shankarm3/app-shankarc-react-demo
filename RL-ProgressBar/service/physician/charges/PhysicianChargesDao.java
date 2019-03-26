/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.operasolutions.rl.service.physician.charges;

import com.google.inject.Inject;
import com.operasolutions.rl.common.DbConstants;
import com.operasolutions.rl.common.LookupTypes;
import com.operasolutions.rl.common.NumberConstants;
import com.operasolutions.rl.schema.tables.TCharges;
import com.operasolutions.rl.schema.tables.TCostcenterRuleMapping;
import com.operasolutions.rl.schema.tables.THcpcCodes;
import com.operasolutions.rl.schema.tables.TPhysChargeMasterLookup;
import com.operasolutions.rl.schema.tables.TPhysCharges;
import com.operasolutions.rl.schema.tables.TPhysHospitalMapping;
import com.operasolutions.rl.schema.tables.TPhysMaster;
import com.operasolutions.rl.schema.tables.TPhysPatientAll;
import com.operasolutions.rl.schema.tables.TPhysPredictions;
import com.operasolutions.rl.schema.tables.TSavePhysDiscoveredcode;
import com.operasolutions.rl.schema.tables.TSavePhysExisitngcode;
import com.operasolutions.rl.schema.tables.TSavePhysPossMissingcode;
import com.operasolutions.rl.schema.tables.TTypeLookup;
import com.operasolutions.rl.schema.tables.records.TSavePhysDiscoveredcodeRecord;
import com.operasolutions.rl.service.physician.charges.PhysicianChargesResource.ExistingChargeResult;
import com.operasolutions.rl.service.physician.charges.PhysicianChargesResource.ExistingChargeSaveResult;
import com.operasolutions.rl.service.physician.charges.PhysicianChargesResource.HcpcResult;
import com.operasolutions.rl.service.physician.charges.PhysicianChargesResource.MissingSavedChargeResult;
import com.operasolutions.rl.service.physician.charges.PhysicianChargesResource.MissingSavedPhyChargePredictionResult;
import java.util.ArrayList;
import java.util.List;
import org.jooq.FactoryOperations;
import org.jooq.JoinType;
import org.jooq.Record;
import org.jooq.Result;
import org.jooq.SelectQuery;

/**
 *
 * @author nirmal.kumar
 */
public class PhysicianChargesDao {

    private final FactoryOperations create;

    @Inject
    public PhysicianChargesDao(FactoryOperations jooqFactory) {
        this.create = jooqFactory;
    }

    /**
     * Returns all existing charges for a given hospitalId and accountId
     *
     * @param hospitalId
     * @param accountId
     * @return Existing charges
     */
    public List<ExistingChargeResult> getExistingCharges(String hospitalId, String accountId) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalId' cannot be null.");
        }
        if (accountId == null) {
            throw new IllegalArgumentException("Input parameter 'accountId' cannot be null.");
        }
        return create.selectDistinct(TCharges.T_CHARGES.ACCOUNT_ID, TCharges.T_CHARGES.AMOUNT, TCharges.T_CHARGES.CHARGE_CODE, TCharges.T_CHARGES.CHARGE_DATE,
                TCharges.T_CHARGES.CHARGE_DESCRIPTION, TCharges.T_CHARGES.HCPC_CODE, TCharges.T_CHARGES.REVENUE_CODE, TCharges.T_CHARGES.CHARGE_NUMBER, TCharges.T_CHARGES.DEPT, TCharges.T_CHARGES.QUANTITY,
                TCharges.T_CHARGES.DOCTOR_ID, TPhysMaster.T_PHYS_MASTER.NAME, TPhysMaster.T_PHYS_MASTER.CODE, TPhysMaster.T_PHYS_MASTER.NPI, TPhysMaster.T_PHYS_MASTER.START_DATE, TPhysMaster.T_PHYS_MASTER.TERMINATION_DATE, TPhysMaster.T_PHYS_MASTER.TYPE)
                .from(TCharges.T_CHARGES)
                .leftOuterJoin(TPhysMaster.T_PHYS_MASTER).on(TCharges.T_CHARGES.HOSPITAL_ID.eq(TPhysMaster.T_PHYS_MASTER.HOSPITAL_ID), TCharges.T_CHARGES.DOCTOR_ID.eq(TPhysMaster.T_PHYS_MASTER.CODE), TPhysMaster.T_PHYS_MASTER.NPI.ne(""))
                .where(TCharges.T_CHARGES.HOSPITAL_ID.equal(hospitalId))
                .and(TCharges.T_CHARGES.ACCOUNT_ID.equal(accountId))
                .orderBy(TCharges.T_CHARGES.DEPT)
                .fetchInto(ExistingChargeResult.class);
    }

    /**
     * Returns all saved existing charges for a given hospitalId, accountId,
     * billType and userId
     *
     * @param hospitalId
     * @param accountId
     * @param userId
     * @return Existing saved charges
     */
    public List<ExistingChargeSaveResult> getPhysicianExistingSavedCharges(String hospitalId, String accountId, String userId) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalId' cannot be null.");
        }
        if (accountId == null) {
            throw new IllegalArgumentException("Input parameter 'accountId' cannot be null.");
        }
        SelectQuery query = create.selectQuery();
        query.addSelect(TSavePhysExisitngcode.T_SAVE_PHYS_EXISITNGCODE.PRED_KEY, TSavePhysExisitngcode.T_SAVE_PHYS_EXISITNGCODE.GUARANTOR_ID, TSavePhysExisitngcode.T_SAVE_PHYS_EXISITNGCODE.IS_NEW, TSavePhysExisitngcode.T_SAVE_PHYS_EXISITNGCODE.ACCOUNT_ID, TSavePhysExisitngcode.T_SAVE_PHYS_EXISITNGCODE.DEPT, TSavePhysExisitngcode.T_SAVE_PHYS_EXISITNGCODE.CHARGE_AMOUNT, TSavePhysExisitngcode.T_SAVE_PHYS_EXISITNGCODE.CHARGE_CODE, TSavePhysExisitngcode.T_SAVE_PHYS_EXISITNGCODE.CHARGE_DATE,
                TSavePhysExisitngcode.T_SAVE_PHYS_EXISITNGCODE.CHARGE_DESC, TSavePhysExisitngcode.T_SAVE_PHYS_EXISITNGCODE.HCPC_CODE, TSavePhysExisitngcode.T_SAVE_PHYS_EXISITNGCODE.REVENUE_CODE, TSavePhysExisitngcode.T_SAVE_PHYS_EXISITNGCODE.CHARGE_NUMBER, TSavePhysExisitngcode.T_SAVE_PHYS_EXISITNGCODE.NEW_QUANTITY, TSavePhysExisitngcode.T_SAVE_PHYS_EXISITNGCODE.QUANTITY,
                TSavePhysExisitngcode.T_SAVE_PHYS_EXISITNGCODE.COMMENTS, TSavePhysExisitngcode.T_SAVE_PHYS_EXISITNGCODE.SOURCE, TSavePhysExisitngcode.T_SAVE_PHYS_EXISITNGCODE.CLAIM_NUMBER, TSavePhysExisitngcode.T_SAVE_PHYS_EXISITNGCODE.DOCTOR_ID, TPhysMaster.T_PHYS_MASTER.NAME, TPhysMaster.T_PHYS_MASTER.CODE, TPhysMaster.T_PHYS_MASTER.NPI, TPhysMaster.T_PHYS_MASTER.START_DATE, TPhysMaster.T_PHYS_MASTER.TERMINATION_DATE, TPhysMaster.T_PHYS_MASTER.TYPE);
        query.addFrom(TSavePhysExisitngcode.T_SAVE_PHYS_EXISITNGCODE);
        query.addJoin(TPhysMaster.T_PHYS_MASTER, JoinType.LEFT_OUTER_JOIN, TSavePhysExisitngcode.T_SAVE_PHYS_EXISITNGCODE.DOCTOR_ID.eq(TPhysMaster.T_PHYS_MASTER.CODE), TPhysMaster.T_PHYS_MASTER.NPI.ne(""));
        query.addConditions(TSavePhysExisitngcode.T_SAVE_PHYS_EXISITNGCODE.HOSPITAL_ID.equal(hospitalId));
        query.addConditions(TSavePhysExisitngcode.T_SAVE_PHYS_EXISITNGCODE.ACCOUNT_ID.equal(accountId));
        query.addOrderBy(TSavePhysExisitngcode.T_SAVE_PHYS_EXISITNGCODE.DEPT, TSavePhysExisitngcode.T_SAVE_PHYS_EXISITNGCODE.HCPC_CODE);

        if (userId != null) {
            query.addConditions(TSavePhysExisitngcode.T_SAVE_PHYS_EXISITNGCODE.USER_ID.equal(userId));
        }
        return query.fetchInto(ExistingChargeSaveResult.class
        );
    }

    /**
     * Returns all existing charges for a given hospitalId and accountId
     *
     * @param hospitalId
     * @param accountId
     * @return Existing charges
     */
    public List<ExistingChargeResult> getPhysicianExistingCharges(String hospitalId, String accountId) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalId' cannot be null.");
        }
        if (accountId == null) {
            throw new IllegalArgumentException("Input parameter 'accountId' cannot be null.");
        }
        return create.selectDistinct(TPhysCharges.T_PHYS_CHARGES.ACCOUNT_ID, TPhysCharges.T_PHYS_CHARGES.GUARANTOR_ID, TPhysCharges.T_PHYS_CHARGES.AMOUNT, TPhysCharges.T_PHYS_CHARGES.CHARGE_CODE, TPhysCharges.T_PHYS_CHARGES.CHARGE_DATE,
                TPhysCharges.T_PHYS_CHARGES.CHARGE_DESCRIPTION, TPhysCharges.T_PHYS_CHARGES.HCPC_CODE, TPhysCharges.T_PHYS_CHARGES.REVENUE_CODE, TPhysCharges.T_PHYS_CHARGES.CHARGE_NUMBER, TPhysCharges.T_PHYS_CHARGES.DEPT, TPhysCharges.T_PHYS_CHARGES.QUANTITY,
                TPhysPatientAll.T_PHYS_PATIENT_ALL.FIRST_NAME, TPhysPatientAll.T_PHYS_PATIENT_ALL.LAST_NAME, TPhysPatientAll.T_PHYS_PATIENT_ALL.DOB,
                TPhysCharges.T_PHYS_CHARGES.CLAIM_NUMBER, TPhysCharges.T_PHYS_CHARGES.SOURCE, TPhysCharges.T_PHYS_CHARGES.DOCTOR_ID, TPhysMaster.T_PHYS_MASTER.NAME, TPhysMaster.T_PHYS_MASTER.CODE, TPhysMaster.T_PHYS_MASTER.NPI, TPhysMaster.T_PHYS_MASTER.START_DATE, TPhysMaster.T_PHYS_MASTER.TERMINATION_DATE, TPhysMaster.T_PHYS_MASTER.TYPE)
                .from(TPhysCharges.T_PHYS_CHARGES)
                .leftOuterJoin(TPhysMaster.T_PHYS_MASTER).on(TPhysCharges.T_PHYS_CHARGES.HOSPITAL_ID.eq(TPhysMaster.T_PHYS_MASTER.HOSPITAL_ID), TPhysCharges.T_PHYS_CHARGES.DOCTOR_ID.eq(TPhysMaster.T_PHYS_MASTER.CODE), TPhysMaster.T_PHYS_MASTER.NPI.ne(""))
                .leftOuterJoin(TPhysPatientAll.T_PHYS_PATIENT_ALL).on(TPhysCharges.T_PHYS_CHARGES.GUARANTOR_ID.eq(TPhysPatientAll.T_PHYS_PATIENT_ALL.GUARANTOR_ID))
                .where(TPhysCharges.T_PHYS_CHARGES.HOSPITAL_ID.equal(hospitalId))
                .and(TPhysCharges.T_PHYS_CHARGES.ACCOUNT_ID.equal(accountId))
                .orderBy(TPhysCharges.T_PHYS_CHARGES.DEPT)
                .fetchInto(ExistingChargeResult.class);
    }

    /**
     * Returns possibly missing charges from T_PREDICTIONS_PRE table
     *
     * @param hospitalId
     * @param accountId
     * @param isConfirm
     * @return Result<Record>
     */
    public List<MissingSavedPhyChargePredictionResult> getSubmittedExistingPhysicianCharges(String hospitalId, String accountId, boolean isConfirm) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalId' cannot be null.");
        }
        if (accountId == null) {
            throw new IllegalArgumentException("Input parameter 'accountId' cannot be null.");
        }

        List<MissingSavedPhyChargePredictionResult> resultOut = new ArrayList<MissingSavedPhyChargePredictionResult>();
        if (isConfirm) {
            Result<Record> result = create.selectDistinct(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_KEY, TPhysPredictions.T_PHYS_PREDICTIONS.GUARANTOR_ID, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITING_TIME, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG, TPhysPredictions.T_PHYS_PREDICTIONS.DCHG_CODE, TPhysPredictions.T_PHYS_PREDICTIONS.HCPC_CODE, THcpcCodes.T_HCPC_CODES.DESCRIPTION.as("chargeDescription"), TPhysPredictions.T_PHYS_PREDICTIONS.CLAIM_NUMBER,
                    TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING.DESCRIPTION, TPhysPredictions.T_PHYS_PREDICTIONS.INT_AUDITOR_QTY, TPhysPredictions.T_PHYS_PREDICTIONS.CHARGE_NUMBER, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_COMMENTS,
                    TPhysPredictions.T_PHYS_PREDICTIONS.PRED_CODE, TPhysPredictions.T_PHYS_PREDICTIONS.DATE_OF_SERVICE, TPhysPredictions.T_PHYS_PREDICTIONS.VAL.as("price"), TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_QTY, TTypeLookup.T_TYPE_LOOKUP.DESCRIPTION.as("response"))
                    .from(TPhysPredictions.T_PHYS_PREDICTIONS)
                    .leftOuterJoin(THcpcCodes.T_HCPC_CODES).on(TPhysPredictions.T_PHYS_PREDICTIONS.HCPC_CODE.equal(THcpcCodes.T_HCPC_CODES.CODE_VALUE))
                    .leftOuterJoin(TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING).on(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_CODE.equal(TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING.RULE))
                    .leftOuterJoin(TTypeLookup.T_TYPE_LOOKUP).on(TTypeLookup.T_TYPE_LOOKUP.VALUE.equal(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG), TTypeLookup.T_TYPE_LOOKUP.LOOKUP_TYPE.eq(DbConstants.RESPONSE_PHYS))
                    .where(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(hospitalId))
                    .and(TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID.equal(accountId))
                    .and(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.equal(DbConstants.YES_VALUE))
                    .and(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_NBR.equal(NumberConstants.ZERO))
                    .and(TPhysPredictions.T_PHYS_PREDICTIONS.METHOD.equal(DbConstants.METHOD_MANUAL))
                    .orderBy(TPhysPredictions.T_PHYS_PREDICTIONS.EV_SCORE.desc())
                    .fetch();
            if (result != null) {
                resultOut = result.into(MissingSavedPhyChargePredictionResult.class);
            }
        } else {
            Result<Record> result = create.selectDistinct(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_KEY, TPhysPredictions.T_PHYS_PREDICTIONS.GUARANTOR_ID, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITING_TIME, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG, TPhysPredictions.T_PHYS_PREDICTIONS.DCHG_CODE, TPhysPredictions.T_PHYS_PREDICTIONS.HCPC_CODE, THcpcCodes.T_HCPC_CODES.DESCRIPTION.as("chargeDescription"), TPhysPredictions.T_PHYS_PREDICTIONS.CLAIM_NUMBER,
                    TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING.DESCRIPTION, TPhysPredictions.T_PHYS_PREDICTIONS.INT_AUDITOR_QTY, TPhysPredictions.T_PHYS_PREDICTIONS.CHARGE_NUMBER, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_COMMENTS,
                    TPhysPredictions.T_PHYS_PREDICTIONS.PRED_CODE, TPhysPredictions.T_PHYS_PREDICTIONS.DATE_OF_SERVICE, TPhysPredictions.T_PHYS_PREDICTIONS.VAL.as("price"), TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_QTY, TTypeLookup.T_TYPE_LOOKUP.DESCRIPTION.as("response"))
                    .from(TPhysPredictions.T_PHYS_PREDICTIONS)
                    .leftOuterJoin(THcpcCodes.T_HCPC_CODES).on(TPhysPredictions.T_PHYS_PREDICTIONS.HCPC_CODE.equal(THcpcCodes.T_HCPC_CODES.CODE_VALUE))
                    .leftOuterJoin(TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING).on(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_CODE.equal(TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING.RULE))
                    .leftOuterJoin(TTypeLookup.T_TYPE_LOOKUP).on(TTypeLookup.T_TYPE_LOOKUP.VALUE.equal(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG), TTypeLookup.T_TYPE_LOOKUP.LOOKUP_TYPE.eq(DbConstants.RESPONSE_PHYS))
                    .where(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(hospitalId))
                    .and(TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID.equal(accountId))
                    .and(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.equal(DbConstants.YES_VALUE))
                    .and(TPhysPredictions.T_PHYS_PREDICTIONS.FOUND.equal(DbConstants.FOUND))
                    .and(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_NBR.equal(NumberConstants.ZERO))
                    .and(TPhysPredictions.T_PHYS_PREDICTIONS.METHOD.equal(DbConstants.METHOD_MANUAL))
                    .orderBy(TPhysPredictions.T_PHYS_PREDICTIONS.EV_SCORE.desc())
                    .fetch();
            if (result != null) {
                resultOut = result.into(MissingSavedPhyChargePredictionResult.class);
            }
        }
        return resultOut;
    }

    /**
     * Returns discovered charges for a given hospitalId, accountId, billType
     * and userId
     *
     * @param hospitalId
     * @param accountId
     * @param userId
     * @return List of charges
     */
    public List<TSavePhysDiscoveredcodeRecord> getOtherDiscoveredCharges(String hospitalId, String accountId, String userId) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalId' cannot be null.");
        }
        if (accountId == null) {
            throw new IllegalArgumentException("Input parameter 'accountId' cannot be null.");
        }

        SelectQuery query = create.selectQuery();
        query.addFrom(TSavePhysDiscoveredcode.T_SAVE_PHYS_DISCOVEREDCODE);
        query.addConditions(TSavePhysDiscoveredcode.T_SAVE_PHYS_DISCOVEREDCODE.HOSPITAL_ID.equal(hospitalId));
        query.addConditions(TSavePhysDiscoveredcode.T_SAVE_PHYS_DISCOVEREDCODE.ACCOUNT_ID.equal(accountId));
        query.addOrderBy(TSavePhysDiscoveredcode.T_SAVE_PHYS_DISCOVEREDCODE.DEPT);
        if (userId != null) {
            query.addConditions(TSavePhysDiscoveredcode.T_SAVE_PHYS_DISCOVEREDCODE.USER_ID.equal(userId));
        }

        return query.fetchInto(TSavePhysDiscoveredcodeRecord.class);
    }

    /**
     * Returns possibly missing charges from T_PREDICTIONS_PRE table
     *
     * @param hospitalId
     * @param accountId
     * @param isConfirm
     * @return Result<Record>
     */
    public List<MissingSavedPhyChargePredictionResult> getSubmittedOtherDiscoveredCharges(String hospitalId, String accountId, boolean isConfirm) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalId' cannot be null.");
        }
        if (accountId == null) {
            throw new IllegalArgumentException("Input parameter 'accountId' cannot be null.");
        }
        List<MissingSavedPhyChargePredictionResult> resultOut = new ArrayList<MissingSavedPhyChargePredictionResult>();
        if (isConfirm) {
            Result<Record> result = create.selectDistinct(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_KEY, TPhysPredictions.T_PHYS_PREDICTIONS.GUARANTOR_ID, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITING_TIME, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG, TPhysPredictions.T_PHYS_PREDICTIONS.DCHG_CODE, TPhysPredictions.T_PHYS_PREDICTIONS.HCPC_CODE, THcpcCodes.T_HCPC_CODES.DESCRIPTION.as("chargeDescription"),
                    TPhysPredictions.T_PHYS_PREDICTIONS.PRED_NBR, TPhysPredictions.T_PHYS_PREDICTIONS.METHOD, TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER, TPhysPredictions.T_PHYS_PREDICTIONS.SOURCE,
                    TPhysPredictions.T_PHYS_PREDICTIONS.CLAIM_NUMBER, TPhysPredictions.T_PHYS_PREDICTIONS.POS, TPhysPredictions.T_PHYS_PREDICTIONS.MODIFIER, TPhysPredictions.T_PHYS_PREDICTIONS.DIAG, TPhysPredictions.T_PHYS_PREDICTIONS.PRIMARY_DIAG, TPhysPredictions.T_PHYS_PREDICTIONS.NPI,
                    THcpcCodes.T_HCPC_CODES.DESCRIPTION, TPhysPredictions.T_PHYS_PREDICTIONS.INT_AUDITOR_QTY, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_COMMENTS,
                    TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_QTY, TPhysPredictions.T_PHYS_PREDICTIONS.VAL.as("price"),
                    TPhysPredictions.T_PHYS_PREDICTIONS.DEPT_PHYS, TPhysPredictions.T_PHYS_PREDICTIONS.BILL_PHYS, TPhysPredictions.T_PHYS_PREDICTIONS.PRED_CODE, TPhysPredictions.T_PHYS_PREDICTIONS.DATE_OF_SERVICE).from(TPhysPredictions.T_PHYS_PREDICTIONS)
                    .leftOuterJoin(THcpcCodes.T_HCPC_CODES).on(TPhysPredictions.T_PHYS_PREDICTIONS.HCPC_CODE.equal(THcpcCodes.T_HCPC_CODES.CODE_VALUE))
                    //.leftOuterJoin(TPhysMaster.T_PHYS_MASTER).on(TPhysMaster.T_PHYS_MASTER.NPI.equal(TPhysPredictions.T_PHYS_PREDICTIONS.NPI), TPhysMaster.T_PHYS_MASTER.NPI.isNotNull(),TPhysMaster.T_PHYS_MASTER.NPI.ne(""))
                    .where(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(hospitalId))
                    .and(TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID.equal(accountId))
                    .and(TPhysPredictions.T_PHYS_PREDICTIONS.METHOD.equal(DbConstants.METHOD_MANUAL))
                    .and(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_NBR.notEqual(NumberConstants.ZERO))
                    .and(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.equal(DbConstants.YES_VALUE))
                    .fetch();
            if (result != null) {
                resultOut = result.into(MissingSavedPhyChargePredictionResult.class);
            }
        } else {
            Result<Record> result = create.selectDistinct(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_KEY, TPhysPredictions.T_PHYS_PREDICTIONS.GUARANTOR_ID, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITING_TIME, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG, TPhysPredictions.T_PHYS_PREDICTIONS.DCHG_CODE, TPhysPredictions.T_PHYS_PREDICTIONS.HCPC_CODE, THcpcCodes.T_HCPC_CODES.DESCRIPTION.as("chargeDescription"),
                    TPhysPredictions.T_PHYS_PREDICTIONS.PRED_NBR, TPhysPredictions.T_PHYS_PREDICTIONS.METHOD, TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER, TPhysPredictions.T_PHYS_PREDICTIONS.SOURCE,
                    TPhysPredictions.T_PHYS_PREDICTIONS.CLAIM_NUMBER, TPhysPredictions.T_PHYS_PREDICTIONS.POS, TPhysPredictions.T_PHYS_PREDICTIONS.MODIFIER, TPhysPredictions.T_PHYS_PREDICTIONS.DIAG, TPhysPredictions.T_PHYS_PREDICTIONS.PRIMARY_DIAG, TPhysPredictions.T_PHYS_PREDICTIONS.NPI,
                    THcpcCodes.T_HCPC_CODES.DESCRIPTION, TPhysPredictions.T_PHYS_PREDICTIONS.INT_AUDITOR_QTY, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_COMMENTS,
                    TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_QTY, TPhysPredictions.T_PHYS_PREDICTIONS.VAL.as("price"),
                    TPhysPredictions.T_PHYS_PREDICTIONS.DEPT_PHYS, TPhysPredictions.T_PHYS_PREDICTIONS.BILL_PHYS, TPhysPredictions.T_PHYS_PREDICTIONS.PRED_CODE, TPhysPredictions.T_PHYS_PREDICTIONS.DATE_OF_SERVICE).from(TPhysPredictions.T_PHYS_PREDICTIONS)
                    .leftOuterJoin(THcpcCodes.T_HCPC_CODES).on(TPhysPredictions.T_PHYS_PREDICTIONS.HCPC_CODE.equal(THcpcCodes.T_HCPC_CODES.CODE_VALUE))
                    //.leftOuterJoin(TPhysMaster.T_PHYS_MASTER).on(TPhysMaster.T_PHYS_MASTER.NPI.equal(TPhysPredictions.T_PHYS_PREDICTIONS.NPI), TPhysMaster.T_PHYS_MASTER.NPI.isNotNull(),TPhysMaster.T_PHYS_MASTER.NPI.ne(""))
                    .where(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(hospitalId))
                    .and(TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID.equal(accountId))
                    .and(TPhysPredictions.T_PHYS_PREDICTIONS.METHOD.equal(DbConstants.METHOD_MANUAL))
                    .and(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_NBR.notEqual(NumberConstants.ZERO))
                    .and(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.equal(DbConstants.YES_VALUE))
                    .and(TPhysPredictions.T_PHYS_PREDICTIONS.FOUND.equal(DbConstants.FOUND))
                    .fetch();
            if (result != null) {
                resultOut = result.into(MissingSavedPhyChargePredictionResult.class);
            }
        }
        return resultOut;
    }

    /**
     * Returns possibly missing charges from T_SAVE_POSS_MISSINGCODE table
     *
     * @param hospitalId
     * @param accountId
     * @param userId
     * @return Result<Record>
     */
    public List<MissingSavedChargeResult> getExistingMissingSavedCharges(String hospitalId, String accountId, String userId) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalId' cannot be null.");
        }
        if (accountId == null) {
            throw new IllegalArgumentException("Input parameter 'accountId' cannot be null.");
        }

        List<MissingSavedChargeResult> resultOut = new ArrayList<MissingSavedChargeResult>();

        SelectQuery query = create.selectQuery();
        query.addSelect(TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING.HSP_HCPC_CODE.as("hcpcCode"), TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING.HSP_CODE_TYPE);
        query.setDistinct(true);
        query.addFrom(TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE);
        query.addJoin(TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING, JoinType.JOIN, TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.PRED_CODE.eq(TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING.RULE));
        query.addConditions(TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.HOSPITAL_ID.equal(hospitalId));
        query.addConditions(TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.ACCOUNT_ID.equal(accountId));
        query.addOrderBy(TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.DEPT);
        if (userId != null) {
            query.addConditions(TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.USER_ID.equal(userId));
        }
        Result<Record> result = query.fetch();
        if (result != null) {
            resultOut = result.into(MissingSavedChargeResult.class);
        }
        return resultOut;
    }

    /**
     * Returns possibly missing charges from T_SAVE_POSS_MISSINGCODE table
     *
     * @param hospitalId
     * @param accountId
     * @param userId
     * @return Result<Record>
     */
    public List<MissingSavedChargeResult> getMissingSavedCharges(String hospitalId, String accountId, String userId) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalId' cannot be null.");
        }
        if (accountId == null) {
            throw new IllegalArgumentException("Input parameter 'accountId' cannot be null.");
        }

        List<MissingSavedChargeResult> resultOut = new ArrayList<MissingSavedChargeResult>();

        SelectQuery query = create.selectQuery();
        query.setDistinct(true);
        query.addSelect(TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.PRED_KEY, TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.SOURCE, TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.GUARANTOR_ID, TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.IS_NEW, TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.HCPC_CODE, TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.DEPT, TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.CHARGE_DESC,
                TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.CHARGE_CODE, TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.QUANTITY, TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.COMMENTS,TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.COST_CENTER,
                TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.DEPT_PHYS, TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.BILL_PHYS, TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.CLAIM_NUMBER, TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.POS, TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.MODIFIER, TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.DIAG, TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.PRIMARY_DIAG, TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.NPI,
                TTypeLookup.T_TYPE_LOOKUP.as("typeLookup").DESCRIPTION, TTypeLookup.T_TYPE_LOOKUP.as("typeLookup").VALUE, TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.PRED_CODE,
                TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.DATE_OF_SERVICE, TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.PRICE);
        query.addFrom(TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE);
        query.addConditions(TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.HOSPITAL_ID.equal(hospitalId));
        query.addConditions(TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.ACCOUNT_ID.equal(accountId));
        // query.addOrderBy(TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.DEPT);
        //query.addJoin(TPhysMaster.T_PHYS_MASTER, JoinType.LEFT_OUTER_JOIN, TPhysMaster.T_PHYS_MASTER.NPI.equal(TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.NPI), TPhysMaster.T_PHYS_MASTER.NPI.isNotNull(),TPhysMaster.T_PHYS_MASTER.NPI.ne(""));
        query.addJoin(TTypeLookup.T_TYPE_LOOKUP.as("typeLookup"), JoinType.LEFT_OUTER_JOIN, TTypeLookup.T_TYPE_LOOKUP.as("typeLookup").LOOKUP_TYPE.equal(LookupTypes.TYPE_RESPONSE_PHYS), TTypeLookup.T_TYPE_LOOKUP.as("typeLookup").VALUE.equal(TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.RESPONSE));
        query.addOrderBy(TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.DEPT);

        if (userId != null) {
            query.addConditions(TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.USER_ID.equal(userId));
        }
        Result<Record> result = query.fetch();
        if (result != null) {
            resultOut = result.into(MissingSavedChargeResult.class);
        }
        return resultOut;
    }

    /**
     * Returns possibly missing charges from T_PREDICTIONS_PRE table
     *
     * @param hospitalId
     * @param accountId
     * @return Result<Record>
     */
    public List<MissingSavedPhyChargePredictionResult> getExistingPossiblyMissingCharges(String hospitalId, String accountId) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalId' cannot be null.");
        }
        if (accountId == null) {
            throw new IllegalArgumentException("Input parameter 'accountId' cannot be null.");
        }

        List<MissingSavedPhyChargePredictionResult> resultOut = new ArrayList<MissingSavedPhyChargePredictionResult>();

        Result<Record> result = create.selectDistinct(TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING.HSP_HCPC_CODE.as("hcpcCode"), TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING.HSP_CODE_TYPE)
                .from(TPhysPredictions.T_PHYS_PREDICTIONS)
                .join(TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING).on(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_CODE.eq(TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING.RULE))
                .where(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(hospitalId))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID.equal(accountId))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.equal(DbConstants.YES_VALUE))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.FOUND.equal(DbConstants.FOUND))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.METHOD.notEqual(DbConstants.METHOD_MANUAL))
                .orderBy(TPhysPredictions.T_PHYS_PREDICTIONS.EV_SCORE.desc())
                .fetch();

        if (result != null) {
            resultOut = result.into(MissingSavedPhyChargePredictionResult.class);
        }

        return resultOut;
    }

    /**
     * Returns possibly missing charges from T_PREDICTIONS_PRE table
     *
     * @param hospitalId
     * @param accountId
     * @param isConfirm
     * @return Result<Record>
     */
    public List<MissingSavedPhyChargePredictionResult> getPossiblyMissingCharges(String hospitalId, String accountId, boolean isConfirm) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalId' cannot be null.");
        }
        if (accountId == null) {
            throw new IllegalArgumentException("Input parameter 'accountId' cannot be null.");
        }

        List<MissingSavedPhyChargePredictionResult> resultOut = new ArrayList<MissingSavedPhyChargePredictionResult>();
        if (isConfirm) {
            Result<Record> result = create.selectDistinct(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_KEY, TPhysPredictions.T_PHYS_PREDICTIONS.SOURCE, TPhysPredictions.T_PHYS_PREDICTIONS.GUARANTOR_ID, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITING_TIME, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID, TPhysPredictions.T_PHYS_PREDICTIONS.DCHG_CODE, TPhysPredictions.T_PHYS_PREDICTIONS.HCPC_CODE, THcpcCodes.T_HCPC_CODES.DESCRIPTION.as("chargeDescription"),
                    TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING.DESCRIPTION, TPhysPredictions.T_PHYS_PREDICTIONS.INT_AUDITOR_QTY, TPhysPredictions.T_PHYS_PREDICTIONS.CHARGE_NUMBER, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_COMMENTS, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG,
                    TPhysPredictions.T_PHYS_PREDICTIONS.CLAIM_NUMBER, TPhysPredictions.T_PHYS_PREDICTIONS.POS, TPhysPredictions.T_PHYS_PREDICTIONS.MODIFIER, TPhysPredictions.T_PHYS_PREDICTIONS.DIAG, TPhysPredictions.T_PHYS_PREDICTIONS.PRIMARY_DIAG, TPhysPredictions.T_PHYS_PREDICTIONS.NPI,
                    TPhysPredictions.T_PHYS_PREDICTIONS.DEPT_PHYS, TPhysPredictions.T_PHYS_PREDICTIONS.BILL_PHYS, TPhysPredictions.T_PHYS_PREDICTIONS.PRED_CODE, TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER, TPhysPredictions.T_PHYS_PREDICTIONS.DATE_OF_SERVICE, TPhysPredictions.T_PHYS_PREDICTIONS.VAL.as("price"), TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_QTY, TTypeLookup.T_TYPE_LOOKUP.DESCRIPTION.as("response"))
                    .from(TPhysPredictions.T_PHYS_PREDICTIONS)
                    .leftOuterJoin(THcpcCodes.T_HCPC_CODES).on(TPhysPredictions.T_PHYS_PREDICTIONS.HCPC_CODE.equal(THcpcCodes.T_HCPC_CODES.CODE_VALUE))
                    .leftOuterJoin(TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING).on(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_CODE.equal(TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING.RULE))
                    .leftOuterJoin(TTypeLookup.T_TYPE_LOOKUP).on(TTypeLookup.T_TYPE_LOOKUP.VALUE.equal(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG), TTypeLookup.T_TYPE_LOOKUP.LOOKUP_TYPE.eq(DbConstants.RESPONSE_PHYS))
                    // .leftOuterJoin(TPhysMaster.T_PHYS_MASTER).on(TPhysMaster.T_PHYS_MASTER.NPI.equal(TPhysPredictions.T_PHYS_PREDICTIONS.NPI), TPhysMaster.T_PHYS_MASTER.NPI.isNotNull(),TPhysMaster.T_PHYS_MASTER.NPI.ne(""))
                    .where(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(hospitalId))
                    .and(TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID.equal(accountId))
                    .and(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.equal(DbConstants.YES_VALUE))
                    .and(TPhysPredictions.T_PHYS_PREDICTIONS.METHOD.notEqual(DbConstants.METHOD_MANUAL))
                    .groupBy(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_KEY)
                    .orderBy(TPhysPredictions.T_PHYS_PREDICTIONS.EV_SCORE.desc())
                    .fetch();

            if (result != null) {
                resultOut = result.into(MissingSavedPhyChargePredictionResult.class);
            }
        } else {
            Result<Record> result = create.selectDistinct(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_KEY, TPhysPredictions.T_PHYS_PREDICTIONS.SOURCE, TPhysPredictions.T_PHYS_PREDICTIONS.GUARANTOR_ID, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITING_TIME, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID, TPhysPredictions.T_PHYS_PREDICTIONS.DCHG_CODE, TPhysPredictions.T_PHYS_PREDICTIONS.HCPC_CODE, THcpcCodes.T_HCPC_CODES.DESCRIPTION.as("chargeDescription"),
                    TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING.DESCRIPTION, TPhysPredictions.T_PHYS_PREDICTIONS.INT_AUDITOR_QTY, TPhysPredictions.T_PHYS_PREDICTIONS.CHARGE_NUMBER, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_COMMENTS, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG,
                    TPhysPredictions.T_PHYS_PREDICTIONS.CLAIM_NUMBER, TPhysPredictions.T_PHYS_PREDICTIONS.POS, TPhysPredictions.T_PHYS_PREDICTIONS.MODIFIER, TPhysPredictions.T_PHYS_PREDICTIONS.DIAG, TPhysPredictions.T_PHYS_PREDICTIONS.PRIMARY_DIAG, TPhysPredictions.T_PHYS_PREDICTIONS.NPI,
                    TPhysPredictions.T_PHYS_PREDICTIONS.DEPT_PHYS, TPhysPredictions.T_PHYS_PREDICTIONS.BILL_PHYS, TPhysPredictions.T_PHYS_PREDICTIONS.PRED_CODE, TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER, TPhysPredictions.T_PHYS_PREDICTIONS.DATE_OF_SERVICE, TPhysPredictions.T_PHYS_PREDICTIONS.VAL.as("price"), TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_QTY, TTypeLookup.T_TYPE_LOOKUP.DESCRIPTION.as("response"))
                    .from(TPhysPredictions.T_PHYS_PREDICTIONS)
                    .leftOuterJoin(THcpcCodes.T_HCPC_CODES).on(TPhysPredictions.T_PHYS_PREDICTIONS.HCPC_CODE.equal(THcpcCodes.T_HCPC_CODES.CODE_VALUE))
                    .leftOuterJoin(TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING).on(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_CODE.equal(TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING.RULE))
                    .leftOuterJoin(TTypeLookup.T_TYPE_LOOKUP).on(TTypeLookup.T_TYPE_LOOKUP.VALUE.equal(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG), TTypeLookup.T_TYPE_LOOKUP.LOOKUP_TYPE.eq(DbConstants.RESPONSE_PHYS))
                    //.leftOuterJoin(TPhysMaster.T_PHYS_MASTER).on(TPhysMaster.T_PHYS_MASTER.NPI.equal(TPhysPredictions.T_PHYS_PREDICTIONS.NPI), TPhysMaster.T_PHYS_MASTER.NPI.isNotNull(),TPhysMaster.T_PHYS_MASTER.NPI.ne(""))
                    .where(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(hospitalId))
                    .and(TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID.equal(accountId))
                    .and(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.equal(DbConstants.YES_VALUE))
                    .and(TPhysPredictions.T_PHYS_PREDICTIONS.FOUND.equal(DbConstants.FOUND))
                    .and(TPhysPredictions.T_PHYS_PREDICTIONS.METHOD.notEqual(DbConstants.METHOD_MANUAL))
                    .groupBy(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_KEY)
                    .orderBy(TPhysPredictions.T_PHYS_PREDICTIONS.EV_SCORE.desc())
                    .fetch();

            if (result != null) {
                resultOut = result.into(MissingSavedPhyChargePredictionResult.class);
            }
        }
        return resultOut;
    }

    public List<HcpcResult> getPhyHcpc(String ruleId, String hospitalId) {

        return create.selectDistinct(TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING.PHY_HCPC_CODE, TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.DESCRIPTION, TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.PRICE)
                .from(TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING)
                .leftOuterJoin(TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP).on(TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.HOSPITAL_ID.eq(hospitalId), TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING.PHY_HCPC_CODE.eq(TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.HCPC), TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.MODIFIER.isNull().or(TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.MODIFIER.eq(DbConstants.BLANK)))
                .where(TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING.RULE.eq(ruleId), TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING.IS_DROP_DOWN.isTrue())
                .groupBy(TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING.PHY_HCPC_CODE)
                .limit(500).fetchInto(HcpcResult.class);
    }

    public List<String> getPhyCostCenter() {
        return create.selectDistinct(TPhysHospitalMapping.T_PHYS_HOSPITAL_MAPPING.COST_CENTER)
                .from(TPhysHospitalMapping.T_PHYS_HOSPITAL_MAPPING).orderBy(1).fetch("COST_CENTER", String.class);
    }

}
