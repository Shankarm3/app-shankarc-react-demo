package com.operasolutions.rl.service.physician.dashboard.peformancecomparison;

import java.util.ArrayList;
import java.util.List;

import com.operasolutions.rl.common.DbUtils;
import com.operasolutions.rl.common.NumberConstants;
import com.operasolutions.rl.common.chart.ReportedPeriodData;
import com.operasolutions.rl.service.physician.dashboard.peformancecomparison.PhysicianPerformanceComparisonResource.HospitalListData;

/**
 * ListViewData
 *
 * @author Nirmal Kumar
 */
public class ListViewData {

    protected final ReportedPeriodData reportPeriodData;
    private final PhysicianPerformanceComparisonDao businessDao;
    private final List<String> hospitalList;
    private final List<String> deptList;

    /**
     * Constructor
     *
     * @param reportPeriodData
     * @param businessDao
     * @param hospitalList
     * @param deptList
     */
    protected ListViewData(ReportedPeriodData reportPeriodData, PhysicianPerformanceComparisonDao businessDao, List<String> hospitalList, List<String> deptList) {
        if (reportPeriodData == null) {
            throw new IllegalArgumentException("Input parameter 'reportPeriodData' cannot be null.");
        }
        if (businessDao == null) {
            throw new IllegalArgumentException("Input parameter 'businessDao' cannot be null.");
        }

        this.reportPeriodData = reportPeriodData;
        this.businessDao = businessDao;
        this.hospitalList = hospitalList;
        this.deptList = deptList;
    }

    /**
     * Generates listView data
     *
     * @return List<HospitalListData>
     */
    protected List<HospitalListData> generateListViewData() {

        List<ListViewResult> localResult = new ArrayList<ListViewResult>(0);

        localResult = businessDao.getListViewData(new java.sql.Date(reportPeriodData.getMinDate().getTimeInMillis()), new java.sql.Date(reportPeriodData.getMaxDate().getTimeInMillis()), hospitalList, deptList);

        return postProcessListViewData(localResult);
    }

    /**
     * Formats data from DAO into representation
     *
     * @param inputData
     * @return List<HospitalListData>
     */
    protected List<HospitalListData> postProcessListViewData(List<ListViewResult> inputData) {

        List<HospitalListData> result = new ArrayList<HospitalListData>();

        for (ListViewResult one : inputData) {

            HospitalListData oneHospitalData = new HospitalListData();
            oneHospitalData.hospitalId = one.hospitalId;

            oneHospitalData.fullAuditorName = DbUtils.concatFullUserName(one.fName, one.lName);
            oneHospitalData.hospitalName = one.hospitalName;
            oneHospitalData.hospitalShortName = one.hospitalShortName;

            if (one.hitRate != null) {
                oneHospitalData.hitRate = one.hitRate.setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_BIG_DECIMAL_SCALE);
            }
            if (one.reviewRate != null) {
                oneHospitalData.reviewRate = one.reviewRate.setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_BIG_DECIMAL_SCALE);
            }
            if (one.reviewedCount != null) {
                oneHospitalData.reviewedCount = one.reviewedCount;
            }
            if (one.totalAccounts != null) {
                oneHospitalData.totalAccounts = one.totalAccounts;
            }
            if (one.hitCount != null) {
                oneHospitalData.hitCount = one.hitCount;
            }
            if (one.hitValue != null) {
                oneHospitalData.hitValue = one.hitValue.setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_BIG_DECIMAL_SCALE);
            }

            result.add(oneHospitalData);
        }

        return result;
    }
}
