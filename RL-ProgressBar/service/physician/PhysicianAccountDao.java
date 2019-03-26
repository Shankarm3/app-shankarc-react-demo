package com.operasolutions.rl.service.physician;

import static org.jooq.impl.Factory.min;

import java.util.List;

import org.jooq.FactoryOperations;
import org.jooq.Record;
import org.jooq.SelectQuery;

import com.google.inject.Inject;
import com.operasolutions.rl.common.ActivityLogUtils;
import com.operasolutions.rl.common.DbConstants;
import com.operasolutions.rl.common.LookupTypes;
import com.operasolutions.rl.schema.tables.TActivityLog;
import com.operasolutions.rl.schema.tables.TDailyFileLog;
import com.operasolutions.rl.schema.tables.TInsurance;
import com.operasolutions.rl.schema.tables.TPatMatchStats;
import com.operasolutions.rl.schema.tables.TPatient;
import com.operasolutions.rl.schema.tables.TPhysAccountDetails;
import com.operasolutions.rl.schema.tables.TPhysMaster;
import com.operasolutions.rl.schema.tables.TPhysPredictions;
import com.operasolutions.rl.schema.tables.TSavePhysPossMissingcode;
import com.operasolutions.rl.schema.tables.TTypeLookup;
import com.operasolutions.rl.schema.tables.records.TPatMatchStatsRecord;
import com.operasolutions.rl.service.physnpilookup.PhysicianLookupResource.TPhysMasterRepresentation;
import com.operasolutions.rl.service.physician.PhysicianAccountResource.PhysicianAccountResourceResult;
import java.sql.Timestamp;
import java.text.ParseException;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.jooq.impl.Factory;

/**
 * PhysicianAccountDao
 *
 * @author Nirmal Kumar
 */
public class PhysicianAccountDao {

    private final FactoryOperations create;

    protected ActivityLogUtils activityLogUtils;

    @Inject
    public PhysicianAccountDao(FactoryOperations jooqFactory, ActivityLogUtils activityLogUtils) {
        this.create = jooqFactory;
        this.activityLogUtils = activityLogUtils;
    }

    /**
     * Gets list of accounts for preBill
     *
     * @param hospitalId
     * @param userId
     * @param all
     * @param auditorList
     * @return Result<Record>
     */
    public List<PhysicianAccountResourceResult> getPhysicianAccounts(String hospitalId, String userId, Boolean all, List<String> auditorList) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalId' cannot be null.");
        }
        if (userId == null) {
            throw new IllegalArgumentException("Input parameter 'userId' cannot be null.");
        }
        if (all == null) {
            throw new IllegalArgumentException("Input parameter 'all' cannot be null.");
        }

        SelectQuery nested = create.selectQuery();
        nested.addSelect(min(TPhysPredictions.T_PHYS_PREDICTIONS.EV_SCORE).as("EV_SCORE"), TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID, TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID,
                Factory.groupConcatDistinct(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_CODE).orderBy(TPhysPredictions.T_PHYS_PREDICTIONS.EV_SCORE.asc()).as("predCode"),
                Factory.groupConcatDistinct(TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER).orderBy(TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER).as("costCenter"));
        nested.addFrom(TPhysPredictions.T_PHYS_PREDICTIONS);
        nested.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(hospitalId));
        nested.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.EV_SCORE.isNotNull());
        nested.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.FOUND.equal((byte) 0));
        nested.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.equal(DbConstants.YES_VALUE));
        nested.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.isNull());
        if (all == Boolean.FALSE) {
            nested.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID.equal(userId));
        }

        if (all == Boolean.TRUE && (auditorList != null && auditorList.size() > 0)) {
            nested.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID.in(auditorList));
        }
        nested.addGroupBy(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID, TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID);
        nested.addOrderBy(min(TPhysPredictions.T_PHYS_PREDICTIONS.EV_SCORE).asc());
        nested.asTable("nested");

        return create.select(nested.getField(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID).as("hospitalId"),
                nested.getField(TPhysPredictions.T_PHYS_PREDICTIONS.EV_SCORE).as("evScore"), nested.getField(Factory.groupConcatDistinct(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_CODE).orderBy(TPhysPredictions.T_PHYS_PREDICTIONS.EV_SCORE.asc()).as("predCode")),
                TPatient.T_PATIENT.ACCOUNT_ID, TPatient.T_PATIENT.NAME, nested.getField("costCenter").as("serviceLine"), TPatient.T_PATIENT.AGE, TPatient.T_PATIENT.SEX, TPatient.T_PATIENT.PATIENT_ID,
                TPatient.T_PATIENT.ADMIT_DATE, TPatient.T_PATIENT.DOB, TPatient.T_PATIENT.DISCHARGE_DATE, TPatient.T_PATIENT.TRANSFER_DATE, TPatient.T_PATIENT.PATIENT_TYPE,
                TInsurance.T_INSURANCE.PAYER_DESC, TInsurance.T_INSURANCE.PAYER_CODE,
                TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.ACCOUNT_ID.as("possMissingCode"),
                TTypeLookup.T_TYPE_LOOKUP.as("typeLookup").DESCRIPTION.as("patTypeDescription"),
                TPatient.T_PATIENT.PATIENT_SUBTYPE, TTypeLookup.T_TYPE_LOOKUP.as("subTypeLookup").DESCRIPTION.as("patSubTypeDescription"),
                TTypeLookup.T_TYPE_LOOKUP.as("genderLookup").DESCRIPTION.as("genderDescription")).from(nested)
                .join(TPatient.T_PATIENT).on(nested.getField(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID).equal(TPatient.T_PATIENT.HOSPITAL_ID), nested.getField(TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID).equal(TPatient.T_PATIENT.ACCOUNT_ID))
                .join(TInsurance.T_INSURANCE).on(nested.getField(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID).equal(TInsurance.T_INSURANCE.HOSPITAL_ID), nested.getField(TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID).equal(TInsurance.T_INSURANCE.ACCOUNT_ID))
                .leftOuterJoin(TTypeLookup.T_TYPE_LOOKUP.as("typeLookup")).on(TTypeLookup.T_TYPE_LOOKUP.as("typeLookup").LOOKUP_TYPE.equal(LookupTypes.TYPE_PATTYPE), TTypeLookup.T_TYPE_LOOKUP.as("typeLookup").VALUE.equal(TPatient.T_PATIENT.PATIENT_TYPE))
                .leftOuterJoin(TTypeLookup.T_TYPE_LOOKUP.as("subTypeLookup")).on(TTypeLookup.T_TYPE_LOOKUP.as("subTypeLookup").LOOKUP_TYPE.equal(LookupTypes.TYPE_PATSUBTYPE), TTypeLookup.T_TYPE_LOOKUP.as("subTypeLookup").VALUE.equal(TPatient.T_PATIENT.PATIENT_SUBTYPE))
                .leftOuterJoin(TTypeLookup.T_TYPE_LOOKUP.as("genderLookup")).on(TTypeLookup.T_TYPE_LOOKUP.as("genderLookup").LOOKUP_TYPE.equal(LookupTypes.TYPE_GENDER), TTypeLookup.T_TYPE_LOOKUP.as("genderLookup").VALUE.equal(TPatient.T_PATIENT.SEX))
                .leftOuterJoin(TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE).on(
                TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.HOSPITAL_ID.equal(nested.getField(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID)),
                TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.ACCOUNT_ID.equal(nested.getField(TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID)), TSavePhysPossMissingcode.T_SAVE_PHYS_POSS_MISSINGCODE.USER_ID.eq(userId))
                .where(TInsurance.T_INSURANCE.PAYER_PRIORITY.equal(1))
                .groupBy(nested.getField(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID), nested.getField(TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID))
                .orderBy(nested.getField(TPhysPredictions.T_PHYS_PREDICTIONS.EV_SCORE).asc())
                .fetchInto(PhysicianAccountResourceResult.class);
    }

    /**
     * Gets list of accounts for preBill
     *
     * @param hospitalId
     * @param userId
     * @param all
     * @param auditorList
     * @return Result<Record>
     */
    public List<PhysicianAccountResourceResult> getPhysicianAccountsSubmitted(String hospitalId, String userId, Boolean all, List<String> auditorList) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalId' cannot be null.");
        }
        if (userId == null) {
            throw new IllegalArgumentException("Input parameter 'userId' cannot be null.");
        }
        if (all == null) {
            throw new IllegalArgumentException("Input parameter 'all' cannot be null.");
        }
        Timestamp cuurntTime = null;
        try {
            cuurntTime = activityLogUtils.getCuurentDateTimeStamp(userId);
        } catch (ParseException ex) {
            Logger.getLogger(PhysicianAccountDao.class.getName()).log(Level.SEVERE, null, ex);
        }
        SelectQuery nested = create.selectQuery();
        nested.addSelect(min(TPhysPredictions.T_PHYS_PREDICTIONS.EV_SCORE).as("EV_SCORE"), TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID, TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID,
                Factory.groupConcatDistinct(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_CODE).orderBy(TPhysPredictions.T_PHYS_PREDICTIONS.EV_SCORE.asc()).as("predCode"),
                Factory.groupConcatDistinct(TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER).orderBy(TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER).as("costCenter"));
        nested.addFrom(TPhysPredictions.T_PHYS_PREDICTIONS);
        nested.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(hospitalId));
        nested.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.EV_SCORE.isNotNull());
        nested.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.FOUND.equal((byte) 0));
        nested.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.equal(DbConstants.YES_VALUE));
        nested.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.isNotNull());
        nested.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITING_TIME.greaterOrEqual(cuurntTime));
        if (all == Boolean.FALSE) {
            nested.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID.equal(userId));
        }

        if (all == Boolean.TRUE && (auditorList != null && auditorList.size() > 0)) {
            nested.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID.in(auditorList));
        }

        nested.addGroupBy(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID, TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID);
        nested.addOrderBy(min(TPhysPredictions.T_PHYS_PREDICTIONS.EV_SCORE).asc());
        nested.asTable("nested");

        return create.select(nested.getField(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID).as("hospitalId"),
                nested.getField(TPhysPredictions.T_PHYS_PREDICTIONS.EV_SCORE.as("evScore")), nested.getField(Factory.groupConcatDistinct(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_CODE).orderBy(TPhysPredictions.T_PHYS_PREDICTIONS.EV_SCORE.asc()).as("predCode")),
                TPatient.T_PATIENT.ACCOUNT_ID, TPatient.T_PATIENT.NAME, nested.getField("costCenter").as("serviceLine"), TPatient.T_PATIENT.AGE, TPatient.T_PATIENT.SEX, TPatient.T_PATIENT.PATIENT_ID,
                TPatient.T_PATIENT.ADMIT_DATE, TPatient.T_PATIENT.DOB, TPatient.T_PATIENT.DISCHARGE_DATE, TPatient.T_PATIENT.TRANSFER_DATE, TPatient.T_PATIENT.PATIENT_TYPE,
                TInsurance.T_INSURANCE.PAYER_DESC, TInsurance.T_INSURANCE.PAYER_CODE,
                TTypeLookup.T_TYPE_LOOKUP.as("typeLookup").DESCRIPTION.as("patTypeDescription"),
                TPatient.T_PATIENT.PATIENT_SUBTYPE, TTypeLookup.T_TYPE_LOOKUP.as("subTypeLookup").DESCRIPTION.as("patSubTypeDescription"),
                TTypeLookup.T_TYPE_LOOKUP.as("genderLookup").DESCRIPTION.as("genderDescription")).from(nested)
                .join(TPatient.T_PATIENT).on(nested.getField(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID).equal(TPatient.T_PATIENT.HOSPITAL_ID), nested.getField(TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID).equal(TPatient.T_PATIENT.ACCOUNT_ID))
                .leftOuterJoin(TInsurance.T_INSURANCE).on(nested.getField(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID).equal(TInsurance.T_INSURANCE.HOSPITAL_ID), nested.getField(TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID).equal(TInsurance.T_INSURANCE.ACCOUNT_ID), TInsurance.T_INSURANCE.PAYER_PRIORITY.equal(1))
                .leftOuterJoin(TTypeLookup.T_TYPE_LOOKUP.as("typeLookup")).on(TTypeLookup.T_TYPE_LOOKUP.as("typeLookup").LOOKUP_TYPE.equal(LookupTypes.TYPE_PATTYPE), TTypeLookup.T_TYPE_LOOKUP.as("typeLookup").VALUE.equal(TPatient.T_PATIENT.PATIENT_TYPE))
                .leftOuterJoin(TTypeLookup.T_TYPE_LOOKUP.as("subTypeLookup")).on(TTypeLookup.T_TYPE_LOOKUP.as("subTypeLookup").LOOKUP_TYPE.equal(LookupTypes.TYPE_PATSUBTYPE), TTypeLookup.T_TYPE_LOOKUP.as("subTypeLookup").VALUE.equal(TPatient.T_PATIENT.PATIENT_SUBTYPE))
                .leftOuterJoin(TTypeLookup.T_TYPE_LOOKUP.as("genderLookup")).on(TTypeLookup.T_TYPE_LOOKUP.as("genderLookup").LOOKUP_TYPE.equal(LookupTypes.TYPE_GENDER), TTypeLookup.T_TYPE_LOOKUP.as("genderLookup").VALUE.equal(TPatient.T_PATIENT.SEX))
                .groupBy(nested.getField(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID), nested.getField(TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID))
                .orderBy(nested.getField(TPhysPredictions.T_PHYS_PREDICTIONS.EV_SCORE).asc())
                .fetchInto(PhysicianAccountResourceResult.class);
    }

    /**
     * TPhysAcctDetailsRecord for a hospital and an account
     *
     * @param hospitalId
     * @param accountId
     * @return List of
     */
    public List<TPhysMasterRepresentation> getPhysicianAccountDetail(String hospitalId, String accountId) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalId' cannot be null.");
        }
        if (accountId == null) {
            throw new IllegalArgumentException("Input parameter 'accountId' cannot be null.");
        }
        return create.selectDistinct(TPhysAccountDetails.T_PHYS_ACCOUNT_DETAILS.CODE, TPhysAccountDetails.T_PHYS_ACCOUNT_DETAILS.NAME, TPhysAccountDetails.T_PHYS_ACCOUNT_DETAILS.PHYSICIAN_TYPE, TPhysAccountDetails.T_PHYS_ACCOUNT_DETAILS.NPI, TPhysMaster.T_PHYS_MASTER.START_DATE, TPhysMaster.T_PHYS_MASTER.TERMINATION_DATE, TPhysMaster.T_PHYS_MASTER.IS_EMPLOYED, TPhysMaster.T_PHYS_MASTER.TYPE)
                .from(TPhysAccountDetails.T_PHYS_ACCOUNT_DETAILS)
                .leftOuterJoin(TPhysMaster.T_PHYS_MASTER).on(TPhysAccountDetails.T_PHYS_ACCOUNT_DETAILS.HOSPITAL_ID.eq(TPhysMaster.T_PHYS_MASTER.HOSPITAL_ID), TPhysAccountDetails.T_PHYS_ACCOUNT_DETAILS.CODE.eq(TPhysMaster.T_PHYS_MASTER.CODE), TPhysMaster.T_PHYS_MASTER.NPI.isNotNull())
                .where(TPhysAccountDetails.T_PHYS_ACCOUNT_DETAILS.HOSPITAL_ID.equal(hospitalId))
                .and(TPhysAccountDetails.T_PHYS_ACCOUNT_DETAILS.ACCOUNT_ID.equal(accountId))
                .fetchInto(TPhysMasterRepresentation.class);
    }

    public Boolean scoringCheck() {
        Record record = create.select(TActivityLog.T_ACTIVITY_LOG.STATUS.as("STATUS"))
                .from(TActivityLog.T_ACTIVITY_LOG)
                //.where(TActivityLog.T_ACTIVITY_LOG.TYPE_CD.equal("LOADER"))
                .orderBy(TActivityLog.T_ACTIVITY_LOG.ACT_DT.desc())
                .limit(1).fetchOne();

        if (record != null) {
            String result = record.getValue("STATUS", String.class);
            if (result.equalsIgnoreCase("RUNNING")) {
                return true;
            }
        }
        return false;
    }

    public Boolean scoringCheck(String hospitalId) {
        Record record = create.select(TDailyFileLog.T_DAILY_FILE_LOG.STATUS.as("STATUS"))
                .from(TDailyFileLog.T_DAILY_FILE_LOG)
                .where(TDailyFileLog.T_DAILY_FILE_LOG.HOSPITAL_ID.equal(hospitalId))
                .orderBy(TDailyFileLog.T_DAILY_FILE_LOG.ACT_DT.desc())
                .limit(1).fetchOne();

        if (record != null) {
            String result = record.getValue("STATUS", String.class);
            if (result.equalsIgnoreCase("RUNNING")) {
                return true;
            }
        }
        return false;
    }

    public List<TPatMatchStatsRecord> getPhysicianAccountStatePanel(String hospitalId, String accountId) {
        return create.selectFrom(TPatMatchStats.T_PAT_MATCH_STATS)
                .where(TPatMatchStats.T_PAT_MATCH_STATS.HOSPITAL_ID.eq(hospitalId)
                        .and(TPatMatchStats.T_PAT_MATCH_STATS.ACCOUNT_ID.eq(accountId)))
                .fetch();
    }

}
