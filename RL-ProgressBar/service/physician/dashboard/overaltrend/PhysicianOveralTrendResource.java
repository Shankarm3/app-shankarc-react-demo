package com.operasolutions.rl.service.physician.dashboard.overaltrend;

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
import com.operasolutions.rl.common.chart.ReportedPeriod;
import com.operasolutions.rl.common.chart.ReportedPeriodData;
import com.operasolutions.rl.common.chart.ReportedPeriodEnum;
import com.operasolutions.rl.common.chart.api.GraphData;
import com.operasolutions.rl.schema.enums.TPermission;

/**
 * PhysicianOveralTrendResource
 *
 * @author Nirmal Kumar
 */
@Path("/" + PhysicianOveralTrendResource.URL_OVERAL_TREND)
@Produces(MediaType.APPLICATION_JSON)
@RequiresAuthentication
public class PhysicianOveralTrendResource {

    public static final String URL_OVERAL_TREND = "physicianOveralTrends";
    protected static final Logger log = LoggerFactory.getLogger(PhysicianOveralTrendResource.class);
    private final PhysicianOveralTrendDao overalTrendDao;

    @Context
    UriInfo uriInfo;

    /**
     *
     * @param overalTrendDao
     */
    @Inject
    public PhysicianOveralTrendResource(PhysicianOveralTrendDao overalTrendDao) {
        this.overalTrendDao = overalTrendDao;
    }

    /**
     *
     * @param hospitalList
     * @param period
     * @param deptList
     * @return
     */
    @GET
    public OveralTrendRepresentation getOveralTrendData(@QueryParam(value = "hospitalId") List<String> hospitalList, @QueryParam("period") Integer period, @QueryParam("costCenter") List<String> costCenterList) {

        log.debug("getOveralTrendData() - start, hospitalId = " + hospitalList + ", period = " + period);

        SecurityUtils.getSubject().checkPermission(TPermission.READ_OVERALL_TRENDS.getPermission());

        if (hospitalList == null || hospitalList.isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }
        if (costCenterList == null || costCenterList.isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }
        if (period == null) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        ReportedPeriodData reportPeriodData = ReportedPeriod.getReportedPeriod(Calendar.getInstance(), ReportedPeriodEnum.getReportedPeriod(period));

        List<PhysicianOveralTrendResult> results = new ArrayList<PhysicianOveralTrendResult>(0);

        results = overalTrendDao.getChartDataPreBill(new java.sql.Date(reportPeriodData.getMinDate().getTimeInMillis()), new java.sql.Date(reportPeriodData.getMaxDate().getTimeInMillis()), hospitalList, costCenterList);

        log.debug("Number of records from DAO: " + results.size());
        log.debug("Generating output data structure...");

        PhysicianOveralTrendOutputGenerator output = new PhysicianOveralTrendOutputGenerator(results, reportPeriodData);
        OveralTrendRepresentation result = output.generateChartData();

        log.debug("Output data structure has been generated succesfully.");

        return result;
    }

    /**
     * Message class
     */
    public static class OveralTrendRepresentation {

        public List<String> xAxis;
        public List<GraphData> yAxis;
    }
}
