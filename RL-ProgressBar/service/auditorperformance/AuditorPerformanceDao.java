package com.operasolutions.rl.service.auditorperformance;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

import org.jooq.FactoryOperations;
import org.jooq.Record;
import org.jooq.Result;
import org.jooq.impl.Factory;

import com.google.inject.Inject;
import com.operasolutions.rl.schema.tables.TPhysReportingAssignment;
import com.operasolutions.rl.schema.tables.TPhysSnapshotReport;
import com.operasolutions.rl.schema.tables.TUser;

/**
 * AuditorPerformanceDao
 *
 * @author Jatin Suri
 */
public class AuditorPerformanceDao {

    private final FactoryOperations create;

    @Inject
    public AuditorPerformanceDao(FactoryOperations jooqFactory) {
        this.create = jooqFactory;
    }

    /**
     * Comparison data for preBill
     *
     * @param startDate
     * @param endDate
     * @param reportingUserId
     * @param costCenterList
     * @return List<AuditorComparisonResult>
     */
    public List<AuditorComparisonResult> getAuditorComparisonData(Date startDate, Date endDate, String reportingUserId, List<String> costCenterList) {
        if (startDate == null) {
            throw new IllegalArgumentException("Input parameter 'startDate' cannot be null.");
        }
        if (endDate == null) {
            throw new IllegalArgumentException("Input parameter 'endDate' cannot be null.");
        }

        List<AuditorComparisonResult> resultOut = new ArrayList<AuditorComparisonResult>();

        Result<Record> result = null;

        if (reportingUserId == null) {
            result = create.select(
                    TUser.T_USER.F_NAME.as("fName"),
                    TUser.T_USER.L_NAME.as("lName"),
                    TUser.T_USER.USER_ID.as("userId"),
                    Factory.countDistinct(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER).as("totalCostCenter"),
                    Factory.sum(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.REVIEWED_CT).as("reviewedAccount"),
                    Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_CT, 0)).as("hitAccount"),
                    Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_VALUE, new BigDecimal(0))).as("hitValue"))
                    .from(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT)
                    .join(TUser.T_USER).on(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.AUDITOR_ID.equal(TUser.T_USER.USER_ID))
                    .where(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PRED_DATE.between(startDate, endDate), TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER.in(costCenterList))
                    .groupBy(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.AUDITOR_ID)
                    .orderBy(TUser.T_USER.F_NAME.as("fName"), TUser.T_USER.USER_ID.as("userId"))
                    .fetch();
        } else {
            result = create.select(
                    TUser.T_USER.F_NAME.as("fName"),
                    TUser.T_USER.L_NAME.as("lName"),
                    TUser.T_USER.USER_ID.as("userId"),
                    Factory.countDistinct(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER).as("totalCostCenter"),
                    Factory.sum(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.REVIEWED_CT).as("reviewedAccount"),
                    Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_CT, 0)).as("hitAccount"),
                    Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_VALUE, new BigDecimal(0))).as("hitValue"))
                    .from(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT)
                    .join(TUser.T_USER).on(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.AUDITOR_ID.equal(TUser.T_USER.USER_ID))
                    .where(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PRED_DATE.between(startDate, endDate), TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER.in(costCenterList))
                    .and(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HOSPITAL_ID.in(create.select(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT.HOSPITAL_ID).from(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT).where(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT.USER_ID.equal(reportingUserId))))
                    .groupBy(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.AUDITOR_ID)
                    .orderBy(TUser.T_USER.F_NAME.as("fName"), TUser.T_USER.USER_ID.as("userId"))
                    .fetch();
        }

        if (result != null) {
            resultOut = result.into(AuditorComparisonResult.class);
        }
        return resultOut;
    }

    /**
     * Trend data for preBill
     *
     * @param startDate
     * @param endDate
     * @param auditorId
     * @param reportingUserId
     * @param costCenterList
     * @return List<AuditorTrendResult>
     */
    public List<AuditorTrendResult> getAuditorTrendData(Date startDate, Date endDate, String auditorId, String reportingUserId, List<String> costCenterList) {
        if (startDate == null) {
            throw new IllegalArgumentException("Input parameter 'startDate' cannot be null.");
        }
        if (endDate == null) {
            throw new IllegalArgumentException("Input parameter 'endDate' cannot be null.");
        }
        if (auditorId == null || auditorId.isEmpty()) {
            throw new IllegalArgumentException("Input parameter 'auditorId' cannot be null or empty.");
        }
        Result<Record> result = null;

        if (reportingUserId == null) {
            result = create.select(
                    TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PRED_DATE.as("date"), TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER,
                    Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.TOTAL_ACCT, 0)).as("totalCount"),
                    Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.REVIEWED_CT, 0)).as("reviewedCount"),
                    Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_CT, 0)).as("hitCount"),
                    Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_VALUE, new BigDecimal(0))).as("hitValue")
            )
                    .from(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT)
                    .where(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PRED_DATE.between(startDate, endDate), TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER.in(costCenterList))
                    .and(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.AUDITOR_ID.equal(auditorId))
                    .groupBy(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PRED_DATE, TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER)
                    .orderBy(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PRED_DATE)
                    .fetch();
        } else {
            result = create.select(
                    TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PRED_DATE.as("date"), TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER,
                    Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.TOTAL_ACCT, 0)).as("totalCount"),
                    Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.REVIEWED_CT, 0)).as("reviewedCount"),
                    Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_CT, 0)).as("hitCount"),
                    Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_VALUE, new BigDecimal(0))).as("hitValue")
            )
                    .from(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT)
                    .where(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PRED_DATE.between(startDate, endDate), TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER.in(costCenterList))
                    .and(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.AUDITOR_ID.equal(auditorId))
                    .and(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HOSPITAL_ID.in(create.select(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT.HOSPITAL_ID).from(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT).where(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT.USER_ID.equal(reportingUserId))))
                    .groupBy(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PRED_DATE, TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER)
                    .orderBy(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PRED_DATE)
                    .fetch();
        }

        return result.into(AuditorTrendResult.class);
    }

    /**
     * Trend data for preBill
     *
     * @param startDate
     * @param endDate
     * @param auditorId
     * @param reportingUserId
     * @param costCenterList
     * @return List<AuditorTrendResult>
     */
    public List<String> getCostCenter(Date startDate, Date endDate, String auditorId, String reportingUserId, List<String> costCenterList) {
        if (startDate == null) {
            throw new IllegalArgumentException("Input parameter 'startDate' cannot be null.");
        }
        if (endDate == null) {
            throw new IllegalArgumentException("Input parameter 'endDate' cannot be null.");
        }
        if (auditorId == null || auditorId.isEmpty()) {
            throw new IllegalArgumentException("Input parameter 'auditorId' cannot be null or empty.");
        }

        if (reportingUserId == null) {
            return create.selectDistinct(
                    TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER)
                    .from(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT)
                    .where(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PRED_DATE.between(startDate, endDate), TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER.in(costCenterList))
                    .and(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.AUDITOR_ID.equal(auditorId)).and(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_VALUE.greaterThan(BigDecimal.ZERO))
                    .fetch("COST_CENTER", String.class);
        } else {
            return create.selectDistinct(
                    TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER)
                    .from(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT)
                    .where(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PRED_DATE.between(startDate, endDate), TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER.in(costCenterList))
                    .and(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.AUDITOR_ID.equal(auditorId)).and(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_VALUE.greaterThan(BigDecimal.ZERO))
                    .and(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HOSPITAL_ID.in(create.select(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT.HOSPITAL_ID).from(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT).where(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT.USER_ID.equal(reportingUserId))))
                    .fetch("COST_CENTER", String.class);
        }
    }

}
