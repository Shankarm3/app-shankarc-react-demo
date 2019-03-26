package com.operasolutions.rl.service.division;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriInfo;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.inject.Inject;
import com.operasolutions.rl.auth.AuthUtils;
import com.operasolutions.rl.schema.enums.TPermission;
import com.operasolutions.rl.schema.tables.records.TDivisionHospitalRecord;
import com.operasolutions.rl.service.physician.hospital.PhysicianHospitalResource;

/**
 * DivisionResource
 *
 * @author Nirmal Kumar
 * @author Ondrej Maksi
 * @author Nirmal Kumar
 */
@Path("/" + DivisionResource.URL_DIVISIONS)
@Produces(MediaType.APPLICATION_JSON)
@RequiresAuthentication
public class DivisionResource {

    public static final String URL_DIVISIONS = "divisions";
    public static final String URL_DIVISIONS_ASSIGNED = "assigned";
    protected static final Logger log = LoggerFactory.getLogger(DivisionResource.class);

    private final DivisionDao divisionDao;

    @Context
    UriInfo uriInfo;

    @Inject
    public DivisionResource(DivisionDao divisionDao) {
        this.divisionDao = divisionDao;
    }

    @GET
    public List<DivisionRepresentation> getAllDivisions() {

        log.debug("getAllDivisions() - start");

        SecurityUtils.getSubject().checkPermission(TPermission.READ_DIVISIONS_LIST.getPermission());

        List<TDivisionHospitalRecord> daoResults = divisionDao.getAllDivisions();

        log.debug("Number of results from dao = " + daoResults.size());

        return generateRepresentation(daoResults);
    }
    
    @GET
	@Path("/" + DivisionResource.URL_DIVISIONS_ASSIGNED)
	public List<DivisionRepresentation> getAssignedDivisions() {

		log.debug("getAssignedDivisions() - start");

		SecurityUtils.getSubject().checkPermission(TPermission.READ_ASSIGNED_DIVISIONS_LIST.getPermission());
		
		List<TDivisionHospitalRecord> daoResults = divisionDao.getAssignedDivisions(AuthUtils.getLoggedUserName());

		log.debug("Number of results from dao = " + daoResults.size());

		return generateRepresentation(daoResults);
	}

    /**
     * Groups all results by division
     *
     * @param input
     * @return List<DivisionRepresentation>
     */
    protected List<DivisionRepresentation> generateRepresentation(List<TDivisionHospitalRecord> input) {

        log.debug("generateRepresentation() - start");

        // key is String, using TreeMap for natural ordering
        Map<String, DivisionRepresentation> result = new TreeMap<String, DivisionRepresentation>();

        for (TDivisionHospitalRecord one : input) {
            DivisionRepresentation oneRecord = result.get(one.getDivisionName());
            if (oneRecord == null) {
                oneRecord = new DivisionRepresentation();
                oneRecord.divisionId = one.getDivisionId();
                oneRecord.divisionName = one.getDivisionName();

                oneRecord.hospitals = new ArrayList<Hospital>();

                result.put(one.getDivisionName(), oneRecord);
            }

            Hospital hospital = new Hospital();
            hospital.hospitalId = one.getHospitalId();
            hospital.hospitalName = one.getHospitalName();
            hospital.shortName = one.getShortName();
            hospital.uri = uriInfo.getBaseUriBuilder().path(PhysicianHospitalResource.class).path(one.getHospitalId()).build();

            oneRecord.hospitals.add(hospital);
        }

        log.debug("generateRepresentation(), number of divisions = " + result.size());

        return convertMapIntoList(result);
    }

    /**
     * Converts data from Map into List
     *
     * @param input
     * @return List<DivisionRepresentation>
     */
    protected List<DivisionRepresentation> convertMapIntoList(Map<String, DivisionRepresentation> input) {
        List<DivisionRepresentation> result = new ArrayList<DivisionRepresentation>();

        for (Map.Entry<String, DivisionRepresentation> entry : input.entrySet()) {
            result.add(entry.getValue());
        }

        return result;

    }

    /**
     * DivisionRepresentation
     *
     */
    public static class DivisionRepresentation {

        public String divisionId;
        public String divisionName;

        public List<Hospital> hospitals;
    }

    public static class Hospital {

        public URI uri;

        public String hospitalId;
        public String hospitalName;
        public String shortName;
    }
}
