package com.operasolutions.rl.service.facilitypeformance;

import java.util.HashMap;
import java.util.Map;

import com.operasolutions.rl.common.ReportConstants;

/**
 * Enum FacilityPerformanceGroupType
 *
 * @author Marcel Bodnar
 */
public enum FacilityPerformanceGroupType {
    DEPT("DEPT", ReportConstants.FACILITY_PERFORMANCE_TABLE_NAME_BY_DEPT, ReportConstants.FACILITY_PERFORMANCE_CHARGES_SHEET_NAME_BY_DEPT, ReportConstants.FACILITY_PERFORMANCE_REPORT_FILE_NAME_BY_DEPT),
    DEPT_PROC("DEPT_PROC", "", "", ""),
    COST_CENTER("COST_CENTER", ReportConstants.FACILITY_PERFORMANCE_TABLE_NAME_BY_COST_CENTER, ReportConstants.FACILITY_PERFORMANCE_CHARGES_SHEET_NAME_BY_COST_CENTER, ReportConstants.FACILITY_PERFORMANCE_REPORT_FILE_NAME_BY_COST_CENTER),
    COST_CENTER_PROC_CODE("COST_CENTER_PROC_CODE", "", "", ""),
    REGION("REGION", ReportConstants.FACILITY_PERFORMANCE_TABLE_NAME_BY_REGION, ReportConstants.FACILITY_PERFORMANCE_CHARGES_SHEET_NAME_BY_REGION, ReportConstants.FACILITY_PERFORMANCE_REPORT_FILE_NAME_BY_REGION),
    REGION_NPI("REGION_NPI", "", "", ""),
    NPI("NPI", ReportConstants.FACILITY_PERFORMANCE_TABLE_NAME_BY_NPI, ReportConstants.FACILITY_PERFORMANCE_CHARGES_SHEET_NAME_BY_NPI, ReportConstants.FACILITY_PERFORMANCE_REPORT_FILE_NAME_BY_NPI),
    NPI_PROC_CODE("NPI_PROC_CODE", "", "", "");

    private String value;
    private String reportHeader;
    private String excelSheetName;
    private String reportFileName;
    private static Map<String, FacilityPerformanceGroupType> typeMap = new HashMap<String, FacilityPerformanceGroupType>();

    static {
        for (FacilityPerformanceGroupType one : FacilityPerformanceGroupType.values()) {
            typeMap.put(one.value, one);
        }
    }

    private FacilityPerformanceGroupType(String value, String reportHeader, String excelSheetName, String reportFileName) {
        this.value = value;
        this.reportHeader = reportHeader;
        this.excelSheetName = excelSheetName;
        this.reportFileName = reportFileName;
    }

    static FacilityPerformanceGroupType getTypeFromString(String valueString) {
        return typeMap.get(valueString);
    }

    static String getStringFromType(FacilityPerformanceGroupType type) {
        return type.value;
    }

    public String getValue() {
        return value;
    }

    public String getReportHeader() {
        return reportHeader;
    }

    public String getReportFileName() {
        return reportFileName;
    }

    public String getExcelSheetName() {
        return excelSheetName;
    }
}
