package com.operasolutions.rl.service.physician.dashboard.peformancecomparison;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.operasolutions.rl.common.DateUtils;
import com.operasolutions.rl.common.NumberConstants;
import com.operasolutions.rl.common.chart.ReportedPeriodData;
import com.operasolutions.rl.service.physician.dashboard.peformancecomparison.PhysicianPerformanceComparisonResource.DivisionData;
import com.operasolutions.rl.service.physician.dashboard.peformancecomparison.PhysicianPerformanceComparisonResource.HospitalChartData;

/**
 * ChartViewData
 *
 * @author Nirmal Kumar
 */
public class ChartViewData {

    protected static final Logger log = LoggerFactory.getLogger(ChartViewData.class);

    private final ReportedPeriodData reportPeriodData;
    private final ReportedPeriodData reportPeriodDataYTD;
    private final PhysicianPerformanceComparisonDao businessDao;
    private List<String> hospitalList;
    private final ChartType chartType;
    private final long daysCount;
    private final long daysCountYTD;
    private List<String> costCenterList;

    /**
     * Constructor
     *
     * @param reportPeriodData
     * @param reportPeriodDataYTD
     * @param businessDao
     * @param hospitalList
     * @param chartType
     */
    public ChartViewData(ReportedPeriodData reportPeriodData, ReportedPeriodData reportPeriodDataYTD, PhysicianPerformanceComparisonDao businessDao, List<String> hospitalList, ChartType chartType, List<String> costCenterList) {
        if (reportPeriodData == null) {
            throw new IllegalArgumentException("Input parameter 'reportPeriodData' cannot be null.");
        }
        if (reportPeriodDataYTD == null) {
            throw new IllegalArgumentException("Input parameter 'reportPeriodDataYTD' cannot be null.");
        }
        if (businessDao == null) {
            throw new IllegalArgumentException("Input parameter 'businessDao' cannot be null.");
        }

        if (chartType == null) {
            throw new IllegalArgumentException("Input parameter 'metricType' cannot be null or empty string.");
        }

        this.reportPeriodData = reportPeriodData;
        this.reportPeriodDataYTD = reportPeriodDataYTD;
        this.businessDao = businessDao;
        this.hospitalList = hospitalList;
        this.chartType = chartType;
        this.daysCount = DateUtils.getDifferenceInDays(reportPeriodData.getMinDate(), reportPeriodData.getMaxDate(), reportPeriodData.getReportedPeriod());
        this.daysCountYTD = DateUtils.getDifferenceInDays(reportPeriodDataYTD.getMinDate(), reportPeriodDataYTD.getMaxDate(), reportPeriodDataYTD.getReportedPeriod());
        this.costCenterList = costCenterList;
    }

    /**
     * Generates chartView data
     *
     * @return List<DivisionData>
     */
    public List<DivisionData> generateChartViewData() {
        log.debug("generateChartViewData() - start");
        List<ChartViewResult> localResult = new ArrayList<ChartViewResult>(0);
        localResult = businessDao.getChartViewConfig(new java.sql.Date(reportPeriodData.getMinDate().getTimeInMillis()), new java.sql.Date(reportPeriodData.getMaxDate().getTimeInMillis()), new java.sql.Date(reportPeriodDataYTD.getMinDate().getTimeInMillis()), new java.sql.Date(reportPeriodDataYTD.getMaxDate().getTimeInMillis()), hospitalList, chartType, costCenterList);
        log.debug("Number of results from DAO = " + localResult.size());
        if (chartType == ChartType.HEATMAP) {
            return postProcessChartViewDataHeatMap(localResult);
        } else {
            return postProcessChartViewData(localResult);
        }
    }

    /**
     * Formats data from DAO into representation
     *
     * @param dataInput
     * @return List<DivisionData>
     */
    protected List<DivisionData> postProcessChartViewDataHeatMap(List<ChartViewResult> dataInput) {

        // I use map for processing
        Map<String, DivisionData> result = new TreeMap<String, DivisionData>();

        log.debug("Processing hospitals...");
        for (ChartViewResult one : dataInput) {

            BigDecimal foundPerDay = new BigDecimal(0);
            BigDecimal foundPerDayYTD = new BigDecimal(0);
            HospitalChartData oneHospitalData = new HospitalChartData();

            oneHospitalData.hospitalName = one.hospitalName;
            oneHospitalData.hospitalShortName = one.hospitalShortName;

            if (daysCount != 0) {
                foundPerDay = one.hitValue.divide(new BigDecimal(daysCount), NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE);
            }

            if (daysCountYTD != 0) {
                foundPerDayYTD = one.hitValueYTD.divide(new BigDecimal(daysCountYTD), NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE);
            }

            if (chartType == ChartType.HEATMAP) {
                oneHospitalData.variance = (foundPerDayYTD.setScale(0, NumberConstants.RL_ROUNDING_MODE).compareTo(new BigDecimal(0)) != 0) ? (foundPerDay.subtract(foundPerDayYTD)).multiply(new BigDecimal(100)).divide(foundPerDayYTD, NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE) : new BigDecimal(0);
            } else if (chartType == ChartType.HEATMAP) {
                oneHospitalData.variance = one.reviewRate.subtract(one.reviewRateYTD);
            }

            if (one.reviewRate != null) {
                oneHospitalData.reviewRate = one.reviewRate.setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE);
            }
            if (one.reviewedCount != null) {
                oneHospitalData.reviewedCount = one.reviewedCount;
            }
            if (one.totalAccounts != null) {
                oneHospitalData.totalAccounts = one.totalAccounts;
            }
            if (one.hitCount != null) {
                oneHospitalData.hitCount = one.hitCount;
            }
            if (one.reviewedCountYTD != null) {
                oneHospitalData.reviewedCountYTD = one.reviewedCountYTD;
            }
            if (one.totalAccountsYTD != null) {
                oneHospitalData.totalAccountsYTD = one.totalAccountsYTD;
            }
            if (one.hitValue != null) {
                oneHospitalData.hitValue = one.hitValue.setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE);
            }
            if (one.hitValueYTD != null) {
                oneHospitalData.hitValueYTD = one.hitValueYTD.setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE);
            }

            // put into map group by division name
            DivisionData oneDivision = result.get(one.divisionName);

            if (oneDivision == null) {
                oneDivision = new DivisionData();
                oneDivision.divisionName = one.divisionName;
                oneDivision.hospitalData = new ArrayList<HospitalChartData>();
                result.put(one.divisionName, oneDivision);
            }

            oneDivision.hospitalData.add(oneHospitalData);
        }

        log.debug("Computing summaries for divisions...");
        computeSummaryForAllDivisions(result);

        if (chartType == ChartType.HEATMAP) {
            for (Map.Entry<String, DivisionData> entry : result.entrySet()) {
                if (entry.getValue() != null) {
                    computeRescaleValueForHospitals(entry.getValue().hospitalData);
                }
            }
        }

        log.debug("Converting hospitals into List and returning output...");

        return convertMapIntoList(result);
    }

    /**
     * Formats data from DAO into representation
     *
     * @param dataInput
     * @return List<DivisionData>
     */
    protected List<DivisionData> postProcessChartViewData(List<ChartViewResult> dataInput) {

        //log.debug("Ranking hospitals...");
        //RankUtils.rankHospitals(dataInput);
        // I use map for processing
        Map<String, DivisionData> result = new TreeMap<String, DivisionData>();

        log.debug("Processing hospitals...");
        for (ChartViewResult one : dataInput) {

            BigDecimal foundPerDay = new BigDecimal(0);
            BigDecimal foundPerDayYTD = new BigDecimal(0);
            HospitalChartData oneHospitalData = new HospitalChartData();

            oneHospitalData.hospitalName = one.hospitalName;
            oneHospitalData.hospitalShortName = one.hospitalShortName;

            if (daysCount != 0) {
                foundPerDay = one.hitValue.divide(new BigDecimal(daysCount), NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE);
            }

            if (daysCountYTD != 0) {
                foundPerDayYTD = one.hitValueYTD.divide(new BigDecimal(daysCountYTD), NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE);
            }

            if (chartType == ChartType.HEATMAP) {
                oneHospitalData.variance = (foundPerDayYTD.setScale(0, NumberConstants.RL_ROUNDING_MODE).compareTo(new BigDecimal(0)) != 0) ? (foundPerDay.subtract(foundPerDayYTD)).multiply(new BigDecimal(100)).divide(foundPerDayYTD, NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE) : new BigDecimal(0);
            } else if (chartType == ChartType.HEATMAP) {
                oneHospitalData.variance = one.reviewRate.subtract(one.reviewRateYTD);
            }

            if (one.reviewRate != null) {
                oneHospitalData.reviewRate = one.reviewRate.setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE);
            }
            if (one.reviewedCount != null) {
                oneHospitalData.reviewedCount = one.reviewedCount;
            }
            if (one.hitCount != null) {
                oneHospitalData.hitCount = one.hitCount;
            }
            if (one.totalAccounts != null) {
                oneHospitalData.totalAccounts = one.totalAccounts;
            }
            if (one.reviewedCountYTD != null) {
                oneHospitalData.reviewedCountYTD = one.reviewedCountYTD;
            }
            if (one.totalAccountsYTD != null) {
                oneHospitalData.totalAccountsYTD = one.totalAccountsYTD;
            }
            if (one.hitValue != null) {
                oneHospitalData.hitValue = one.hitValue.setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE);
            }
            if (one.hitValueYTD != null) {
                oneHospitalData.hitValueYTD = one.hitValueYTD.setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE);
            }

            // put into map group by division name
            DivisionData oneDivision = result.get(one.costCenter);

            if (oneDivision == null) {
                oneDivision = new DivisionData();
                oneDivision.costCenter = one.costCenter;
                oneDivision.hospitalData = new ArrayList<HospitalChartData>();
                result.put(one.costCenter, oneDivision);
            }

            oneDivision.hospitalData.add(oneHospitalData);
        }

        log.debug("Computing summaries for divisions...");
        computeSummaryForAllDivisions(result);

        if (chartType == ChartType.HEATMAP) {
            for (Map.Entry<String, DivisionData> entry : result.entrySet()) {
                if (entry.getValue() != null) {
                    computeRescaleValueForHospitals(entry.getValue().hospitalData);
                }
            }
        }

        log.debug("Converting hospitals into List and returning output...");

        return convertMapIntoList(result);
    }

    /**
     * Computes rescaled value for each hospital for each division separately
     *
     * @param input
     */
    protected void computeRescaleValueForHospitals(List<HospitalChartData> input) {
        if (input.size() > 0) {
            class ComparatorByVariance implements Comparator<HospitalChartData> {

                @Override
                public int compare(HospitalChartData o1, HospitalChartData o2) {
                    return o2.variance.compareTo(o1.variance);
                }
            }

            Collections.sort(input, new ComparatorByVariance());

            BigDecimal minValue = input.get(input.size() - 1).variance;
            BigDecimal maxValue = input.get(0).variance;
            BigDecimal difference = maxValue.subtract(minValue);

            log.debug("the min value :" + minValue + "the max value :" + maxValue);
            log.debug("the difference is :" + difference.setScale(0, RoundingMode.HALF_UP));

            for (HospitalChartData one : input) {
                if (difference.setScale(0, RoundingMode.HALF_UP).compareTo(new BigDecimal(0)) != 0) {
                    log.debug("computing rescale value for :" + one.hospitalName);
                    one.rescaleValue = one.variance.subtract(minValue).divide(difference, 2, NumberConstants.RL_ROUNDING_MODE).multiply(new BigDecimal(100)).setScale(0, NumberConstants.RL_ROUNDING_MODE);
                }
            }
        }
    }

    /**
     * Computes rescaled value for each hospital for each division separately
     *
     * @param input
     * @return
     */
    protected List<DivisionData> computeRescaleValueForDivision(List<DivisionData> input) {
        if (input.size() > 0) {
            class ComparatorByVariance implements Comparator<DivisionData> {

                @Override
                public int compare(DivisionData o1, DivisionData o2) {
                    return o2.variance.compareTo(o1.variance);
                }
            }

            Collections.sort(input, new ComparatorByVariance());

            BigDecimal minValue = input.get(input.size() - 1).variance;
            BigDecimal maxValue = input.get(0).variance;
            BigDecimal difference = maxValue.subtract(minValue);

            log.debug("the min value :" + minValue + "the max value :" + maxValue);
            log.debug("the difference is :" + difference.setScale(0, RoundingMode.HALF_UP));

            for (DivisionData one : input) {
                if (difference.setScale(0, RoundingMode.HALF_UP).compareTo(new BigDecimal(0)) != 0) {
                    log.debug("computing rescale  value for :" + one.costCenter);
                    one.rescaleValue = one.variance.subtract(minValue).divide(difference, 2, NumberConstants.RL_ROUNDING_MODE).multiply(new BigDecimal(100)).setScale(0, NumberConstants.RL_ROUNDING_MODE);
                }
            }
        }
        return input;
    }

    /**
     * Sorts input based on hospitalShortName
     *
     * @param dataInput
     */
    protected void sortChartViewResultsByHospitalShortName(List<HospitalChartData> dataInput) {

        class ComparatorByHospitalShortName implements Comparator<HospitalChartData> {

            @Override
            public int compare(HospitalChartData o1, HospitalChartData o2) {
                if (o1.hospitalShortName == null && o2.hospitalShortName != null) {
                    return -1;
                } else if (o1.hospitalShortName != null && o2.hospitalShortName == null) {
                    return 1;
                } else {
                    return o1.hospitalShortName.compareTo(o2.hospitalShortName);
                }
            }
        }

        Collections.sort(dataInput, new ComparatorByHospitalShortName());
    }

    /**
     * Calculates total hitValue and total hitRate per division
     *
     * @param input
     */
    protected void computeSummaryForAllDivisions(Map<String, DivisionData> input) {

        for (Map.Entry<String, DivisionData> entry : input.entrySet()) {

            log.debug("Processing division = " + entry.getKey());

            List<HospitalChartData> allHospitals = entry.getValue().hospitalData;

            BigDecimal totalHitValue = new BigDecimal(0);
            Integer totalCount = 0;
            Integer totalReviewedCount = 0;
            Integer hitCount = 0;
            BigDecimal totalHitValueYTD = new BigDecimal(0);
            Integer totalCountYTD = 0;
            Integer totalReviewedCountYTD = 0;
            BigDecimal foundPerDay = new BigDecimal(0);
            BigDecimal foundPerDayYTD = new BigDecimal(0);
            for (HospitalChartData one : allHospitals) {
                if (one.hitValue != null) {
                    totalHitValue = totalHitValue.setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE).add(one.hitValue.setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE));
                }
                if (one.totalAccounts != null) {
                    totalCount = totalCount + one.totalAccounts;
                }
                if (one.hitCount != null) {
                    hitCount = hitCount + one.hitCount;
                }
                if (one.reviewedCount != null) {
                    totalReviewedCount = totalReviewedCount + one.reviewedCount;
                }
                if (one.hitValueYTD != null) {
                    totalHitValueYTD = totalHitValueYTD.setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE).add(one.hitValueYTD.setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE));
                }
                if (one.totalAccountsYTD != null) {
                    totalCountYTD = totalCountYTD + one.totalAccountsYTD;
                }
                if (one.reviewedCountYTD != null) {
                    totalReviewedCountYTD = totalReviewedCountYTD + one.reviewedCountYTD;
                }
            }

            log.debug("Setting data for division...");

            entry.getValue().hitValue = totalHitValue.setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE);
            entry.getValue().hitValueYTD = totalHitValueYTD.setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE);

            if (daysCount != 0) {
                foundPerDay = entry.getValue().hitValue.divide(new BigDecimal(daysCount), NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE);
            }

            if (daysCountYTD != 0) {
                foundPerDayYTD = entry.getValue().hitValueYTD.divide(new BigDecimal(daysCountYTD), NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE);
            }

            BigDecimal computedReviewRate = new BigDecimal(0);
            if (totalCount != 0) {
                computedReviewRate = new BigDecimal(totalReviewedCount).setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE).divide(new BigDecimal(totalCount), NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE).multiply(new BigDecimal(100)).setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE);
            }

            BigDecimal computedReviewRateYTD = new BigDecimal(0);
            if (totalCountYTD != 0) {
                computedReviewRateYTD = new BigDecimal(totalReviewedCountYTD).setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE).divide(new BigDecimal(totalCountYTD), NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE).multiply(new BigDecimal(100)).setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE);
            }

            entry.getValue().reviewRate = computedReviewRate.setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE);
            entry.getValue().reviewRateYTD = computedReviewRateYTD.setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE);

            entry.getValue().totalAccounts = totalCount;
            entry.getValue().reviewedCount = totalReviewedCount;
            entry.getValue().hitCount = hitCount;
            entry.getValue().totalAccountsYTD = totalCountYTD;
            entry.getValue().reviewedCountYTD = totalReviewedCountYTD;

            //computing variance
            if (chartType == ChartType.HEATMAP) {
                entry.getValue().variance = (foundPerDayYTD.setScale(0, NumberConstants.RL_ROUNDING_MODE).compareTo(new BigDecimal(0)) != 0) ? (foundPerDay.subtract(foundPerDayYTD)).multiply(new BigDecimal(100)).divide(foundPerDayYTD, NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE) : new BigDecimal(0);
            } else if (chartType == ChartType.HEATMAP) {
                entry.getValue().variance = entry.getValue().reviewRate.subtract(entry.getValue().reviewRateYTD);
            }

            log.debug("the variance :" + entry.getValue().variance);
        }
    }

    /**
     * Converts data from Map into List
     *
     * @param input
     * @return List<DivisionData>
     */
    protected List<DivisionData> convertMapIntoList(Map<String, DivisionData> input) {
        List<DivisionData> result = new ArrayList<DivisionData>();

        for (Map.Entry<String, DivisionData> entry : input.entrySet()) {
            // sorting the hospitalData based upon hospitalShortName
            sortChartViewResultsByHospitalShortName(entry.getValue().hospitalData);
            result.add(entry.getValue());
        }

        //computimg rescale value
        log.debug("the size of division list :" + result.size());
        if (chartType == ChartType.HEATMAP) {
            return computeRescaleValueForDivision(result);
        } else {
            return result;
        }
    }
}
