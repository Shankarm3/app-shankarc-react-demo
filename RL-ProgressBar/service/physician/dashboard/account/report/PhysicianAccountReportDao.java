package com.operasolutions.rl.service.physician.dashboard.account.report;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.List;

import org.jooq.FactoryOperations;
import org.jooq.SelectQuery;
import org.jooq.impl.Factory;

import com.google.inject.Inject;
import com.operasolutions.rl.common.DbConstants;
import com.operasolutions.rl.schema.tables.TPhysSnapshotReport;
import com.operasolutions.rl.service.physician.dashboard.account.report.PhysicianAccountReportResource.SummaryDataResult;
import org.jooq.Record;

/**
 * PhysicianAccountReportDao
 *
 * @author Nirmal Kumar
 */
public class PhysicianAccountReportDao {

    private final FactoryOperations create;

    @Inject
    public PhysicianAccountReportDao(FactoryOperations jooqFactory) {
        this.create = jooqFactory;
    }

    /**
     * Data for summary chart - preBill
     *
     * @param startDate
     * @param endDate
     * @param hospitalIds
     * @param userId
     * @param isAuditor
     * @param deptList
     * @return SummaryDataResult
     */
    public SummaryDataResult getSummaryChartData(Date startDate, Date endDate, List<String> hospitalIds, String userId, Boolean isAuditor, List<String> deptList) {
        // hospitalIds, userId and isAuditor is optional
        if (startDate == null) {
            throw new IllegalArgumentException("Input parameter 'startDate' cannot be null.");
        }
        if (endDate == null) {
            throw new IllegalArgumentException("Input parameter 'endDate' cannot be null.");
        }

        SelectQuery select = create.selectQuery();
        select.addSelect(
                Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.TOTAL_ACCT, 0)).as("totalAccounts"),
                Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.REVIEWED_CT, 0)).as("reviewedCount"),
                Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_CT, 0)).as("hitsCount"),
                Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.REVIEWED_CT, 0)).mul(100).div(Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.TOTAL_ACCT, 0))).as("reviewRate"),
                Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_CT, 0)).mul(100).div(Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.REVIEWED_CT, 0))).as("hitRate"),
                Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_VALUE, new BigDecimal(0))).as("hitValue")
        );
        select.addFrom(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT);
        select.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PRED_DATE.between(startDate, endDate));
        if (deptList != null && !deptList.isEmpty()) {
            select.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER.in(deptList));
        }
        if (hospitalIds != null && !hospitalIds.isEmpty()) {
            select.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HOSPITAL_ID.in(hospitalIds));
        }
        if (userId != null && !userId.isEmpty()) {
            select.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.AUDITOR_ID.equal(userId));
        }
        if (isAuditor != null && isAuditor == false) {
            select.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.AUDITOR_ID.isNotNull());
        }

        return select.fetchOne().into(SummaryDataResult.class);
    }

}
