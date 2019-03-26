package com.operasolutions.rl.service.physician.dashboard.peformancecomparison;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * RankUtils
 * 
 * @author Nirmal Kumar
 */
public class RankUtils {
	public static final int TOP_COUNT = 5;
	public static final int BOTTOM_COUNT = 5;

	protected static final Logger log = LoggerFactory.getLogger(RankUtils.class);

	/**
	 * Finds TOP x and BOTTOM x hospitals and sets flag
	 * 
	 * @param dataInput
	 */
//	public static void rankHospitals(List<ChartViewResult> dataInput) {
//
//		for (int i=0; i < dataInput.size(); i++) {
//
//			ChartViewResult one = dataInput.get(i);
//
//			log.debug("Ranking TOP record = " + one);
//
//			if (i + 1 <= TOP_COUNT) {
//				one.isTop5 = true;							
//			}
//			else if (dataInput.size() - i <= BOTTOM_COUNT) {
//				one.isBottom5 = true;							
//			}
//
//			log.debug("Current record after ranking TOP record = " + one);
//		}
//	}
}