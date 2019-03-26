package com.operasolutions.rl.service.security;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.operasolutions.rl.servlet.RevenueLeakageShiroWebModule;

/**
 * SecurityProviderResource
 *
 * @author Nirmal Kumar
 */
@Path("/" + SecurityResource.URL_SECURITY)
public class SecurityResource {

    public static final String URL_SECURITY = "security";
    public static final String URL_IMPLEMENTATION = "impl";

    protected static final Logger log = LoggerFactory.getLogger(SecurityResource.class);

    @GET
    @Path(URL_IMPLEMENTATION)
    @Produces(MediaType.TEXT_PLAIN)
    public String getSecurityImplementation() {
        log.debug("getSecurityImplementation() - start");
        String impl = "";
        impl = RevenueLeakageShiroWebModule.isRSARequest ? "rsa" : "form";
        log.info("security impl : " + impl);
        log.debug("getSecurityImplementation() - end");
        return impl;
    }

}
