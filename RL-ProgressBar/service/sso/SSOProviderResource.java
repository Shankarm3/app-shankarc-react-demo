package com.operasolutions.rl.service.sso;

import java.util.List;

import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response.Status;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.google.inject.Inject;
import com.operasolutions.rl.auth.AuthUtils;
import com.operasolutions.rl.auth.RevenueLeakageTokenAuthenticationFilter;
import com.operasolutions.rl.auth.TokenGenerator;
import com.operasolutions.rl.schema.enums.TPermission;
import com.operasolutions.rl.schema.tables.records.TSsoTokenRecord;
import com.operasolutions.rl.service.user.UserDao;
import com.operasolutions.rl.servlet.RevenueLeakageShiroWebModule;
import com.operasolutions.security.rsa.RSAAuthenticator;
import com.rsa.authagent.authapi.AuthAgentException;

/**
 * SSOProviderResource
 *
 * @author Nirmal Kumar, Ritwik P R
 */
@Path("/" + SSOProviderResource.URL_PROVIDER)
public class SSOProviderResource {

    public static final String URL_PROVIDER = "provider";
    public static final String URL_AUTH = "auth";
    public static final String URL_GENERATOR = "generator";
    public static final String URL_SSO_CREDENTIALS = "ssocredentials";
    public static final String URL_SSO_AUTH = "ssoauth";
    public static final String ROLE_ADMIN = "ADMIN";
    public static final String ROLE_SUPERVISOR = "SUPERVISOR";
    public static final String ROLE_PARAMETER = "ROLE";
    public static final String PACKAGE_PARAMETER = "PACKAGE";
    public static final String CATEGORY_PARAMETER = "CATEGORY";
    private static final String CLIENT_STANDALONE = "standAlone";

    protected static final Logger log = LoggerFactory.getLogger(SSOProviderResource.class);

    private final SSOProviderDao provider;
    private final UserDao userDao;
    private final RSAAuthenticator authenticator;

    @Inject
    public SSOProviderResource(SSOProviderDao provider, UserDao userDao, RSAAuthenticator authenticator) {
        this.provider = provider;
        this.userDao = userDao;
        this.authenticator = authenticator;
        if (RevenueLeakageShiroWebModule.isRSARequest) {
            try {
                authenticator.setConfigFile(RevenueLeakageShiroWebModule.resourceBundle.getString("security.config"));
            } catch (AuthAgentException e) {
                log.error("Exception ", e);
            }
        }
    }

    @POST
    @Path(URL_AUTH)
    public String verifyToken(@FormParam("token") String token) {
        log.debug("verifyToken() - start");

        if (token == null || token.trim().isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        String result = null;

        List<TSsoTokenRecord> record = provider.getUserName(token);

        if (record != null && !record.isEmpty()) {
            result = record.get(0).getUserId();
        }

        log.debug("verifyToken() - end");

        return result;
    }

    @GET
    @Path(URL_GENERATOR)
    @Produces(MediaType.APPLICATION_JSON)
    @RequiresAuthentication
    public String generateAndSaveNewToken() {
        log.debug("generateAndSaveNewToken() - start");

        SecurityUtils.getSubject().checkPermission(TPermission.GENERATE_SSO_TOKEN.getPermission());

        String token = TokenGenerator.generateNewToken();

        int numberOfAffected = provider.saveNewToken(AuthUtils.getLoggedUserName(), token);

        log.debug("generateAndSaveNewToken() - end");
        if (numberOfAffected == 1) {
            return token;
        } else {
            throw new WebApplicationException(Status.INTERNAL_SERVER_ERROR);
        }
    }

    @GET
    @Path(URL_SSO_CREDENTIALS)
    @Produces(MediaType.APPLICATION_JSON)
    @RequiresAuthentication
    public SSOUserRepresentation getSSOCredentials() {
        log.debug("getSSOCredentials() - start");

        String password = SecurityUtils.getSubject().getSession().getAttribute(RevenueLeakageTokenAuthenticationFilter.SSOTOKEN_SESSION_PARAMETER_NAME).toString();
        SSOUserRepresentation userRep = new SSOUserRepresentation();
        userRep.userName = AuthUtils.getLoggedUserName();
        userRep.password = password;

        return userRep;
    }

    public static class SSOUserRepresentation {

        public String userName;
        public String password;
    }

}
