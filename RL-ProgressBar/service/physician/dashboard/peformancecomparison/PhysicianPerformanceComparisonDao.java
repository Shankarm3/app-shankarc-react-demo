package com.operasolutions.rl.service.physician.dashboard.peformancecomparison;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

import org.jooq.FactoryOperations;
import org.jooq.JoinType;
import org.jooq.Record;
import org.jooq.Result;
import org.jooq.SelectQuery;
import org.jooq.impl.Factory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.inject.Inject;
import com.operasolutions.rl.common.DbConstants;
import com.operasolutions.rl.schema.enums.TUserRole;
import com.operasolutions.rl.schema.tables.TDivisionHospital;
import com.operasolutions.rl.schema.tables.THospital;
import com.operasolutions.rl.schema.tables.TPhysConfigReports;
import com.operasolutions.rl.schema.tables.TPhysSnapshotReport;
import com.operasolutions.rl.schema.tables.TUser;
import com.operasolutions.rl.schema.tables.records.TPhysConfigReportsRecord;
import org.apache.shiro.SecurityUtils;

/**
 * PhysicianPerformanceComparisonDao
 *
 * @author Nirmal Kumar
 */
public class PhysicianPerformanceComparisonDao {

    protected final FactoryOperations create;
    protected static final Logger log = LoggerFactory.getLogger(PhysicianPerformanceComparisonDao.class);

    @Inject
    public PhysicianPerformanceComparisonDao(FactoryOperations jooqFactory) {
        this.create = jooqFactory;
    }

    /**
     * List view data for preBill
     *
     * @param startDate
     * @param endDate
     * @param hospitalList
     * @param deptList
     * @return List<ListViewResult>
     */
    public List<ListViewResult> getListViewData(Date startDate, Date endDate, List<String> hospitalList, List<String> deptList) {
        if (startDate == null) {
            throw new IllegalArgumentException("Input parameter 'startDate' cannot be null.");
        }
        if (endDate == null) {
            throw new IllegalArgumentException("Input parameter 'endDate' cannot be null.");
        }

        Result<Record> results = create.select(
                TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HOSPITAL_ID.as("hospitalId"),
                THospital.T_HOSPITAL.HOSPITAL_NAME.as("hospitalName"),
                THospital.T_HOSPITAL.SHORT_NAME.as("hospitalShortName"),
                TUser.T_USER.L_NAME.as("lName"),
                TUser.T_USER.F_NAME.as("fName"),
                TUser.T_USER.USER_ID.as("userId"),
                Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.TOTAL_ACCT, 0)).as("totalAccounts"),
                Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.REVIEWED_CT, 0)).as("reviewedCount"),
                Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_CT, 0)).as("hitCount"),
                Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_VALUE, new BigDecimal(0))).as("hitValue"),
                Factory.nvl(Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.REVIEWED_CT, 0)).mul(100).div(Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.TOTAL_ACCT, 0))), new BigDecimal(0)).as("reviewRate"),
                Factory.nvl(Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_CT, 0)).mul(100).div(Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.REVIEWED_CT, 0))), new BigDecimal(0)).as("hitRate")
        )
                .from(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT)
                .join(THospital.T_HOSPITAL).on(THospital.T_HOSPITAL.HOSPITAL_ID.equal(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HOSPITAL_ID))
                .join(TUser.T_USER).on(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.AUDITOR_ID.equal(TUser.T_USER.USER_ID))
                .where(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PRED_DATE.between(startDate, endDate))
                .and(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HOSPITAL_ID.in(hospitalList))
                .and(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER.in(deptList))
                .and(TUser.T_USER.U_TYPE.equal(TUserRole.PHYSICIAN_AUDITOR))
                .groupBy(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HOSPITAL_ID.as("hospitalId"), THospital.T_HOSPITAL.HOSPITAL_NAME.as("hospitalName"), TUser.T_USER.USER_ID.as("userId"))
                .orderBy(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HOSPITAL_ID.as("hospitalId"), TUser.T_USER.USER_ID.as("userId"))
                .fetch();

        return results.into(ListViewResult.class);

    }

    /**
     * Chart view data for preBill, results are order only for
     * MetricType.HIT_RATE
     *
     * @param startDate
     * @param endDate
     * @param startDateYTD
     * @param endDateYTD
     * @param hospitalList
     * @param chartType
     * @return List<ChartViewResult>
     */
    public List<ChartViewResult> getChartViewData(Date startDate, Date endDate, Date startDateYTD, Date endDateYTD, List<String> hospitalList, ChartType chartType, List<String> costCenterList) {
        if (startDate == null) {
            throw new IllegalArgumentException("Input parameter 'startDate' cannot be null.");
        }
        if (endDate == null) {
            throw new IllegalArgumentException("Input parameter 'endDate' cannot be null.");
        }
        if (startDateYTD == null) {
            throw new IllegalArgumentException("Input parameter 'startDateYTD' cannot be null.");
        }
        if (endDateYTD == null) {
            throw new IllegalArgumentException("Input parameter 'endDateYTD' cannot be null.");
        }
        if (hospitalList == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalList' cannot be null.");
        }
        if (chartType == null) {
            throw new IllegalArgumentException("Input parameter 'chartType' cannot be null.");
        }

        log.debug("the YTD dates are :" + startDateYTD + ":" + endDateYTD);
        List<ChartViewResult> result = new ArrayList<ChartViewResult>();

        SelectQuery query = create.selectQuery();
        query.addSelect(
                THospital.T_HOSPITAL.HOSPITAL_NAME.as("hospitalName"),
                THospital.T_HOSPITAL.SHORT_NAME.as("hospitalShortName"),
                TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER,
                TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HOSPITAL_ID.as("hospitalId"),
                Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.TOTAL_ACCT, 0)).as("totalAccounts"),
                Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.REVIEWED_CT, 0)).as("reviewedCount"),
                Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_CT, 0)).as("hitCount"),
                Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_VALUE, new BigDecimal(0))).as("hitValue"),
                Factory.nvl(Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.REVIEWED_CT, 0)).mul(100).div(Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.TOTAL_ACCT, 0))), new BigDecimal(0)).as("reviewRate"),
                Factory.nvl(Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_CT, 0)).mul(100).div(Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.REVIEWED_CT, 0))), new BigDecimal(0)).as("hitRate")
        );

        query.addFrom(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT);
        query.addJoin(THospital.T_HOSPITAL, THospital.T_HOSPITAL.HOSPITAL_ID.equal(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HOSPITAL_ID));
        query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PRED_DATE.between(startDate, endDate));
        query.addGroupBy(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER, THospital.T_HOSPITAL.HOSPITAL_NAME.as("hospitalName"));

        if (!hospitalList.isEmpty()) {
            query.addConditions(THospital.T_HOSPITAL.HOSPITAL_ID.in(hospitalList));
        }
        if (!costCenterList.isEmpty()) {
            query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER.in(costCenterList));
        }
        if (chartType == ChartType.HEATMAP) {
            SelectQuery queryYTD = create.selectQuery();
            queryYTD.addSelect(
                    THospital.T_HOSPITAL.HOSPITAL_NAME.as("hospitalName"),
                    THospital.T_HOSPITAL.SHORT_NAME.as("hospitalShortName"),
                    TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER,
                    TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HOSPITAL_ID.as("hospitalIdYTD"),
                    Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.TOTAL_ACCT, 0)).as("totalAccounts"),
                    Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.REVIEWED_CT, 0)).as("reviewedCount"),
                    Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_CT, 0)).as("hitCount"),
                    Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_VALUE, new BigDecimal(0))).as("hitValue"),
                    Factory.nvl(Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.REVIEWED_CT, 0)).mul(100).div(Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.TOTAL_ACCT, 0))), new BigDecimal(0)).as("reviewRate"),
                    Factory.nvl(Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_CT, 0)).mul(100).div(Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.REVIEWED_CT, 0))), new BigDecimal(0)).as("hitRate")
            );
            queryYTD.addFrom(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT);
            queryYTD.addJoin(THospital.T_HOSPITAL, THospital.T_HOSPITAL.HOSPITAL_ID.equal(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HOSPITAL_ID));
            queryYTD.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PRED_DATE.between(startDateYTD, endDateYTD));
            queryYTD.addGroupBy(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER, THospital.T_HOSPITAL.HOSPITAL_NAME.as("hospitalName"));

            if (!hospitalList.isEmpty()) {
                queryYTD.addConditions(THospital.T_HOSPITAL.HOSPITAL_ID.in(hospitalList));
            }
            if (!costCenterList.isEmpty()) {
                queryYTD.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER.in(costCenterList));
            }
            SelectQuery queryResult = create.selectQuery();
            queryResult.addSelect(query.getField("hospitalName").as("hospitalName"), query.getField("hospitalShortName").as("hospitalShortName"), query.getField("hospitalId").as("hospitalId"),
                    query.getField(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER), query.getField("totalAccounts").as("totalAccounts"), query.getField("reviewedCount").as("reviewedCount"),
                    query.getField("hitValue").as("hitValue"),query.getField("hitCount").as("hitCount"), query.getField("reviewRate").as("reviewRate"), Factory.nvl(query.getField("hitRate"), new BigDecimal(0)).as("hitRate"),
                    Factory.nvl(queryYTD.getField("hitValue"), new BigDecimal(0)).as("hitValueYTD"), Factory.nvl(queryYTD.getField("reviewRate"), new BigDecimal(0)).as("reviewRateYTD"),
                    Factory.nvl(queryYTD.getField("hitRate"), new BigDecimal(0)).as("hitRateYTD"), Factory.nvl(queryYTD.getField("totalAccounts"), new Integer(0)).as("totalAccountsYTD"),
                    Factory.nvl(queryYTD.getField("reviewedCount"), new Integer(0)).as("reviewedCountYTD"));

            queryResult.addFrom(query);
            queryResult.addJoin(queryYTD, JoinType.LEFT_OUTER_JOIN, query.getField("hospitalId").cast(String.class).equal(queryYTD.getField("hospitalIdYTD").cast(String.class)));
            queryResult.addGroupBy(query.getField(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER), query.getField("hospitalName"));

            result = queryResult.fetch().into(ChartViewResult.class);
        } else if (chartType == ChartType.DONUT) {
            result = query.fetch().into(ChartViewResult.class);
        }
        return result;

    }

    /**
     * Chart view data for preBill, results are order only for
     * MetricType.HIT_RATE
     *
     * @param startDate
     * @param endDate
     * @param startDateYTD
     * @param endDateYTD
     * @param hospitalList
     * @param chartType
     * @param costCenterList
     * @return List<ChartViewResult>
     */
    public List<ChartViewResult> getChartViewConfig(Date startDate, Date endDate, Date startDateYTD, Date endDateYTD, List<String> hospitalList, ChartType chartType, List<String> costCenterList) {
        if (startDate == null) {
            throw new IllegalArgumentException("Input parameter 'startDate' cannot be null.");
        }
        if (endDate == null) {
            throw new IllegalArgumentException("Input parameter 'endDate' cannot be null.");
        }
        if (startDateYTD == null) {
            throw new IllegalArgumentException("Input parameter 'startDateYTD' cannot be null.");
        }
        if (endDateYTD == null) {
            throw new IllegalArgumentException("Input parameter 'endDateYTD' cannot be null.");
        }
        if (hospitalList == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalList' cannot be null.");
        }
        if (chartType == null) {
            throw new IllegalArgumentException("Input parameter 'chartType' cannot be null.");
        }

        log.debug("the YTD dates are :" + startDateYTD + ":" + endDateYTD);
        List<ChartViewResult> result = new ArrayList<ChartViewResult>();
        TPhysConfigReportsRecord record = getQueryDetail(DbConstants.PHYS_PERF_COPM_CHART);
        if (record == null) {
            return getChartViewData(startDate, endDate, startDateYTD, endDateYTD, hospitalList, chartType, costCenterList);
        }
        String fieldArray[] = record.getSelectQuery().split("#");
        SelectQuery query = create.selectQuery();
        // filterQry.setDistinct(true);
        for (String fieldArray1 : fieldArray) {
            String[] arry = fieldArray1.split(" as ");
            if (arry.length == 2) {
                query.addSelect(Factory.field(arry[0]).as(arry[1].trim()));
            }
        }
        String fromQuery = record.getFromQuery();
        query.addFrom(Factory.table(fromQuery));
        query.addGroupBy(Factory.field(record.getGroupBy()));
        if (record.getOrderBy() != null) {
            query.addOrderBy(Factory.field(record.getOrderBy()));
        }
        query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PRED_DATE.between(startDate, endDate));
        if (!hospitalList.isEmpty()) {
            query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HOSPITAL_ID.in(hospitalList));
        }
        if (!costCenterList.isEmpty()) {
            query.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER.in(costCenterList));
        }
        if (chartType == ChartType.HEATMAP) {
            query.addGroupBy(Factory.field("divisionName, hospitalName"));
            SelectQuery queryYTD = create.selectQuery();
            queryYTD.addSelect(
                    TDivisionHospital.T_DIVISION_HOSPITAL.HOSPITAL_NAME.as("hospitalName"),
                    TDivisionHospital.T_DIVISION_HOSPITAL.SHORT_NAME.as("hospitalShortName"),
                    TDivisionHospital.T_DIVISION_HOSPITAL.DIVISION_NAME.as("divisionName"),
                    TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HOSPITAL_ID.as("hospitalIdYTD"),
                    Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.TOTAL_ACCT, 0)).as("totalAccounts"),
                    Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_CT, 0)).as("hitCount"),
                    Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.REVIEWED_CT, 0)).as("reviewedCount"),
                    Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_VALUE, new BigDecimal(0))).as("hitValue"),
                    Factory.nvl(Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.REVIEWED_CT, 0)).mul(100).div(Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.TOTAL_ACCT, 0))), new BigDecimal(0)).as("reviewRate"),
                    Factory.nvl(Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HIT_CT, 0)).mul(100).div(Factory.sum(Factory.nvl(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.REVIEWED_CT, 0))), new BigDecimal(0)).as("hitRate")
            );

            queryYTD.addFrom(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT);
            queryYTD.addJoin(TDivisionHospital.T_DIVISION_HOSPITAL, TDivisionHospital.T_DIVISION_HOSPITAL.HOSPITAL_ID.equal(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HOSPITAL_ID));
            queryYTD.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.PRED_DATE.between(startDateYTD, endDateYTD));
            queryYTD.addConditions(TDivisionHospital.T_DIVISION_HOSPITAL.DIVISION_NAME.notEqual(DbConstants.DIVISION_NAME_OTHER));
            queryYTD.addGroupBy(TDivisionHospital.T_DIVISION_HOSPITAL.DIVISION_NAME.as("divisionName"), TDivisionHospital.T_DIVISION_HOSPITAL.HOSPITAL_NAME.as("hospitalName"));

            if (!hospitalList.isEmpty()) {
                queryYTD.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.HOSPITAL_ID.in(hospitalList));
            }
            if (!costCenterList.isEmpty()) {
                queryYTD.addConditions(TPhysSnapshotReport.T_PHYS_SNAPSHOT_REPORT.COST_CENTER.in(costCenterList));
            }

            SelectQuery queryResult = create.selectQuery();
            queryResult.addSelect(query.getField("hospitalName").as("hospitalName"), query.getField("hospitalShortName").as("hospitalShortName"), query.getField("hospitalId").as("hospitalId"),
                    query.getField("divisionName").as("divisionName"), query.getField("totalAccounts").as("totalAccounts"), query.getField("reviewedCount").as("reviewedCount"),
                    query.getField("hitValue").as("hitValue"), query.getField("hitCount").as("hitCount"), query.getField("reviewRate").as("reviewRate"), Factory.nvl(query.getField("hitRate"), new BigDecimal(0)).as("hitRate"),
                    Factory.nvl(queryYTD.getField("hitValue"), new BigDecimal(0)).as("hitValueYTD"), Factory.nvl(queryYTD.getField("reviewRate"), new BigDecimal(0)).as("reviewRateYTD"),
                    Factory.nvl(queryYTD.getField("hitRate"), new BigDecimal(0)).as("hitRateYTD"), Factory.nvl(queryYTD.getField("totalAccounts"), new Integer(0)).as("totalAccountsYTD"),
                    Factory.nvl(queryYTD.getField("reviewedCount"), new Integer(0)).as("reviewedCountYTD"));

            queryResult.addFrom(query);
            queryResult.addJoin(queryYTD, JoinType.LEFT_OUTER_JOIN, query.getField("hospitalId").cast(String.class).equal(queryYTD.getField("hospitalIdYTD").cast(String.class)));
            queryResult.addGroupBy(query.getField("divisionName"), query.getField("hospitalName"));

            result = queryResult.fetch().into(ChartViewResult.class);
        } else if (chartType == ChartType.DONUT) {
            result = query.fetch().into(ChartViewResult.class);
        }
        return result;

    }

    public TPhysConfigReportsRecord getQueryDetail(String reportType) {
        String currentRoleId = "";
        if (SecurityUtils.getSubject().hasRole(TUserRole.PHYSICIAN_ADMIN.getUType())) {
            currentRoleId = TUserRole.PHYSICIAN_ADMIN.getUType();
        } else if (SecurityUtils.getSubject().hasRole(TUserRole.PHYSICIAN_SUPERVISOR.getUType())) {
            currentRoleId = TUserRole.PHYSICIAN_SUPERVISOR.getUType();
        } else if (SecurityUtils.getSubject().hasRole(TUserRole.PHYSICIAN_AUDITOR.getUType())) {
            currentRoleId = TUserRole.PHYSICIAN_AUDITOR.getUType();
        }
        return create.selectFrom(TPhysConfigReports.T_PHYS_CONFIG_REPORTS)
                .where(TPhysConfigReports.T_PHYS_CONFIG_REPORTS.REPORT_TYPE.eq(reportType)
                        .and(TPhysConfigReports.T_PHYS_CONFIG_REPORTS.USER_ROLE.eq(currentRoleId)))
                .fetchOne();
    }

}
