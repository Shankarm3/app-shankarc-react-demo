package com.operasolutions.rl.service.physician.hospital;

import java.net.URI;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

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
import org.apache.shiro.authz.AuthorizationException;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.inject.Inject;
import com.operasolutions.rl.schema.enums.TPermission;
import com.operasolutions.rl.schema.enums.TUserRole;
import com.operasolutions.rl.schema.tables.records.THospitalRecord;
import com.operasolutions.rl.service.ExtensionPoint;
import com.operasolutions.rl.service.Extensions;
import com.operasolutions.rl.service.Href;
import com.operasolutions.rl.service.ResourceExtensionProvider;
import com.sun.jersey.api.NotFoundException;

/**
 * PhysicianHospitalResource
 *
 * @author Nirmal Kumar
 * @author Nirmal Kumar
 */
@Path("/" + PhysicianHospitalResource.URL_HOSPITALS)
@Produces(MediaType.APPLICATION_JSON)
@RequiresAuthentication
public class PhysicianHospitalResource {

    public static final String URL_HOSPITALS = "physicianHospitals";
    public static final String URL_COST_CENTER = "physicianCostCenter";
    protected static final Logger log = LoggerFactory.getLogger(PhysicianHospitalResource.class);
    public static final String URL_USERS = "users";
    public static final String URL_COST_CENTER_USER = "userCostCenter";
    private final PhysicianHospitalDao hospitalDao;

    @Inject(optional = true)
    @ExtensionPoint(PhysicianHospitalResource.class)
    protected Set<ResourceExtensionProvider> extensionProviders;

    @Context
    protected UriInfo uriInfo;

    @Inject
    public PhysicianHospitalResource(PhysicianHospitalDao hospitalDao) {
        this.hospitalDao = hospitalDao;
    }

    @GET
    @Path("/{hospitalId:.*}")
    public HospitalRepresentation getHospitalById(@PathParam("hospitalId") String hospitalId) {

        log.debug("getHospitalById() - start, hospitalId = " + hospitalId);

        SecurityUtils.getSubject().checkPermission(TPermission.READ_HOSPITAL_DATA.getPermission());

        if (hospitalId == null || hospitalId.isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        THospitalRecord record = hospitalDao.getHospitalById(hospitalId);

        if (record == null) {
            throw new NotFoundException("Hospital not found.");
        }

        return getRepresentation(record);
    }

    @GET
    public List<HospitalRepresentation> getAllHospitals() {

        log.debug("getAllHospitals() - start");

        SecurityUtils.getSubject().checkPermission(TPermission.READ_ALL_HOSPITALS.getPermission());

        List<HospitalRepresentation> result = new ArrayList<HospitalRepresentation>();

        for (THospitalRecord oneRecord : hospitalDao.getAllHospitals()) {
            result.add(getRepresentation(oneRecord));
        }

        return result;
    }

    @GET
    @Path(URL_USERS + "/{userId:.*}")
    public List<HospitalRepresentationCommon> getAssignedHospitalsByUserId(@PathParam("userId") String userId) {

        log.debug("entered getAssignedHospitalsByUserId");

        if (userId == null || userId.isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }
        List<HospitalRepresentationCommon> result = new ArrayList<HospitalRepresentationCommon>();
        List<HospitalResult> records = null;
        if (SecurityUtils.getSubject().hasRole(TUserRole.PHYSICIAN_RPT_USER.getUType())) {
            records = hospitalDao.getAssignedHospitalsByReportUser(userId);
        } else if (SecurityUtils.getSubject().isPermitted(TPermission.READ_ALL_ASSIGNED_HOSPITALS.getPermission())) {
            records = hospitalDao.getAllHospitalsByAuditor();
        } else if (SecurityUtils.getSubject().isPermitted(TPermission.READ_ASSIGNED_HOSPITALS.getPermission())) {
            records = hospitalDao.getAssignedHospitalsByUserId(userId);
        } else {
            throw new AuthorizationException();
        }
        for (HospitalResult oneRecord : records) {
            result.add(getRepresentation(oneRecord));
        }

        log.debug("exited getAssignedHospitalsByUserId");

        return result;
    }

    @GET
    @Path(URL_COST_CENTER_USER + "/{userId:.*}")
    public List<CostCenterResult> getAssignedCostCenterByUserId(@PathParam("userId") String userId) {

        log.debug("entered getAssignedCostCenterByUserId");

        if (userId == null || userId.isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }
        List<CostCenterResult> result = new ArrayList<CostCenterResult>();
        if (SecurityUtils.getSubject().hasRole(TUserRole.PHYSICIAN_RPT_USER.getUType())) {
            result = hospitalDao.getAllCostceneterReportingUser(userId);
        } else if (SecurityUtils.getSubject().isPermitted(TPermission.READ_ALL_ASSIGNED_HOSPITALS.getPermission())) {
            result = hospitalDao.getAllCostceneterByAuditor();
        } else if (SecurityUtils.getSubject().isPermitted(TPermission.READ_ASSIGNED_HOSPITALS.getPermission())) {
            result = hospitalDao.getAllCostceneterByAuditor(userId);
        } else {
            throw new AuthorizationException();
        }
        log.debug("exited getAssignedCostCenterByUserId");
        return result;
    }

    @GET
    @Path(URL_COST_CENTER)
    public List<String> getAllCostCenter() {
        log.debug("getAllHospitals() - start");
        SecurityUtils.getSubject().checkPermission(TPermission.READ_ALL_COST_CENTER.getPermission());
        return hospitalDao.getAllCostCenter();
    }

    protected HospitalRepresentation getRepresentation(THospitalRecord record) {
        HospitalRepresentation result = new HospitalRepresentation();

        result.hospitalId = record.getHospitalId();
        result.hospitalName = record.getHospitalName();
        result.city = record.getCity();
        result.state = record.getState();
        result.addressLine1 = record.getAddressLine_1();
        result.addressLine2 = record.getAddressLine_2();
        result.zip = record.getZip();
        result.origFileNameDate = record.getOrigFileNameDate();
        result.fileLoadTimestamp = record.getFileLoadTimestamp();
        result.shortName = record.getShortName();
        result.uri = uriInfo.getBaseUriBuilder().path(PhysicianHospitalResource.class).path(result.hospitalId).build();
        List<String> parameters = new ArrayList<String>();
        parameters.add(result.hospitalId);
        result.extensions = Extensions.consolidate(uriInfo, extensionProviders, parameters);
        //result.uriPhysicianAccounts = uriInfo.getBaseUriBuilder().path(PhysicianAccountResource.class).build(result.hospitalId);
        //result.uriPhysicianAccountsView = uriInfo.getBaseUriBuilder().path(PhysicianAccountResource.class).build(result.hospitalId);
        //result.uriPhysicianAccountsInfo = uriInfo.getBaseUriBuilder().path(PhysicianAccountInfoResource.class).build(result.hospitalId);
        return result;
    }

    protected HospitalRepresentationCommon getRepresentation(HospitalResult record) {
        HospitalRepresentationCommon result = new HospitalRepresentationCommon();

        result.hospitalId = record.hospitalId;
        result.hospitalName = record.hospitalName;
        result.city = record.city;
        result.state = record.state;
        result.addressLine1 = record.addressLine1;
        result.addressLine2 = record.addressLine2;
        result.zip = record.zip;
        result.origFileNameDate = record.origFileNameDate;
        result.fileLoadTimestamp = record.fileLoadTimestamp;
        result.shortName = record.shortName;
        result.totalCount = record.totalCount;
        result.uri = uriInfo.getBaseUriBuilder().path(PhysicianHospitalResource.class).path(result.hospitalId).build();
        List<String> parameters = new ArrayList<String>();
        parameters.add(result.hospitalId);
        result.extensions = Extensions.consolidate(uriInfo, extensionProviders, parameters);
        //result.uriPhysicianAccounts = uriInfo.getBaseUriBuilder().path(PhysicianAccountResource.class).build(result.hospitalId);
        // result.uriPhysicianAccountsView = uriInfo.getBaseUriBuilder().path(PhysicianAccountResource.class).build(result.hospitalId);
        //result.uriPhysicianAccountsInfo = uriInfo.getBaseUriBuilder().path(PhysicianAccountInfoResource.class).build(result.hospitalId);
        return result;
    }

    /**
     * HospitalRepresentation
     *
     */
    public static class HospitalRepresentation {

        public URI uri;
//        public URI uriPhysicianAccountsInfo;
//        public URI uriPhysicianAccounts;
        //public URI uriPhysicianAccountsView;
        public List<Href> extensions;
        public String hospitalId;
        public String hospitalName;
        public String city;
        public String state;
        public String addressLine1;
        public String addressLine2;
        public String zip;
        public Date origFileNameDate;
        public Timestamp fileLoadTimestamp;
        public URI accountScoringCheckUri;
        public String shortName;
        public int totalCount;
    }

    /**
     * HospitalRepresentation
     *
     */
    public static class HospitalResult {

        public String hospitalId;
        public String hospitalName;
        public String city;
        public String state;
        public String addressLine1;
        public String addressLine2;
        public String zip;
        public Date origFileNameDate;
        public Timestamp fileLoadTimestamp;
        public String shortName;
        public int totalCount;
    }

    public static class CostCenterResult {

        public String costCenter;
        public int totalCount;
    }

    /**
     * HospitalRepresentation
     *
     */
    public static class HospitalRepresentationCommon {

        public URI uri;

//        public URI uriPhysicianAccountsInfo;
//        public URI uriPhysicianAccounts;
        //public URI uriPhysicianAccountsView;
        public List<Href> extensions;
        public String hospitalId;
        public String hospitalName;
        public String city;
        public String state;
        public String addressLine1;
        public String addressLine2;
        public String zip;
        public Date origFileNameDate;
        public Timestamp fileLoadTimestamp;
        public URI accountScoringCheckUri;
        public String shortName;
        public int totalCount;
    }
}
