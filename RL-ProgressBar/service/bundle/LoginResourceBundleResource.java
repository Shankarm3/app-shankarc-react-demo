package com.operasolutions.rl.service.bundle;

import java.io.IOException;
import java.util.Properties;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * LoginResourceBundleResource - Loads
 * com/operasolutions/rl/bundle/login/messages.properties which contains the
 * error messages corresponding to the login module.
 *
 * @author Nirmal Kumar
 */
@Path("/" + LoginResourceBundleResource.URL_RESOURCE_BUNDLE)
@Produces(MediaType.TEXT_PLAIN)
public class LoginResourceBundleResource extends ResourceBundleResource {

    public static final String URL_RESOURCE_BUNDLE = "bundles/login";
    private static final String FILE_LOCATION_PREFIX = "/com/operasolutions/rl/bundle/login/";
    private static final String FILE_LOCATION_PREFIX_CUSTOM = "/com/operasolutions/rl/bundle/custom/login/";
    protected static final Logger log = LoggerFactory.getLogger(LoginResourceBundleResource.class);

    @GET
    @Path("/{language}")
    public String getResourceBundleFile(@PathParam("language") String language) {

        Properties finalProps = new Properties();

        try {
            String fileLocation = FILE_LOCATION_PREFIX + language;
            loadAndMergeFile(finalProps, fileLocation);
            loadAndMergeFile(finalProps, FILE_LOCATION_PREFIX_CUSTOM + language);

        } catch (IOException e) {
            log.error("An error during loading resource bundle file.", e);
        }
        String result = serializeIntoString(finalProps);

        return result;
    }

}
