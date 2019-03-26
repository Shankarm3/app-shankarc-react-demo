package com.operasolutions.rl.service.physician.dashboard.overaltrend;

import java.math.BigDecimal;
import java.sql.Date;

/**
 * PhysicianOveralTrendResult - class for results from DB
 * 
 * @author Nirmal Kumar
 */
public class PhysicianOveralTrendResult implements Comparable<PhysicianOveralTrendResult> {	
	public Date date;
	public Integer totalCount;
	public Integer reviewedCount;
	public Integer hitCount;
	public BigDecimal hitValue;

	@Override
	public int compareTo(PhysicianOveralTrendResult o) {
	  if (this.date == null && o.date != null) {
	        return -1;
	    }
	    else if (this.date != null && o.date == null) {
	        return 1;
	    }
	    else {
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