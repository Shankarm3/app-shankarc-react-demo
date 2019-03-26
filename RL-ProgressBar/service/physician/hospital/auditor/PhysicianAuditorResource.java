package com.operasolutions.rl.service.physician.hospital.auditor;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.inject.Inject;
import com.operasolutions.rl.auth.AuthUtils;
import com.operasolutions.rl.common.DbUtils;
import com.operasolutions.rl.schema.enums.TPermission;
import com.operasolutions.rl.schema.enums.TUserRole;
import com.operasolutions.rl.schema.tables.records.TUserRecord;
import com.operasolutions.rl.service.user.UserDao;
import com.operasolutions.rl.service.user.UserResource.UserRepresentation;
import com.sun.jersey.api.core.ResourceContext;
import java.util.Set;

/**
 * PhysicianAuditorResource
 *
 * @author Nirmal Kumar
 * @author Nirmal Kumar
 */
@Produces(MediaType.APPLICATION_JSON)
@Path("/" + PhysicianAuditorResource.URL_AUDITORS)
@RequiresAuthentication
public class PhysicianAuditorResource {

    public static final String URL_AUDITORS = "physicianAuditors";
    public static final String URL_GET_ALL_AUDITOR = "getAllAuditor";
    public static final String URL_GET_ALL_PHYS_AUDITOR = "getAllPhyscianAuditor";
    protected static final Logger log = LoggerFactory.getLogger(PhysicianAuditorResource.class);
    private final PhysicianAuditorDao auditorDao;

    @Context
    ResourceContext rc;

    @Inject
    private UserDao userDao;

    @Inject
    public PhysicianAuditorResource(PhysicianAuditorDao auditorDao) {
        this.auditorDao = auditorDao;
    }

    /**
     * List of assigned auditors
     *
     * @return List<UserRepresentation>
     */
    @GET
    public List<UserRepresentation> getAuditorsList() {
        log.debug("getAuditorsList() - start");

        SecurityUtils.getSubject().checkPermission(TPermission.READ_AUDITORS.getPermission());

        List<UserRepresentation> result = new ArrayList<UserRepresentation>();
        if (SecurityUtils.getSubject().hasRole(TUserRole.PHYSICIAN_RPT_USER.getUType())) {
            for (AuditorRepresentation oneRecord : auditorDao.getReportAuditorList(AuthUtils.getLoggedUserName())) {
                log.debug("Processing result, auditorId = " + oneRecord.userId);
                TUserRecord record = userDao.getUser(oneRecord.userId);
                if (record != null) {
                    result.add(getRepresentation(record));
                }
            }
        } else {
            for (AuditorRepresentation oneRecord : auditorDao.getAuditorList()) {
                log.debug("Processing result, auditorId = " + oneRecord.userId);
                TUserRecord record = userDao.getUser(oneRecord.userId);
                if (record != null) {
                    result.add(getRepresentation(record));
                }
            }
        }
        return result;
    }

    /**
     *
     * @return
     */
    @GET
    @Path(URL_GET_ALL_AUDITOR)
    public List<UserRepresentation> getAllAuditor() {
        SecurityUtils.getSubject().checkPermission(TPermission.READ_AUDITORS.getPermission());
        List<UserRepresentation> result = new ArrayList<UserRepresentation>();
        for (String userId : auditorDao.getAllAuditor()) {
            log.debug("Processing result, auditorId = " + userId);
            TUserRecord record = userDao.getUser(userId);
            if (record != null) {
                result.add(getRepresentation(record));
            }
        }
        return result;
    }

    /**
     * *
     * @return
     */
    @GET
    @Path(URL_GET_ALL_PHYS_AUDITOR)
    public List<UserRepresentation> getAllPhysicianAuditor() {
        SecurityUtils.getSubject().checkPermission(TPermission.READ_AUDITORS.getPermission());
        List<UserRepresentation> result = new ArrayList<UserRepresentation>();
        for (String userId : auditorDao.getAllPhysicianAuditor()) {
            log.debug("Processing result, auditorId = " + userId);
            TUserRecord record = userDao.getUser(userId);
            if (record != null) {
                result.add(getRepresentation(record));
            }

        }

        return result;
    }

    private UserRepresentation getRepresentation(TUserRecord record) {
        UserRepresentation result = new UserRepresentation();

        result.userId = record.getUserId();
        result.fName = record.getFName();
        result.lName = record.getLName();
        result.fullUserName = DbUtils.concatFullUserName(record.getFName(), record.getLName());
        result.isEnabled = record.getEnabled();
        result.timeZone = record.getTimeZone();
        if (record.getUType() != null) {
            result.uType = record.getUType().getUType();

            //This check is used during SAML based integration when the role info is stored in external system (IDP)
            if (SecurityUtils.getSubject() != null && SecurityUtils.getSubject().getSession() != null && SecurityUtils.getSubject().getSession().getAttribute("ROLE") != null) {
                log.debug(" uType 1:  " + result.uType);
                result.uType = ((Set<Object>) SecurityUtils.getSubject().getSession().getAttribute("ROLE")).toString().replaceAll("\\[", "").replaceAll("\\]", "");
                log.debug(" uType 2:  " + result.uType);
            }
        }

        return result;
    }

    /**
     * Message class
     */
    public static class AuditorRepresentation {

        public String userId;
    }
}
