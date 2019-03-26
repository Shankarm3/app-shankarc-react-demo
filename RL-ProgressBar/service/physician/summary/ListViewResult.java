package com.operasolutions.rl.service.physician.summary;

import java.math.BigDecimal;

/**
 * ListViewResult
 *
 * @author Marcel Bodnar
 */
public class ListViewResult {

    public String hospitalId;
    public String hospitalName;
    public String hospitalShortName;
    public String lName;
    public String fName;
    public String userId;
    public Integer totalAccounts;
    public Integer remaining;
    public Integer completed;
    public BigDecimal reviewed = new BigDecimal(0);
    public Integer hitCount;
    public BigDecimal hitValue = new BigDecimal(0);
    public String costCenter;

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
        ListViewResult other = (ListViewResult) obj;
        if (hospitalId == null) {
            if (other.hospitalId != null) {
                return false;
            }
        } else if (!hospitalId.equals(other.hospitalId)) {
            return false;
        } else if (!costCenter.equals(other.costCenter)) {
            return false;
        } else if (!userId.equals(other.userId)) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        StringBuffer result = new StringBuffer();
        result.append("hospitalId = " + hospitalId);
        result.append(", hospitalName = " + hospitalName);
        result.append(", hospitalShortName = " + hospitalShortName);
        result.append(", lName = " + lName);
        result.append(", fName = " + fName);
        result.append(", userId = " + userId);
        result.append(", totalAccounts = " + totalAccounts);
        return result.toString();
    }
}
