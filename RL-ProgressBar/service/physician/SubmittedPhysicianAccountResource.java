/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.operasolutions.rl.service.physician;

import com.google.inject.Inject;
import com.operasolutions.rl.auth.AuthUtils;
import com.operasolutions.rl.common.DbConstants;
import com.operasolutions.rl.common.NumberConstants;
import com.operasolutions.rl.common.RevLeakageUtils;
import com.operasolutions.rl.schema.enums.TPermission;
import static com.operasolutions.rl.service.physician.PhysicianAccountResource.ISCONFIRM;
import com.operasolutions.rl.service.physician.PhysicianAccountResource.PhysicianAccountRepresentation;
import com.operasolutions.rl.service.physician.PhysicianAccountResource.PhysicianAccountResourceResult;
import static com.operasolutions.rl.service.physician.PhysicianAccountViewResource.DEFAULT_VIEW;
import static com.operasolutions.rl.service.physician.PhysicianAccountViewResource.QUERY_STRING_VIEW_TYPE;
import com.operasolutions.rl.service.physician.charges.PhysicianChargesResource;
import static com.operasolutions.rl.service.physician.charges.PhysicianChargesResource.ISSUBMITTED;
import com.sun.jersey.api.core.ResourceContext;
import java.util.ArrayList;
import java.util.List;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.AuthorizationException;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author nirmal.kumar
 */
@Path("/" + SubmittedPhysicianAccountResource.URL_ACCOUNTS_SUBMITTED)
@Produces(MediaType.APPLICATION_JSON)
@RequiresAuthentication
public class SubmittedPhysicianAccountResource {

    public static final String URL_ACCOUNTS_SUBMITTED = "submittedphysicianAccounts";
    public static final String URL_ACCOUNTS_VIEW = "View";
    protected static final Logger log = LoggerFactory.getLogger(SubmittedPhysicianAccountResource.class);
    @Context
    UriInfo uriInfo;

    @Context
    ResourceContext rc;

    public PhysicianAccountDao physicianAccountDao;

    private PhysicianAccountViewDao accountDao;

    @Inject
    public SubmittedPhysicianAccountResource(PhysicianAccountDao physicianAccountDao, PhysicianAccountViewDao accountDao) {
        this.accountDao = accountDao;
        this.physicianAccountDao = physicianAccountDao;
    }

    @GET
    public List<PhysicianAccountRepresentation> getAccountsSubmitted(@QueryParam("hospitalId") String hospitalId, @QueryParam("auditorId") List<String> auditorList) {
        log.debug("getAccounts() - start, hospitalId = " + hospitalId);

        if (hospitalId == null || hospitalId.trim().isEmpty()) {
            throw new WebApplicationException(Response.Status.BAD_REQUEST);
        }
        List<PhysicianAccountRepresentation> result = new ArrayList<PhysicianAccountRepresentation>();
        Boolean all = null;
        if (SecurityUtils.getSubject().isPermitted(TPermission.READ_ALL_ACCOUNTS.getPermission())) {
            all = true;
        } else if (SecurityUtils.getSubject().isPermitted(TPermission.READ_ASSIGNED_ACCOUNTS.getPermission())) {
            all = false;
        } else {
            throw new AuthorizationException();
        }
        List<PhysicianAccountResourceResult> records = new ArrayList<PhysicianAccountResourceResult>();
        for (PhysicianAccountResourceResult oneRecord : physicianAccountDao.getPhysicianAccountsSubmitted(hospitalId, AuthUtils.getLoggedUserName(), all, auditorList)) {
            records.add(oneRecord);
        }
        log.debug("Creating representation...");
        if (records != null && !records.isEmpty()) {
            int index = 1;
            for (PhysicianAccountResourceResult oneRecord : records) {
                PhysicianAccountRepresentation oneAccount = new PhysicianAccountRepresentation();
                oneAccount.rank = index;
                index++;
                oneAccount.accountId = oneRecord.accountId;
                oneAccount.age = oneRecord.age;
                oneAccount.dob = oneRecord.dob;
                oneAccount.patientId = oneRecord.patientId;
                oneAccount.name = oneRecord.name;
                oneAccount.predCode = RevLeakageUtils.getSubString(oneRecord.predCode, DbConstants.COMMA, NumberConstants.THREE);
                // gender, T_TYPE_LOOKUP
                String genderValue = oneRecord.sex;
                String genderDescription = oneRecord.genderDescription;
                if (genderDescription != null) {
                    genderValue = genderDescription;
                }

                oneAccount.gender = genderValue;
                oneAccount.admitDate = oneRecord.admitDate;
                oneAccount.dischargeDate = oneRecord.dischargeDate;
                oneAccount.transferDate = oneRecord.transferDate;
                oneAccount.serviceLocation = oneRecord.serviceLine;

                // patType, T_TYPE_LOOKUP
                String patTypeWithDescription = null;
                String patType = oneRecord.patientType;
                String patTypeDescription = oneRecord.patTypeDescription;

                if (patTypeDescription != null) {
                    patTypeWithDescription = patType + " - " + patTypeDescription;
                } else {
                    patTypeWithDescription = patType;
                }

                oneAccount.patType = patType;
                oneAccount.patTypeWithDescription = patTypeWithDescription;
                // patSubType, T_TYPE_LOOKUP
                String patSubTypeWithDescription = null;
                String patSubType = oneRecord.patientSubtype;
                String patSubTypeDescription = oneRecord.patSubTypeDescription;

                if (patSubTypeDescription != null) {
                    patSubTypeWithDescription = patSubType + " - " + patSubTypeDescription;
                } else {
                    patSubTypeWithDescription = patSubType;
                }
                oneAccount.patSubType = patSubType;
                oneAccount.patSubTypeWithDescription = patSubTypeWithDescription;
                oneAccount.insurance = oneRecord.payerCode;
                oneAccount.insuranceName = oneRecord.payerDesc;
                oneAccount.isHighlighted = false;
                oneAccount.isPrimary = oneRecord.isPrimary;
                oneAccount.uri = uriInfo.getRequestUri();
                oneAccount.uriCharges = uriInfo.getBaseUriBuilder().path(PhysicianChargesResource.class).queryParam(ISCONFIRM, false).queryParam(ISSUBMITTED, true).build(hospitalId, oneAccount.accountId);
                result.add(oneAccount);
            }
        }
        return result;
    }

    @GET
    @Path(URL_ACCOUNTS_VIEW)
    public List<PhysicianAccountViewResource.PhysicianAccountRepresentation> getAccountsSubmittedView(@QueryParam("hospitalId") String hospitalId, @QueryParam("auditorId") List<String> auditorList,
            @DefaultValue(DEFAULT_VIEW) @QueryParam(QUERY_STRING_VIEW_TYPE) String viewType) {
        log.debug("getAccounts() - start, hospitalId = " + hospitalId);

        if (hospitalId == null || hospitalId.trim().isEmpty()) {
            throw new WebApplicationException(Response.Status.BAD_REQUEST);
        }
        Boolean all = null;
        if (SecurityUtils.getSubject().isPermitted(TPermission.READ_ALL_ACCOUNTS.getPermission())) {
            all = true;
        } else if (SecurityUtils.getSubject().isPermitted(TPermission.READ_ASSIGNED_ACCOUNTS.getPermission())) {
            all = false;
        } else {
            throw new AuthorizationException();
        }
        String uriCharges = uriInfo.getBaseUriBuilder().path(PhysicianChargesResource.class).queryParam(ISCONFIRM, false).queryParam(ISSUBMITTED, true).build("hospitalId", "accountId").toString();
        return accountDao.getAccountsSubmitted(hospitalId, AuthUtils.getLoggedUserName(), all, auditorList, viewType, uriCharges);
    }
}
