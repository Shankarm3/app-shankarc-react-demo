package com.operasolutions.rl.service.physician.dashboard.overaltrend;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.List;

import org.jooq.FactoryOperations;
import org.jooq.Record;
import org.jooq.Result;
import org.jooq.impl.Factory;
import com.google.inject.Inject;
import com.operasolutions.rl.schema.tables.TPhysSnapshotReport;

/**
 * PhysicianOveralTrendDao
 *
 * @author Nirmal Kumar
 */
public class PhysicianOveralTrendDao {

    private final FactoryOperations create;

    @Inject
    public PhysicianOveralTrendDao(FactoryOperations jooqFactory) {
        this.create = jooqFactory;
    }

    /**
     * Charts data for preBill
     *
     * @param startDate
     * @param endDate
     * @param hospitalIds
     * @param costCenterList
     * @return List<OveralTrendResult>
     */
    public List<PhysicianOveralTrendResult> getChartDataPreBill(Date startDate, Date endDate, List<String> hospitalIds, List<String> costCenterList) {
        if (startDate == null) {
            throw new IllegalArgumentException("Input parameter 'startDate' cannot be null.");
        }
        if (endDate == null) {
            throw new IllegalArgumentException("Input parameter 'endDate' cannot be null.");
        }
        if (hospitalIds == null || hospitalIds.isEmpty()) {
            throw new IllegalArgumentException("Input parameter 'hospitalIds' cannot be null or empty list.");
        }

        Result<Record> result = create.select(
                TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PRED_DATE.as("date"),
                Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.TOTAL_ACCT, 0)).as("totalCount"),
                Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.REVIEWED_CT, 0)).as("reviewedCount"),
                Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_CT, 0)).as("hitCount"),
                Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_VALUE, new BigDecimal(0))).as("hitValue")
        )
                .from(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT)
                .where(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PRED_DATE.between(startDate, endDate))
                .and(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HOSPITAL_ID.in(hospitalIds))
                .and(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER.in(costCenterList))
                .groupBy(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PRED_DATE)
                .orderBy(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PRED_DATE)
                .fetch();
        return result.into(PhysicianOveralTrendResult.class);

    }
}
