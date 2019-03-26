package com.operasolutions.rl.service.physician;

import org.jooq.FactoryOperations;
import org.jooq.Record;
import org.jooq.SelectQuery;
import org.jooq.impl.Factory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.inject.Inject;
import com.operasolutions.rl.auth.AuthUtils;
import com.operasolutions.rl.common.ActivityLogUtils;
import com.operasolutions.rl.common.DbConstants;
import static com.operasolutions.rl.common.DbConstants.PHYS_AGREE;
import com.operasolutions.rl.common.NumberConstants;
import com.operasolutions.rl.schema.enums.TUserRole;
import com.operasolutions.rl.schema.tables.TPhysPredictions;
import com.operasolutions.rl.schema.tables.TPhysReportingAssignment;
import com.operasolutions.rl.schema.tables.TPhysSummaryReport;
import com.operasolutions.rl.service.physician.PhysicianAccountInfoResource.AccountInfoResult;
import java.util.List;
import org.apache.shiro.SecurityUtils;
import org.jooq.Operator;

/**
 * PhysicianAccountInfoDao
 *
 * @author Nirmal Kumar
 * @author Nirmal Kumar
 */
public class PhysicianAccountInfoDao {

    private final FactoryOperations create;
    protected static final Logger log = LoggerFactory.getLogger(PhysicianAccountInfoDao.class);
    protected ActivityLogUtils activityLogUtils;

    @Inject
    public PhysicianAccountInfoDao(FactoryOperations jooqFactory, ActivityLogUtils activityLogUtils) {
        this.create = jooqFactory;
        this.activityLogUtils = activityLogUtils;
    }

    /**
     * Reads number of completed accounts by given hospitalId, billType and
     * userId
     *
     * @param hospitalId
     * @param userId
     * @param all
     * @param auditorList
     * @return Number of completed accounts
     */
    public long getCurrentMonthCompleted(String hospitalId, String userId, Boolean all, String costCenter, List<String> auditorList) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalId' cannot be null.");
        }
        if (userId == null) {
            throw new IllegalArgumentException("Input parameter 'userId' cannot be null.");
        }
        if (all == null) {
            throw new IllegalArgumentException("Input parameter 'all' cannot be null.");
        }

        long result = 0;

        SelectQuery query = create.selectQuery();

        query.addSelect(Factory.field("IFNULL(COUNT(DISTINCT HOSPITAL_ID,ACCOUNT_ID, DATE(CEN_AUDITING_TIME)),0)").as("count"));
        query.addFrom(TPhysPredictions.T_PHYS_PREDICTIONS);
        if (!hospitalId.equalsIgnoreCase(DbConstants.OVER_ALL)) {
            query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(hospitalId));
        } else if (SecurityUtils.getSubject().hasRole(TUserRole.PHYSICIAN_RPT_USER.getUType())) {
            query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.in(create.select(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT.HOSPITAL_ID).from(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT).where(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT.USER_ID.eq(AuthUtils.getLoggedUserName()))));
        }
        if (!costCenter.equalsIgnoreCase(DbConstants.OVER_ALL)) {
            query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER.equal(costCenter));
        }
        query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.equal(DbConstants.YES_VALUE));
        query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.isNotNull());
        query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.EV_SCORE.isNotNull());
        query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITING_TIME.greaterOrEqual(activityLogUtils.getCurrentDate()));
        //query.addConditions(Operator.AND, Factory.condition("CEN_AUDITING_TIME  >= DATE_FORMAT(CURDATE(),'%Y-%m-01') "));
        if (all == Boolean.FALSE) {
            query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID.equal(userId));
        }
        if (all == Boolean.TRUE && (auditorList != null && auditorList.size() > 0)) {
            query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID.in(auditorList));
        }
        Record record = query.fetchOne();
        if (record != null) {
            result = record.getValue("count", Long.class);
        }
        return result;
    }

    /**
     * Reads number of completed accounts by given hospitalId, billType and
     * userId
     *
     * @param hospitalId
     * @param userId
     * @param all
     * @param auditorList
     * @return Number of completed accounts
     */
    public long getCurrentMonthCompleted1(String hospitalId, String userId, Boolean all, String costCenter, List<String> auditorList) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalId' cannot be null.");
        }
        if (userId == null) {
            throw new IllegalArgumentException("Input parameter 'userId' cannot be null.");
        }
        if (all == null) {
            throw new IllegalArgumentException("Input parameter 'all' cannot be null.");
        }

        long result = 0;

        SelectQuery query = create.selectQuery();

        query.addSelect(Factory.field("IFNULL(COUNT(DISTINCT HOSPITAL_ID,ACCOUNT_ID, DATE(CEN_AUDITING_TIME)),0)").as("count"));
        query.addFrom(TPhysPredictions.T_PHYS_PREDICTIONS);
        if (!hospitalId.equalsIgnoreCase(DbConstants.OVER_ALL)) {
            query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(hospitalId));
        } else if (SecurityUtils.getSubject().hasRole(TUserRole.PHYSICIAN_RPT_USER.getUType())) {
            query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.in(create.select(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT.HOSPITAL_ID).from(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT).where(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT.USER_ID.eq(AuthUtils.getLoggedUserName()))));
        }
        if (!costCenter.equalsIgnoreCase(DbConstants.OVER_ALL)) {
            query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER.equal(costCenter));
        }
        query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.equal(DbConstants.YES_VALUE));
        query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.isNotNull());
        query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.EV_SCORE.isNotNull());
        //query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITING_TIME.greaterOrEqual(activityLogUtils.getCurrentDate()));
        query.addConditions(Factory.condition("CEN_AUDITING_TIME  >= DATE_FORMAT(CURDATE(),'%Y-%m-01') "));
        if (all == Boolean.FALSE) {
            query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID.equal(userId));
        }
        if (all == Boolean.TRUE && (auditorList != null && auditorList.size() > 0)) {
            query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID.in(auditorList));
        }
        Record record = query.fetchOne();
        if (record != null) {
            result = record.getValue("count", Long.class);
        }
        return result;
    }

    /**
     * Reads number of remaining accounts by given hospitalId, billType and
     * userId
     *
     * @param hospitalId
     * @param userId
     * @param all
     * @param auditorList
     * @return Number of remaining accounts
     */
    public long getCurrentMonthRemaining(String hospitalId, String userId, Boolean all, String costCenter, List<String> auditorList) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalId' cannot be null.");
        }

        if (userId == null) {
            throw new IllegalArgumentException("Input parameter 'userId' cannot be null.");
        }
        if (all == null) {
            throw new IllegalArgumentException("Input parameter 'all' cannot be null.");
        }

        long result = 0;

        SelectQuery query = create.selectQuery();

        query.addSelect(Factory.countDistinct(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID, TPhysPredictions.T_PHYS_PREDICTIONS.ACCOUNT_ID).as("count"));
        query.addFrom(TPhysPredictions.T_PHYS_PREDICTIONS);
        if (!hospitalId.equalsIgnoreCase(DbConstants.OVER_ALL)) {
            query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(hospitalId));
        } else if (SecurityUtils.getSubject().hasRole(TUserRole.PHYSICIAN_RPT_USER.getUType())) {
            query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.in(create.select(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT.HOSPITAL_ID).from(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT).where(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT.USER_ID.eq(AuthUtils.getLoggedUserName()))));
        }
        if (!costCenter.equalsIgnoreCase(DbConstants.OVER_ALL)) {
            query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER.equal(costCenter));
        }
        query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.equal(DbConstants.YES_VALUE));
        query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.isNull());
        query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.EV_SCORE.isNotNull());
        query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.FOUND.equal((byte) 0));
        if (all == Boolean.FALSE) {
            query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID.equal(userId));
        }
        if (all == Boolean.TRUE && (auditorList != null && auditorList.size() > 0)) {
            query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID.in(auditorList));
        }
        Record record = query.fetchOne();
        if (record != null) {
            result = record.getValue("count", Long.class);
        }
        return result;
    }

    /**
     * Reads number of completed accounts by given hospitalId, billType and
     * userId
     *
     * @param hospitalId
     * @param userId
     * @param all
     * @param auditorList
     * @return Number of completed accounts
     */
    public AccountInfoResult getCurrentMonthHitCountHitValue(String hospitalId, String userId, Boolean all, String costCenter, List<String> auditorList) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalId' cannot be null.");
        }
        if (userId == null) {
            throw new IllegalArgumentException("Input parameter 'userId' cannot be null.");
        }
        if (all == null) {
            throw new IllegalArgumentException("Input parameter 'all' cannot be null.");
        }

        SelectQuery query = create.selectQuery();
        query.addSelect(Factory.field("IFNULL(COUNT(DISTINCT HOSPITAL_ID,ACCOUNT_ID, DATE(CEN_AUDITING_TIME)),0)").as("hitCount"),
                Factory.field("IFNULL(SUM(CEN_AUDITOR_QTY*VAL),0)").as("hitValue"));
        query.addFrom(TPhysPredictions.T_PHYS_PREDICTIONS);
        if (!hospitalId.equalsIgnoreCase(DbConstants.OVER_ALL)) {
            query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(hospitalId));
        } else if (SecurityUtils.getSubject().hasRole(TUserRole.PHYSICIAN_RPT_USER.getUType())) {
            query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.in(create.select(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT.HOSPITAL_ID).from(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT).where(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT.USER_ID.eq(AuthUtils.getLoggedUserName()))));
        }
        if (!costCenter.equalsIgnoreCase(DbConstants.OVER_ALL)) {
            query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER.equal(costCenter));
        }
        query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.equal(DbConstants.YES_VALUE));
        query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.in(PHYS_AGREE));
        query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_QTY.greaterThan(NumberConstants.ZERO));
        query.addConditions(Operator.AND, Factory.condition("CEN_AUDITING_TIME  >= DATE_FORMAT(CURDATE(),'%Y-%m-01') "));
        if (all == Boolean.FALSE) {
            query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID.equal(userId));
        }
        if (all == Boolean.TRUE && (auditorList != null && auditorList.size() > 0)) {
            query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID.in(auditorList));
        }
        return query.fetchOne().into(AccountInfoResult.class);

    }

    /**
     * Reads number of completed accounts by given hospitalId, billType and
     * userId
     *
     * @param hospitalId
     * @param userId
     * @param all
     * @param auditorList
     * @return Number of completed accounts
     */
    public long getLastMonthCompleted(String hospitalId, String userId, Boolean all, String costCenter, List<String> auditorList) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalId' cannot be null.");
        }
        if (userId == null) {
            throw new IllegalArgumentException("Input parameter 'userId' cannot be null.");
        }
        if (all == null) {
            throw new IllegalArgumentException("Input parameter 'all' cannot be null.");
        }

        long result = 0;

        SelectQuery query = create.selectQuery();
        query.addSelect(Factory.field("IFNULL(COUNT(DISTINCT HOSPITAL_ID,ACCOUNT_ID, DATE(CEN_AUDITING_TIME)),0)").as("count"));
        query.addFrom(TPhysPredictions.T_PHYS_PREDICTIONS);
        if (!hospitalId.equalsIgnoreCase(DbConstants.OVER_ALL)) {
            query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(hospitalId));
        } else if (SecurityUtils.getSubject().hasRole(TUserRole.PHYSICIAN_RPT_USER.getUType())) {
            query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.in(create.select(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT.HOSPITAL_ID).from(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT).where(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT.USER_ID.eq(AuthUtils.getLoggedUserName()))));
        }
        if (!costCenter.equalsIgnoreCase(DbConstants.OVER_ALL)) {
            query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER.equal(costCenter));
        }
        query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.equal(DbConstants.YES_VALUE));
        query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.isNotNull());
        query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.EV_SCORE.isNotNull());
        query.addConditions(Operator.AND, Factory.condition("CEN_AUDITING_TIME BETWEEN DATE_FORMAT(DATE_ADD(CURDATE(),INTERVAL -1 MONTH), '%Y-%m-01') AND  DATE_ADD(DATE_FORMAT(CURDATE(), '%Y-%m-01'),INTERVAL -1 SECOND)"));
        if (all == Boolean.FALSE) {
            query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID.equal(userId));
        }
        if (all == Boolean.TRUE && (auditorList != null && auditorList.size() > 0)) {
            query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID.in(auditorList));
        }
        Record record = query.fetchOne();
        if (record != null) {
            result = record.getValue("count", Long.class);
        }
        return result;
    }

    /**
     * Reads number of remaining accounts by given hospitalId, billType and
     * userId
     *
     * @param hospitalId
     * @param userId
     * @param all
     * @param costCenter
     * @param auditorList
     * @return Number of remaining accounts
     */
    public long getLastMonthRemaining(String hospitalId, String userId, Boolean all, String costCenter, List<String> auditorList) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalId' cannot be null.");
        }

        if (userId == null) {
            throw new IllegalArgumentException("Input parameter 'userId' cannot be null.");
        }
        if (all == null) {
            throw new IllegalArgumentException("Input parameter 'all' cannot be null.");
        }

        long result = 0;

        SelectQuery query = create.selectQuery();

        query.addSelect(Factory.field("IFNULL(SUM(ACCT_CNT),0)").as("count"));
        query.addFrom(TPhysSummaryReport.T_PHYS_SUMMARY_REPORT);
        if (!hospitalId.equalsIgnoreCase(DbConstants.OVER_ALL)) {
            query.addConditions(TPhysSummaryReport.T_PHYS_SUMMARY_REPORT.HOSPITAL_ID.equal(hospitalId));
        } else if (SecurityUtils.getSubject().hasRole(TUserRole.PHYSICIAN_RPT_USER.getUType())) {
            query.addConditions(TPhysSummaryReport.T_PHYS_SUMMARY_REPORT.HOSPITAL_ID.in(create.select(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT.HOSPITAL_ID).from(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT).where(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT.USER_ID.eq(AuthUtils.getLoggedUserName()))));
        }
        if (!costCenter.equalsIgnoreCase(DbConstants.OVER_ALL)) {
            query.addConditions(TPhysSummaryReport.T_PHYS_SUMMARY_REPORT.COST_CENTER.equal(hospitalId));
        }
        query.addConditions(Operator.AND, Factory.condition(" UPDATE_TIME BETWEEN DATE_FORMAT(DATE_ADD(CURDATE(),INTERVAL -1 MONTH), '%Y-%m-01') AND  DATE_ADD(DATE_FORMAT(CURDATE(), '%Y-%m-01'),INTERVAL -1 SECOND)"));
        if (all == Boolean.FALSE) {
            query.addConditions(TPhysSummaryReport.T_PHYS_SUMMARY_REPORT.AUDITOR_ID.equal(userId));
        }
        if (all == Boolean.TRUE && (auditorList != null && auditorList.size() > 0)) {
            query.addConditions(TPhysSummaryReport.T_PHYS_SUMMARY_REPORT.AUDITOR_ID.in(auditorList));
        }
        Record record = query.fetchOne();
        if (record != null) {
            result = record.getValue("count", Long.class);
        }
        return result;
    }

    /**
     * Reads number of completed accounts by given hospitalId, billType and
     * userId
     *
     * @param hospitalId
     * @param userId
     * @param all
     * @param costCenter
     * @param auditorList
     * @return Number of completed accounts
     */
    public AccountInfoResult getLastMonthHitCountHitValue(String hospitalId, String userId, Boolean all, String costCenter, List<String> auditorList) {
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalId' cannot be null.");
        }
        if (userId == null) {
            throw new IllegalArgumentException("Input parameter 'userId' cannot be null.");
        }
        if (all == null) {
            throw new IllegalArgumentException("Input parameter 'all' cannot be null.");
        }

        SelectQuery query = create.selectQuery();
        query.addSelect(Factory.field("IFNULL(COUNT(DISTINCT HOSPITAL_ID,ACCOUNT_ID, DATE(CEN_AUDITING_TIME)),0)").as("hitCount"),
                Factory.field("IFNULL(SUM(CEN_AUDITOR_QTY*VAL),0)").as("hitValue"));
        query.addFrom(TPhysPredictions.T_PHYS_PREDICTIONS);
        if (!hospitalId.equalsIgnoreCase(DbConstants.OVER_ALL)) {
            query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.equal(hospitalId));
        } else if (SecurityUtils.getSubject().hasRole(TUserRole.PHYSICIAN_RPT_USER.getUType())) {
            query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.HOSPITAL_ID.in(create.select(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT.HOSPITAL_ID).from(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT).where(TPhysReportingAssignment.T_PHYS_REPORTING_ASSIGNMENT.USER_ID.eq(AuthUtils.getLoggedUserName()))));
        }
        if (!costCenter.equalsIgnoreCase(DbConstants.OVER_ALL)) {
            query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.COST_CENTER.equal(costCenter));
        }
        query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.SENT_FLAG.equal(DbConstants.YES_VALUE));
        query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_FLAG.in(PHYS_AGREE));
        query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_QTY.greaterThan(NumberConstants.ZERO));
        query.addConditions(Operator.AND, Factory.condition("CEN_AUDITING_TIME BETWEEN DATE_FORMAT(DATE_ADD(CURDATE(),INTERVAL -1 MONTH), '%Y-%m-01') AND  DATE_ADD(DATE_FORMAT(CURDATE(), '%Y-%m-01'),INTERVAL -1 SECOND)"));
        if (all == Boolean.FALSE) {
            query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID.equal(userId));
        }
        if (all == Boolean.TRUE && (auditorList != null && auditorList.size() > 0)) {
            query.addConditions(TPhysPredictions.T_PHYS_PREDICTIONS.CEN_AUDITOR_ID.in(auditorList));
        }
        return query.fetchOne().into(AccountInfoResult.class);

    }

}
