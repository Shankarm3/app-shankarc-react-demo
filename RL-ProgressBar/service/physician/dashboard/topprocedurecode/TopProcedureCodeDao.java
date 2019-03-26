package com.operasolutions.rl.service.physician.dashboard.topprocedurecode;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

import org.jooq.FactoryOperations;
import org.jooq.SelectQuery;
import org.jooq.impl.Factory;

import com.google.inject.Inject;
import com.operasolutions.rl.schema.tables.TPhysSnapshotCharge;
import com.operasolutions.rl.service.physician.dashboard.topprocedurecode.TopProcedureCodeResource.TopProcedureCodeResult;

/**
 * TopProcedureCodeDao
 *
 * @author Nirmal Kumar
 */
public class TopProcedureCodeDao {

    private final FactoryOperations create;

    @Inject
    public TopProcedureCodeDao(FactoryOperations jooqFactory) {
        this.create = jooqFactory;
    }

    /**
     * Top five charges data
     *
     * @param startDate
     * @param endDate
     * @param hospitalList
     * @param deptList
     * @return List<TSnapshotReportChargeRecord>
     */
    public List<TopProcedureCodeResult> getDashboardTopFiveCharges(Date startDate, Date endDate, List<String> hospitalList, List<String> deptList) {
        if (startDate == null) {
            throw new IllegalArgumentException("Input parameter 'startDate' cannot be null.");
        }
        if (endDate == null) {
            throw new IllegalArgumentException("Input parameter 'endDate' cannot be null.");
        }
        if (hospitalList == null || hospitalList.isEmpty()) {
            throw new IllegalArgumentException("Input parameter 'hospitalList' cannot be null or empty string.");
        }
        List<TopProcedureCodeResult> result = new ArrayList<TopProcedureCodeResult>();
        SelectQuery query = create.selectQuery();
        query.addSelect(Factory.sum(TPhysSnapshotCharge.T_PHYS_SNAPSHOT_CHARGE.HIT_VALUE).as("hitValue"), TPhysSnapshotCharge.T_PHYS_SNAPSHOT_CHARGE.PROCEDURE_CODE,
                TPhysSnapshotCharge.T_PHYS_SNAPSHOT_CHARGE.DESCRIPTION.as("procedureDesc"));
        query.addFrom(TPhysSnapshotCharge.T_PHYS_SNAPSHOT_CHARGE);
        query.addConditions(TPhysSnapshotCharge.T_PHYS_SNAPSHOT_CHARGE.PRED_DATE.between(startDate, endDate));
        query.addConditions(TPhysSnapshotCharge.T_PHYS_SNAPSHOT_CHARGE.HOSPITAL_ID.in(hospitalList));
        query.addConditions(TPhysSnapshotCharge.T_PHYS_SNAPSHOT_CHARGE.DEPT_CODE.in(deptList));
        query.addGroupBy(TPhysSnapshotCharge.T_PHYS_SNAPSHOT_CHARGE.PROCEDURE_CODE);
        query.addGroupBy(TPhysSnapshotCharge.T_PHYS_SNAPSHOT_CHARGE.DESCRIPTION);
        query.addOrderBy(Factory.sum(TPhysSnapshotCharge.T_PHYS_SNAPSHOT_CHARGE.HIT_VALUE).desc());
        query.addLimit(5);
        result = query.fetchInto(TopProcedureCodeResult.class);

        return result;
    }
}
