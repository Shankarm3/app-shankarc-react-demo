package com.operasolutions.rl.service.user;

import java.net.URI;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Set;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriBuilder;
import javax.ws.rs.core.UriInfo;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.AuthorizationException;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.inject.Inject;
import com.google.inject.persist.Transactional;
import com.operasolutions.rl.auth.AuthUtils;
import com.operasolutions.rl.auth.PasswordGenerator;
import com.operasolutions.rl.common.DateUtils;
import com.operasolutions.rl.common.DbUtils;
import com.operasolutions.rl.common.RevLeakageUtils;
import com.operasolutions.rl.common.email.EmailConstants;
import com.operasolutions.rl.common.email.EmailSender;
import com.operasolutions.rl.common.email.EmailUtils;
import com.operasolutions.rl.exception.RLConditionFailedException;
import com.operasolutions.rl.exception.RLConflictException;
import com.operasolutions.rl.exception.RevenueLeakageException;
import com.operasolutions.rl.schema.enums.TPermission;
import com.operasolutions.rl.schema.enums.TUserRole;
import com.operasolutions.rl.schema.tables.records.TUserRecord;
import com.operasolutions.rl.service.physician.auditor.assignment.PhysicianAuditorAssignmentDao;
import com.operasolutions.rl.servlet.RevenueLeakageShiroWebModule;
import com.sun.jersey.api.NotFoundException;

/**
 * UserResource
 *
 * @author Nirmal Kumar
 */
@Path("/" + UserResource.URL_USERS)
@Produces(MediaType.APPLICATION_JSON)
@RequiresAuthentication
public class UserResource {

    public static final String URL_USERS = "users";
    public static final String PWD = "pwd";
    public static final String PASSWORD_RESET = "passwordReset";
    public static final String TIME_ZONE = "listTimeZone";
    protected static final Logger log = LoggerFactory.getLogger(UserResource.class);

    private final UserDao userDao;

    @Inject
    private EmailSender emailSender;
    private final PhysicianAuditorAssignmentDao auditorAssignmentDao;

    private boolean allData = true;

    @Context
    UriInfo uriInfo;

    @Inject
    public UserResource(UserDao userDao, PhysicianAuditorAssignmentDao auditorAssignmentDao) {
        this.userDao = userDao;
        this.auditorAssignmentDao = auditorAssignmentDao;
    }

    /**
     * List of users
     *
     * @param role
     * @return List<UserRepresentation>
     */
    @GET
    public List<UserRepresentation> listUsers(@QueryParam("role") String role, @QueryParam("isUserManagement") boolean isUserManagement) {
        log.debug("listUsers() - start, role = " + role + ", isUserManagement = " + isUserManagement);

        boolean allUsers = SecurityUtils.getSubject().isPermitted(TPermission.READ_ALL_USERS.getPermission());
        boolean byRole = SecurityUtils.getSubject().isPermitted(TPermission.READ_USERS_BY_ROLES.getPermission());

        if (!allUsers && !byRole) {
            throw new AuthorizationException();
        }

        TUserRole roleEnum = null;
        // only READ_USERS_BY_ROLES permission
        if (byRole && !allUsers) {
            if (role == null || role.isEmpty()) {
                throw new WebApplicationException(Status.BAD_REQUEST);
            }

            if (role != null && !role.isEmpty()) {
                allData = false;
                roleEnum = TUserRole.valueOf(role);
            }
        }

        if (allUsers) {
            if (role != null && !role.isEmpty()) {
                allData = false;
                roleEnum = TUserRole.valueOf(role);
            } else {
                allData = true;
            }
        }

        List<UserRepresentation> result = new ArrayList<UserRepresentation>();

        for (TUserRecord oneRecord : userDao.getAllUsers(roleEnum, isUserManagement)) {
            result.add(getRepresentation(oneRecord));
        }

        return result;
    }

    /**
     * Gets user by userId
     *
     * @param userId
     * @return UserRepresentation
     */
    @GET
    @Path("/{userId:.*}")
    public UserRepresentation getUser(@PathParam("userId") String userId) {
        log.debug("getUser() - start, userId = " + userId);

        SecurityUtils.getSubject().checkPermission(TPermission.READ_USER_INFO.getPermission());

        if (userId == null || userId.trim().isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        TUserRecord record = userDao.getUser(userId);

        if (record == null) {
            throw new NotFoundException("User not found.");
        }

        return getRepresentation(record);
    }

    /**
     * Deletes user
     *
     * @param userId
     * @return Response
     */
    @DELETE
    @Path("/{userId:.*}")
    public Response deleteUser(@PathParam("userId") String userId) {
        log.debug("deleteUser() - start, userId = " + userId);

        SecurityUtils.getSubject().checkPermission(TPermission.DISABLE_USER.getPermission());

        Response response = Response.status(Status.NO_CONTENT).build();

        if (userId == null || userId.trim().isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        if (!auditorAssignmentDao.hasUserAssignment(userId)) {
            int count = userDao.deleteUser(userId);

            if (count == 0) {
                throw new NotFoundException("User not found.");
            }

            log.debug("User disabled succesfully.");
        } else {
            response = Response.status(Status.CONFLICT).build();
        }

        return response;
    }

    /**
     * Creates user
     *
     * @param postBody
     * @return Response
     * @throws RevenueLeakageException
     */
    @POST
    @Transactional(rollbackOn = RevenueLeakageException.class)
    public Response createUser(UserRepresentation postBody) throws RevenueLeakageException {
        log.debug("createUser() - start");

        SecurityUtils.getSubject().checkPermission(TPermission.CREATE_NEW_USER.getPermission());

        if (postBody.userId == null || postBody.userId.trim().isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        if (postBody.email == null || postBody.email.trim().isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        if (postBody.fName == null || postBody.fName.trim().isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        if (postBody.lName == null || postBody.lName.trim().isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        if (userDao.getUser(postBody.userId) != null) {
            throw new RLConflictException(RLConflictException.USER_DUPLICATE);
        }

        String plainTextPassword = PasswordGenerator.generateNewPassword();

        TUserRecord record = new TUserRecord();
        record.setUserId(postBody.userId);
        record.setPwd(AuthUtils.getEncrypedString(plainTextPassword));
        record.setFName(postBody.fName);
        record.setLName(postBody.lName);
        record.setUType(TUserRole.valueOf(postBody.uType));
        record.setEmail(postBody.email);
        record.setPhoneNbr(postBody.phoneNbr);
        record.setPrimaryLoc(postBody.primaryLoc);
        record.setManager(postBody.manager);
        record.setCreatedBy(AuthUtils.getLoggedUserName());
        record.setLoginAttempt((byte) 0);
        record.setUpdateTime(new Timestamp(System.currentTimeMillis()));
        record.setEnabled(Boolean.TRUE);
        record.setTimeZone(postBody.timeZone);
        record.setPwdValidTillDate(new Timestamp(RevLeakageUtils.getPasswordValidTillDate().getTimeInMillis()));

        userDao.storeUser(record);

        log.debug("Sending email...");

        if (!RevenueLeakageShiroWebModule.isRSARequest) {
            emailSender.sendEmail(postBody.email, EmailConstants.CREATE_USER_SUBJECT, EmailUtils.composeEmailBody(EmailConstants.CREATE_USER_TEMPLATE_FILE_NAME, postBody.fName, postBody.lName, postBody.userId, plainTextPassword), null);
        }

        log.debug("Email has been sent.");

        return Response.status(Response.Status.ACCEPTED).location(userUriForId(record.getUserId())).build();
    }

    /**
     * Updates user
     *
     * @param postBody
     * @return Response
     */
    @PUT
    @Path("/{userId:.*}")
    public Response updateUser(UserRepresentation postBody) {
        log.debug("updateUser() - start");

        SecurityUtils.getSubject().checkPermission(TPermission.UPDATE_USER.getPermission());

        if (postBody.userId == null || postBody.userId.trim().isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        if (postBody.fName == null || postBody.fName.trim().isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        if (postBody.lName == null || postBody.lName.trim().isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        if (postBody.uType == null || postBody.uType.trim().isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        TUserRecord record = userDao.getUser(postBody.userId);

        if (record == null) {
            throw new NotFoundException("User not found.");
        }
        if (!postBody.isEnabled) {
            if (auditorAssignmentDao.hasUserAssignment(postBody.userId.trim())) {
                return Response.status(Response.Status.CONFLICT).location(uriInfo.getAbsolutePath()).build();
            }
        }
        if (postBody.pwd != null && !postBody.pwd.isEmpty()) {
            record.setPwd(AuthUtils.getEncrypedString(postBody.pwd));
        }

        record.setFName(postBody.fName);
        record.setLName(postBody.lName);
        record.setUType(TUserRole.valueOf(postBody.uType));
        record.setEmail(postBody.email);
        record.setPhoneNbr(postBody.phoneNbr);
        record.setPrimaryLoc(postBody.primaryLoc);
        record.setManager(postBody.manager);
        record.setUpdateTime(new Timestamp(System.currentTimeMillis()));
        record.setLoginAttempt((byte) 0);
        record.setEnabled(postBody.isEnabled);
        record.setTimeZone(postBody.timeZone);
        userDao.storeUser(record);

        return Response.status(Response.Status.ACCEPTED).location(userUriForId(record.getUserId())).build();
    }

    /**
     * Updates user password
     *
     * @param userId
     * @param data
     */
    @PUT
    @Path("/{userId:.*}/" + PWD)
    @Consumes(MediaType.APPLICATION_JSON)
    public void updatePassword(@PathParam("userId") String userId, ChangePasswordInput data) {
        log.debug("updatePassword() - start, userId = " + userId);

        SecurityUtils.getSubject().checkPermission(TPermission.UPDATE_PASSWORD.getPermission());

        // check input parameters
        if (userId == null || userId.trim().isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }
        if (data.newPwd == null || data.newPwd.trim().isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }
        if (data.currentPassword == null || data.currentPassword.trim().isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        if (!AuthUtils.isUserValid(userId)) {
            throw new AuthorizationException("You are not changing your password.");
        }

        TUserRecord record = userDao.getUser(userId);

        if (!AuthUtils.isPlainPasswordValid(data.currentPassword, record.getPwd())) {
            throw new RLConditionFailedException(RLConditionFailedException.OLDPASSWORD_NOTMATCHING);
        }

        record.setPwd(AuthUtils.getEncrypedString(data.newPwd));
        record.setUpdateTime(new Timestamp(System.currentTimeMillis()));
        record.setPwdValidTillDate(new Timestamp(RevLeakageUtils.getPasswordValidTillDate().getTimeInMillis()));

        userDao.storeUser(record);
    }

    /**
     * Reset user password
     *
     * @param userId
     */
    @PUT
    @Path("/" + PASSWORD_RESET)
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional(rollbackOn = RevenueLeakageException.class)
    public void resetPassword(String userId) throws RevenueLeakageException {
        log.debug("resetPassword() - start, userId = " + userId);

        SecurityUtils.getSubject().checkPermission(TPermission.RESET_PASSWORD.getPermission());

        // check input parameters
        if (userId == null || userId.trim().isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        TUserRecord record = userDao.getUser(userId);

        if (record == null) {
            throw new NotFoundException("User not found.");
        }

        String plainTextPassword = PasswordGenerator.generateNewPassword();

        record.setPwd(AuthUtils.getEncrypedString(plainTextPassword));
        record.setUpdateTime(new Timestamp(System.currentTimeMillis()));
        record.setPwdValidTillDate(new Timestamp(RevLeakageUtils.getPasswordValidTillDate().getTimeInMillis()));
        record.setLoginAttempt((byte) 0);
        record.setEnabled(true);
        userDao.storeUser(record);

        emailSender.sendEmail(record.getEmail(), EmailConstants.RESET_PASSWORD_SUBJECT, EmailUtils.composeEmailBody(EmailConstants.RESET_PASSWORD_TEMPLATE_FILE_NAME, record.getFName(), record.getLName(), userId, plainTextPassword), null);
        log.debug("Email has been sent.");
    }

    private URI userUriForId(String userId) {
        UriBuilder ub = uriInfo.getAbsolutePathBuilder();
        URI uri = ub.path(userId).build();

        return uri;
    }

    private UserRepresentation getRepresentation(TUserRecord record) {
        UserRepresentation result = new UserRepresentation();

        result.userId = record.getUserId();
        result.fName = record.getFName();
        result.lName = record.getLName();
        result.fullUserName = DbUtils.concatFullUserName(record.getFName(), record.getLName());
        result.isEnabled = record.getEnabled();
        result.timeZone = record.getTimeZone();
        Timestamp pwdVaildDte = record.getPwdValidTillDate();

        if (pwdVaildDte != null) {
            Calendar cal1 = Calendar.getInstance();
            cal1.set(Calendar.HOUR, 0);
            cal1.set(Calendar.MINUTE, 0);
            cal1.set(Calendar.SECOND, 0);
            cal1.set(Calendar.MILLISECOND, 0);

            Calendar cal2 = Calendar.getInstance();
            cal2.setTimeInMillis(pwdVaildDte.getTime());
            result.pwdValidDays = DateUtils.getDaysBetweenDates(cal1.getTime(), cal2.getTime());
        }

        if (record.getUType() != null) {
            result.uType = record.getUType().getUType();

            //This check is used during SAML based integration when the role info is stored in external system (IDP)
            if (SecurityUtils.getSubject() != null && SecurityUtils.getSubject().getSession() != null && SecurityUtils.getSubject().getSession().getAttribute("ROLE") != null) {
                log.debug(" uType 1:  " + result.uType);
                result.uType = ((Set<Object>) SecurityUtils.getSubject().getSession().getAttribute("ROLE")).toString().replaceAll("\\[", "").replaceAll("\\]", "");
                log.debug(" uType 2:  " + result.uType);
            }
        }

        // I don't want to publish all data
        if (allData) {
            result.email = record.getEmail();
            result.phoneNbr = record.getPhoneNbr();
            result.primaryLoc = record.getPrimaryLoc();
            result.manager = record.getManager();
            result.createdBy = record.getCreatedBy();
        }

        result.uri = uriInfo.getBaseUriBuilder().path(UserResource.class).path(result.userId).build();

        return result;
    }

    /**
     * User message class
     */
    public static class UserRepresentation {

        public URI uri;

        public String userId;
        public String pwd;
        public String fName;
        public String lName;
        public String uType;
        public String email;
        public String phoneNbr;
        public String primaryLoc;
        public String manager;
        public String createdBy;
        public String fullUserName;
        public int pwdValidDays;
        public Boolean isEnabled;
        public String timeZone;
    }

    /**
     * Message input class for change password
     *
     */
    public static class ChangePasswordInput {

        public String newPwd;
        public String currentPassword;
    }

    @GET
    @Path(TIME_ZONE)
    public List<TimeZoneResult> getListTime() {
        log.debug("getListTime() - start");

        SecurityUtils.getSubject().checkPermission(TPermission.READ_USER_INFO.getPermission());
        return userDao.getAllTimeZone();
    }

    public static class TimeZoneResult {

        public String code;
        public String name;
    }
}
