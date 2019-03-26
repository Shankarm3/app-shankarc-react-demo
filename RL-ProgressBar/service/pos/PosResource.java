/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.operasolutions.rl.service.pos;

import com.google.inject.Inject;
import com.operasolutions.rl.service.diagnose.DiagnoseResource;
import com.operasolutions.rl.service.modifier.ModifierResource;
import com.operasolutions.rl.service.physnpilookup.PhysicianLookupResource;
import java.util.List;
import java.util.Map;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriInfo;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author nirmal.kumar
 */
@Path("/" + PosResource.URL_POS)
@Produces(MediaType.APPLICATION_JSON)
@RequiresAuthentication
public class PosResource {

    public static final String URL_POS = "pos";
    public static final String URL_PHYS_MODIFIER_DIAG = "getPhysModifierDaig";
    public static final String URL_PHYS = "getPhys";
    public static final String URL_MODIFIER = "getModifier";
    public static final String URL_DIAG = "getDaig";
    public static final String URL_DEPT = "getDept";
    protected static final Logger log = LoggerFactory.getLogger(PosResource.class);

    private final PosDao posDao;

    @Context
    UriInfo uriInfo;

    @Inject
    public PosResource(PosDao posDao) {
        this.posDao = posDao;
    }

    @GET
    public List<PosResult> getPos() {
        log.info("getPos() ");
        return posDao.getAllPos();
    }

    @GET
    @Path("/{hospitalId:.*}/{accountId:.*}/" + URL_PHYS_MODIFIER_DIAG)
    public Map getPhysModifierDaig(@PathParam("hospitalId") String hospitalId, @PathParam("accountId") String accountId, @QueryParam("predKey") Integer predKey, @QueryParam("rowId") Integer rowId,
            @QueryParam("hcpcCode") String hcpcCode) {
        log.info("getPhysModifierDaig() predkey " + predKey);
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'predKey' cannot be null.");
        }
        if (accountId == null) {
            throw new IllegalArgumentException("Input parameter 'accountId' cannot be null.");
        }
        return posDao.getPhysModifierDaig(hospitalId, accountId, predKey, rowId, hcpcCode);
    }

    @GET
    @Path("/{hospitalId:.*}/{accountId:.*}/" + URL_PHYS)
    public List<PhysicianLookupResource.TPhysMasterRepresentation> getPhys(@PathParam("hospitalId") String hospitalId, @PathParam("accountId") String accountId, @QueryParam("predKey") Integer predKey, @QueryParam("rowId") Integer rowId,
            @QueryParam("hcpcCode") String hcpcCode) {
        log.info("getPhysModifierDaig() predkey " + predKey);
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'predKey' cannot be null.");
        }
        if (accountId == null) {
            throw new IllegalArgumentException("Input parameter 'accountId' cannot be null.");
        }
        return posDao.getPhys(hospitalId, accountId, predKey, rowId, hcpcCode);
    }

    @GET
    @Path("/{hospitalId:.*}/{accountId:.*}/" + URL_MODIFIER)
    public List<ModifierResource.ModifierResult> getModifier(@PathParam("hospitalId") String hospitalId, @PathParam("accountId") String accountId, @QueryParam("predKey") Integer predKey, @QueryParam("rowId") Integer rowId,
            @QueryParam("hcpcCode") String hcpcCode) {
        log.info("getPhysModifierDaig() predkey " + predKey);
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'predKey' cannot be null.");
        }
        if (accountId == null) {
            throw new IllegalArgumentException("Input parameter 'accountId' cannot be null.");
        }
        return posDao.getModifier(hospitalId, accountId, predKey, rowId, hcpcCode);
    }

    @GET
    @Path("/{hospitalId:.*}/{accountId:.*}/" + URL_DIAG)
    public List<DiagnoseResource.DiagnoseResult> getDaig(@PathParam("hospitalId") String hospitalId, @PathParam("accountId") String accountId, @QueryParam("predKey") Integer predKey, @QueryParam("rowId") Integer rowId,
            @QueryParam("hcpcCode") String hcpcCode) {
        log.info("getPhysModifierDaig() predkey " + predKey);
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'predKey' cannot be null.");
        }
        if (accountId == null) {
            throw new IllegalArgumentException("Input parameter 'accountId' cannot be null.");
        }
        return posDao.getDaig(hospitalId, accountId, predKey, rowId, hcpcCode);
    }

    @GET
    @Path("/{hospitalId:.*}/" + URL_DEPT)
    public List<Dept> getDept(@PathParam("hospitalId") String hospitalId) {
        log.info("getPhysModifierDaig() hospitalId " + hospitalId);
        if (hospitalId == null) {
            throw new IllegalArgumentException("Input parameter 'hospitalId' cannot be null.");
        }

        return posDao.getDept(hospitalId);
    }

    public static class PosResult {

        public String pos;
    }

    public static class Dept {

        public String dept;
        public String deptDesc;

    }
}
