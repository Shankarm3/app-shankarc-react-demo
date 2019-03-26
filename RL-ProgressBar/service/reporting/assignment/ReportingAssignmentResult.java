package com.operasolutions.rl.service.reporting.assignment;

/**
 * ReportingAssignmentResult
 *
 * @author Ritwik P R
 */
public class ReportingAssignmentResult {

    public String hospitalId;
    public String hospitalName;
    public String userId;
    public String fName;
    public String lName;

    @Override
    public String toString() {
        StringBuffer result = new StringBuffer();

        result.append("hospitalId = " + hospitalId);
        result.append(", hospitalName = " + hospitalName);
        result.append(", userId = " + userId);
        result.append(", fName = " + fName);
        result.append(", lName = " + lName);

        return result.toString();
    }
}
