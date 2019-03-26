package com.operasolutions.rl.service.facilitypeformance;

import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.operasolutions.rl.common.NumberConstants;

/**
 * FacilityPerformanceDataProcessor
 *
 * @author Marcel Bodnar
 */
public class FacilityPerformanceDataProcessor {

    protected static final Logger log = LoggerFactory.getLogger(FacilityPerformanceDataProcessor.class);

    private List<GridDataResult> inputData;
    private List<GridDataResult> inputDeptChargeList; // combine data for Dept and charge code

    /**
     * Internal structure for effective data processing
     */
    protected Map<String, GridDataResult> mapResults;

    enum RankType {

        FIRST, SECOND;
    }

    /**
     * Constructor
     *
     * @param inputData
     */
    protected FacilityPerformanceDataProcessor(List<GridDataResult> inputData, List<GridDataResult> inputDeptChargeList) {
        if (inputData == null) {
            throw new IllegalArgumentException("Input parameter 'inputData' cannot be null.");
        }
        this.inputData = inputData;
        this.inputDeptChargeList = inputDeptChargeList;
        mapResults = new HashMap<String, GridDataResult>(inputData.size());

        // populate Map
        for (GridDataResult one : inputData) {
            mapResults.put(one.getRecordIdentifier().toLowerCase(), one);
        }
    }

    protected FacilityPerformanceDataProcessor(List<GridDataResult> inputData) {
        if (inputData == null) {
            throw new IllegalArgumentException("Input parameter 'inputData' cannot be null.");
        }

        this.inputData = inputData;
        mapResults = new HashMap<String, GridDataResult>(inputData.size());

        // populate Map
        for (GridDataResult one : inputData) {
            mapResults.put(one.getRecordIdentifier().toLowerCase(), one);
        }
    }

    /**
     * Processes input collection and generates output data based on ranking
     * system
     *
     * @return
     */
    protected List<GridDataResult> processInputCollection() {

        sortCollection();

        return inputData;
    }

    /**
     * Sorts collections by hitValue
     */
    protected void sortCollection() {

        class GridDataResultComparator implements Comparator<GridDataResult> {

            @Override
            public int compare(GridDataResult o1, GridDataResult o2) {
                if (o1.hitValue == null && o2.hitValue != null) {
                    return -1;
                } else if (o1.hitValue != null && o2.hitValue == null) {
                    return 1;
                } else {
                    return o1.hitValue.setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE).compareTo(o2.hitValue.setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE));
                }
            }
        }

        Collections.sort(inputData, Collections.reverseOrder(new GridDataResultComparator()));
    }

    public List<GridDataResult> getInputDeptChargeList() {
        return inputDeptChargeList;
    }

}
