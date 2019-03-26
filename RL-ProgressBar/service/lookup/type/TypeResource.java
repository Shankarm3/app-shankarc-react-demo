package com.operasolutions.rl.service.lookup.type;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.core.Response.Status;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.google.inject.Inject;
import com.operasolutions.rl.schema.enums.TPermission;
import com.operasolutions.rl.schema.tables.records.TTypeLookupRecord;
import com.sun.jersey.api.NotFoundException;

/**
 * Lookup for types
 *
 * @author Nirmal Kumar
 */
@Path("/" + TypeResource.URL_TYPES)
@Produces(MediaType.APPLICATION_JSON)
@RequiresAuthentication
public class TypeResource {

    public static final String URL_TYPES = "types";
    protected static final Logger log = LoggerFactory.getLogger(TypeResource.class);

    private final TypeDao typeDao;

    @Context
    UriInfo uriInfo;

    @Inject
    public TypeResource(TypeDao typeDao) {
        this.typeDao = typeDao;
    }

    /**
     * Returns all types
     */
    @GET
    @Path("/{lookupType}")
    public List<TypeRepresentation> getAllTypes(@PathParam("lookupType") String lookupType) {
        log.debug("getAllTypes() - start, lookupType = " + lookupType);

        SecurityUtils.getSubject().checkPermission(TPermission.LOOKUP_TYPES.getPermission());

        // check input parameters
        if (lookupType == null || lookupType.trim().isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        List<TypeRepresentation> result = new ArrayList<TypeRepresentation>();
        for (TTypeLookupRecord one : typeDao.getAllTypes(lookupType)) {
            result.add(getRepresentation(one));
        }

        return result;
    }

    /**
     * Returns all types
     */
    @GET
    @Path("/{lookupType}/{lookupValue}")
    public TypeRepresentation getOneTypeData(@PathParam("lookupType") String lookupType, @PathParam("lookupValue") String lookupValue) {
        log.debug("getAllTypes() - start, lookupType = " + lookupType + ", lookupValue = " + lookupValue);

        SecurityUtils.getSubject().checkPermission(TPermission.READ_TYPE.getPermission());

        // check input parameters
        if (lookupType == null || lookupType.trim().isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }
        if (lookupValue == null || lookupValue.trim().isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        TTypeLookupRecord record = typeDao.getTypeAndValueData(lookupType, lookupValue);

        if (record == null) {
            throw new NotFoundException("Type and value not found.");
        }

        return getRepresentation(record);
    }

    /**
     * Creates representation
     *
     * @param one
     * @return TypeRepresentation
     */
    private TypeRepresentation getRepresentation(TTypeLookupRecord one) {
        TypeRepresentation record = new TypeRepresentation();
        record.type = one.getLookupType();
        record.description = one.getDescription();
        record.value = one.getValue();

        record.uri = uriInfo.getBaseUriBuilder().path(TypeResource.class).path(one.getLookupType()).path(one.getValue()).build();

        return record;
    }

    /**
     * Message class
     *
     */
    public static class TypeRepresentation {

        public URI uri;
        public String type;
        public String description;
        public String value;
    }
}
