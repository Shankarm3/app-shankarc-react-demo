/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.operasolutions.rl.service.modifier;

import java.net.URI;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriInfo;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.inject.Inject;
import com.operasolutions.rl.schema.enums.TPermission;
import com.operasolutions.rl.schema.tables.TPhysHcpcModifier;
import com.operasolutions.rl.schema.tables.records.TPhysHcpcModifierRecord;
import com.operasolutions.rl.service.physician.charges.PhysicianLookupChargeMasterResource.SearchCriteria;
import com.operasolutions.rl.service.physician.charges.SearchTypeEnum;
import com.sun.jersey.api.NotFoundException;
import com.sun.jersey.api.core.InjectParam;
import java.util.ArrayList;
import java.util.List;
import javax.ws.rs.QueryParam;

@Path("/" + ModifierResource.URL_MODIFIER)
@Produces(MediaType.APPLICATION_JSON)
@RequiresAuthentication
public class ModifierResource {

    public static final String URL_MODIFIER = "modifier";

    protected static final Logger log = LoggerFactory.getLogger(ModifierResource.class);

    private final ModifierDao modifierDao;

    @Context
    UriInfo uriInfo;

    @Inject
    public ModifierResource(ModifierDao modifierDao) {
        this.modifierDao = modifierDao;
    }

    @GET
    public List<ModifierResult> findCharges(@InjectParam MyInput params) {

        log.debug("findCharges() - start, params = " + params);

        SecurityUtils.getSubject().checkPermission(TPermission.LOOKUP_CHARGES.getPermission());

        if (params == null) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        log.debug("Converting input into internal representation...");

        List<SearchCriteria> searchCriteria = new ArrayList<SearchCriteria>();

        // if value is not present or empty or not valid operation, ignore search criteria
        if (params.modifierValue != null && !params.modifierValue.isEmpty() && SearchTypeEnum.getSearchType(params.modifierType) != null) {
            SearchCriteria searchInputObject = new SearchCriteria();
            searchInputObject.searchType = SearchTypeEnum.getSearchType(params.modifierType);
            searchInputObject.value = params.modifierValue;
            searchInputObject.field = TPhysHcpcModifier.T_PHYS_HCPC_MODIFIER.MODIFIER;
            searchCriteria.add(searchInputObject);
        }

        if (params.descriptionValue != null && !params.descriptionValue.isEmpty() && SearchTypeEnum.getSearchType(params.descriptionType) != null) {
            SearchCriteria searchInputObject = new SearchCriteria();
            searchInputObject.searchType = SearchTypeEnum.getSearchType(params.descriptionType);
            searchInputObject.value = params.descriptionValue;
            searchInputObject.field = TPhysHcpcModifier.T_PHYS_HCPC_MODIFIER.DESCRIPTION;
            searchCriteria.add(searchInputObject);
        }
        return modifierDao.searchForCharges(searchCriteria);

    }

    @GET
    @Path("/{modifierCode}")
    public ModifierRepresentation getModifier(@PathParam("modifierCode") String modifierCode) {

        log.debug("getModifier() - start, modifierCode = " + modifierCode);

        SecurityUtils.getSubject().checkPermission(TPermission.READ_DIAGNOSE.getPermission());

        if (modifierCode == null || modifierCode.isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        TPhysHcpcModifierRecord record = modifierDao.getModifier(modifierCode);

        if (record == null) {
            throw new NotFoundException("modifierCode not found.");
        }

        return getRepresentation(record);
    }

    public ModifierRepresentation getRepresentation(TPhysHcpcModifierRecord record) {
        ModifierRepresentation result = new ModifierRepresentation();

        result.uri = uriInfo.getBaseUriBuilder().path(ModifierResource.class).path(record.getModifier()).build();
        result.modifier = record.getModifier();
        result.description = record.getDescription();

        return result;
    }

    /**
     * DiagnoseRepresentation - message class
     */
    public static class ModifierRepresentation {

        public URI uri;
        public String modifier;
        public String description;
    }

    public static class ModifierResult {

        public String modifier;
        public String description;
    }

    public static class MyInput {

        @QueryParam("modifierValue")
        public String modifierValue;

        @QueryParam("modifierType")
        public String modifierType;

        @QueryParam(value = "descriptionType")
        public String descriptionType;

        @QueryParam(value = "descriptionValue")
        public String descriptionValue;

    }
}
