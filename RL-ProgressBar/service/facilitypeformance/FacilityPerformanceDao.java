package com.operasolutions.rl.service.facilitypeformance;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.List;

import org.jooq.FactoryOperations;
import org.jooq.JoinType;
import org.jooq.SelectQuery;
import org.jooq.impl.Factory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.inject.Inject;
import com.operasolutions.rl.schema.tables.THospital;
import com.operasolutions.rl.schema.tables.TPhysSnapshotReport;
import org.jooq.Comparator;

/**
 * FacilityPerformanceDao
 *
 * @author Marcel Bodnar
 * @author Jatin Suri
 */
public class FacilityPerformanceDao {

    private final FactoryOperations create;
    protected static final Logger log = LoggerFactory.getLogger(FacilityPerformanceDao.class);

    @Inject
    public FacilityPerformanceDao(FactoryOperations jooqFactory) {
        this.create = jooqFactory;
    }

    /**
     * Adds order by clause
     *
     * @param query
     * @param groupType
     */
    protected void addOrderByClause(SelectQuery query, FacilityPerformanceGroupType groupType) {
        if (query == null) {
            throw new IllegalArgumentException("Input parameter 'query' cannot be null.");
        }
        if (groupType == null) {
            throw new IllegalArgumentException("Input parameter 'groupType' cannot be null.");
        }

        switch (groupType) {
            case COST_CENTER:
                query.addOrderBy(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_VALUE.as("hitValue").desc());
                break;
            case COST_CENTER_PROC_CODE:
                query.addOrderBy(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER.as("groupType").desc(), TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_VALUE.as("hitValue").desc());
                break;
            case DEPT:
                query.addOrderBy(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_VALUE.as("hitValue").desc());
                break;
            case DEPT_PROC:
                query.addOrderBy(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.DEPT_DESC.as("groupType").desc(), TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_VALUE.as("hitValue").desc());
                break;
            case REGION:
                query.addOrderBy(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_VALUE.as("hitValue").desc());
                break;
            case REGION_NPI:
                query.addOrderBy(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.DIVISION_NAME.as("groupType").desc(), TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_VALUE.as("hitValue").desc());
                break;
            case NPI:
                query.addOrderBy(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_VALUE.as("hitValue").desc());
                break;
            case NPI_PROC_CODE:
                query.addOrderBy(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.NPI_DESC.as("groupType").desc(), TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_VALUE.as("hitValue").desc());
                break;
            default:
                break;
        }

    }

    /**
     * Adds group clause
     *
     * @param query
     * @param groupType
     */
    protected void addGroupByClause(SelectQuery query, FacilityPerformanceGroupType groupType) {
        if (query == null) {
            throw new IllegalArgumentException("Input parameter 'query' cannot be null.");
        }
        if (groupType == null) {
            throw new IllegalArgumentException("Input parameter 'groupType' cannot be null.");
        }
        switch (groupType) {
            case COST_CENTER:
                query.addGroupBy(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER.as("groupType"));
                break;
            case COST_CENTER_PROC_CODE:
                query.addGroupBy(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER.as("groupType"), TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PROC_DESC.as("groupDesc"));
                break;
            case DEPT:
                query.addGroupBy(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.DEPT_DESC.as("groupType"));
                break;
            case DEPT_PROC:
                query.addGroupBy(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.DEPT_DESC.as("groupType"), TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PROC_DESC.as("groupDesc"));
                break;
            case REGION:
                query.addGroupBy(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.DIVISION_NAME.as("groupType"));
                break;
            case REGION_NPI:
                query.addGroupBy(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.DIVISION_NAME.as("groupType"), TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.NPI_DESC.as("groupDesc"));
                break;
            case NPI:
                query.addGroupBy(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.NPI_DESC.as("groupType"));
                break;
            case NPI_PROC_CODE:
                query.addGroupBy(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.NPI_DESC.as("groupType"), TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PROC_DESC.as("groupDesc"));
                break;
            default:
                break;
        }

    }

    /**
     * Adds select clause
     *
     * @param query
     * @param groupType
     */
    protected void addSelectClause(SelectQuery query, FacilityPerformanceGroupType groupType) {
        if (query == null) {
            throw new IllegalArgumentException("Input parameter 'query' cannot be null.");
        }
        if (groupType == null) {
            throw new IllegalArgumentException("Input parameter 'groupType' cannot be null.");
        }

        // !!! Do not change order of columns, JOOQ mapping is based on number of parameters and parameters order !!!
        switch (groupType) {
            case COST_CENTER:
                query.addSelect(
                        TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER.as("groupType"),
                        Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_VALUE, new BigDecimal(0))).as("hitValue"),
                        Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_CT, 0)).as("hitCount")
                );
                break;
            case COST_CENTER_PROC_CODE:
                query.addSelect(
                        TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER.as("groupType"),
                        Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_VALUE, new BigDecimal(0))).as("hitValue"),
                        Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_CT, 0)).as("hitCount"),
                        TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PROC_DESC.as("groupDesc"), TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PROC_CODE
                );
                break;
            case DEPT:
                query.addSelect(
                        TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.DEPT_DESC.as("groupType"),
                        Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_VALUE, new BigDecimal(0))).as("hitValue"),
                        Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_CT, 0)).as("hitCount")
                );
                break;
            case DEPT_PROC:
                query.addSelect(
                        TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.DEPT_DESC.as("groupType"),
                        Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_VALUE, new BigDecimal(0))).as("hitValue"),
                        Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_CT, 0)).as("hitCount"),
                        TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PROC_DESC.as("groupDesc"), TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PROC_CODE
                );
                break;
            case REGION:
                query.addSelect(
                        TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.DIVISION_NAME.as("groupType"),
                        Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_VALUE, new BigDecimal(0))).as("hitValue"),
                        Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_CT, 0)).as("hitCount")
                );
                break;
            case REGION_NPI:
                query.addSelect(
                        TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.DIVISION_NAME.as("groupType"),
                        Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_VALUE, new BigDecimal(0))).as("hitValue"),
                        Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_CT, 0)).as("hitCount"),
                        TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.NPI_DESC.as("groupDesc"), TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PROC_CODE
                );
                break;
            case NPI:
                query.addSelect(
                        TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.NPI_DESC.as("groupType"),
                        Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_VALUE, new BigDecimal(0))).as("hitValue"),
                        Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_CT, 0)).as("hitCount")
                );
                break;
            case NPI_PROC_CODE:
                query.addSelect(
                        TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.NPI_DESC.as("groupType"),
                        Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_VALUE, new BigDecimal(0))).as("hitValue"),
                        Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_CT, 0)).as("hitCount"),
                        TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PROC_DESC.as("groupDesc"), TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PROC_CODE
                );
                break;
            default:
                break;
        }

    }

    /**
     * Gets records between dates - month
     *
     * @param startDate
     * @param endDate
     * @param hospitalIds
     * @param groupType
     * @param costCenterList
     * @return List<GridDataResult>
     */
    public List<GridDataResult> getRecordsBetweenDates(Date startDate, Date endDate, List<String> hospitalIds, FacilityPerformanceGroupType groupType, List<String> costCenterList) {
        if (startDate == null) {
            throw new IllegalArgumentException("Input parameter 'startDate' cannot be null.");
        }
        if (endDate == null) {
            throw new IllegalArgumentException("Input parameter 'endDate' cannot be null.");
        }
        if (hospitalIds == null || hospitalIds.isEmpty()) {
            throw new IllegalArgumentException("Input parameter 'hospitalIds' cannot be null or empty list.");
        }
        if (groupType == null) {
            throw new IllegalArgumentException("Input parameter 'groupType' cannot be null.");
        }

        SelectQuery query = create.selectQuery();
        switch (groupType) {
            case COST_CENTER:
                query.addFrom(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT);
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PRED_DATE.between(startDate, endDate));
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HOSPITAL_ID.in(hospitalIds));
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER.in(costCenterList));
                break;
            case COST_CENTER_PROC_CODE:
                query.addFrom(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT);
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PRED_DATE.between(startDate, endDate));
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HOSPITAL_ID.in(hospitalIds));
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER.in(costCenterList));
                break;
            case DEPT:
                query.addFrom(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT);
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PRED_DATE.between(startDate, endDate));
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HOSPITAL_ID.in(hospitalIds));
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER.in(costCenterList));
                break;
            case DEPT_PROC:
                query.addFrom(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT);
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PRED_DATE.between(startDate, endDate));
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HOSPITAL_ID.in(hospitalIds));
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER.in(costCenterList));
                break;
            case REGION:
                query.addFrom(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT);
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PRED_DATE.between(startDate, endDate));
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HOSPITAL_ID.in(hospitalIds));
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER.in(costCenterList));
                break;
            case REGION_NPI:
                query.addFrom(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT);
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PRED_DATE.between(startDate, endDate));
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HOSPITAL_ID.in(hospitalIds));
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER.in(costCenterList));
                query.addJoin(THospital.T_HOSPITAL, JoinType.JOIN, TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HOSPITAL_ID.equal(THospital.T_HOSPITAL.HOSPITAL_ID));
                break;
            case NPI:
                query.addFrom(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT);
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PRED_DATE.between(startDate, endDate));
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HOSPITAL_ID.in(hospitalIds));
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER.in(costCenterList));
                break;
            case NPI_PROC_CODE:
                query.addFrom(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT);
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PRED_DATE.between(startDate, endDate));
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HOSPITAL_ID.in(hospitalIds));
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER.in(costCenterList));
                break;
            default:
                break;
        }
        addSelectClause(query, groupType);
        addGroupByClause(query, groupType);
        query.addHaving(Factory.field("hitValue").compare(Comparator.GREATER, 0));
        return query.fetch().into(GridDataResult.class);
    }

    /**
     * Data for preBill
     *
     * @param startDate
     * @param endDate
     * @param hospitalIds
     * @param groupType
     * @param costCenterList
     * @return List<GridDataResult>
     */
    public List<GridDataResult> getAllData(Date startDate, Date endDate, List<String> hospitalIds, FacilityPerformanceGroupType groupType, List<String> costCenterList) {
        if (startDate == null) {
            throw new IllegalArgumentException("Input parameter 'startDate' cannot be null.");
        }
        if (endDate == null) {
            throw new IllegalArgumentException("Input parameter 'endDate' cannot be null.");
        }
        if (hospitalIds == null || hospitalIds.isEmpty()) {
            throw new IllegalArgumentException("Input parameter 'hospitalIds' cannot be null or empty list.");
        }
        if (groupType == null) {
            throw new IllegalArgumentException("Input parameter 'groupType' cannot be null.");
        }

        // all values
        SelectQuery query = create.selectQuery();
        switch (groupType) {
            case COST_CENTER:
                query.addFrom(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT);
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PRED_DATE.between(startDate, endDate));
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HOSPITAL_ID.in(hospitalIds));
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER.in(costCenterList));
                break;
            case COST_CENTER_PROC_CODE:
                query.addFrom(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT);
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PRED_DATE.between(startDate, endDate));
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HOSPITAL_ID.in(hospitalIds));
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER.in(costCenterList));
                break;
            case DEPT:
                query.addFrom(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT);
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PRED_DATE.between(startDate, endDate));
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HOSPITAL_ID.in(hospitalIds));
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER.in(costCenterList));
                break;
            case DEPT_PROC:
                query.addFrom(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT);
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PRED_DATE.between(startDate, endDate));
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HOSPITAL_ID.in(hospitalIds));
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER.in(costCenterList));
                break;
            case REGION:
                query.addFrom(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT);
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PRED_DATE.between(startDate, endDate));
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HOSPITAL_ID.in(hospitalIds));
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER.in(costCenterList));
                break;
            case REGION_NPI:
                query.addFrom(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT);
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PRED_DATE.between(startDate, endDate));
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HOSPITAL_ID.in(hospitalIds));
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER.in(costCenterList));
                query.addJoin(THospital.T_HOSPITAL, JoinType.JOIN, TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HOSPITAL_ID.equal(THospital.T_HOSPITAL.HOSPITAL_ID));
                break;
            case NPI:
                query.addFrom(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT);
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PRED_DATE.between(startDate, endDate));
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HOSPITAL_ID.in(hospitalIds));
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER.in(costCenterList));
                break;
            case NPI_PROC_CODE:
                query.addFrom(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT);
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PRED_DATE.between(startDate, endDate));
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HOSPITAL_ID.in(hospitalIds));
                query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER.in(costCenterList));
                break;
            default:
                break;
        }

        addSelectClause(query, groupType);
        addGroupByClause(query, groupType);
        addOrderByClause(query, groupType);
        query.addHaving(Factory.field("hitValue").compare(Comparator.GREATER, 0));
        return query.fetch().into(GridDataResult.class);
    }

}
