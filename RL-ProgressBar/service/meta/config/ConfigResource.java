/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.operasolutions.rl.service.meta.config;

import com.google.inject.Inject;
import java.util.HashMap;
import java.util.Map;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response.Status;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author nirmal.kumar
 */
/**
 * Lookup for types
 *
 * @author Nirmal Kumar
 */
@Path("/" + ConfigResource.URL_CONFIG)
@Produces(MediaType.APPLICATION_JSON)
@RequiresAuthentication
public class ConfigResource {

    public static final String URL_CONFIG = "getGridConfig";
    protected static final Logger log = LoggerFactory.getLogger(ConfigResource.class);

    private final ConfigDao configDao;

    @Inject
    public ConfigResource(ConfigDao configDao) {
        this.configDao = configDao;
    }

    /**
     * Returns all types
     *
     * @param screenName
     * @return
     */
    @GET
    public Map<String, Object> getGridConfig(@QueryParam("screenName") String screenName) {
        log.debug("getGridConfig() - start, screenName = " + screenName);

        // check input parameters
        if (screenName == null || screenName.trim().isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }
        Map<String, Object> map = new HashMap<String, Object>();
        return configDao.getJqGridConfig(map, screenName);
    }

    /**
     * Message class
     *
     */
    public static class JqGridRepresentation {

        public String name;
        public Integer width;
        public String sorttype;
        public boolean fixed;
        public String classes;
        public boolean sortable;
        public String align;
        public boolean hidden;
    }

}
