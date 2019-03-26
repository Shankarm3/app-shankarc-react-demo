package com.operasolutions.rl.service.physician.dashboard.peformancecomparison;

import java.math.BigDecimal;

/**
 * ChartViewResult
 *
 * @author Nirmal Kumar
 */
public class ChartViewResult {
    // dummy attributes

    public String costCenter;
    public String divisionName;
    public String hospitalId;
    public String hospitalName;
    public String hospitalShortName;
    public Integer totalAccounts = 0;
    public Integer hitCount = 0;
    public Integer reviewedCount = 0;
    public BigDecimal hitValue = new BigDecimal(0);
    public BigDecimal reviewRate = new BigDecimal(0);
    public BigDecimal hitValueYTD = new BigDecimal(0);
    public BigDecimal reviewRateYTD = new BigDecimal(0);
    public Integer totalAccountsYTD = 0;
    public Integer reviewedCountYTD = 0;

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((hospitalId == null) ? 0 : hospitalId.hashCode());

        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        ChartViewResult other = (ChartViewResult) obj;
        if (hospitalId == null) {
            if (other.hospitalId != null) {
                return false;
            }
        } else if (!hospitalId.equals(other.hospitalId)) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        StringBuffer result = new StringBuffer();
        result.append(", reviewRate = " + reviewRate);
        result.append(", hitValue = " + hitValue);
        result.append(", reviewedCount = " + reviewedCount);
        result.append(", totalAccounts = " + totalAccounts);
        result.append(", hospitalId = " + hospitalId);

        return result.toString();
    }
}
