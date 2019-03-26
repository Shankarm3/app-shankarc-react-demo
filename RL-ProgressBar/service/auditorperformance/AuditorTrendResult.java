package com.operasolutions.rl.service.auditorperformance;

import java.math.BigDecimal;
import java.sql.Date;

/**
 * AuditorTrendResult
 *
 * @author Marcel Bodnar
 */
public class AuditorTrendResult implements Comparable<AuditorTrendResult> {

    public Date date;
    public String costCenter;
    public Integer totalCount;
    public Integer reviewedCount;
    public Integer hitCount;
    public BigDecimal hitValue;

    @Override
    public int compareTo(AuditorTrendResult o) {
        if (this.date == null && o.date != null) {
            return -1;
        } else if (this.date != null && o.date == null) {
            return 1;
        } else {
            return this.date.compareTo(o.date);
        }
    }

    @Override
    public String toString() {
        StringBuffer buffer = new StringBuffer();

        buffer.append("date = " + date);
        buffer.append(", totalCount = " + totalCount);
        buffer.append(", reviewedCount = " + reviewedCount);
        buffer.append(", hitCount = " + hitCount);
        buffer.append(", hitValue = " + hitValue);

        return buffer.toString();
    }
}
