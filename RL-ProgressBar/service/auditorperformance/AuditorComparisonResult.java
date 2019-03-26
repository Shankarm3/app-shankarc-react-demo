package com.operasolutions.rl.service.auditorperformance;

import java.math.BigDecimal;

/**
 * AuditorComparisonResult
 *
 * @author Marcel Bodnar
 */
public class AuditorComparisonResult {

    public String userId;
    public String fName;
    public String lName;
    public Integer totalCostCenter = 0;
    public BigDecimal hitValue = new BigDecimal(0);
    public Integer reviewedAccount = 0;
    public Integer hitAccount = 0;

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((userId == null) ? 0 : userId.hashCode());

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
        AuditorComparisonResult other = (AuditorComparisonResult) obj;
        if (userId == null) {
            if (other.userId != null) {
                return false;
            }
        } else if (!userId.equals(other.userId)) {
            return false;
        }
        return true;
    }
}
