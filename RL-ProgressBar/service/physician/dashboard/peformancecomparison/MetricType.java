package com.operasolutions.rl.service.physician.dashboard.peformancecomparison;

import java.util.HashMap;
import java.util.Map;

/**
 * MetricType enum
 * 
 * @author Nirmal Kumar
 */
 public enum MetricType {
	HIT_RATE("hitRate", "Hit Rate"), FOUND_PER_DAY("foundPerDay", "$ Found"), REVIEW_RATE("reviewRate", "Review Rate");

	private String value;
	private String filterValue;
	private static Map<String, MetricType> typeMap = new HashMap<String, MetricType>();

	static {
		for (MetricType one: MetricType.values()) {
			typeMap.put(one.value, one);
		}
	}
	private MetricType(String value, String filterValue) {
		this.value = value;
		this.filterValue = filterValue;
	}

	public static MetricType getTypeFromString(String valueString) {
		return typeMap.get(valueString);
	}
	
	public static String getValueFromType(MetricType one) {
		return one.value;
	}
	
	public String getFilterValue() {
		return filterValue;
	}
}