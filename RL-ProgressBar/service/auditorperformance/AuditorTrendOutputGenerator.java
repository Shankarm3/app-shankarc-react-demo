package com.operasolutions.rl.service.auditorperformance;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.operasolutions.rl.common.NumberConstants;
import com.operasolutions.rl.common.chart.ChartConstants;
import com.operasolutions.rl.common.chart.ReportedPeriodData;
import com.operasolutions.rl.common.chart.api.Chart;
import com.operasolutions.rl.common.chart.api.GraphData;
import com.operasolutions.rl.service.auditorperformance.AuditorPerformanceResource.AuditorTrendRepresentation;
import java.util.HashMap;
import java.util.Map;

/**
 * AuditorTrendOutputGenerator - processes DAO objects into output for chart
 *
 * @author Jatin Suri
 */
public class AuditorTrendOutputGenerator {

    protected static final Logger log = LoggerFactory.getLogger(AuditorTrendOutputGenerator.class);

    protected static final String MISSING_DOLARS = "missingDollars";
    protected static final String HITS = "hits";
    protected static final String REVIEWED_COUNT = "reviewedCount";

    /* Input list */
    protected List<AuditorTrendResult> list;

    /* Input period */
    protected ReportedPeriodData period;

    /* Output data */
    protected Chart chart;

    /* totalHitCountForPeriod */
    protected Integer totalHitCountForPeriod;

    /* totalCountForPeriod */
    protected Integer totalCountForPeriod;

    /* totalReviewedCountForPeriod */
    protected Integer totalReviewedCountForPeriod;

    /* totalHitValueForPeriod */
    protected BigDecimal totalHitValueForPeriod;

    /* Output data */
    protected AuditorTrendRepresentation result = new AuditorTrendRepresentation();

    protected List<String> costCenterList;

    protected Map<String, BigDecimal> costCenterMap = new HashMap<String, BigDecimal>();

    /**
     * Constructor
     *
     * @param list
     * @param period
     * @param costCenterList
     */
    public AuditorTrendOutputGenerator(List<AuditorTrendResult> list, ReportedPeriodData period, List<String> costCenterList) {
        if (list == null) {
            throw new IllegalArgumentException("Input parameter 'list' cannot be null.");
        }
        if (period == null) {
            throw new IllegalArgumentException("Input parameter 'period' cannot be null.");
        }

        this.list = list;
        this.period = period;
        this.costCenterList = costCenterList;

        chart = new Chart(period.getList().size(), (costCenterList.isEmpty() ? 1 : costCenterList.size()) + 2);

        // I have to sort data for Overall type, algorithm relies on order by date
        Collections.sort(this.list);
    }

    /**
     * Initializes output object
     */
    protected void initOutputObject() {

        log.debug("Initialize x-axis...");

        chart.setxAxis(period.getList());

        log.debug("Initialize y-axis...");
        int i = 0;
        for (String costCenter : costCenterList) {
            GraphData gd1 = chart.getyAxis().get(i);
            gd1.setName(costCenter);
            gd1.setType(ChartConstants.CHART_TYPE_COLUMN);
            gd1.setyAxis(1);
            i++;
        }
        if (i == 0) {
            GraphData gd1 = chart.getyAxis().get(i);
            gd1.setName("Empty Cost Center");
            gd1.setType(ChartConstants.CHART_TYPE_COLUMN);
            gd1.setyAxis(1);
            i++;
        }
        GraphData gd3 = chart.getyAxis().get(i);
        gd3.setName(HITS);
        gd3.setType(ChartConstants.CHART_TYPE_LINE);
        gd3.setyAxis(0);
        i++;
        GraphData gd4 = chart.getyAxis().get(i);
        gd4.setName(REVIEWED_COUNT);
        gd4.setType(ChartConstants.CHART_TYPE_LINE);
        gd4.setyAxis(2);
        log.debug("Initializing y-axis finished.");
    }

    /**
     * Generates data for the chart
     *
     * @return AuditorTrendRepresentation
     */
    public AuditorTrendRepresentation generateChartData() {

        log.debug("generateOutput() - start");
        log.debug("Initializing output structure...");

        initOutputObject();

        totalHitCountForPeriod = 0;
        totalCountForPeriod = 0;
        totalReviewedCountForPeriod = 0;
        totalHitValueForPeriod = new BigDecimal(0);

        log.debug("Generate y-axis...");

        String previousPeriod = null;
        String currentPeriod = null;
        for (AuditorTrendResult one : list) {
            log.debug("Processing OveralTrendResult = " + one);

            log.debug("currentPeriod = " + previousPeriod);
            log.debug("previousPeriod = " + previousPeriod);

            currentPeriod = period.getPeriodFromDateAsString(one.date);

            if (previousPeriod == null) {
                // first run
                updateSummaryData(one);
            } else if (!previousPeriod.equals(currentPeriod)) {
                saveDataForPeriod(previousPeriod);
                updateSummaryData(one);
            } else {
                updateSummaryData(one);
            }
            previousPeriod = currentPeriod;
        }

        // save last period
        if (!list.isEmpty()) {
            saveDataForPeriod(previousPeriod);
        }

        // set to the output object
        result.xAxis = chart.getxAxis();
        result.yAxis = chart.getyAxis();

        return result;
    }

    /**
     * Saves data for a period
     *
     * @param periodParam
     */
    protected void saveDataForPeriod(String periodParam) {
        log.debug("Saving data for period = " + periodParam);
        log.debug("Current data - totalCountForPeriod = " + totalHitCountForPeriod + ", totalReviewedCountForPeriod = " + totalReviewedCountForPeriod + ", totalHitCountForPeriod = " + totalHitCountForPeriod + ", totalHitValueForPeriod = " + totalHitValueForPeriod);

        Integer index = period.getPeriodIndex(periodParam);

        // total missing dollars
        int i = 0;
        for (String cost : costCenterList) {
            if (costCenterMap.containsKey(cost)) {
                chart.getyAxis().get(i).getData().set(index, costCenterMap.get(cost).setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE));
            }
            i++;
        }
        if (i == 0) {
            chart.getyAxis().get(i).getData().set(index, new BigDecimal(0));
            i++;
        }
        if (totalReviewedCountForPeriod != null && totalReviewedCountForPeriod != 0) {
            BigDecimal hitRatePerPeriod = new BigDecimal(totalHitCountForPeriod).multiply(new BigDecimal(100)).divide(new BigDecimal(totalReviewedCountForPeriod), NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE);
            chart.getyAxis().get(i).getData().set(index, hitRatePerPeriod.setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE));
        }
        i++;
        if (totalReviewedCountForPeriod != null && totalReviewedCountForPeriod != 0) {
            chart.getyAxis().get(i).getData().set(index, new BigDecimal(totalReviewedCountForPeriod).setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE));
        }

        log.debug("Resetting counters for period...");
        costCenterMap = new HashMap<String, BigDecimal>();
        totalHitValueForPeriod = new BigDecimal(0);
        totalHitCountForPeriod = 0;
        totalCountForPeriod = 0;
        totalReviewedCountForPeriod = 0;
    }

    /**
     * Updates data for period and summary data
     *
     * @param one
     */
    protected void updateSummaryData(AuditorTrendResult one) {

        // per period
        totalHitValueForPeriod = totalHitValueForPeriod.setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE).add(one.hitValue.setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE));
        if (costCenterMap.containsKey(one.costCenter)) {
            costCenterMap.get(one.costCenter).add(one.hitValue.setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE));
        } else {
            costCenterMap.put(one.costCenter, one.hitValue.setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE));
        }
        totalHitCountForPeriod = totalHitCountForPeriod + one.hitCount;
        totalCountForPeriod = totalCountForPeriod + one.totalCount;
        totalReviewedCountForPeriod = totalReviewedCountForPeriod + one.reviewedCount;
    }
}
