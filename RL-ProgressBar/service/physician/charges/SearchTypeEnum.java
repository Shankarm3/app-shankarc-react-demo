package com.operasolutions.rl.service.physician.charges;

import java.util.HashMap;
import java.util.Map;

/**
 * SearchTypeEnum - Enum for search type
 * 
 * @author Nirmal Kumar
 *
 */
public enum SearchTypeEnum {
	EQUALS("equals"), BEGINS_WITH("begins with"), ENDS_WITH("ends with"), CONTAINS("contains");

	private String value;
	private static Map<String, SearchTypeEnum> valueMap = new HashMap<String, SearchTypeEnum>();

	// static constructor
	static
	{
		for (SearchTypeEnum searchType : SearchTypeEnum.values())
		{
			valueMap.put(searchType.value, searchType);
		}
	}

	// constructor
	private SearchTypeEnum(String value) {
		this.value = value;
	}

	/**
	 * Returns enum value
	 * 
	 * @return Enum value
	 */
	public String getValue() {
		return value;
	}
	
	/**
	 * Returns enum instance
	 * 
	 * @param value
	 * @return SearchTypeEnum
	 */
	public static SearchTypeEnum getSearchType(String value) {
		return valueMap.get(value);
	}
}