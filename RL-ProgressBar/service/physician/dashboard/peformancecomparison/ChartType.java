package com.operasolutions.rl.service.physician.dashboard.peformancecomparison;

import java.util.HashMap;
import java.util.Map;

/**
 * ChartType enum
 *
 * @author Nirmal Kumar
 */
public enum ChartType {
    DONUT("donut"), HEATMAP("heatmap");

    private String value;
    private static Map<String, ChartType> typeMap = new HashMap<String, ChartType>();

    static {
        for (ChartType one : ChartType.values()) {
            typeMap.put(one.value, one);
        }
    }

    private ChartType(String value) {
        this.value = value;
    }

    public static ChartType getTypeFromString(String valueString) {
        return typeMap.get(valueString);
    }

    public static String getValueFromType(ChartType one) {
        return one.value;
    }
}
