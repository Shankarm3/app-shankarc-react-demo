package com.operasolutions.rl.service.exporter;

import java.util.HashMap;
import java.util.Map;

/**
 * FilterMapperEnum
 *
 * @author Nirmal Kumar
 */
public enum FilterMapperEnum {

    // order of instances affects order of filters in PDF report --> don't change the order :)
    METRIC_TYPE("metricType", "Metric Type"),
    COST_CENTER("costCenter", "Cost Center"),
    TIME_PERIOD("period", "Time period"),
    AUDITOR("auditorId", "Auditor"),
    REPORT_TYPE("reportType", "Report type"),
    FACILITY("hospitalId", "Facility");

    private String key;
    private String publishedValue;
    private static Map<String, FilterMapperEnum> keyInstanceMap = new HashMap<String, FilterMapperEnum>();

    // static constructor
    static {
        for (FilterMapperEnum type : FilterMapperEnum.values()) {
            keyInstanceMap.put(type.key, type);
        }
    }

    /**
     * Constructor
     *
     * @param key
     * @param reportValue
     */
    private FilterMapperEnum(String key, String reportValue) {
        this.key = key;
        this.publishedValue = reportValue;
    }

    /**
     * Returns ui value
     *
     * @return String
     */
    public String getUiValue() {
        return this.publishedValue;
    }

    /**
     * Returns key value
     *
     * @return String
     */
    public String getKeyValue() {
        return this.key;
    }

    /**
     * Returns instance from key value
     *
     * @param key
     * @return FilterMapperEnum
     */
    public static FilterMapperEnum getInstanceFromKey(String key) {
        return keyInstanceMap.get(key);
    }
}
