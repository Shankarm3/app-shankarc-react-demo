package com.operasolutions.rl.service.physician.dashboard.account.report;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriInfo;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.inject.Inject;
import com.operasolutions.rl.common.DateFormatConstant;
import com.operasolutions.rl.common.DateUtils;
import com.operasolutions.rl.common.NumberConstants;
import com.operasolutions.rl.common.chart.ReportedPeriod;
import com.operasolutions.rl.common.chart.ReportedPeriodData;
import com.operasolutions.rl.common.chart.ReportedPeriodEnum;
import com.operasolutions.rl.schema.enums.TPermission;

/**
 * PhysicianAccountReportResource
 *
 * @author Nirmal Kumar
 */
@Path("/" + PhysicianAccountReportResource.URL_ACCOUNT_REPORT_RESOURCE)
@Produces(MediaType.APPLICATION_JSON)
@RequiresAuthentication
public class PhysicianAccountReportResource {

    public static final String URL_ACCOUNT_REPORT_RESOURCE = "physicianAccountReports";
    protected static final Logger log = LoggerFactory.getLogger(PhysicianAccountReportResource.class);
    protected final PhysicianAccountReportDao accountReportDao;

    @Context
    UriInfo uriInfo;

    @Inject
    public PhysicianAccountReportResource(PhysicianAccountReportDao accountReportDao) {
        this.accountReportDao = accountReportDao;
    }

    /**
     * Gets representation for Summary data
     *
     * @param hospitalList
     * @param period
     * @param auditorId
     * @param deptList
     * @param isAuditor
     * @return SummaryDataRepresentation
     */
    @GET
    public SummaryDataRepresentation generateSummaryDataForPeriod(@QueryParam(value = "hospitalId") List<String> hospitalList,
            @QueryParam("period") Integer period, @QueryParam("auditorId") String auditorId, @QueryParam(value = "deptId") List<String> deptList,
            @QueryParam("isAuditor") Boolean isAuditor) {

        // hospitalList and userId is optional
        if (period == null) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        SecurityUtils.getSubject().checkPermission(TPermission.READ_SUMMARY_ACCOUNT_INFO.getPermission());

        SummaryDataRepresentation result = new SummaryDataRepresentation();

        ReportedPeriodData reportPeriodData = ReportedPeriod.getReportedPeriod(Calendar.getInstance(), ReportedPeriodEnum.getReportedPeriod(period));

        SummaryDataResult summaryData = null;

        summaryData = accountReportDao.getSummaryChartData(new java.sql.Date(reportPeriodData.getMinDate().getTimeInMillis()), new java.sql.Date(reportPeriodData.getMaxDate().getTimeInMillis()), hospitalList, auditorId, isAuditor, deptList);

        log.debug("Processing summary data into report...");

        // columns in summaryData can be null if there is no data, dateDifference is not empty
        if (summaryData.hitValue != null) {
            result.hitValue = summaryData.hitValue.setScale(0, NumberConstants.RL_ROUNDING_MODE);

            Long days = DateUtils.getDifferenceInDays(reportPeriodData.getMinDate(), reportPeriodData.getMaxDate(), reportPeriodData.getReportedPeriod());
            if (days != null && days != 0) {
                result.dollarsFoundPerDay = summaryData.hitValue.setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE).divide(new BigDecimal(days), NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE).setScale(0, NumberConstants.RL_ROUNDING_MODE);
            }
        }

        if (summaryData.reviewRate != null) {
            result.reviewRate = summaryData.reviewRate.setScale(0, NumberConstants.RL_ROUNDING_MODE);
        }

        if (summaryData.hitRate != null) {
            result.hitRate = summaryData.hitRate.setScale(0, NumberConstants.RL_ROUNDING_MODE);
        }

        if (summaryData.totalAccounts != null) {
            result.totalAccounts = summaryData.totalAccounts;
        }

        if (summaryData.reviewedCount != null) {
            result.reviewedCount = summaryData.reviewedCount;
        }

        if (summaryData.hitsCount != null) {
            result.hitsCount = summaryData.hitsCount;
        }

        result.month = new SimpleDateFormat(DateFormatConstant.FULL_MONTH_YEAR).format(reportPeriodData.getMinDate().getTime());

        return result;
    }

    public static class SummaryDataResult {

        public Integer totalAccounts;
        public Integer reviewedCount;
        public Integer hitsCount;
        public BigDecimal reviewRate;
        public BigDecimal hitRate;
        public BigDecimal hitValue;
    }

    public static class SummaryDataRepresentation {

        public Integer totalAccounts = 0;
        public Integer reviewedCount = 0;
        public Integer hitsCount = 0;
        public BigDecimal reviewRate = new BigDecimal(0);
        public BigDecimal hitRate = new BigDecimal(0);
        public BigDecimal hitValue = new BigDecimal(0);
        public BigDecimal dollarsFoundPerDay = new BigDecimal(0);
        public String month;
    }
}
