package com.operasolutions.rl.service.physician.hospital.auditor;

import java.util.ArrayList;
import java.util.List;

import org.jooq.FactoryOperations;
import org.jooq.Record;
import org.jooq.Result;

import com.google.inject.Inject;
import com.operasolutions.rl.common.DbConstants;
import com.operasolutions.rl.schema.enums.TUserRole;
import com.operasolutions.rl.schema.tables.TPhysAssignment;
import com.operasolutions.rl.schema.tables.TPhysAssignmentLog;
import com.operasolutions.rl.schema.tables.TPhysPredictions;
import com.operasolutions.rl.schema.tables.TPhysReportingAssignment;
import com.operasolutions.rl.schema.tables.TUser;
import com.operasolutions.rl.service.physician.hospital.auditor.PhysicianAuditorResource.AuditorRepresentation;

/**
 * PhysicianAuditorDao
 *
 * @author Nirmal Kumar
 */
public class PhysicianAuditorDao {

    private final FactoryOperations create;

    @Inject
    public PhysicianAuditorDao(FactoryOperations jooqFactory) {
        this.create = jooqFactory;
    }

    /**
     * Auditor list
     *
     * @return List<AuditorRepresentation>
     */
    public List<AuditorRepresentation> getAuditorList() {

        List<AuditorRepresentation> resultOut = new ArrayList<AuditorRepresentation>();

        Result<Record> result = create.selectDistinct(TPhysAssignment.T_PHYS_ASSIGNMENT.USER_ID)
                .from(TPhysAssignment.T_PHYS_ASSIGNMENT)
                .join(TUser.T_USER).on(TPhysAssignment.T_PHYS_ASSIGNMENT.USER_ID.equal(TUser.T_USER.USER_ID), TUser.T_USER.ENABLED.isTrue())
                .where(TUser.T_USER.U_TYPE.equal(TUserRole.PHYSICIAN_AUDITOR))
                .orderBy(TPhysAssignment.T_PHYS_ASSIGNMENT.USER_ID)
                .fetch();

        if (result != null) {
            resultOut = result.into(AuditorRepresentation.class);
        }

        return resultOut;
    }

    /**
     * Auditor list
     *
     * @return List<AuditorRepresentation>
     */
    public List<AuditorRepresentation> getReportAuditorList(String userId) {

        List<AuditorRepresentation> resultOut = new ArrayList<AuditorRepresentation>();

        Result<Record> result = create.selectDistinct(TPhysAssignment.T_PHYS_ASSIGNMENT.USER_ID)
                .from(TPhysAssignment.T_PHYS_ASSIGNMENT)
                .join(TUser.T_USER).on(TPhysAssignment.T_PHYS_ASSIGNMENT.USER_ID.equal(TUser.T_USER.USER_ID), TUser.T_USER.ENABLED.isTrue())
                .join(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT).on(TPhysAssignment.T_PHYS_ASSIGNMENT.HOSPITAL_ID.eq(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT.HOSPITAL_ID))
                .where(TUser.T_USER.U_TYPE.equal(TUserRole.PHYSICIAN_AUDITOR), TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT.USER_ID.eq(userId))
                .orderBy(TPhysAssignment.T_PHYS_ASSIGNMENT.USER_ID)
                .fetch();

        if (result != null) {
            resultOut = result.into(AuditorRepresentation.class);
        }

        return resultOut;
    }

    /*
     *getAuditor List()
     */
    public List<String> getAllAuditor() {
        List<String> list = new ArrayList<String>();
        List<Record> records = create.selectDistinct(TUser.T_USER.USER_ID).from(TUser.T_USER)
                .join(TPhysAssignmentLog.T_PHYS_ASSIGNMENT_LOG).on(TUser.T_USER.USER_ID.eq(TPhysAssignmentLog.T_PHYS_ASSIGNMENT_LOG.USER_ID))
                //.where(TUser.T_USER.U_TYPE.eq(TUserRole.PHYSICIAN_AUDITOR))
                .orderBy(TUser.T_USER.USER_ID)
                .fetch();
        if (!records.isEmpty()) {
            for (Record record : records) {
                list.add(record.getValue("USER_ID", String.class));
            }
        }
        return list;
    }

    /*
     *getAuditor List()
     */
    public List<String> getAllPhysicianAuditor() {
        List<String> list = new ArrayList<String>();
        List<Record> records = create.selectDistinct(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID).from(TPhysPredictions.T_PHYS_PREDICTIONS)
                .where(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.eq(DbConstants.YES_VALUE), TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID.isNotNull(), TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID.ne(""))
                .orderBy(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID)
                .fetch();
        if (!records.isEmpty()) {
            for (Record record : records) {
                list.add(record.getValue("CEN_AUDITOR_ID", String.class));
            }
        }
        return list;
    }
}
