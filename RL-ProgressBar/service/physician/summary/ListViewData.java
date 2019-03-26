package com.operasolutions.rl.service.physician.summary;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import com.operasolutions.rl.common.DbUtils;
import com.operasolutions.rl.common.NumberConstants;
import com.operasolutions.rl.service.physician.summary.SummaryResource.HospitalListData;

/**
 * ListViewData
 *
 * @author Marcel Bodnar
 */
public class ListViewData {

    private final SummaryDao summaryDao;
    public static Integer totalAccounts = 0;
    public static Integer remaining = 0;
    public static Integer completed = 0;
    public static BigDecimal totalHitValue = new BigDecimal(0);
    public static Integer totalHitCount = 0;

    /**
     * Constructor
     *
     * @param summaryDao
     */
    protected ListViewData(SummaryDao summaryDao) {
        if (summaryDao == null) {
            throw new IllegalArgumentException("Input parameter 'summaryDao' cannot be null.");
        }
        this.summaryDao = summaryDao;
    }

    /**
     * Generates listView data
     *
     * @param costCenter
     * @return List<HospitalListData>
     */
    protected List<HospitalListData> generateListViewData(String costCenter) {
        List<ListViewResult> localResult = summaryDao.getPhysListViewData(costCenter);
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
        totalAccounts = 0;
        completed = 0;
        remaining = 0;
        totalHitCount = 0;
        totalHitValue = new BigDecimal(0);
        for (ListViewResult one : inputData) {

            HospitalListData oneHospitalData = new HospitalListData();
            oneHospitalData.hospitalId = one.hospitalId;
            oneHospitalData.fullAuditorName = DbUtils.concatFullUserName(one.fName, one.lName);
            oneHospitalData.hospitalName = one.hospitalName;
            oneHospitalData.userId = one.userId;
            oneHospitalData.costCenter = one.costCenter;
            oneHospitalData.groupKey = one.hospitalId + " | " + one.costCenter;
            oneHospitalData.hospitalShortName = one.hospitalShortName;
            oneHospitalData.completed = one.completed;
            oneHospitalData.remaining = one.remaining;
            oneHospitalData.hitCount = one.hitCount;
            oneHospitalData.hitValue = one.hitValue;
            oneHospitalData.totalAccounts = one.completed + one.remaining;
            BigDecimal cmpltd = new BigDecimal(one.completed * 100);
            BigDecimal ttl = new BigDecimal(oneHospitalData.totalAccounts);
            oneHospitalData.reviewed = cmpltd.divide(ttl, NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_BIG_DECIMAL_SCALE);
            totalAccounts = totalAccounts + oneHospitalData.totalAccounts;
            completed = completed + oneHospitalData.completed;
            remaining = remaining + oneHospitalData.remaining;
            totalHitCount = totalHitCount + oneHospitalData.hitCount;
            totalHitValue = totalHitValue.add(oneHospitalData.hitValue);
            result.add(oneHospitalData);
        }

        return result;
    }

    List<HospitalListData> generateListViewDataByAuditor(String costCenter) {
        List<ListViewResult> localResult = summaryDao.getPhysListViewData(costCenter);
        return postProcessListViewData(localResult);
    }

}
