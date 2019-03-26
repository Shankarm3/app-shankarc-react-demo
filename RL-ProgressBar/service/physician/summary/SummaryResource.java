/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.operasolutions.rl.service.physician.summary;

import com.google.inject.Inject;
import com.operasolutions.rl.schema.enums.TPermission;
import com.sun.jersey.api.core.ResourceContext;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriInfo;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author nirmal.kumar
 */
@Path("/" + SummaryResource.URL_CURRENT_SUMMARY)
@Produces(MediaType.APPLICATION_JSON)
@RequiresAuthentication
public class SummaryResource {

    public static final String URL_CURRENT_SUMMARY = "physCurrentSummary";
    protected static final Logger log = LoggerFactory.getLogger(SummaryResource.class);
    private final SummaryDao summaryDao;

    @Context
    ResourceContext rc;

    @Context
    UriInfo uriInfo;

    @Inject
    public SummaryResource(SummaryDao summaryDao) {
        this.summaryDao = summaryDao;
    }

    /**
     * Get list view
     *
     * @param costCenter
     * @return ListViewRepresentation
     */
    @GET
    public Map getDataForListView(@QueryParam(value = "costCenter") String costCenter) {

        log.debug("getComparisonDataForListView() - start, ");

        SecurityUtils.getSubject().checkPermission(TPermission.READ_LIST_VIEW.getPermission());

        Map map = new HashMap();
        log.debug("Generating listView data...");
        map.put("facilityList", getListViewData(costCenter));
        //map.put("auditorList", getListViewDataByAuditor(costCenter));
        map.put("totalAccount", ListViewData.totalAccounts);
        map.put("remaining", ListViewData.remaining);
        map.put("completed", ListViewData.completed);
        map.put("totalHitCount", ListViewData.totalHitCount);
        map.put("totalHitValue", ListViewData.totalHitValue);

        return map;
    }

    /**
     * Generates data for output
     *
     * @param costCenter
     * @return List<HospitalListData>
     */
    protected List<HospitalListData> getListViewData(String costCenter) {

        return new ListViewData(summaryDao).generateListViewData(costCenter);
    }

    protected List<HospitalListData> getListViewDataByAuditor(String costCenter) {

        return new ListViewData(summaryDao).generateListViewDataByAuditor(costCenter);
    }

    public static class HospitalListData {

        public String hospitalId;
        public String fullAuditorName;
        public String hospitalName;
        public String hospitalShortName;
        public String costCenter;
        public String groupKey;
        public String userId;
        public BigDecimal reviewed = new BigDecimal(0);
        public Integer remaining = 0;
        public Integer totalAccounts = 0;
        public Integer completed = 0;
        public Integer hitCount;
        public BigDecimal hitValue = new BigDecimal(0);
    }
}
