package com.operasolutions.rl.service.physician.dashboard.topprocedurecode;

import java.math.BigDecimal;
import java.util.ArrayList;
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
import com.operasolutions.rl.common.NumberConstants;
import com.operasolutions.rl.common.chart.ReportedPeriod;
import com.operasolutions.rl.common.chart.ReportedPeriodData;
import com.operasolutions.rl.common.chart.ReportedPeriodEnum;
import com.operasolutions.rl.schema.enums.TPermission;

/**
 * TopProcedureCodeResource
 *
 * @author Nirmal Kumar
 */
@Produces(MediaType.APPLICATION_JSON)
@Path("/" + TopProcedureCodeResource.URL_TOP_PROCEDURE_CODE)
@RequiresAuthentication
public class TopProcedureCodeResource {

    public static final String URL_TOP_PROCEDURE_CODE = "physicianTopProcedureCode";
    protected static final Logger log = LoggerFactory.getLogger(TopProcedureCodeResource.class);
    protected static final String EMPTY_VALUE = "";

    private final TopProcedureCodeDao topProcedureCodeDao;

    @Context
    UriInfo uriInfo;

    @Inject
    public TopProcedureCodeResource(TopProcedureCodeDao topProcedureCodeDao) {
        this.topProcedureCodeDao = topProcedureCodeDao;
    }

    /**
     * Gets top five charges for dashboard
     *
     * @param period
     * @param hospitalList
     * @param deptList
     * @return TopProcedureCodeRepresentation
     */
    @GET
    public TopProcedureCodeRepresentation getDashboardTopFiveCharges(@QueryParam("period") Integer period,
            @QueryParam(value = "hospitalId") List<String> hospitalList, @QueryParam(value = "deptId") List<String> deptList) {
        log.debug("getDashboardTopFiveCharges() - start, period = " + period);

        SecurityUtils.getSubject().checkPermission(TPermission.READ_TOP_PROCEDURE_CODE.getPermission());

        if (period == null) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }
        if (hospitalList == null || hospitalList.isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        TopProcedureCodeRepresentation result = new TopProcedureCodeRepresentation();

        ReportedPeriodData reportPeriodData = ReportedPeriod.getReportedPeriod(Calendar.getInstance(), ReportedPeriodEnum.getReportedPeriod(period));

        result = getRepresentation(topProcedureCodeDao.getDashboardTopFiveCharges(new java.sql.Date(reportPeriodData.getMinDate().getTimeInMillis()), new java.sql.Date(reportPeriodData.getMaxDate().getTimeInMillis()), hospitalList, deptList));

        return result;
    }

    /**
     * Produces data representation
     *
     * @param data
     * @return TopProcedureCodeRepresentation
     */
    public TopProcedureCodeRepresentation getRepresentation(List<TopProcedureCodeResult> data) {
        TopProcedureCodeRepresentation result = new TopProcedureCodeRepresentation();
        for (TopProcedureCodeResult one : data) {
            YAxisData yAxisData = new YAxisData();
            yAxisData.y = one.hitValue != null ? one.hitValue.setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE) : new BigDecimal(0);
            yAxisData.procedureDescription = one.procedureDesc != null ? one.procedureDesc : EMPTY_VALUE;
            result.yAxis.add(yAxisData);
            result.xAxis.add(one.procedureCode != null ? one.procedureCode : EMPTY_VALUE);
        }

        return result;
    }

    /**
     * Message class for Top five charges data
     */
    public static class TopProcedureCodeRepresentation {

        public List<String> xAxis = new ArrayList<String>();
        public List<YAxisData> yAxis = new ArrayList<YAxisData>();
    }

    /**
     * Message class for YAxis data
     */
    public static class YAxisData {

        public String procedureDescription;
        public BigDecimal y = new BigDecimal(0);
    }

    public static class TopProcedureCodeResult {

        public BigDecimal hitValue = new BigDecimal(0);
        public String procedureCode;
        public String procedureDesc;
    }
}
