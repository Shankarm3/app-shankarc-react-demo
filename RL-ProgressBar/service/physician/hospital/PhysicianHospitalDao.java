package com.operasolutions.rl.service.physician.hospital;

import java.util.List;

import org.jooq.FactoryOperations;

import com.google.inject.Inject;
import com.operasolutions.rl.common.DbConstants;
import com.operasolutions.rl.schema.tables.TCostcenterRuleMapping;
import com.operasolutions.rl.schema.tables.THospital;
import com.operasolutions.rl.schema.tables.TPhysAssignment;
import com.operasolutions.rl.schema.tables.TPhysPredictions;
import com.operasolutions.rl.schema.tables.TPhysReportingAssignment;
import com.operasolutions.rl.schema.tables.records.THospitalRecord;
import com.operasolutions.rl.service.physician.hospital.PhysicianHospitalResource.CostCenterResult;
import com.operasolutions.rl.service.physician.hospital.PhysicianHospitalResource.HospitalResult;
import java.util.ArrayList;
import org.jooq.Table;
import org.jooq.impl.Factory;

/**
 * PhysicianHospitalDao
 *
 * @author Nirmal Kumar
 * @author Nirmal Kumar
 */
public class PhysicianHospitalDao {

    private final FactoryOperations create;

    @Inject
    public PhysicianHospitalDao(FactoryOperations jooqFactory) {
        this.create = jooqFactory;
    }

    /**
     * Gets all hospitals
     *
     * @return List of all hospitals
     */
    public List<THospitalRecord> getAllHospitals() {
        return create.selectFrom(THospital.T_HOSPITAL).fetch();
    }

    /**
     * Stores hospital
     *
     * @param hospital
     * @return hospitalId
     */
    public String storeHospital(THospitalRecord hospital) {
        if (hospital == null) {
            throw new IllegalArgumentException("Input parameter 'hospital' cannot be null.");
        }

        hospital.attach(create);
        hospital.store();

        return hospital.getHospitalId();
    }

    /**
     * Gets hospital by hospitalId
     *
     * @param hospitalId
     * @return THospitalRecord
     */
    public THospitalRecord getHospitalById(String hospitalId) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalId' cannot be null.");
        }
        return create.selectFrom(THospital.T_HOSPITAL).where(THospital.T_HOSPITAL.HOSPITAL_ID.equal(hospitalId)).fetchOne();
    }

    /**
     * Gets hospitals by userId
     *
     * @param userId
     * @return List of hospitals
     */
    public List<HospitalResult> getAssignedHospitalsByUserId(String userId) {
        if (userId == null) {
            throw new IllegalArgumentException("Input parameter 'userId' cannot be null.");
        }
        List<HospitalResult> list = new ArrayList<HospitalResult>(0);
        list = create.selectDistinct(THospital.T_HOSPITAL.ADDRESS_LINE_1.as("addressLine1"), THospital.T_HOSPITAL.ADDRESS_LINE_2.as("addressLine2"), THospital.T_HOSPITAL.CITY, THospital.T_HOSPITAL.FILE_LOAD_TIMESTAMP, Factory.countDistinct(TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID).as("totalCount"),
                THospital.T_HOSPITAL.HOSPITAL_ID, THospital.T_HOSPITAL.HOSPITAL_NAME, THospital.T_HOSPITAL.ORIG_FILE_NAME_DATE, THospital.T_HOSPITAL.SHORT_NAME, THospital.T_HOSPITAL.STATE, THospital.T_HOSPITAL.ZIP)
                .from(THospital.T_HOSPITAL)
                .leftOuterJoin(TPhysPredictions.T_PHYS_PREDICTIONS).on(THospital.T_HOSPITAL.HOSPITAL_ID.eq(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID), TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.eq(DbConstants.YES_VALUE), TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.isNull(), TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID.eq(userId), TPhysPredictions.T_PHYS_PREDICTIONS.EV_SCORE.isNotNull(), TPhysPredictions.T_PHYS_PREDICTIONS.FOUND.equal((byte) 0))
                .where(THospital.T_HOSPITAL.HOSPITAL_ID.in(create.select(TPhysAssignment.T_PHYS_ASSIGNMENT.HOSPITAL_ID)
                        .from(TPhysAssignment.T_PHYS_ASSIGNMENT).where(TPhysAssignment.T_PHYS_ASSIGNMENT.USER_ID.equal(userId))))
                .groupBy(THospital.T_HOSPITAL.HOSPITAL_ID)
                .orderBy(THospital.T_HOSPITAL.HOSPITAL_ID).fetchInto(HospitalResult.class);

        return list;
    }

    /**
     * Gets hospitals by userId
     *
     * @param userId
     * @return List of hospitals
     */
    public List<HospitalResult> getAssignedHospitalsByReportUser(String userId) {
        if (userId == null) {
            throw new IllegalArgumentException("Input parameter 'userId' cannot be null.");
        }
        List<HospitalResult> list = new ArrayList<HospitalResult>(0);
        list = create.selectDistinct(THospital.T_HOSPITAL.ADDRESS_LINE_1.as("addressLine1"), THospital.T_HOSPITAL.ADDRESS_LINE_2.as("addressLine2"), THospital.T_HOSPITAL.CITY, THospital.T_HOSPITAL.FILE_LOAD_TIMESTAMP, Factory.countDistinct(TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID).as("totalCount"),
                THospital.T_HOSPITAL.HOSPITAL_ID, THospital.T_HOSPITAL.HOSPITAL_NAME, THospital.T_HOSPITAL.ORIG_FILE_NAME_DATE, THospital.T_HOSPITAL.SHORT_NAME, THospital.T_HOSPITAL.STATE, THospital.T_HOSPITAL.ZIP)
                .from(THospital.T_HOSPITAL)
                .join(TPhysAssignment.T_PHYS_ASSIGNMENT).on(THospital.T_HOSPITAL.HOSPITAL_ID.eq(TPhysAssignment.T_PHYS_ASSIGNMENT.HOSPITAL_ID))
                .join(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT).on(THospital.T_HOSPITAL.HOSPITAL_ID.eq(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT.HOSPITAL_ID))
                .leftOuterJoin(TPhysPredictions.T_PHYS_PREDICTIONS).on(THospital.T_HOSPITAL.HOSPITAL_ID.eq(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID), TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.eq(DbConstants.YES_VALUE), TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.isNull(), TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID.isNotNull(), TPhysPredictions.T_PHYS_PREDICTIONS.EV_SCORE.isNotNull(), TPhysPredictions.T_PHYS_PREDICTIONS.FOUND.equal((byte) 0))
                .where(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT.USER_ID.eq(userId))
                .groupBy(THospital.T_HOSPITAL.HOSPITAL_ID)
                .orderBy(THospital.T_HOSPITAL.HOSPITAL_ID).fetchInto(HospitalResult.class);

        return list;
    }

    /**
     * Gets hospitals
     *
     * @return List of hospitals
     */
//    public List<THospitalRecord> getAllHospitalsByAuditor() {
//        return create.selectFrom(THospital.T_HOSPITAL).where(THospital.T_HOSPITAL.HOSPITAL_ID.in(create.select(TPhysAssignment.T_PHYS_ASSIGNMENT.HOSPITAL_ID).from(TPhysAssignment.T_PHYS_ASSIGNMENT))).orderBy(THospital.T_HOSPITAL.HOSPITAL_ID).fetch();
//    }
    /**
     * Gets hospitals
     *
     * @return List of hospitals
     */
    public List<HospitalResult> getAllHospitalsByAuditor() {

        List<HospitalResult> list = new ArrayList<HospitalResult>(0);
        list = create.selectDistinct(THospital.T_HOSPITAL.ADDRESS_LINE_1.as("addressLine1"), THospital.T_HOSPITAL.ADDRESS_LINE_2.as("addressLine2"), THospital.T_HOSPITAL.CITY, THospital.T_HOSPITAL.FILE_LOAD_TIMESTAMP, Factory.countDistinct(TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID).as("totalCount"),
                THospital.T_HOSPITAL.HOSPITAL_ID, THospital.T_HOSPITAL.HOSPITAL_NAME, THospital.T_HOSPITAL.ORIG_FILE_NAME_DATE, THospital.T_HOSPITAL.SHORT_NAME, THospital.T_HOSPITAL.STATE, THospital.T_HOSPITAL.ZIP)
                .from(THospital.T_HOSPITAL)
                .leftOuterJoin(TPhysPredictions.T_PHYS_PREDICTIONS).on(THospital.T_HOSPITAL.HOSPITAL_ID.eq(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID), TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.eq(DbConstants.YES_VALUE), TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.isNull(), TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID.isNotNull(), TPhysPredictions.T_PHYS_PREDICTIONS.EV_SCORE.isNotNull(), TPhysPredictions.T_PHYS_PREDICTIONS.FOUND.equal((byte) 0))
                .where(THospital.T_HOSPITAL.HOSPITAL_ID.in(create.select(TPhysAssignment.T_PHYS_ASSIGNMENT.HOSPITAL_ID)
                        .from(TPhysAssignment.T_PHYS_ASSIGNMENT)))
                .groupBy(THospital.T_HOSPITAL.HOSPITAL_ID)
                .orderBy(THospital.T_HOSPITAL.HOSPITAL_ID).fetchInto(HospitalResult.class);

        return list;
    }

    public List<CostCenterResult> getAllCostceneterByAuditor() {

        List<CostCenterResult> list = new ArrayList<CostCenterResult>(0);
        Table queryTotal = create.select(TPhysAssignment.T_PHYS_ASSIGNMENT.COST_CENTER, Factory.countDistinct(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID, TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID).as("totalCount"))
                .from(TPhysAssignment.T_PHYS_ASSIGNMENT)
                .join(TPhysPredictions.T_PHYS_PREDICTIONS).on(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(TPhysAssignment.T_PHYS_ASSIGNMENT.HOSPITAL_ID),
                TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER.equal(TPhysAssignment.T_PHYS_ASSIGNMENT.COST_CENTER), TPhysPredictions.T_PHYS_PREDICTIONS.SOURCE.equal(TPhysAssignment.T_PHYS_ASSIGNMENT.SOURCE), TPhysAssignment.T_PHYS_ASSIGNMENT.USER_ID.eq(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID), TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.eq(DbConstants.YES_VALUE), TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.isNull(), TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID.isNotNull(), TPhysPredictions.T_PHYS_PREDICTIONS.EV_SCORE.isNotNull(), TPhysPredictions.T_PHYS_PREDICTIONS.FOUND.equal((byte) 0))
                .groupBy(TPhysAssignment.T_PHYS_ASSIGNMENT.COST_CENTER).asTable("A");

        list = create.selectDistinct(TPhysAssignment.T_PHYS_ASSIGNMENT.COST_CENTER, Factory.nvl(queryTotal.getField("totalCount"), 0).as("totalCount"))
                .from(TPhysAssignment.T_PHYS_ASSIGNMENT)
                .leftOuterJoin(queryTotal).on(TPhysAssignment.T_PHYS_ASSIGNMENT.COST_CENTER.eq(queryTotal.getField(TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER)))
                .groupBy(TPhysAssignment.T_PHYS_ASSIGNMENT.COST_CENTER)
                .orderBy(TPhysAssignment.T_PHYS_ASSIGNMENT.COST_CENTER).fetchInto(CostCenterResult.class);

        return list;
    }

    public List<CostCenterResult> getAllCostceneterByAuditor(String userId) {

        List<CostCenterResult> list = new ArrayList<CostCenterResult>(0);
        Table queryTotal = create.select(TPhysAssignment.T_PHYS_ASSIGNMENT.COST_CENTER, Factory.countDistinct(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID, TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID).as("totalCount"))
                .from(TPhysAssignment.T_PHYS_ASSIGNMENT)
                .join(TPhysPredictions.T_PHYS_PREDICTIONS).on(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(TPhysAssignment.T_PHYS_ASSIGNMENT.HOSPITAL_ID),
                TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER.equal(TPhysAssignment.T_PHYS_ASSIGNMENT.COST_CENTER), TPhysPredictions.T_PHYS_PREDICTIONS.SOURCE.equal(TPhysAssignment.T_PHYS_ASSIGNMENT.SOURCE), TPhysAssignment.T_PHYS_ASSIGNMENT.USER_ID.eq(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID), TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.eq(DbConstants.YES_VALUE), TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.isNull(), TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID.isNotNull(), TPhysPredictions.T_PHYS_PREDICTIONS.EV_SCORE.isNotNull(), TPhysPredictions.T_PHYS_PREDICTIONS.FOUND.equal((byte) 0))
                .where(TPhysAssignment.T_PHYS_ASSIGNMENT.USER_ID.eq(userId))
                .groupBy(TPhysAssignment.T_PHYS_ASSIGNMENT.COST_CENTER).asTable("A");
        list = create.selectDistinct(TPhysAssignment.T_PHYS_ASSIGNMENT.COST_CENTER, Factory.nvl(queryTotal.getField("totalCount"), 0).as("totalCount"))
                .from(TPhysAssignment.T_PHYS_ASSIGNMENT)
                .leftOuterJoin(queryTotal).on(TPhysAssignment.T_PHYS_ASSIGNMENT.COST_CENTER.eq(queryTotal.getField(TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER)))
                .where(TPhysAssignment.T_PHYS_ASSIGNMENT.USER_ID.eq(userId))
                .groupBy(TPhysAssignment.T_PHYS_ASSIGNMENT.COST_CENTER)
                .orderBy(TPhysAssignment.T_PHYS_ASSIGNMENT.COST_CENTER).fetchInto(CostCenterResult.class);

        return list;
    }

    public List<CostCenterResult> getAllCostceneterReportingUser(String userId) {

        List<CostCenterResult> list = new ArrayList<CostCenterResult>(0);
        Table queryTotal = create.select(TPhysAssignment.T_PHYS_ASSIGNMENT.COST_CENTER, Factory.countDistinct(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID, TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID).as("totalCount"))
                .from(TPhysAssignment.T_PHYS_ASSIGNMENT)
                .join(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT).on(TPhysAssignment.T_PHYS_ASSIGNMENT.HOSPITAL_ID.eq(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT.HOSPITAL_ID))
                .join(TPhysPredictions.T_PHYS_PREDICTIONS).on(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(TPhysAssignment.T_PHYS_ASSIGNMENT.HOSPITAL_ID),
                TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER.equal(TPhysAssignment.T_PHYS_ASSIGNMENT.COST_CENTER), TPhysPredictions.T_PHYS_PREDICTIONS.SOURCE.equal(TPhysAssignment.T_PHYS_ASSIGNMENT.SOURCE), TPhysAssignment.T_PHYS_ASSIGNMENT.USER_ID.eq(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID), TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.eq(DbConstants.YES_VALUE), TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.isNull(), TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID.isNotNull(), TPhysPredictions.T_PHYS_PREDICTIONS.EV_SCORE.isNotNull(), TPhysPredictions.T_PHYS_PREDICTIONS.FOUND.equal((byte) 0))
                .where(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT.USER_ID.eq(userId))
                .groupBy(TPhysAssignment.T_PHYS_ASSIGNMENT.COST_CENTER).asTable("A");
        list = create.selectDistinct(TPhysAssignment.T_PHYS_ASSIGNMENT.COST_CENTER, Factory.nvl(queryTotal.getField("totalCount"), 0).as("totalCount"))
                .from(TPhysAssignment.T_PHYS_ASSIGNMENT)
                .join(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT).on(TPhysAssignment.T_PHYS_ASSIGNMENT.HOSPITAL_ID.eq(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT.HOSPITAL_ID))
                .leftOuterJoin(queryTotal).on(TPhysAssignment.T_PHYS_ASSIGNMENT.COST_CENTER.eq(queryTotal.getField(TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER)))
                .where(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT.USER_ID.eq(userId))
                .groupBy(TPhysAssignment.T_PHYS_ASSIGNMENT.COST_CENTER)
                .orderBy(TPhysAssignment.T_PHYS_ASSIGNMENT.COST_CENTER).fetchInto(CostCenterResult.class);

        return list;
    }

    public List<String> getAllCostCenter() {
        return create.selectDistinct(TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING.COSTCENTER).from(TCostcenterRuleMapping.T_COSTCENTER_RULE_MAPPING).orderBy(1)
                .fetch("COSTCENTER", String.class);

    }

}
