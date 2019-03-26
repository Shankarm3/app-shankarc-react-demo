package com.operasolutions.rl.service.division;

import java.util.List;

import org.jooq.FactoryOperations;

import com.google.inject.Inject;
import com.operasolutions.rl.common.DbConstants;
import com.operasolutions.rl.schema.tables.TDivisionHospital;
import com.operasolutions.rl.schema.tables.TPhysReportingAssignment;
import com.operasolutions.rl.schema.tables.records.TDivisionHospitalRecord;
import static com.operasolutions.rl.service.physician.confirmed.search.GlobalChargeResource.HOSPITAL_ID;

/**
 * DivisionDao
 *
 * @author Nirmal Kumar
 */
public class DivisionDao {

    private final FactoryOperations create;

    @Inject
    public DivisionDao(FactoryOperations jooqFactory) {
        this.create = jooqFactory;
    }

    /**
     * Gets all divisions
     *
     * @return List<TDivisionHospitalRecord>
     */
    public List<TDivisionHospitalRecord> getAllDivisions() {
        return create.selectFrom(TDivisionHospital.T_DIVISION_HOSPITAL)
                .where(TDivisionHospital.T_DIVISION_HOSPITAL.DIVISION_NAME.notEqual(DbConstants.DIVISION_NAME_OTHER))
                .orderBy(TDivisionHospital.T_DIVISION_HOSPITAL.DIVISION_ID, TDivisionHospital.T_DIVISION_HOSPITAL.HOSPITAL_ID)
                .fetch();
    }

    /**
     * Gets associated divisions
     *
     * @return List<TDivisionHospitalRecord>
     */
    public List<TDivisionHospitalRecord> getAssignedDivisions(String userId) {
        return create.selectFrom(TDivisionHospital.T_DIVISION_HOSPITAL)
                .where(TDivisionHospital.T_DIVISION_HOSPITAL.DIVISION_NAME.notEqual(DbConstants.DIVISION_NAME_OTHER).and(TDivisionHospital.T_DIVISION_HOSPITAL.HOSPITAL_ID.in(create.select(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT.HOSPITAL_ID).from(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT).where(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT.USER_ID.equal(userId)))))
                .orderBy(TDivisionHospital.T_DIVISION_HOSPITAL.DIVISION_ID, TDivisionHospital.T_DIVISION_HOSPITAL.HOSPITAL_ID)
                .fetch();
    }

}
