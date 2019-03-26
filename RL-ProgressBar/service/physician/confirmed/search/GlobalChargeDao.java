/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.operasolutions.rl.service.physician.confirmed.search;

import com.google.inject.Inject;
import com.operasolutions.rl.common.DbConstants;
import com.operasolutions.rl.common.LookupTypes;
import com.operasolutions.rl.common.NumberConstants;
import com.operasolutions.rl.schema.tables.TCostcenterRuleMapping;
import com.operasolutions.rl.schema.tables.THcpcCodes;
import com.operasolutions.rl.schema.tables.THospital;
import com.operasolutions.rl.schema.tables.TInsurance;
import com.operasolutions.rl.schema.tables.TPatient;
import com.operasolutions.rl.schema.tables.TPhysCharges;
import com.operasolutions.rl.schema.tables.TPhysMaster;
import com.operasolutions.rl.schema.tables.TPhysPatientAll;
import com.operasolutions.rl.schema.tables.TPhysPredictions;
import com.operasolutions.rl.schema.tables.TTypeLookup;
import com.operasolutions.rl.service.physician.confirmed.search.GlobalChargeResource.AccountDetailRepresentation;
import com.operasolutions.rl.service.physician.confirmed.search.GlobalChargeResource.ExistingChargeResult;
import com.operasolutions.rl.service.physician.confirmed.search.GlobalChargeResource.MissingSavedPhyChargePredictionResult;
import java.util.ArrayList;
import java.util.List;
import org.jooq.FactoryOperations;
import org.jooq.Record;
import org.jooq.Result;
import org.jooq.impl.Factory;

/**
 *
 * @author nirmal.kumar
 */
public class GlobalChargeDao {

    private final FactoryOperations create;

    @Inject
    public GlobalChargeDao(FactoryOperations jooqFactory) {
        this.create = jooqFactory;
    }

    public AccountDetailRepresentation getAccountDetail(String hospitalId, String accountId) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalId' cannot be null.");
        }
        if (accountId == null) {
            throw new IllegalArgumentException("Input parameter 'accountId' cannot be null.");
        }
        return create.select(THospital.T_HOSPITAL.SHORT_NAME, THospital.T_HOSPITAL.HOSPITAL_NAME, TPatient.T_PATIENT.ACCOUNT_ID, TPatient.T_PATIENT.HOSPITAL_ID, TPatient.T_PATIENT.AGE, TPatient.T_PATIENT.ADMIT_DATE,
                TPatient.T_PATIENT.DISCHARGE_DATE, TPatient.T_PATIENT.DOB, TPatient.T_PATIENT.FINANCIAL_CLASS, TPatient.T_PATIENT.TRANSFER_DATE, TPatient.T_PATIENT.PATIENT_TYPE,
                TPatient.T_PATIENT.PATIENT_SUBTYPE, TPatient.T_PATIENT.PATIENT_ID, TInsurance.T_INSURANCE.PAYER_DESC, TInsurance.T_INSURANCE.PAYER_CODE,
                Factory.decode().when(TTypeLookup.T_TYPE_LOOKUP.as("typeLookup").DESCRIPTION.isNotNull(), TPatient.T_PATIENT.PATIENT_TYPE.concat("-").concat(TTypeLookup.T_TYPE_LOOKUP.as("typeLookup").DESCRIPTION)).otherwise(TPatient.T_PATIENT.PATIENT_TYPE).as("patTypeWithDescription"),
                Factory.decode().when(TTypeLookup.T_TYPE_LOOKUP.as("subTypeLookup").DESCRIPTION.isNotNull(), TPatient.T_PATIENT.PATIENT_SUBTYPE.concat("-").concat(TTypeLookup.T_TYPE_LOOKUP.as("subTypeLookup").DESCRIPTION)).otherwise(TPatient.T_PATIENT.PATIENT_SUBTYPE).as("patSubTypeWithDescription"),
                TTypeLookup.T_TYPE_LOOKUP.as("genderLookup").DESCRIPTION.as("genderDescription"))
                .from(TPatient.T_PATIENT)
                .join(THospital.T_HOSPITAL).on(THospital.T_HOSPITAL.HOSPITAL_ID.eq(TPatient.T_PATIENT.HOSPITAL_ID))
                .leftOuterJoin(TInsurance.T_INSURANCE).on(TPatient.T_PATIENT.HOSPITAL_ID.eq(TInsurance.T_INSURANCE.HOSPITAL_ID), TPatient.T_PATIENT.ACCOUNT_ID.eq(TInsurance.T_INSURANCE.ACCOUNT_ID), TInsurance.T_INSURANCE.PAYER_PRIORITY.eq(1))
                .leftOuterJoin(TTypeLookup.T_TYPE_LOOKUP.as("typeLookup")).on(TTypeLookup.T_TYPE_LOOKUP.as("typeLookup").LOOKUP_TYPE.equal(LookupTypes.TYPE_PATTYPE), TTypeLookup.T_TYPE_LOOKUP.as("typeLookup").VALUE.equal(TPatient.T_PATIENT.PATIENT_TYPE))
                .leftOuterJoin(TTypeLookup.T_TYPE_LOOKUP.as("subTypeLookup")).on(TTypeLookup.T_TYPE_LOOKUP.as("subTypeLookup").LOOKUP_TYPE.equal(LookupTypes.TYPE_PATSUBTYPE), TTypeLookup.T_TYPE_LOOKUP.as("subTypeLookup").VALUE.equal(TPatient.T_PATIENT.PATIENT_SUBTYPE))
                .leftOuterJoin(TTypeLookup.T_TYPE_LOOKUP.as("genderLookup")).on(TTypeLookup.T_TYPE_LOOKUP.as("genderLookup").LOOKUP_TYPE.equal(LookupTypes.TYPE_GENDER), TTypeLookup.T_TYPE_LOOKUP.as("genderLookup").VALUE.equal(TPatient.T_PATIENT.SEX))
                .where(TPatient.T_PATIENT.HOSPITAL_ID.eq(hospitalId).and(TPatient.T_PATIENT.ACCOUNT_ID.eq(accountId)))
                .fetchOne().into(AccountDetailRepresentation.class);
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
    public List<MissingSavedPhyChargePredictionResult> getSubmittedExistingPhysicianCharges(String hospitalId, String accountId) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalId' cannot be null.");
        }
        if (accountId == null) {
            throw new IllegalArgumentException("Input parameter 'accountId' cannot be null.");
        }

        List<MissingSavedPhyChargePredictionResult> resultOut = new ArrayList<MissingSavedPhyChargePredictionResult>();

        Result<Record> result = create.selectDistinct(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_KEY, TPhysPredictions.T_PHYS_PREDICTIONS.GUARANTOR_ID, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITING_TIME, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG, TPhysPredictions.T_PHYS_PREDICTIONS.DCHG_CODE, TPhysPredictions.T_PHYS_PREDICTIONS.HCPC_CODE, THcpcCodes.T_HCPC_CODES.DESCRIPTION.as("chargeDescription"),
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
    public List<MissingSavedPhyChargePredictionResult> getSubmittedOtherDiscoveredCharges(String hospitalId, String accountId) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalId' cannot be null.");
        }
        if (accountId == null) {
            throw new IllegalArgumentException("Input parameter 'accountId' cannot be null.");
        }
        List<MissingSavedPhyChargePredictionResult> resultOut = new ArrayList<MissingSavedPhyChargePredictionResult>();

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
    public List<MissingSavedPhyChargePredictionResult> getPossiblyMissingCharges(String hospitalId, String accountId) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalId' cannot be null.");
        }
        if (accountId == null) {
            throw new IllegalArgumentException("Input parameter 'accountId' cannot be null.");
        }

        List<MissingSavedPhyChargePredictionResult> resultOut = new ArrayList<MissingSavedPhyChargePredictionResult>();

        Result<Record> result = create.selectDistinct(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_KEY, TPhysPredictions.T_PHYS_PREDICTIONS.SOURCE, TPhysPredictions.T_PHYS_PREDICTIONS.GUARANTOR_ID, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITING_TIME, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID, TPhysPredictions.T_PHYS_PREDICTIONS.DCHG_CODE, TPhysPredictions.T_PHYS_PREDICTIONS.HCPC_CODE, THcpcCodes.T_HCPC_CODES.DESCRIPTION.as("chargeDescription"),
                TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING.DESCRIPTION, TPhysPredictions.T_PHYS_PREDICTIONS.INT_AUDITOR_QTY, TPhysPredictions.T_PHYS_PREDICTIONS.CHARGE_NUMBER, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_COMMENTS, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG,
                TPhysPredictions.T_PHYS_PREDICTIONS.CLAIM_NUMBER, TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG, TPhysPredictions.T_PHYS_PREDICTIONS.POS, TPhysPredictions.T_PHYS_PREDICTIONS.MODIFIER, TPhysPredictions.T_PHYS_PREDICTIONS.DIAG, TPhysPredictions.T_PHYS_PREDICTIONS.PRIMARY_DIAG, TPhysPredictions.T_PHYS_PREDICTIONS.NPI,
                TPhysPredictions.T_PHYS_PREDICTIONS.DEPT_PHYS, TPhysPredictions.T_PHYS_PREDICTIONS.BILL_PHYS, TPhysPredictions.T_PHYS_PREDICTIONS.PRED_CODE, TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER, TPhysPredictions.T_PHYS_PREDICTIONS.DATE_OF_SERVICE, TPhysPredictions.T_PHYS_PREDICTIONS.VAL.as("price"), TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_QTY, TTypeLookup.T_TYPE_LOOKUP.DESCRIPTION.as("response"))
                .from(TPhysPredictions.T_PHYS_PREDICTIONS)
                .leftOuterJoin(THcpcCodes.T_HCPC_CODES).on(TPhysPredictions.T_PHYS_PREDICTIONS.HCPC_CODE.equal(THcpcCodes.T_HCPC_CODES.CODE_VALUE))
                .leftOuterJoin(TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING).on(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_CODE.equal(TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING.RULE))
                .leftOuterJoin(TTypeLookup.T_TYPE_LOOKUP).on(TTypeLookup.T_TYPE_LOOKUP.VALUE.equal(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG), TTypeLookup.T_TYPE_LOOKUP.LOOKUP_TYPE.eq(DbConstants.RESPONSE_PHYS))
                // .leftOuterJoin(TPhysMaster.T_PHYS_MASTER).on(TPhysMaster.T_PHYS_MASTER.NPI.equal(TPhysPredictions.T_PHYS_PREDICTIONS.NPI), TPhysMaster.T_PHYS_MASTER.NPI.isNotNull(),TPhysMaster.T_PHYS_MASTER.NPI.ne(""))
                .where(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(hospitalId))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID.equal(accountId))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.METHOD.notEqual(DbConstants.METHOD_MANUAL))
                .groupBy(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_KEY)
                .orderBy(TPhysPredictions.T_PHYS_PREDICTIONS.EV_SCORE.desc())
                .fetch();

        if (result != null) {
            resultOut = result.into(MissingSavedPhyChargePredictionResult.class);
        }

        return resultOut;
    }

}
