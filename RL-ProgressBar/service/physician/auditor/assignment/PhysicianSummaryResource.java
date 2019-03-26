/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.operasolutions.rl.service.physician.auditor.assignment;

import com.google.inject.Inject;
import com.operasolutions.rl.schema.enums.TPermission;
import java.util.ArrayList;
import java.util.List;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author nirmal.kumar
 */
@Path("/" + PhysicianSummaryResource.URL_SUMMARY)
@Produces(MediaType.APPLICATION_JSON)
@RequiresAuthentication
public class PhysicianSummaryResource {

    public static final String URL_SUMMARY = "viewCodeAssignment";
    protected static final Logger log = LoggerFactory.getLogger(PhysicianSummaryResource.class);

    private final PhysicianAuditorAssignmentDao businessDao;

    @Inject
    public PhysicianSummaryResource(PhysicianAuditorAssignmentDao businessDao) {
        this.businessDao = businessDao;
    }

    /**
     * Reads all hospital assignments
     *
     * @return List<AuditorAssignmentRepresentation>
     */
    @GET
    public List<SummaryRepresentation> getAllAssignments() {
        log.debug("getAllAssignments() - start");

        SecurityUtils.getSubject().checkPermission(TPermission.READ_HOSPITALS_ASSIGNMENTS.getPermission());
        List<SummaryResult> list = businessDao.getSummaryViewCodeAssignment();
        log.debug("Number of size = " + list.size());
        return getRepresentation(list);
    }

    public List<SummaryRepresentation> getRepresentation(List<SummaryResult> list) {
        List<SummaryRepresentation> representations = new ArrayList<SummaryRepresentation>(0);
        for (SummaryResult one : list) {
            SummaryRepresentation oneRecord = new SummaryRepresentation();
            oneRecord.source = one.source;
            oneRecord.costCenter = one.costCenter;
            oneRecord.hospitalId = one.hospitalId;
            oneRecord.userId = one.cenAuditorId;
            oneRecord.count = one.count;
            oneRecord.shortName = one.shortName;
            oneRecord.hospitalName = one.hospitalName;
            representations.add(oneRecord);
        }
        return representations;
    }

    public static class SummaryRepresentation {

        public String source;
        public String costCenter;
        public String hospitalId;
        public String userId;
        public Integer count;
        public String shortName;
        public String hospitalName;

    }

    public static class SummaryResult {

        public String source;
        public String costCenter;
        public String hospitalId;
        public String cenAuditorId;
        public Integer count;
        public String shortName;
        public String hospitalName;

    }
}
