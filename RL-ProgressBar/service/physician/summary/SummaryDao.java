/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.operasolutions.rl.service.physician.summary;

import com.google.inject.Inject;
import com.operasolutions.rl.common.ActivityLogUtils;
import static com.operasolutions.rl.common.ActivityLogUtils.PHYS_AGREE;
import com.operasolutions.rl.common.DbConstants;
import com.operasolutions.rl.common.NumberConstants;
import com.operasolutions.rl.schema.enums.TUserRole;
import com.operasolutions.rl.schema.tables.THospital;
import com.operasolutions.rl.schema.tables.TPhysAssignment;
import com.operasolutions.rl.schema.tables.TPhysAssignmentLog;
import com.operasolutions.rl.schema.tables.TPhysConfigReports;
import com.operasolutions.rl.schema.tables.TPhysPredictions;
import com.operasolutions.rl.schema.tables.TUser;
import com.operasolutions.rl.schema.tables.records.TPhysConfigReportsRecord;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;
import org.apache.shiro.SecurityUtils;
import org.jooq.FactoryOperations;
import org.jooq.Field;
import org.jooq.JoinType;
import org.jooq.Operator;
import org.jooq.SelectQuery;
import org.jooq.Table;
import org.jooq.impl.Factory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author nirmal.kumar
 */
public class SummaryDao {

    protected final FactoryOperations create;
    protected static final Logger log = LoggerFactory.getLogger(SummaryDao.class);

    protected final ActivityLogUtils activityLogUtils;

    @Inject
    public SummaryDao(FactoryOperations jooqFactory, ActivityLogUtils activityLogUtils) {
        this.create = jooqFactory;
        this.activityLogUtils = activityLogUtils;
    }

    public List<ListViewResult> getPhysListViewData(String costCenter) {
        TPhysConfigReportsRecord record = getQueryDetail(DbConstants.PHYS_LIVE_SUMMARY);
        if (record == null) {
            return getListViewDataPreBill(costCenter);
        }
        Timestamp timestamp = activityLogUtils.getCurrentDate();
        String fieldArray[] = record.getSelectQuery().split("#");
        SelectQuery filterQry = create.selectQuery();
        filterQry.setDistinct(true);
        for (String fieldArray1 : fieldArray) {
            String[] arry = fieldArray1.split(" as ");
            if (arry.length == 2) {
                filterQry.addSelect(Factory.field(arry[0]).as(arry[1].trim()));
            }
        }
        String fromQuery = record.getFromQuery();
        if (costCenter.equalsIgnoreCase(DbConstants.OVER_ALL)) {
            fromQuery = fromQuery.replaceAll("#COST_CENTER#", " ");
        } else {
            fromQuery = fromQuery.replaceAll("#COST_CENTER#", " AND T_PHYS_PREDICTIONS.COST_CENTER = '" + costCenter + "'");
        }
        fromQuery = fromQuery.replaceAll("#TIMESTAMP#", timestamp.toString());
        filterQry.addFrom(Factory.table(fromQuery));
        filterQry.addGroupBy(Factory.field(record.getGroupBy()));
        filterQry.addOrderBy(Factory.field(record.getOrderBy()));
        return filterQry.fetchInto(ListViewResult.class);
    }

    /**
     * List view data for preBill
     *
     * @param costCenter
     * @return List<ListViewResult>
     */
    public List<ListViewResult> getListViewDataPreBill(String costCenter) {
        Timestamp timestamp = activityLogUtils.getCurrentDate();
        Table assignment = create.select(TPhysAssignment.T_PHYS_ASSIGNMENT.HOSPITAL_ID, TPhysAssignment.T_PHYS_ASSIGNMENT.USER_ID, TPhysAssignment.T_PHYS_ASSIGNMENT.COST_CENTER).from(TPhysAssignment.T_PHYS_ASSIGNMENT)
                .union(create.select(TPhysAssignmentLog.T_PHYS_ASSIGNMENT_LOG.HOSPITAL_ID, TPhysAssignmentLog.T_PHYS_ASSIGNMENT_LOG.USER_ID, TPhysAssignmentLog.T_PHYS_ASSIGNMENT_LOG.COST_CENTER).from(TPhysAssignmentLog.T_PHYS_ASSIGNMENT_LOG)
                        .where(TPhysAssignmentLog.T_PHYS_ASSIGNMENT_LOG.OPERATION_TYPE.eq(DbConstants.OPERATION_DELETE).and(TPhysAssignmentLog.T_PHYS_ASSIGNMENT_LOG.UPDATE_TIME.
                                greaterOrEqual(timestamp)))).asTable("assignment");
        SelectQuery remainingTotal = create.selectQuery();
        remainingTotal.addSelect(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID, TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER,
                Factory.countDistinct(TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID).as("remaining"));
        remainingTotal.addFrom(TPhysPredictions.T_PHYS_PREDICTIONS);
        remainingTotal.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.eq(DbConstants.YES_VALUE).and(TPhysPredictions.T_PHYS_PREDICTIONS.FOUND.eq(DbConstants.FOUND)).and(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.isNull())
        );
        remainingTotal.addGroupBy(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID, TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER);
        if (!costCenter.equalsIgnoreCase(DbConstants.OVER_ALL)) {
            remainingTotal.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER.eq(costCenter));
        }
        remainingTotal.asTable("remainingTotal");
        SelectQuery completedAccounts = create.selectQuery();
        completedAccounts.addSelect(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID, TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER,
                Factory.countDistinct(TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID).as("completed"));
        completedAccounts.addFrom(TPhysPredictions.T_PHYS_PREDICTIONS);
        completedAccounts.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.eq(DbConstants.YES_VALUE).and(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.isNotNull())
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITING_TIME.greaterOrEqual(timestamp)));
        completedAccounts.addGroupBy(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID, TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER);
        if (!costCenter.equalsIgnoreCase(DbConstants.OVER_ALL)) {
            completedAccounts.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER.eq(costCenter));
        }
        SelectQuery hitQuery = create.selectQuery();
        hitQuery.addSelect(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID, TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER,
                Factory.nvl(Factory.countDistinct(TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID), 0).as("hitCount"),
                Factory.sum(Factory.nvl(TPhysPredictions.T_PHYS_PREDICTIONS.VAL, new BigDecimal(0)).mul(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_QTY)).as("hitValue"));
        hitQuery.addFrom(TPhysPredictions.T_PHYS_PREDICTIONS);
        hitQuery.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.eq(DbConstants.YES_VALUE).and(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.in(PHYS_AGREE))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_QTY.greaterThan(NumberConstants.ZERO)).and(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITING_TIME.greaterOrEqual(timestamp)));
        hitQuery.addGroupBy(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID, TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER);
        if (!costCenter.equalsIgnoreCase(DbConstants.OVER_ALL)) {
            hitQuery.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER.eq(costCenter));
        }
        hitQuery.asTable("hitQuery");

        SelectQuery query = create.selectQuery();
        query.addSelect(THospital.T_HOSPITAL.SHORT_NAME.as("hospitalId"),
                assignment.getField(TPhysAssignment.T_PHYS_ASSIGNMENT.USER_ID).as("userId"), assignment.getField(TPhysAssignment.T_PHYS_ASSIGNMENT.COST_CENTER).as("costCenter"),
                THospital.T_HOSPITAL.HOSPITAL_NAME.as("hospitalName"), TUser.T_USER.L_NAME.as("lName"), TUser.T_USER.F_NAME.as("fName"),
                Factory.sum(Factory.nvl((Field<Integer>) remainingTotal.getField("remaining"), 0)).as("remaining"), Factory.sum(Factory.nvl((Field<Integer>) completedAccounts.getField("completed"), 0)).as("completed"),
                Factory.sum(Factory.nvl((Field<Integer>) hitQuery.getField("hitCount"), 0)).as("hitCount"), Factory.sum(Factory.nvl((Field<BigDecimal>) hitQuery.getField("hitValue"), new BigDecimal(0))).as("hitValue")
        );
        query.addFrom(assignment);
        query.addJoin(THospital.T_HOSPITAL, JoinType.JOIN, THospital.T_HOSPITAL.HOSPITAL_ID.eq(assignment.getField(TPhysAssignment.T_PHYS_ASSIGNMENT.HOSPITAL_ID)));
        query.addJoin(TUser.T_USER, JoinType.JOIN, TUser.T_USER.USER_ID.eq(assignment.getField(TPhysAssignment.T_PHYS_ASSIGNMENT.USER_ID)).and(TUser.T_USER.U_TYPE.eq(TUserRole.PHYSICIAN_AUDITOR)));
        //query.addJoin(TUserRoleMapping.T_USER_ROLE_MAPPING, JoinType.JOIN, TUser.T_USER.USER_ID.eq(TUserRoleMapping.T_USER_ROLE_MAPPING.USER_ID).and(TUser.T_USER.USER_ID.eq(assignment.getField(TPhysAssignment.T_PHYS_ASSIGNMENT.USER_ID))).and(TUserRoleMapping.T_USER_ROLE_MAPPING.U_TYPE.eq(TUserRole.PHYSICIAN_AUDITOR)));
        query.addJoin(remainingTotal, JoinType.LEFT_OUTER_JOIN, assignment.getField(TPhysAssignment.T_PHYS_ASSIGNMENT.HOSPITAL_ID).eq(remainingTotal.getField(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID))
                .and(assignment.getField(TPhysAssignment.T_PHYS_ASSIGNMENT.USER_ID).eq(remainingTotal.getField(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID))).and(assignment.getField(TPhysAssignment.T_PHYS_ASSIGNMENT.COST_CENTER).eq(remainingTotal.getField(TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER))));
        query.addJoin(completedAccounts, JoinType.LEFT_OUTER_JOIN, assignment.getField(TPhysAssignment.T_PHYS_ASSIGNMENT.HOSPITAL_ID).eq(completedAccounts.getField(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID))
                .and(assignment.getField(TPhysAssignment.T_PHYS_ASSIGNMENT.USER_ID).eq(completedAccounts.getField(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID)).and(assignment.getField(TPhysAssignment.T_PHYS_ASSIGNMENT.COST_CENTER).eq(completedAccounts.getField(TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER)))));
        query.addJoin(hitQuery, JoinType.LEFT_OUTER_JOIN, assignment.getField(TPhysAssignment.T_PHYS_ASSIGNMENT.HOSPITAL_ID).eq(hitQuery.getField(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID))
                .and(assignment.getField(TPhysAssignment.T_PHYS_ASSIGNMENT.USER_ID).eq(hitQuery.getField(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID)).and(assignment.getField(TPhysAssignment.T_PHYS_ASSIGNMENT.COST_CENTER).eq(hitQuery.getField(TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER)))));
        query.addConditions(Operator.OR, Factory.nvl(remainingTotal.getField("remaining"), 0).greaterThan(0), Factory.nvl(completedAccounts.getField("completed"), 0).greaterThan(0));
        query.addOrderBy(assignment.getField(TPhysAssignment.T_PHYS_ASSIGNMENT.HOSPITAL_ID), assignment.getField(TPhysAssignment.T_PHYS_ASSIGNMENT.USER_ID), assignment.getField(TPhysAssignment.T_PHYS_ASSIGNMENT.COST_CENTER));
        if (!costCenter.equalsIgnoreCase(DbConstants.OVER_ALL)) {
            query.addConditions(assignment.getField(TPhysAssignment.T_PHYS_ASSIGNMENT.COST_CENTER).eq(costCenter));
        }
        query.addGroupBy(assignment.getField(TPhysAssignment.T_PHYS_ASSIGNMENT.HOSPITAL_ID), assignment.getField(TPhysAssignment.T_PHYS_ASSIGNMENT.USER_ID));
        return query.fetch().into(ListViewResult.class);

    }

    /**
     * List view data for preBill
     *
     * @param costCenter
     * @return List<ListViewResult>
     */
    public List<ListViewResult> getListViewDataByAuditor(String costCenter) {

        Table assignment = create.select(TPhysAssignment.T_PHYS_ASSIGNMENT.HOSPITAL_ID, TPhysAssignment.T_PHYS_ASSIGNMENT.USER_ID, TPhysAssignment.T_PHYS_ASSIGNMENT.COST_CENTER).from(TPhysAssignment.T_PHYS_ASSIGNMENT)
                .union(create.select(TPhysAssignmentLog.T_PHYS_ASSIGNMENT_LOG.HOSPITAL_ID, TPhysAssignmentLog.T_PHYS_ASSIGNMENT_LOG.USER_ID, TPhysAssignmentLog.T_PHYS_ASSIGNMENT_LOG.COST_CENTER).from(TPhysAssignmentLog.T_PHYS_ASSIGNMENT_LOG)
                        .where(TPhysAssignmentLog.T_PHYS_ASSIGNMENT_LOG.OPERATION_TYPE.eq(DbConstants.OPERATION_DELETE).and(TPhysAssignmentLog.T_PHYS_ASSIGNMENT_LOG.UPDATE_TIME.
                                greaterOrEqual(activityLogUtils.getCurrentDate())))).asTable("assignment");
        SelectQuery remainingTotal = create.selectQuery();
        remainingTotal.addSelect(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID, TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER,
                Factory.countDistinct(TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID).as("remaining"));
        remainingTotal.addFrom(TPhysPredictions.T_PHYS_PREDICTIONS);
        remainingTotal.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.eq(DbConstants.YES_VALUE).and(TPhysPredictions.T_PHYS_PREDICTIONS.FOUND.eq(DbConstants.FOUND)).and(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.isNull())
        );
        remainingTotal.addGroupBy(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID, TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER);
        if (!costCenter.equalsIgnoreCase(DbConstants.OVER_ALL)) {
            remainingTotal.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER.eq(costCenter));
        }
        remainingTotal.asTable("remainingTotal");
        SelectQuery completedAccounts = create.selectQuery();
        completedAccounts.addSelect(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID, TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER,
                Factory.countDistinct(TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID).as("completed"));
        completedAccounts.addFrom(TPhysPredictions.T_PHYS_PREDICTIONS);
        completedAccounts.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.eq(DbConstants.YES_VALUE).and(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.isNotNull())
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITING_TIME.greaterOrEqual(activityLogUtils.getCurrentDate())));
        completedAccounts.addGroupBy(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID, TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER);
        if (!costCenter.equalsIgnoreCase(DbConstants.OVER_ALL)) {
            completedAccounts.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER.eq(costCenter));
        }
        SelectQuery hitQuery = create.selectQuery();
        hitQuery.addSelect(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID, TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER,
                Factory.nvl(Factory.countDistinct(TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID), 0).as("hitCount"),
                Factory.sum(Factory.nvl(TPhysPredictions.T_PHYS_PREDICTIONS.VAL, new BigDecimal(0)).mul(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_QTY)).as("hitValue"));
        hitQuery.addFrom(TPhysPredictions.T_PHYS_PREDICTIONS);
        hitQuery.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.eq(DbConstants.YES_VALUE).and(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.in(PHYS_AGREE))
                .and(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_QTY.greaterThan(NumberConstants.ZERO)).and(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITING_TIME.greaterOrEqual(activityLogUtils.getCurrentDate())));
        hitQuery.addGroupBy(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID, TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID, TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER);
        if (!costCenter.equalsIgnoreCase(DbConstants.OVER_ALL)) {
            hitQuery.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER.eq(costCenter));
        }
        hitQuery.asTable("hitQuery");

        SelectQuery query = create.selectQuery();
        query.addSelect(THospital.T_HOSPITAL.SHORT_NAME.as("hospitalId"),
                assignment.getField(TPhysAssignment.T_PHYS_ASSIGNMENT.USER_ID).as("userId"), assignment.getField(TPhysAssignment.T_PHYS_ASSIGNMENT.COST_CENTER).as("costCenter"),
                THospital.T_HOSPITAL.HOSPITAL_NAME.as("hospitalName"), TUser.T_USER.L_NAME.as("lName"), TUser.T_USER.F_NAME.as("fName"),
                Factory.nvl(remainingTotal.getField("remaining"), 0).as("remaining"), Factory.nvl(completedAccounts.getField("completed"), 0).as("completed"),
                Factory.nvl(hitQuery.getField("hitCount"), 0).as("hitCount"), Factory.nvl(hitQuery.getField("hitValue"), 0).as("hitValue")
        );
        query.addFrom(assignment);
        query.addJoin(THospital.T_HOSPITAL, JoinType.JOIN, THospital.T_HOSPITAL.HOSPITAL_ID.eq(assignment.getField(TPhysAssignment.T_PHYS_ASSIGNMENT.HOSPITAL_ID)));
        query.addJoin(TUser.T_USER, JoinType.JOIN, TUser.T_USER.USER_ID.eq(assignment.getField(TPhysAssignment.T_PHYS_ASSIGNMENT.USER_ID)).and(TUser.T_USER.U_TYPE.eq(TUserRole.PHYSICIAN_AUDITOR)));
        //query.addJoin(TUserRoleMapping.T_USER_ROLE_MAPPING, JoinType.JOIN, TUser.T_USER.USER_ID.eq(TUserRoleMapping.T_USER_ROLE_MAPPING.USER_ID).and(TUser.T_USER.USER_ID.eq(assignment.getField(TPhysAssignment.T_PHYS_ASSIGNMENT.USER_ID))).and(TUserRoleMapping.T_USER_ROLE_MAPPING.U_TYPE.eq(TUserRole.PHYSICIAN_AUDITOR)));
        query.addJoin(remainingTotal, JoinType.LEFT_OUTER_JOIN, assignment.getField(TPhysAssignment.T_PHYS_ASSIGNMENT.HOSPITAL_ID).eq(remainingTotal.getField(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID))
                .and(assignment.getField(TPhysAssignment.T_PHYS_ASSIGNMENT.USER_ID).eq(remainingTotal.getField(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID))).and(assignment.getField(TPhysAssignment.T_PHYS_ASSIGNMENT.COST_CENTER).eq(remainingTotal.getField(TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER))));
        query.addJoin(completedAccounts, JoinType.LEFT_OUTER_JOIN, assignment.getField(TPhysAssignment.T_PHYS_ASSIGNMENT.HOSPITAL_ID).eq(completedAccounts.getField(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID))
                .and(assignment.getField(TPhysAssignment.T_PHYS_ASSIGNMENT.USER_ID).eq(completedAccounts.getField(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID)).and(assignment.getField(TPhysAssignment.T_PHYS_ASSIGNMENT.COST_CENTER).eq(completedAccounts.getField(TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER)))));
        query.addJoin(hitQuery, JoinType.LEFT_OUTER_JOIN, assignment.getField(TPhysAssignment.T_PHYS_ASSIGNMENT.HOSPITAL_ID).eq(hitQuery.getField(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID))
                .and(assignment.getField(TPhysAssignment.T_PHYS_ASSIGNMENT.USER_ID).eq(hitQuery.getField(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID)).and(assignment.getField(TPhysAssignment.T_PHYS_ASSIGNMENT.COST_CENTER).eq(hitQuery.getField(TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER)))));
        query.addConditions(Operator.OR, Factory.nvl(remainingTotal.getField("remaining"), 0).greaterThan(0), Factory.nvl(completedAccounts.getField("completed"), 0).greaterThan(0));
        query.addOrderBy(assignment.getField(TPhysAssignment.T_PHYS_ASSIGNMENT.USER_ID), assignment.getField(TPhysAssignment.T_PHYS_ASSIGNMENT.HOSPITAL_ID), assignment.getField(TPhysAssignment.T_PHYS_ASSIGNMENT.COST_CENTER));
        if (!costCenter.equalsIgnoreCase(DbConstants.OVER_ALL)) {
            query.addConditions(assignment.getField(TPhysAssignment.T_PHYS_ASSIGNMENT.COST_CENTER).eq(costCenter));
        }
        query.addGroupBy(assignment.getField(TPhysAssignment.T_PHYS_ASSIGNMENT.HOSPITAL_ID), assignment.getField(TPhysAssignment.T_PHYS_ASSIGNMENT.USER_ID), assignment.getField(TPhysAssignment.T_PHYS_ASSIGNMENT.COST_CENTER));
        return query.fetch().into(ListViewResult.class);

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
