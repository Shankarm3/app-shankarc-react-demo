package com.operasolutions.rl.service.physician.auditor.assignment;

import java.sql.Timestamp;
import java.util.List;

import org.jooq.FactoryOperations;
import org.jooq.Record;
import com.google.inject.Inject;
import com.operasolutions.rl.common.DbConstants;
import static com.operasolutions.rl.common.DbConstants.CUSTOM_PHYS_ASSIGNMENT;
import static com.operasolutions.rl.common.DbConstants.CUSTOM_PHYS_ASSIGNMENT_UI;
import com.operasolutions.rl.schema.tables.THospital;
import com.operasolutions.rl.schema.tables.TPhysAssignment;
import com.operasolutions.rl.schema.tables.TPhysHospitalMapping;
import com.operasolutions.rl.schema.tables.TPhysPredictions;
import com.operasolutions.rl.schema.tables.TSystemFlags;
import com.operasolutions.rl.schema.tables.records.TPhysAssignmentLogRecord;
import com.operasolutions.rl.schema.tables.records.TPhysAssignmentRecord;
import com.operasolutions.rl.service.physician.auditor.assignment.PhysicianAuditorAssignmentResource.AccountList;
import com.operasolutions.rl.service.physician.auditor.assignment.PhysicianAuditorAssignmentResource.AuditorDataAssignment;
import com.operasolutions.rl.service.physician.auditor.assignment.PhysicianAuditorAssignmentResource.PhysicianResult;
import com.operasolutions.rl.service.physician.auditor.assignment.PhysicianSummaryResource.SummaryResult;
import java.util.Map;
import java.util.Set;
import org.jooq.Query;
import org.jooq.Table;
import org.jooq.impl.Factory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * PhysicianAuditorAssignmentDao
 *
 * @author Nirmal Kumar
 */
public class PhysicianAuditorAssignmentDao {

    private final FactoryOperations create;

    protected static final Logger log = LoggerFactory.getLogger(PhysicianAuditorAssignmentDao.class);

    @Inject
    public PhysicianAuditorAssignmentDao(FactoryOperations jooqFactory) {
        this.create = jooqFactory;
    }

    /**
     * Gets all preBill assignments
     *
     * @return List<PhysicianAuditorAssignmentResult>
     */
    public List<PhysicianAuditorAssignmentResult> getAllAssignments() {

        Table query = create.select(TPhysHospitalMapping.T_PHYS_HOSPITAL_MAPPING.HOSPITAL_ID, TPhysHospitalMapping.T_PHYS_HOSPITAL_MAPPING.COST_CENTER, TPhysHospitalMapping.T_PHYS_HOSPITAL_MAPPING.SOURCE, Factory.groupConcatDistinct(TPhysAssignment.T_PHYS_ASSIGNMENT.USER_ID).as("auditorId"))
                .from(TPhysHospitalMapping.T_PHYS_HOSPITAL_MAPPING)
                .leftOuterJoin(TPhysAssignment.T_PHYS_ASSIGNMENT).on(TPhysAssignment.T_PHYS_ASSIGNMENT.HOSPITAL_ID.equal(TPhysHospitalMapping.T_PHYS_HOSPITAL_MAPPING.HOSPITAL_ID),
                TPhysAssignment.T_PHYS_ASSIGNMENT.COST_CENTER.equal(TPhysHospitalMapping.T_PHYS_HOSPITAL_MAPPING.COST_CENTER), TPhysAssignment.T_PHYS_ASSIGNMENT.SOURCE.equal(TPhysHospitalMapping.T_PHYS_HOSPITAL_MAPPING.SOURCE), TPhysAssignment.T_PHYS_ASSIGNMENT.IS_REGULAR.isFalse())
                .groupBy(TPhysHospitalMapping.T_PHYS_HOSPITAL_MAPPING.HOSPITAL_ID, TPhysHospitalMapping.T_PHYS_HOSPITAL_MAPPING.COST_CENTER, TPhysHospitalMapping.T_PHYS_HOSPITAL_MAPPING.SOURCE).asTable("C");

        return create.select(THospital.T_HOSPITAL.SHORT_NAME, THospital.T_HOSPITAL.HOSPITAL_NAME, Factory.countDistinct(TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID).as("total"), TPhysHospitalMapping.T_PHYS_HOSPITAL_MAPPING.SOURCE, TPhysHospitalMapping.T_PHYS_HOSPITAL_MAPPING.COST_CENTER, TPhysHospitalMapping.T_PHYS_HOSPITAL_MAPPING.HOSPITAL_ID, Factory.groupConcatDistinct(TPhysAssignment.T_PHYS_ASSIGNMENT.USER_ID).as("auditorId"), query.getField("auditorId").as("queueAuditorId"))
                .from(TPhysHospitalMapping.T_PHYS_HOSPITAL_MAPPING)
                .join(THospital.T_HOSPITAL).on(TPhysHospitalMapping.T_PHYS_HOSPITAL_MAPPING.HOSPITAL_ID.eq(THospital.T_HOSPITAL.HOSPITAL_ID))
                .leftOuterJoin(TPhysAssignment.T_PHYS_ASSIGNMENT).on(TPhysAssignment.T_PHYS_ASSIGNMENT.HOSPITAL_ID.equal(TPhysHospitalMapping.T_PHYS_HOSPITAL_MAPPING.HOSPITAL_ID), TPhysAssignment.T_PHYS_ASSIGNMENT.SOURCE.equal(TPhysHospitalMapping.T_PHYS_HOSPITAL_MAPPING.SOURCE),
                TPhysAssignment.T_PHYS_ASSIGNMENT.COST_CENTER.equal(TPhysHospitalMapping.T_PHYS_HOSPITAL_MAPPING.COST_CENTER), TPhysAssignment.T_PHYS_ASSIGNMENT.IS_REGULAR.isTrue())
                .leftOuterJoin(query).on("T_PHYS_HOSPITAL_MAPPING.HOSPITAL_ID=C.HOSPITAL_ID AND T_PHYS_HOSPITAL_MAPPING.COST_CENTER=C.COST_CENTER  and T_PHYS_HOSPITAL_MAPPING.SOURCE=C.SOURCE")
                .leftOuterJoin(TPhysPredictions.T_PHYS_PREDICTIONS).on(TPhysPredictions.T_PHYS_PREDICTIONS.SOURCE.equal(TPhysHospitalMapping.T_PHYS_HOSPITAL_MAPPING.SOURCE),
                TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER.equal(TPhysHospitalMapping.T_PHYS_HOSPITAL_MAPPING.COST_CENTER), TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(TPhysHospitalMapping.T_PHYS_HOSPITAL_MAPPING.HOSPITAL_ID), TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.eq(DbConstants.YES_VALUE), TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.isNull(), TPhysPredictions.T_PHYS_PREDICTIONS.FOUND.eq(DbConstants.FOUND))
                .groupBy(TPhysHospitalMapping.T_PHYS_HOSPITAL_MAPPING.SOURCE, TPhysHospitalMapping.T_PHYS_HOSPITAL_MAPPING.COST_CENTER, TPhysHospitalMapping.T_PHYS_HOSPITAL_MAPPING.HOSPITAL_ID)
                .fetchInto(PhysicianAuditorAssignmentResult.class);
    }

    /**
     * Gets all preBill assignments
     *
     * @return List<PhysicianAuditorAssignmentResult>
     */
    public List<PhysicianAuditorAssignmentResult> getAllAssignmentsQueue() {

        return create.select(THospital.T_HOSPITAL.SHORT_NAME, THospital.T_HOSPITAL.HOSPITAL_NAME, Factory.countDistinct(TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID).as("total"), TPhysHospitalMapping.T_PHYS_HOSPITAL_MAPPING.SOURCE, TPhysHospitalMapping.T_PHYS_HOSPITAL_MAPPING.COST_CENTER, TPhysHospitalMapping.T_PHYS_HOSPITAL_MAPPING.HOSPITAL_ID, Factory.groupConcatDistinct(TPhysAssignment.T_PHYS_ASSIGNMENT.USER_ID).as("auditorId"))
                .from(TPhysHospitalMapping.T_PHYS_HOSPITAL_MAPPING)
                .join(THospital.T_HOSPITAL).on(TPhysHospitalMapping.T_PHYS_HOSPITAL_MAPPING.HOSPITAL_ID.eq(THospital.T_HOSPITAL.HOSPITAL_ID))
                .leftOuterJoin(TPhysAssignment.T_PHYS_ASSIGNMENT).on(TPhysAssignment.T_PHYS_ASSIGNMENT.HOSPITAL_ID.equal(TPhysHospitalMapping.T_PHYS_HOSPITAL_MAPPING.HOSPITAL_ID), TPhysAssignment.T_PHYS_ASSIGNMENT.SOURCE.equal(TPhysHospitalMapping.T_PHYS_HOSPITAL_MAPPING.SOURCE),
                TPhysAssignment.T_PHYS_ASSIGNMENT.COST_CENTER.equal(TPhysHospitalMapping.T_PHYS_HOSPITAL_MAPPING.COST_CENTER), TPhysAssignment.T_PHYS_ASSIGNMENT.IS_REGULAR.isFalse())
                .leftOuterJoin(TPhysPredictions.T_PHYS_PREDICTIONS).on(TPhysPredictions.T_PHYS_PREDICTIONS.SOURCE.equal(TPhysHospitalMapping.T_PHYS_HOSPITAL_MAPPING.SOURCE),
                TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER.equal(TPhysHospitalMapping.T_PHYS_HOSPITAL_MAPPING.COST_CENTER), TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(TPhysHospitalMapping.T_PHYS_HOSPITAL_MAPPING.HOSPITAL_ID), TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.eq(DbConstants.YES_VALUE), TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.isNull(), TPhysPredictions.T_PHYS_PREDICTIONS.FOUND.eq(DbConstants.FOUND))
                .groupBy(TPhysHospitalMapping.T_PHYS_HOSPITAL_MAPPING.SOURCE, TPhysHospitalMapping.T_PHYS_HOSPITAL_MAPPING.COST_CENTER, TPhysHospitalMapping.T_PHYS_HOSPITAL_MAPPING.HOSPITAL_ID)
                .fetchInto(PhysicianAuditorAssignmentResult.class);
    }

    /**
     * Updates hospital assignments
     *
     * @param record
     */
    public void addAssignment(TPhysAssignmentRecord record) {
        if (record == null) {
            throw new IllegalArgumentException("Input parameter 'record' cannot be null.");
        }

        TPhysAssignmentRecord inserted = (TPhysAssignmentRecord) create.insertInto(TPhysAssignment.T_PHYS_ASSIGNMENT)
                .set(TPhysAssignment.T_PHYS_ASSIGNMENT.ASSIGNED_BY, record.getAssignedBy())
                .set(TPhysAssignment.T_PHYS_ASSIGNMENT.SOURCE, record.getSource())
                .set(TPhysAssignment.T_PHYS_ASSIGNMENT.HOSPITAL_ID, record.getHospitalId())
                .set(TPhysAssignment.T_PHYS_ASSIGNMENT.UPDATE_TIME, record.getUpdateTime())
                .set(TPhysAssignment.T_PHYS_ASSIGNMENT.COST_CENTER, record.getCostCenter())
                .set(TPhysAssignment.T_PHYS_ASSIGNMENT.USER_ID, record.getUserId())
                .set(TPhysAssignment.T_PHYS_ASSIGNMENT.IS_REGULAR, record.getIsRegular())
                .returning(TPhysAssignment.T_PHYS_ASSIGNMENT.ASSIGNMENT_ID)
                .fetchOne();

        TPhysAssignmentLogRecord logRecord = new TPhysAssignmentLogRecord();
        logRecord.setAssignmentId(inserted.getAssignmentId());
        logRecord.setAssignedBy(record.getAssignedBy());
        logRecord.setSource(record.getSource());
        logRecord.setHospitalId(record.getHospitalId());
        logRecord.setUpdateTime(record.getUpdateTime());
        logRecord.setCostCenter(record.getCostCenter());
        logRecord.setUserId(record.getUserId());
        logRecord.setIsRegular(record.getIsRegular());
        logRecord.setOperationType(DbConstants.OPERATION_ADD);

        updateAssignmentHistory(logRecord);
    }

    /**
     * Finds TAssignmentRecord record based on userId, hospitalId and billType
     *
     * @param userId
     * @param hospitalId
     * @param source
     * @param costCenter
     * @param isRegular
     * @return TAssignmentRecord
     */
    public List<TPhysAssignmentRecord> getAssigmentRecord(String userId, String hospitalId, String source, String costCenter, byte isRegular) {
        if (userId == null) {
            throw new IllegalArgumentException("Input parameter 'userId' cannot be null.");
        }
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalId' cannot be null.");
        }
        if (source == null) {
            throw new IllegalArgumentException("Input parameter 'source' cannot be null.");
        }
        if (costCenter == null) {
            throw new IllegalArgumentException("Input parameter 'costCenter' cannot be null.");
        }

        return create.selectFrom(TPhysAssignment.T_PHYS_ASSIGNMENT)
                .where(TPhysAssignment.T_PHYS_ASSIGNMENT.USER_ID.equal(userId))
                .and(TPhysAssignment.T_PHYS_ASSIGNMENT.HOSPITAL_ID.equal(hospitalId))
                .and(TPhysAssignment.T_PHYS_ASSIGNMENT.SOURCE.equal(source))
                .and(TPhysAssignment.T_PHYS_ASSIGNMENT.COST_CENTER.equal(costCenter))
                .and(TPhysAssignment.T_PHYS_ASSIGNMENT.IS_REGULAR.eq(isRegular))
                .fetch();
    }

    /**
     * Deletes hospital assignments
     *
     * @param userId
     * @param hospitalId
     * @param source
     * @param costCenter
     * @param currentUser
     * @param currentTime
     * @param isRegular
     * @return Number of deleted records
     */
    public int deleteAssignment(String userId, String hospitalId, String source, String costCenter, String currentUser, Long currentTime, byte isRegular) {
        if (userId == null) {
            throw new IllegalArgumentException("Input parameter 'userId' cannot be null.");
        }
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalId' cannot be null.");
        }
        if (source == null) {
            throw new IllegalArgumentException("Input parameter 'billType' cannot be null.");
        }
        if (costCenter == null) {
            throw new IllegalArgumentException("Input parameter 'costCenter' cannot be null.");
        }
        if (currentUser == null) {
            throw new IllegalArgumentException("Input parameter 'currentUser' cannot be null.");
        }
        if (currentTime == null) {
            throw new IllegalArgumentException("Input parameter 'currentTime' cannot be null.");
        }
        // get current record
        List<TPhysAssignmentRecord> oldRecordList = getAssigmentRecord(userId, hospitalId, source, costCenter, isRegular);
        if (!oldRecordList.isEmpty()) {
            for (TPhysAssignmentRecord oldRecord : oldRecordList) {
                TPhysAssignmentLogRecord logRecord = new TPhysAssignmentLogRecord();
                logRecord.setAssignmentId(oldRecord.getAssignmentId());
                logRecord.setAssignedBy(currentUser);
                logRecord.setSource(oldRecord.getSource());
                logRecord.setCostCenter(oldRecord.getCostCenter());
                logRecord.setHospitalId(oldRecord.getHospitalId());
                logRecord.setUpdateTime(new Timestamp(currentTime));
                logRecord.setUserId(oldRecord.getUserId());
                logRecord.setOperationType(DbConstants.OPERATION_DELETE);
                logRecord.setIsRegular(isRegular);
                updateAssignmentHistory(logRecord);
            }
            // insert record into history table
        }
        // delete current record
        return create.delete(TPhysAssignment.T_PHYS_ASSIGNMENT)
                .where(TPhysAssignment.T_PHYS_ASSIGNMENT.USER_ID.equal(userId))
                .and(TPhysAssignment.T_PHYS_ASSIGNMENT.HOSPITAL_ID.equal(hospitalId))
                .and(TPhysAssignment.T_PHYS_ASSIGNMENT.SOURCE.equal(source))
                .and(TPhysAssignment.T_PHYS_ASSIGNMENT.COST_CENTER.equal(costCenter))
                .and(TPhysAssignment.T_PHYS_ASSIGNMENT.IS_REGULAR.equal(isRegular))
                .execute();
    }

    /**
     * If a facility has lost all its auditors in a delete operation, This
     * function unassigns all the accounts of this facility
     *
     * @param source
     * @param costCenter
     * @param hospitalId
     * @return
     */
    public int unassignAccounts(String source, String costCenter, String hospitalId) {

        return create.update(TPhysPredictions.T_PHYS_PREDICTIONS)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID, org.jooq.impl.Factory.castNull(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID))
                .where(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(hospitalId))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.SOURCE.equal(source))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER.equal(costCenter))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.FOUND.equal((byte) 0))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.isNull().or(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.equal("")))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.equal(DbConstants.YES_VALUE))
                .execute();

    }

    /**
     * Inserts new record into history table
     *
     * @param record
     */
    @SuppressWarnings("unchecked")
    public void updateAssignmentHistory(TPhysAssignmentLogRecord record) {
        if (record == null) {
            throw new IllegalArgumentException("Input parameter 'record' cannot be null.");
        }

        record.attach(create);
        record.storeUsing();
    }

    /**
     * Check whether user has assigned hospital
     *
     * @param userId
     * @return true/false
     */
    public boolean hasUserAssignment(String userId) {
        if (userId == null || userId.isEmpty()) {
            throw new IllegalArgumentException("Input parameter 'userId' cannot be null or empty.");
        }

        boolean result = false;

        Record record = create.selectCount()
                .from(TPhysAssignment.T_PHYS_ASSIGNMENT)
                .where(TPhysAssignment.T_PHYS_ASSIGNMENT.USER_ID.equal(userId))
                .fetchOne();

        Long count = record.getValue("count", Long.class);
        if (count != 0) {
            result = true;
        }

        return result;
    }

    /**
     * Finds TAssignmentRecord record list based on userId
     *
     * @param userId
     * @return List-TAssignmentRecord
     */
    public boolean checkUserAssigment(String userId) {
        if (userId == null) {
            throw new IllegalArgumentException("Input parameter 'userId' cannot be null.");
        }
        List<TPhysAssignmentRecord> records = create.selectFrom(TPhysAssignment.T_PHYS_ASSIGNMENT)
                .where(TPhysAssignment.T_PHYS_ASSIGNMENT.USER_ID.equal(userId))
                .fetch();
        return records.isEmpty();
    }

    public List<AccountList> getAllUnReviwedAccount(PhysicianResult physicianResult) {

        return create.selectDistinct(TPhysPredictions.T_PHYS_PREDICTIONS.SOURCE, TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER, TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID, TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID)
                .from(TPhysPredictions.T_PHYS_PREDICTIONS)
                .where(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.eq(physicianResult.hospitalId))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.SOURCE.equal(physicianResult.source))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER.equal(physicianResult.costCenter))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.isNull().or(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.equal("")))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.equal(DbConstants.YES_VALUE))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.FOUND.equal(DbConstants.FOUND))
                .fetchInto(AccountList.class);

    }

    public List<AccountList> getAllOverlapsAccount(String hospitalId, String costCenter, String source) {

        return create.selectDistinct(TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID, Factory.countDistinct(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID))
                .from(TPhysPredictions.T_PHYS_PREDICTIONS)
                .where(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.eq(hospitalId))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.SOURCE.equal(source))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER.equal(costCenter))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.isNull().or(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.equal("")))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.equal(DbConstants.YES_VALUE))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.FOUND.equal(DbConstants.FOUND))
                .groupBy(TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID)
                .having(Factory.countDistinct(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID).greaterThan(1))
                .fetchInto(AccountList.class);

    }

    /**
     * Updates updatePredictionOverlaps predictions
     *
     * @param hospitalId
     * @param costCenter
     * @param source
     * @param userId
     * @param accountId
     * @return Number of updated records
     */
    public int updatePredictionOverlaps(String hospitalId, String costCenter, String source, String userId, String accountId) {

        if (userId == null) {
            throw new IllegalArgumentException("Input parameter 'userId' cannot be null.");
        }
        if (accountId == null) {
            throw new IllegalArgumentException("Input parameter 'accountId' cannot be null.");
        }

        return create.update(TPhysPredictions.T_PHYS_PREDICTIONS)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID, userId)
                .where(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.eq(hospitalId))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID.eq(accountId))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.SOURCE.equal(source))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER.equal(costCenter))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID.notEqual(userId))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.isNull().or(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.equal("")))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.equal(DbConstants.YES_VALUE))
                .execute();
    }

    /**
     * Updates preBill predictions
     *
     * @param userId
     * @param accountList
     * @return Number of updated records
     */
    public int updatePredictionTableR(String userId, Set<String> accountList) {

        if (userId == null) {
            throw new IllegalArgumentException("Input parameter 'userId' cannot be null.");
        }
        if (accountList.isEmpty()) {
            throw new IllegalArgumentException("Input parameter 'accountArray' cannot be null.");
        }
        return create.update(TPhysPredictions.T_PHYS_PREDICTIONS)
                .set(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID, userId)
                .where(TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID.in(accountList))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.isNull().or(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.equal("")))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.equal(DbConstants.YES_VALUE))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.FOUND.equal(DbConstants.FOUND))
                .and("(HOSPITAL_ID, COST_CENTER, SOURCE) IN (SELECT HOSPITAL_ID, COST_CENTER, SOURCE FROM T_PHYS_ASSIGNMENT WHERE USER_ID ='" + userId + "') ")
                .execute();
    }

    public List<SummaryResult> getSummaryViewCodeAssignment() {

        return create.selectDistinct(THospital.T_HOSPITAL.SHORT_NAME, THospital.T_HOSPITAL.HOSPITAL_NAME, TPhysPredictions.T_PHYS_PREDICTIONS.SOURCE, TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER, TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID, Factory.count(TPhysPredictions.T_PHYS_PREDICTIONS.PRED_KEY).as("count"))
                .from(TPhysPredictions.T_PHYS_PREDICTIONS)
                .join(THospital.T_HOSPITAL).on(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.eq(THospital.T_HOSPITAL.HOSPITAL_ID))
                .where(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.isNull().or(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.equal("")))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.equal(DbConstants.YES_VALUE))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.FOUND.equal(DbConstants.FOUND))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID.isNotNull())
                .groupBy(TPhysPredictions.T_PHYS_PREDICTIONS.SOURCE, TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER, TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID)
                .fetchInto(SummaryResult.class);

    }

    public void runCustomAssignment() {
        Record record = create.select(TSystemFlags.T_SYSTEM_FLAGS.VALUE).from(TSystemFlags.T_SYSTEM_FLAGS).where(TSystemFlags.T_SYSTEM_FLAGS.NAME.eq(CUSTOM_PHYS_ASSIGNMENT)).fetchOne();
        if (record != null) {
            String query = record.getValue("VALUE", String.class);
            String[] qq = query.split(";");
            Query[] q2 = new Query[qq.length];
            for (int i = 0; i < qq.length; i++) {
                q2[i] = create.query(qq[i]);
            }
            int[] count = create.batch(q2).execute();
            for (int i : count) {
                log.info("Query " + i + " has been execute successfully. Updated record is  " + i);
            }
        }
    }

    public void runCustomAssignment(Map<PhysicianResult, AuditorDataAssignment> map) {
        String filter = " AND (A.HOSPITAL_ID,A.SOURCE,A.COST_CENTER) IN (";
        boolean flag = true;
        for (PhysicianResult obj : map.keySet()) {
            if (flag) {
                filter += "('" + obj.hospitalId + "','" + obj.source + "','" + obj.costCenter + "')";
                flag = false;
            } else {
                filter += ",('" + obj.hospitalId + "','" + obj.source + "','" + obj.costCenter + "')";
            }
        }
        filter += ")";
        Record record = create.select(TSystemFlags.T_SYSTEM_FLAGS.VALUE).from(TSystemFlags.T_SYSTEM_FLAGS).where(TSystemFlags.T_SYSTEM_FLAGS.NAME.eq(CUSTOM_PHYS_ASSIGNMENT_UI)).fetchOne();
        if (record != null) {
            String query = record.getValue("VALUE", String.class);
            query = query.replaceAll("#FILTER#", filter);
            log.info("Phys Query : " + query);
            String[] qq = query.split(";");
            Query[] q2 = new Query[qq.length];
            for (int i = 0; i < qq.length; i++) {
                q2[i] = create.query(qq[i]);
            }
            int[] count = create.batch(q2).execute();
            for (int i : count) {
                log.info("Query has been execute successfully. Updated record is  " + i);
            }
        }
    }
}
