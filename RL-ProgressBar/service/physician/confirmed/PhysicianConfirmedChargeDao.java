package com.operasolutions.rl.service.physician.confirmed;

import java.sql.Timestamp;
import java.util.List;

import org.jooq.FactoryOperations;
import org.jooq.SelectLimitStep;
import org.jooq.SelectQuery;
import org.jooq.impl.Factory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.google.inject.Inject;
import static com.operasolutions.rl.common.ActivityLogUtils.PHYS_AGREE;
import com.operasolutions.rl.common.DbConstants;
import com.operasolutions.rl.common.LookupTypes;
import com.operasolutions.rl.schema.tables.TCostcenterRuleMapping;
import com.operasolutions.rl.schema.tables.THospital;
import com.operasolutions.rl.schema.tables.TInsurance;
import com.operasolutions.rl.schema.tables.TPatient;
import com.operasolutions.rl.schema.tables.TPhysAcctDetails;
import com.operasolutions.rl.schema.tables.TPhysMaster;
import com.operasolutions.rl.schema.tables.TPhysPredictions;
import com.operasolutions.rl.schema.tables.TTypeLookup;
import com.operasolutions.rl.service.physician.confirmed.PhysicianConfirmedChargeResource.ConfirmChargesResult;
import com.operasolutions.rl.service.physician.confirmed.PhysicianConfirmedChargeResource.ConfirmChargesResultForExcel;
import java.util.ArrayList;

/**
 * ConfirmChargeAccountDao
 *
 * @author Nirmal Kumar
 */
public class PhysicianConfirmedChargeDao {

    private final FactoryOperations create;
    protected static final Logger log = LoggerFactory.getLogger(PhysicianConfirmedChargeDao.class);

    @Inject
    public PhysicianConfirmedChargeDao(FactoryOperations jooqFactory) {
        this.create = jooqFactory;
    }

    /**
     * Gets confirmed charges for pre-bill
     *
     * @param hospitalList
     * @param startDate
     * @param endDate
     * @param rejectedCharges
     * @param isAuditor
     * @param currentUser
     * @param auditorList
     * @return List<ConfirmChargesResult>
     */
    public List<ConfirmChargesResult> getConfirmCharges(List<String> hospitalList, Timestamp startDate, Timestamp endDate, String rejectedCharges, boolean isAuditor, String currentUser,
            List<String> auditorList) {
        if (hospitalList == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalList' cannot be null");
        }
        if (startDate == null) {
            throw new IllegalArgumentException("Input parameter 'startDate' cannot be null");
        }
        if (endDate == null) {
            throw new IllegalArgumentException("Input parameter 'endDate' cannot be null");
        }
        if (currentUser == null) {
            throw new IllegalArgumentException("Input parameter 'currentUser' cannot be null");
        }
        SelectLimitStep qry = null;
        com.operasolutions.rl.schema.tables.TTypeLookup auditorResponseLookup = TTypeLookup.T_TYPE_LOOKUP.as("auditorResponseLookup");
        com.operasolutions.rl.schema.tables.TTypeLookup patTypeDescLookup = TTypeLookup.T_TYPE_LOOKUP.as("patTypeDescLookup");
        qry = create.selectDistinct(TPatient.T_PATIENT.AGE, TPatient.T_PATIENT.PATIENT_ID, TPatient.T_PATIENT.SEX, TPatient.T_PATIENT.ADMIT_DATE, TPatient.T_PATIENT.DISCHARGE_DATE, TPatient.T_PATIENT.TRANSFER_DATE, TPatient.T_PATIENT.PATIENT_TYPE,
                TPatient.T_PATIENT.NAME, TPatient.T_PATIENT.SERVICE_LOCATION, TPatient.T_PATIENT.DOB,
                THospital.T_HOSPITAL.HOSPITAL_NAME, THospital.T_HOSPITAL.SHORT_NAME,
                TInsurance.T_INSURANCE.PAYER_DESC, TInsurance.T_INSURANCE.PAYER_CODE, patTypeDescLookup.DESCRIPTION.as("patTypeDescription"),
                TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID, TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID, TPhysPredictions.T_PHYS_PREDICTIONS.HCPC_CODE, TPhysPredictions.T_PHYS_PREDICTIONS.SOURCE, TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER, TPhysPredictions.T_PHYS_PREDICTIONS.GUARANTOR_ID,
                TPhysPredictions.T_PHYS_PREDICTIONS.DCHG_CODE, TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING.DESCRIPTION, auditorResponseLookup.DESCRIPTION.as("desc"),
                Factory.nvl(TPhysPredictions.T_PHYS_PREDICTIONS.VAL, 0).as("price"), TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_QTY,
                TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_COMMENTS, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITING_TIME, TPhysPredictions.T_PHYS_PREDICTIONS.FOUND,
                TPatient.T_PATIENT.PATIENT_SUBTYPE, TTypeLookup.T_TYPE_LOOKUP.as("subTypeLookup").DESCRIPTION.as("patSubTypeDescription"),
                TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID.as("auditorId"),
                TPhysPredictions.T_PHYS_PREDICTIONS.EXT_AUDITOR_FLAG, TPhysPredictions.T_PHYS_PREDICTIONS.EXT_AUDITOR_COMMENTS, TPhysPredictions.T_PHYS_PREDICTIONS.CHARGE_NUMBER)
                .from(TPhysPredictions.T_PHYS_PREDICTIONS)
                .join(THospital.T_HOSPITAL).on(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(THospital.T_HOSPITAL.HOSPITAL_ID))
                .join(TPatient.T_PATIENT).on(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(TPatient.T_PATIENT.HOSPITAL_ID), TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID.equal(TPatient.T_PATIENT.ACCOUNT_ID))
                .join(TInsurance.T_INSURANCE).on(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(TInsurance.T_INSURANCE.HOSPITAL_ID), TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID.equal(TInsurance.T_INSURANCE.ACCOUNT_ID))
                .leftOuterJoin(TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING).on(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_CODE.equal(TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING.RULE))
                .leftOuterJoin(auditorResponseLookup).on(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.equal(auditorResponseLookup.VALUE), auditorResponseLookup.LOOKUP_TYPE.equal(DbConstants.RESPONSE_PHYS))
                .leftOuterJoin(patTypeDescLookup).on(TPatient.T_PATIENT.PATIENT_TYPE.equal(patTypeDescLookup.VALUE), patTypeDescLookup.LOOKUP_TYPE.equal(DbConstants.PATIENT_TYPE))
                .leftOuterJoin(TTypeLookup.T_TYPE_LOOKUP.as("subTypeLookup")).on(TTypeLookup.T_TYPE_LOOKUP.as("subTypeLookup").LOOKUP_TYPE.equal(LookupTypes.TYPE_PATSUBTYPE), TTypeLookup.T_TYPE_LOOKUP.as("subTypeLookup").VALUE.equal(TPatient.T_PATIENT.PATIENT_SUBTYPE))
                .where(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITING_TIME.between(startDate, endDate))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.in(hospitalList))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.equal(DbConstants.YES_VALUE))
                .and(TInsurance.T_INSURANCE.PAYER_PRIORITY.equal(1));
        SelectQuery filterQry = qry.getQuery();
        if (rejectedCharges != null && rejectedCharges.equals("Y")) {
            filterQry.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.isNotNull().or(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_QTY.lessThan(0)));
        } else {
            filterQry.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.in(PHYS_AGREE).and(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_QTY.greaterThan(0)));
        }
        if (isAuditor) {
            filterQry.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID.eq(currentUser));
        } else if (!auditorList.isEmpty()) {
            filterQry.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID.in(auditorList));
        }
        filterQry.addOrderBy(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID, TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID);
        return filterQry.fetchInto(ConfirmChargesResult.class);
    }

    /**
     * Gets confirmed charges for pre-bill
     *
     * @param hospitalList
     * @param startDate
     * @param endDate
     * @param rejectedCharges
     * @param isAuditor
     * @param currentUser
     * @return List<ConfirmChargesResult>
     */
    public List<ConfirmChargesResultForExcel> getConfirmChargesForExcel(List<String> hospitalList, Timestamp startDate, Timestamp endDate, String rejectedCharges, boolean isAuditor, String currentUser, List<String> auditorList) {
        if (hospitalList == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalList' cannot be null");
        }
        if (startDate == null) {
            throw new IllegalArgumentException("Input parameter 'startDate' cannot be null");
        }
        if (endDate == null) {
            throw new IllegalArgumentException("Input parameter 'endDate' cannot be null");
        }
        if (currentUser == null) {
            throw new IllegalArgumentException("Input parameter 'currentUser' cannot be null");
        }
        log.debug("isAuditor :: " + isAuditor + " , rejectedCharges :: " + rejectedCharges);

        SelectLimitStep qry = null;

        com.operasolutions.rl.schema.tables.TTypeLookup auditorResponseLookup = TTypeLookup.T_TYPE_LOOKUP.as("auditorResponseLookup");
        com.operasolutions.rl.schema.tables.TTypeLookup patTypeDescLookup = TTypeLookup.T_TYPE_LOOKUP.as("patTypeDescLookup");
        qry = create.selectDistinct(TPatient.T_PATIENT.AGE, TPatient.T_PATIENT.PATIENT_ID, TPatient.T_PATIENT.SEX, TPatient.T_PATIENT.ADMIT_DATE, TPatient.T_PATIENT.DISCHARGE_DATE, TPatient.T_PATIENT.TRANSFER_DATE, TPatient.T_PATIENT.PATIENT_TYPE,
                TPatient.T_PATIENT.NAME, TPatient.T_PATIENT.SERVICE_LOCATION, TPatient.T_PATIENT.DOB,
                THospital.T_HOSPITAL.HOSPITAL_NAME, THospital.T_HOSPITAL.SHORT_NAME, TPhysPredictions.T_PHYS_PREDICTIONS.CHARGE_NUMBER,
                TPhysPredictions.T_PHYS_PREDICTIONS.PRED_CODE, TPhysPredictions.T_PHYS_PREDICTIONS.DATE_OF_SERVICE, TPhysPredictions.T_PHYS_PREDICTIONS.METHOD, TPhysPredictions.T_PHYS_PREDICTIONS.PRED_NBR,
                TInsurance.T_INSURANCE.PAYER_DESC, TInsurance.T_INSURANCE.PAYER_CODE, patTypeDescLookup.DESCRIPTION.as("patTypeDescription"),
                TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID, TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID, TPhysPredictions.T_PHYS_PREDICTIONS.HCPC_CODE, TPhysPredictions.T_PHYS_PREDICTIONS.SOURCE, TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER, TPhysPredictions.T_PHYS_PREDICTIONS.GUARANTOR_ID,
                TPhysPredictions.T_PHYS_PREDICTIONS.DCHG_CODE, TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING.DESCRIPTION, auditorResponseLookup.DESCRIPTION.as("desc"),
                Factory.nvl(TPhysPredictions.T_PHYS_PREDICTIONS.VAL, 0).as("price"), TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_QTY,
                TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_COMMENTS, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITING_TIME, TPhysPredictions.T_PHYS_PREDICTIONS.FOUND,
                TPhysPredictions.T_PHYS_PREDICTIONS.EXT_AUDITOR_FLAG, TPhysPredictions.T_PHYS_PREDICTIONS.EXT_AUDITOR_COMMENTS,
                TPatient.T_PATIENT.PATIENT_SUBTYPE, TTypeLookup.T_TYPE_LOOKUP.as("subTypeLookup").DESCRIPTION.as("patSubTypeDescription"),
                TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID.as("auditorId"), TPhysPredictions.T_PHYS_PREDICTIONS.PRED_DATE.as("predictionDate"),
                TPhysPredictions.T_PHYS_PREDICTIONS.PRED_KEY.as("predKey"), TPatient.T_PATIENT.FINANCIAL_CLASS,
                TPhysAcctDetails.T_PHYS_ACCT_DETAILS.ADMIT_PHYS_CODE, TPhysAcctDetails.T_PHYS_ACCT_DETAILS.ER_PHYS_CODE,
                TPhysAcctDetails.T_PHYS_ACCT_DETAILS.ADMIT_PHYS, TPhysAcctDetails.T_PHYS_ACCT_DETAILS.ER_PHYS,
                //TPhysMaster.T_PHYS_MASTER.as("admitPhys").NAME.as("admitPhysName"), TPhysMaster.T_PHYS_MASTER.as("erPhys").NAME.as("erPhysName"),
                TPhysMaster.T_PHYS_MASTER.as("admitPhys").NPI.as("admitPhysNpi"), TPhysMaster.T_PHYS_MASTER.as("erPhys").NPI.as("erPhysNpi"))
                .from(TPhysPredictions.T_PHYS_PREDICTIONS)
                .join(THospital.T_HOSPITAL).on(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(THospital.T_HOSPITAL.HOSPITAL_ID))
                .join(TPatient.T_PATIENT).on(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(TPatient.T_PATIENT.HOSPITAL_ID), TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID.equal(TPatient.T_PATIENT.ACCOUNT_ID))
                .join(TInsurance.T_INSURANCE).on(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(TInsurance.T_INSURANCE.HOSPITAL_ID), TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID.equal(TInsurance.T_INSURANCE.ACCOUNT_ID))
                .leftOuterJoin(TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING).on(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_CODE.equal(TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING.RULE))
                .leftOuterJoin(auditorResponseLookup).on(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.equal(auditorResponseLookup.VALUE), auditorResponseLookup.LOOKUP_TYPE.equal(DbConstants.RESPONSE_PHYS))
                .leftOuterJoin(patTypeDescLookup).on(TPatient.T_PATIENT.PATIENT_TYPE.equal(patTypeDescLookup.VALUE), patTypeDescLookup.LOOKUP_TYPE.equal(DbConstants.PATIENT_TYPE))
                .leftOuterJoin(TTypeLookup.T_TYPE_LOOKUP.as("subTypeLookup")).on(TTypeLookup.T_TYPE_LOOKUP.as("subTypeLookup").LOOKUP_TYPE.equal(LookupTypes.TYPE_PATSUBTYPE), TTypeLookup.T_TYPE_LOOKUP.as("subTypeLookup").VALUE.equal(TPatient.T_PATIENT.PATIENT_SUBTYPE))
                .leftOuterJoin(TPhysAcctDetails.T_PHYS_ACCT_DETAILS).on(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(TPhysAcctDetails.T_PHYS_ACCT_DETAILS.HOSPITAL_ID), TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID.equal(TPhysAcctDetails.T_PHYS_ACCT_DETAILS.ACCOUNT_ID))
                .leftOuterJoin(TPhysMaster.T_PHYS_MASTER.as("admitPhys")).on(TPhysAcctDetails.T_PHYS_ACCT_DETAILS.ADMIT_PHYS_CODE.equal(TPhysMaster.T_PHYS_MASTER.as("admitPhys").CODE))
                .leftOuterJoin(TPhysMaster.T_PHYS_MASTER.as("erPhys")).on(TPhysAcctDetails.T_PHYS_ACCT_DETAILS.ER_PHYS_CODE.equal(TPhysMaster.T_PHYS_MASTER.as("erPhys").CODE))
                .where(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITING_TIME.between(startDate, endDate))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.in(hospitalList))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.equal(DbConstants.YES_VALUE))
                .and(TInsurance.T_INSURANCE.PAYER_PRIORITY.equal(1));

        SelectQuery filterQry = qry.getQuery();
        if (rejectedCharges != null && rejectedCharges.equals("Y")) {
            filterQry.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.isNotNull().or(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_QTY.lessThan(0)));
        } else {
            filterQry.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.in(PHYS_AGREE).and(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_QTY.greaterThan(0)));
        }
        if (isAuditor) {
            filterQry.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID.eq(currentUser));
        } else if (!auditorList.isEmpty()) {
            filterQry.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID.in(auditorList));
        }
        filterQry.addOrderBy(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID, TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID);
        return filterQry.fetchInto(ConfirmChargesResultForExcel.class);
    }

    public List<ConfirmChargesResult> getConfirmChargesSearch(String accountId, boolean isAuditor, String currentUser) {
        if (accountId == null) {
            throw new IllegalArgumentException("Input parameter 'accountId' cannot be null");
        }
        if (currentUser == null) {
            throw new IllegalArgumentException("Input parameter 'currentUser' cannot be null");
        }
        List<ConfirmChargesResult> chargesResults = new ArrayList<ConfirmChargesResult>();

        com.operasolutions.rl.schema.tables.TTypeLookup auditorResponseLookup = TTypeLookup.T_TYPE_LOOKUP.as("auditorResponseLookup");
        com.operasolutions.rl.schema.tables.TTypeLookup patTypeDescLookup = TTypeLookup.T_TYPE_LOOKUP.as("patTypeDescLookup");
        if (isAuditor) {
            List<ConfirmChargesResult> preList = create.selectDistinct(TPatient.T_PATIENT.AGE, TPatient.T_PATIENT.PATIENT_ID, TPatient.T_PATIENT.SEX, TPatient.T_PATIENT.ADMIT_DATE, TPatient.T_PATIENT.DISCHARGE_DATE, TPatient.T_PATIENT.TRANSFER_DATE, TPatient.T_PATIENT.PATIENT_TYPE,
                    TPatient.T_PATIENT.NAME, TPatient.T_PATIENT.SERVICE_LOCATION, TPatient.T_PATIENT.DOB,
                    THospital.T_HOSPITAL.HOSPITAL_NAME, THospital.T_HOSPITAL.SHORT_NAME,
                    TInsurance.T_INSURANCE.PAYER_DESC, TInsurance.T_INSURANCE.PAYER_CODE, patTypeDescLookup.DESCRIPTION.as("patTypeDescription"),
                    TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID, TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID, TPhysPredictions.T_PHYS_PREDICTIONS.HCPC_CODE, TPhysPredictions.T_PHYS_PREDICTIONS.SOURCE, TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER, TPhysPredictions.T_PHYS_PREDICTIONS.GUARANTOR_ID,
                    TPhysPredictions.T_PHYS_PREDICTIONS.DCHG_CODE, TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING.DESCRIPTION, auditorResponseLookup.DESCRIPTION.as("desc"),
                    Factory.nvl(TPhysPredictions.T_PHYS_PREDICTIONS.VAL, 0).as("price"), TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_QTY,
                    TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_COMMENTS, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITING_TIME, TPhysPredictions.T_PHYS_PREDICTIONS.FOUND,
                    TPatient.T_PATIENT.PATIENT_SUBTYPE, TTypeLookup.T_TYPE_LOOKUP.as("subTypeLookup").DESCRIPTION.as("patSubTypeDescription"),
                    TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID.as("auditorId"), TPhysPredictions.T_PHYS_PREDICTIONS.CHARGE_NUMBER,
                    TPhysPredictions.T_PHYS_PREDICTIONS.EXT_AUDITOR_FLAG, Factory.inline("PRE-BILL").as("billType"), TPhysPredictions.T_PHYS_PREDICTIONS.EXT_AUDITOR_COMMENTS)
                    .from(TPhysPredictions.T_PHYS_PREDICTIONS)
                    .join(THospital.T_HOSPITAL).on(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(THospital.T_HOSPITAL.HOSPITAL_ID))
                    .join(TPatient.T_PATIENT).on(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(TPatient.T_PATIENT.HOSPITAL_ID), TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID.equal(TPatient.T_PATIENT.ACCOUNT_ID))
                    .join(TInsurance.T_INSURANCE).on(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(TInsurance.T_INSURANCE.HOSPITAL_ID), TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID.equal(TInsurance.T_INSURANCE.ACCOUNT_ID))
                    .leftOuterJoin(TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING).on(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_CODE.equal(TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING.RULE))
                    .leftOuterJoin(auditorResponseLookup).on(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.equal(auditorResponseLookup.VALUE), auditorResponseLookup.LOOKUP_TYPE.equal(DbConstants.RESPONSE_PHYS))
                    .leftOuterJoin(patTypeDescLookup).on(TPatient.T_PATIENT.PATIENT_TYPE.equal(patTypeDescLookup.VALUE), patTypeDescLookup.LOOKUP_TYPE.equal(DbConstants.PATIENT_TYPE))
                    .leftOuterJoin(TTypeLookup.T_TYPE_LOOKUP.as("subTypeLookup")).on(TTypeLookup.T_TYPE_LOOKUP.as("subTypeLookup").LOOKUP_TYPE.equal(LookupTypes.TYPE_PATSUBTYPE), TTypeLookup.T_TYPE_LOOKUP.as("subTypeLookup").VALUE.equal(TPatient.T_PATIENT.PATIENT_SUBTYPE))
                    .where(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.isNotNull())
                    .or(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_QTY.lessThan(0))
                    .and(TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID.eq(accountId))
                    .and(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID.equal(currentUser))
                    .and(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.equal(DbConstants.YES_VALUE))
                    .and(TInsurance.T_INSURANCE.PAYER_PRIORITY.equal(1))
                    .orderBy(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID, TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID)
                    .fetchInto(ConfirmChargesResult.class
                    );
            if (!preList.isEmpty()) {
                chargesResults.addAll(preList);
            }

        } else {
            List<ConfirmChargesResult> preList = create.selectDistinct(TPatient.T_PATIENT.AGE, TPatient.T_PATIENT.PATIENT_ID, TPatient.T_PATIENT.SEX, TPatient.T_PATIENT.ADMIT_DATE, TPatient.T_PATIENT.DISCHARGE_DATE, TPatient.T_PATIENT.TRANSFER_DATE, TPatient.T_PATIENT.PATIENT_TYPE,
                    TPatient.T_PATIENT.NAME, TPatient.T_PATIENT.SERVICE_LOCATION, TPatient.T_PATIENT.DOB,
                    THospital.T_HOSPITAL.HOSPITAL_NAME, THospital.T_HOSPITAL.SHORT_NAME,
                    TInsurance.T_INSURANCE.PAYER_DESC, TInsurance.T_INSURANCE.PAYER_CODE, patTypeDescLookup.DESCRIPTION.as("patTypeDescription"),
                    TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID, TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID, TPhysPredictions.T_PHYS_PREDICTIONS.HCPC_CODE, TPhysPredictions.T_PHYS_PREDICTIONS.SOURCE, TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER, TPhysPredictions.T_PHYS_PREDICTIONS.GUARANTOR_ID,
                    TPhysPredictions.T_PHYS_PREDICTIONS.DCHG_CODE, TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING.DESCRIPTION, auditorResponseLookup.DESCRIPTION.as("desc"),
                    Factory.nvl(TPhysPredictions.T_PHYS_PREDICTIONS.VAL, 0).as("price"), TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_QTY,
                    TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_COMMENTS, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITING_TIME, TPhysPredictions.T_PHYS_PREDICTIONS.FOUND,
                    TPatient.T_PATIENT.PATIENT_SUBTYPE, TTypeLookup.T_TYPE_LOOKUP.as("subTypeLookup").DESCRIPTION.as("patSubTypeDescription"),
                    TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID.as("auditorId"), TPhysPredictions.T_PHYS_PREDICTIONS.CHARGE_NUMBER,
                    TPhysPredictions.T_PHYS_PREDICTIONS.EXT_AUDITOR_FLAG, Factory.inline("PRE-BILL").as("billType"), TPhysPredictions.T_PHYS_PREDICTIONS.EXT_AUDITOR_COMMENTS)
                    .from(TPhysPredictions.T_PHYS_PREDICTIONS)
                    .join(THospital.T_HOSPITAL).on(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(THospital.T_HOSPITAL.HOSPITAL_ID))
                    .join(TPatient.T_PATIENT).on(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(TPatient.T_PATIENT.HOSPITAL_ID), TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID.equal(TPatient.T_PATIENT.ACCOUNT_ID))
                    .join(TInsurance.T_INSURANCE).on(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(TInsurance.T_INSURANCE.HOSPITAL_ID), TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID.equal(TInsurance.T_INSURANCE.ACCOUNT_ID))
                    .leftOuterJoin(TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING).on(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_CODE.equal(TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING.RULE))
                    .leftOuterJoin(auditorResponseLookup).on(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.equal(auditorResponseLookup.VALUE), auditorResponseLookup.LOOKUP_TYPE.equal(DbConstants.RESPONSE_PHYS))
                    .leftOuterJoin(patTypeDescLookup).on(TPatient.T_PATIENT.PATIENT_TYPE.equal(patTypeDescLookup.VALUE), patTypeDescLookup.LOOKUP_TYPE.equal(DbConstants.PATIENT_TYPE))
                    .leftOuterJoin(TTypeLookup.T_TYPE_LOOKUP.as("subTypeLookup")).on(TTypeLookup.T_TYPE_LOOKUP.as("subTypeLookup").LOOKUP_TYPE.equal(LookupTypes.TYPE_PATSUBTYPE), TTypeLookup.T_TYPE_LOOKUP.as("subTypeLookup").VALUE.equal(TPatient.T_PATIENT.PATIENT_SUBTYPE))
                    .where(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.isNotNull())
                    .or(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_QTY.lessThan(0))
                    .and(TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID.eq(accountId))
                    .and(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.equal(DbConstants.YES_VALUE))
                    .and(TInsurance.T_INSURANCE.PAYER_PRIORITY.equal(1))
                    .orderBy(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID, TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID)
                    .fetchInto(ConfirmChargesResult.class
                    );
            if (!preList.isEmpty()) {
                chargesResults.addAll(preList);
            }
        }
        return chargesResults;

    }
}
