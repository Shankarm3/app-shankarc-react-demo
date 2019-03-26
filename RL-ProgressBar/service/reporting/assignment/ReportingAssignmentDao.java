package com.operasolutions.rl.service.reporting.assignment;

import java.sql.Timestamp;
import java.util.List;

import org.jooq.FactoryOperations;
import org.jooq.Record;
import org.jooq.Table;

import com.google.inject.Inject;
import com.operasolutions.rl.common.DbConstants;
import com.operasolutions.rl.schema.enums.TUserRole;
import com.operasolutions.rl.schema.tables.THospital;
import com.operasolutions.rl.schema.tables.TPhysReportingAssignment;
import com.operasolutions.rl.schema.tables.TUser;
import com.operasolutions.rl.schema.tables.records.TPhysReportingAssignmentLogRecord;
import com.operasolutions.rl.schema.tables.records.TPhysReportingAssignmentRecord;

/**
 * ReportingAssignmentDao
 *
 * @author Ritwik P R
 */
public class ReportingAssignmentDao {

    private final FactoryOperations create;

    @Inject
    public ReportingAssignmentDao(FactoryOperations jooqFactory) {
        this.create = jooqFactory;
    }

    /**
     * Gets all assignments
     *
     * @return List<ReportingAssignmentResult>
     */
    public List<ReportingAssignmentResult> getAllAssignments() {

        Table<Record> nested = create.select(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT.USER_ID.as("userId"),
                THospital.T_HOSPITAL.HOSPITAL_ID.as("hospitalId"), THospital.T_HOSPITAL.HOSPITAL_NAME.as("hospitalName"))
                .from(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT)
                .join(THospital.T_HOSPITAL).on(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT.HOSPITAL_ID.equal(THospital.T_HOSPITAL.HOSPITAL_ID))
                .asTable("nested");

        return create.select(TUser.T_USER.USER_ID.as("userId"), TUser.T_USER.F_NAME.as("fName"), TUser.T_USER.L_NAME.as("lName"),
                nested.getField(THospital.T_HOSPITAL.HOSPITAL_ID.as("hospitalId")), nested.getField(THospital.T_HOSPITAL.HOSPITAL_NAME.as("hospitalName")))
                .from(TUser.T_USER)
                .leftOuterJoin(nested).on(nested.getField(TUser.T_USER.USER_ID.as("userId")).equal(TUser.T_USER.USER_ID))
                .where(TUser.T_USER.U_TYPE.equal(TUserRole.PHYSICIAN_RPT_USER))
                .orderBy(TUser.T_USER.F_NAME.as("fName"), THospital.T_HOSPITAL.HOSPITAL_ID.as("hospitalId"))
                .fetchInto(ReportingAssignmentResult.class);
    }

    /**
     * Updates hospital assignments
     *
     * @param record
     */
    public void addAssignment(TPhysReportingAssignmentRecord record) {
        if (record == null) {
            throw new IllegalArgumentException("Input parameter 'record' cannot be null.");
        }

        TPhysReportingAssignmentRecord inserted = (TPhysReportingAssignmentRecord) create.insertInto(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT)
                .set(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT.ASSIGNED_BY, record.getAssignedBy())
                .set(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT.HOSPITAL_ID, record.getHospitalId())
                .set(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT.UPDATE_TIME, record.getUpdateTime())
                .set(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT.USER_ID, record.getUserId())
                .returning(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT.RPT_ASSIGNMENT_ID)
                .fetchOne();

        TPhysReportingAssignmentLogRecord logRecord = new TPhysReportingAssignmentLogRecord();
        logRecord.setRptAssignmentId(inserted.getRptAssignmentId());
        logRecord.setAssignedBy(record.getAssignedBy());
        logRecord.setHospitalId(record.getHospitalId());
        logRecord.setUpdateTime(record.getUpdateTime());
        logRecord.setUserId(record.getUserId());
        logRecord.setOperationType(DbConstants.OPERATION_ADD);

        updateAssignmentHistory(logRecord);
    }

    /**
     * Finds TPhysReportingAssignmentRecord record based on userId, hospitalId
     * and billType
     *
     * @param userId
     * @param hospitalId
     * @param billType
     * @return TPhysReportingAssignmentRecord
     */
    public TPhysReportingAssignmentRecord getAssigmentRecord(String userId, String hospitalId) {
        if (userId == null) {
            throw new IllegalArgumentException("Input parameter 'userId' cannot be null.");
        }
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalId' cannot be null.");
        }

        return create.selectFrom(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT)
                .where(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT.USER_ID.equal(userId))
                .and(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT.HOSPITAL_ID.equal(hospitalId))
                .fetchOne();
    }

    /**
     * Deletes hospital assignments
     *
     * @param userId
     * @param hospitalId
     * @param billType
     * @param currentUser
     * @param currentTime
     * @return Number of deleted records
     */
    public int deleteAssignment(String userId, String hospitalId, String currentUser, Long currentTime) {
        if (userId == null) {
            throw new IllegalArgumentException("Input parameter 'userId' cannot be null.");
        }
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalId' cannot be null.");
        }
        if (currentUser == null) {
            throw new IllegalArgumentException("Input parameter 'currentUser' cannot be null.");
        }
        if (currentTime == null) {
            throw new IllegalArgumentException("Input parameter 'currentTime' cannot be null.");
        }

        // get current record
        TPhysReportingAssignmentRecord oldRecord = getAssigmentRecord(userId, hospitalId);

        if (oldRecord != null) {

            // insert record into history table
            TPhysReportingAssignmentLogRecord logRecord = new TPhysReportingAssignmentLogRecord();
            logRecord.setRptAssignmentId(oldRecord.getRptAssignmentId());
            logRecord.setAssignedBy(currentUser);
            logRecord.setHospitalId(oldRecord.getHospitalId());
            logRecord.setUpdateTime(new Timestamp(currentTime));
            logRecord.setUserId(oldRecord.getUserId());
            logRecord.setOperationType(DbConstants.OPERATION_DELETE);

            updateAssignmentHistory(logRecord);
        }

        // delete current record
        return create.delete(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT)
                .where(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT.USER_ID.equal(userId))
                .and(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT.HOSPITAL_ID.equal(hospitalId))
                .execute();
    }

    /**
     * Inserts new record into history table
     *
     * @param record
     */
    @SuppressWarnings("unchecked")
    public void updateAssignmentHistory(TPhysReportingAssignmentLogRecord record) {
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
                .from(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT)
                .where(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT.USER_ID.equal(userId))
                .fetchOne();

        Long count = record.getValue("count", Long.class);
        if (count != 0) {
            result = true;
        }

        return result;
    }

}
