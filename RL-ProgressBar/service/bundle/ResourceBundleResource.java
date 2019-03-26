package com.operasolutions.rl.service.bundle;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;
import java.util.Set;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.operasolutions.rl.exception.RevenueLeakageException;
import com.operasolutions.rl.schema.enums.TPermission;
import static com.operasolutions.rl.servlet.RevenueLeakageShiroWebModule.propertyMap;

/**
 * ResourceBundleResource - merges two resource bundles file into one file
 *
 * @author Nirmal Kumar
 */
@Path("/" + ResourceBundleResource.URL_RESOURCE_BUNDLE)
@Produces(MediaType.TEXT_PLAIN)
@RequiresAuthentication
public class ResourceBundleResource {

    public static final String URL_RESOURCE_BUNDLE = "bundles";
    private static final String COMMON_FILE_LOCATION = "/com/operasolutions/rl/bundle/common/messages_en.properties";
    private static final String CUSTOM_FILE_LOCATION = "/com/operasolutions/rl/bundle/custom/messages_en.properties";

    protected static final Logger log = LoggerFactory.getLogger(ResourceBundleResource.class);

    @GET
    @Path("/{language}")
    public String getResourceBundleFile(@PathParam("language") String language) throws RevenueLeakageException {

        SecurityUtils.getSubject().checkPermission(TPermission.READ_RESOURCE_BUNDLE.getPermission());

        Properties finalProps = new Properties();

        try {
            loadAndMergeFile(finalProps, COMMON_FILE_LOCATION);
            loadAndMergeFile(finalProps, CUSTOM_FILE_LOCATION);
        } catch (IOException e) {
            // I ignore errors, only log them
            log.error("An error during loading resource bundle file.", e);
        }

        // it might be nicer solution to create subclass from Properties
        String result = serializeIntoString(finalProps);
        for (final String name : finalProps.stringPropertyNames()) {
            propertyMap.put(name, finalProps.getProperty(name));
        }

        return result;
    }

    /**
     * Loads file into properties object
     *
     * @param fileName
     * @throws IOException
     */
    protected void loadAndMergeFile(Properties props, String fileName) throws IOException {
        if (props == null) {
            throw new IllegalArgumentException("Input parameter 'props' cannot be null.");
        }
        if (fileName == null) {
            throw new IllegalArgumentException("Input parameter 'fileName' cannot be null.");
        }

        Properties result = new Properties();
        InputStream inStream = this.getClass().getResourceAsStream(fileName);
        if (inStream != null) {
            result.load(inStream);
            mergeProperties(props, result);
        }
    }

    /**
     * Merges two properties file, the result is in the first parameter
     *
     * @param result
     * @param toMerge
     */
    protected void mergeProperties(Properties result, Properties toMerge) {
        if (result == null) {
            throw new IllegalArgumentException("Input parameter 'result' cannot be null.");
        }
        if (toMerge == null) {
            throw new IllegalArgumentException("Input parameter 'toMerge' cannot be null.");
        }

        result.putAll(toMerge);
    }

    /**
     * Serializes Properties into String
     *
     * @param props
     * @return String
     */
    protected String serializeIntoString(Properties props) {
        StringBuffer result = new StringBuffer();

        if (props != null && props.size() != 0) {
            Set<Object> keySet = props.keySet();
            for (Object key : keySet) {
                String value = (String) props.get(key);
                result.append(key + "=" + value);
                result.append(System.getProperty("line.separator"));
            }
        }

        return result.toString();
    }
}
