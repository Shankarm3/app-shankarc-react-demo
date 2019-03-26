package com.operasolutions.rl.service.user;

import java.sql.Timestamp;

import javax.ws.rs.Consumes;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response.Status;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.inject.Inject;
import com.google.inject.persist.Transactional;
import com.operasolutions.rl.auth.AuthUtils;
import com.operasolutions.rl.auth.PasswordGenerator;
import com.operasolutions.rl.common.RevLeakageUtils;
import com.operasolutions.rl.common.email.EmailConstants;
import com.operasolutions.rl.common.email.EmailSender;
import com.operasolutions.rl.common.email.EmailUtils;
import com.operasolutions.rl.exception.RevenueLeakageException;
import com.operasolutions.rl.schema.tables.records.TUserRecord;
import com.sun.jersey.api.NotFoundException;

/**
 * ResetPasswordResource
 *
 * @author Nirmal Kumar
 */
@Path("/" + ResetPasswordResource.PASSWORD_RESET)
public class ResetPasswordResource {

    public static final String PASSWORD_RESET = "passwordReset";
    private final UserDao userDao;
    protected static final Logger log = LoggerFactory.getLogger(ResetPasswordResource.class);

    @Inject
    private EmailSender emailSender;

    @Inject
    public ResetPasswordResource(UserDao userDao) {
        this.userDao = userDao;
    }

    /**
     * Reset user password
     *
     * @param userId
     */
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional(rollbackOn = RevenueLeakageException.class)
    public void resetPassword(String userId) throws RevenueLeakageException {
        log.debug("resetPassword() - start, userId = " + userId);

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
        userDao.storeUser(record);

        emailSender.sendEmail(record.getEmail(), EmailConstants.RESET_PASSWORD_SUBJECT, EmailUtils.composeEmailBody(EmailConstants.RESET_PASSWORD_TEMPLATE_FILE_NAME, record.getFName(), record.getLName(), userId, plainTextPassword), null);
        log.debug("Email has been sent.");
    }
}
