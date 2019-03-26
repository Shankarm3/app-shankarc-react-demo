package com.operasolutions.rl.service.exporter.report;

import java.util.HashMap;
import java.util.Map;

/**
 * ReportEnum
 *
 * @author Nirmal Kumar
 */
public enum ReportEnum {

    PERFORMANCE_COMPARISON_DASHBOARD("1", PerformanceComparisonChart.class),
    PERFORMANCE_COMPARISON_TAB("2", PerformanceComparisonTabReport.class);

    private String reportId;
    private Class<? extends AbstractComplexChart> clazz;
    private static Map<String, ReportEnum> valueMap = new HashMap<String, ReportEnum>();

    // static constructor
    static {
        for (ReportEnum value : ReportEnum.values()) {
            valueMap.put(value.reportId, value);
        }
    }

    /**
     * Constructor
     *
     * @param reportId
     * @param clazz
     */
    private ReportEnum(String reportId, Class<? extends AbstractComplexChart> clazz) {
        this.reportId = reportId;
        this.clazz = clazz;
    }

    /**
     * Gets reportId
     *
     * @return String
     */
    public String getReportId() {
        return reportId;
    }

    /**
     * Gets class name for report
     *
     * @return Class<? extends AbstractComplexChart>
     */
    public Class<? extends AbstractComplexChart> getClazz() {
        return clazz;
    }

    /**
     * Gets instance from reportId
     *
     * @param reportId
     * @return ReportEnum
     */
    public static ReportEnum getInstance(String reportId) {
        return valueMap.get(reportId);
    }
}
