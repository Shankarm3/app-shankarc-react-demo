package com.operasolutions.rl.service.physician.dashboard.overaltrend;

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
import com.operasolutions.rl.service.physician.dashboard.overaltrend.PhysicianOveralTrendResource.OveralTrendRepresentation;

/**
 * PhysicianOveralTrendOutputGenerator - processes DAO objects into output for
 * chart
 *
 * @author Nirmal Kumar
 */
public class PhysicianOveralTrendOutputGenerator {

    protected static final Logger log = LoggerFactory.getLogger(PhysicianOveralTrendOutputGenerator.class);

    protected static final String MISSING_DOLARS = "missingDollars";
    protected static final String REVIEWED = "reviewed";
    protected static final String HITS = "hits";
    protected static final String REVIEWED_COUNT = "reviewedCount";

    /* Input list */
    protected List<PhysicianOveralTrendResult> list;

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
    protected OveralTrendRepresentation result = new OveralTrendRepresentation();

    /**
     * Constructor
     *
     * @param list
     * @param period
     */
    public PhysicianOveralTrendOutputGenerator(List<PhysicianOveralTrendResult> list, ReportedPeriodData period) {
        if (list == null) {
            throw new IllegalArgumentException("Input parameter 'list' cannot be null.");
        }
        if (period == null) {
            throw new IllegalArgumentException("Input parameter 'period' cannot be null.");
        }

        this.list = list;
        this.period = period;

        chart = new Chart(period.getList().size(), 4);

        // I have to sort data because for Overall type data are not sorted because they come from preBill + postBill Lists
        Collections.sort(this.list);
    }

    /**
     * Initializes output object
     */
    protected void initOutputObject() {

        log.debug("Initialize x-axis...");

        chart.setxAxis(period.getList());

        log.debug("Initialize y-axis...");

        GraphData gd1 = chart.getyAxis().get(0);
        gd1.setName(MISSING_DOLARS);
        gd1.setType(ChartConstants.CHART_TYPE_COLUMN);
        gd1.setyAxis(1);

        GraphData gd2 = chart.getyAxis().get(1);
        gd2.setName(REVIEWED);
        gd2.setType(ChartConstants.CHART_TYPE_LINE);
        gd2.setyAxis(0);

        GraphData gd3 = chart.getyAxis().get(2);
        gd3.setName(HITS);
        gd3.setType(ChartConstants.CHART_TYPE_LINE);
        gd3.setyAxis(0);

        GraphData gd4 = chart.getyAxis().get(3);
        gd4.setName(REVIEWED_COUNT);
        gd4.setType(ChartConstants.CHART_TYPE_LINE);
        gd4.setyAxis(2);

        log.debug("Initializing y-axis finished.");
    }

    /**
     * Generates data for the chart
     *
     * @return OveralTrendRepresentation
     */
    public OveralTrendRepresentation generateChartData() {

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
        for (PhysicianOveralTrendResult one : list) {
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
        chart.getyAxis().get(0).getData().set(index, totalHitValueForPeriod.setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE));

        if (totalCountForPeriod != null && totalCountForPeriod != 0) {
            BigDecimal reviewRatePerPeriod = new BigDecimal(totalReviewedCountForPeriod).multiply(new BigDecimal(100)).divide(new BigDecimal(totalCountForPeriod), NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE);
            chart.getyAxis().get(1).getData().set(index, reviewRatePerPeriod.setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE));
        }

        if (totalReviewedCountForPeriod != null && totalReviewedCountForPeriod != 0) {
            BigDecimal hitRatePerPeriod = new BigDecimal(totalHitCountForPeriod).multiply(new BigDecimal(100)).divide(new BigDecimal(totalReviewedCountForPeriod), NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE);
            chart.getyAxis().get(2).getData().set(index, hitRatePerPeriod.setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE));
        }

        if (totalReviewedCountForPeriod != null && totalReviewedCountForPeriod != 0) {
            chart.getyAxis().get(3).getData().set(index, new BigDecimal(totalReviewedCountForPeriod).setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE));
        }

        log.debug("Resetting counters for period...");

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
    protected void updateSummaryData(PhysicianOveralTrendResult one) {

        // per period
        totalHitValueForPeriod = totalHitValueForPeriod.setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE).add(one.hitValue.setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE));
        totalHitCountForPeriod = totalHitCountForPeriod + one.hitCount;
        totalCountForPeriod = totalCountForPeriod + one.totalCount;
        totalReviewedCountForPeriod = totalReviewedCountForPeriod + one.reviewedCount;
    }
}
