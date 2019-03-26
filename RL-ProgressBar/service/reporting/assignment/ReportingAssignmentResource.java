package com.operasolutions.rl.service.reporting.assignment;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.core.Response.Status;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.codehaus.jackson.annotate.JsonProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.inject.Inject;
import com.google.inject.persist.Transactional;
import com.operasolutions.rl.auth.AuthUtils;
import com.operasolutions.rl.common.DbUtils;
import com.operasolutions.rl.exception.RevenueLeakageException;
import com.operasolutions.rl.schema.enums.TPermission;
import com.operasolutions.rl.schema.tables.records.TPhysReportingAssignmentRecord;

/**
 * ReportingAssignmentResource
 * 
 * @author Ritwik P R
 */
@Path("/" + ReportingAssignmentResource.URL_REPORTING_ASSIGNMENT)
@Produces(MediaType.APPLICATION_JSON) 
@RequiresAuthentication
public class ReportingAssignmentResource {
	public static final String URL_REPORTING_ASSIGNMENT = "reportingAssignment";

	protected static final Logger log = LoggerFactory.getLogger(ReportingAssignmentResource.class);

	private final ReportingAssignmentDao businessDao;
	
	@Context
	UriInfo uriInfo;

	@Inject
	public ReportingAssignmentResource(ReportingAssignmentDao businessDao) {
		this.businessDao = businessDao;
	}
	
	/**
	 * Reads all hospital assignments
	 * 
	 * @return List<ReportingAssignmentRepresentation>
	 */
	@GET
	public List<ReportingAssignmentRepresentation> getAllAssignments() {
		log.debug("getAllAssignments() - start");

		SecurityUtils.getSubject().checkPermission(TPermission.READ_REPORTING_ASSIGNMENTS.getPermission());

		List<ReportingAssignmentResult> reportingAssignments = businessDao.getAllAssignments();

		log.debug("Number of Reporting Assignments = " + reportingAssignments.size());
		log.debug("Reporting Assignments = " + reportingAssignments);
		return transformResults(reportingAssignments);
	}

	
	/**
	 * Updates hospital assignments
	 * 
	 * @param input
	 * @return Response
	 */
	@PUT
	@Transactional
	public Response updateAssignments (List<ReportingAssignmentRepresentation> input) throws RevenueLeakageException {
		log.debug("updateAssignments() - start, input = " + input);

		SecurityUtils.getSubject().checkPermission(TPermission.UPDATE_REPORTING_ASSIGNMENTS.getPermission());

		if (input == null) throw new WebApplicationException(Status.BAD_REQUEST);
		if (!isInputObjectValid(input)) throw new WebApplicationException(Status.BAD_REQUEST);

		long currentTime = System.currentTimeMillis();

		log.debug("Reading current assignments...");
		List<ReportingAssignmentRepresentation> currentAssignment = getAllAssignments();
		
		HashMap<String,HashMap<String,String>> currentAssignmentMap=convertToHashMap(currentAssignment);
		ArrayList<String> currentList=new ArrayList<String>(currentAssignmentMap.keySet());
		ArrayList<String> currentListCopy=new ArrayList<String>(currentAssignmentMap.keySet());
		
		HashMap<String,HashMap<String,String>> inputAssignmentMap=convertToHashMap(input);
		ArrayList<String> inputList=new ArrayList<String>(inputAssignmentMap.keySet());
		
		//Identifies Deletion List
		currentList.removeAll(inputList);
		//Identifies New List
		inputList.removeAll(currentListCopy);
		
		//Handle Deletions
		if(currentList!=null)
		{
			for(String userHospitalMap:currentList)
			{
				HashMap<String,String> userHospMap=currentAssignmentMap.get(userHospitalMap);
				if(userHospMap!=null)
				{
					String userId= userHospMap.get("userId");
					String hospitalId=userHospMap.get("hospitalId");
					businessDao.deleteAssignment(userId, hospitalId, AuthUtils.getLoggedUserName(), currentTime);
				}
			}
		}

		//Handle Additions
		if(inputList!=null)
		{
			for(String userHospitalMap:inputList)
			{
				HashMap<String,String> userHospMap=inputAssignmentMap.get(userHospitalMap);
				if(userHospMap!=null)
				{
					String userId= userHospMap.get("userId");
					String hospitalId=userHospMap.get("hospitalId");

					TPhysReportingAssignmentRecord record = new TPhysReportingAssignmentRecord();
					record.setHospitalId(hospitalId);
					record.setUserId(userId);
					record.setUpdateTime(new Timestamp(currentTime));
					record.setAssignedBy(AuthUtils.getLoggedUserName());

					log.debug("Adding assignments = " + userHospMap);
					businessDao.addAssignment(record);					
				}
			}
		}

		return Response.status(Response.Status.ACCEPTED).build();
	}

	/**
	 * Verifies whether input object from client is valid
	 * 
	 * @param input
	 * @return true/false
	 */
	protected boolean isInputObjectValid(List<ReportingAssignmentRepresentation> input) {
		boolean result = true;

		for (ReportingAssignmentRepresentation one: input) {
			if (one.userId == null || one.userId.trim().isEmpty()) {
				log.error("userId is null or empty string!");

				result = false;
				break;
			}

			if (one.hospitals== null) {
				log.error("Hospital list is null!");

				result = false;
				break;
			}
		}

		return result;
	}

	/**
	 * Transform into appropriate structure for UI
	 * 
	 * @return List<ReportingAssignmentRepresentation>
	 */
	protected List<ReportingAssignmentRepresentation> transformResults(List<ReportingAssignmentResult> reportingAssignments) {
		Map<String, ReportingAssignmentRepresentation> tempResult = new TreeMap<String, ReportingAssignmentRepresentation>();

		log.debug("Processing reporting assignments...");
		for (ReportingAssignmentResult one: reportingAssignments) {

			ReportingAssignmentRepresentation oneRecord = tempResult.get(one.userId);
			if (oneRecord == null) {
				ReportingAssignmentRepresentation newRecord = new ReportingAssignmentRepresentation();
				newRecord.userId = one.userId;
				newRecord.userFullName = DbUtils.concatFullUserName(one.fName, one.lName);

				tempResult.put(one.userId, newRecord);

				oneRecord = newRecord;
			}
			List<HospData> allHospitals = oneRecord.hospitals;

			if (one.hospitalId != null) {
				HospData newHospital = new HospData(one.hospitalId, one.hospitalName);
				allHospitals.add(newHospital);
			}
		}
		return convertMapIntoList(tempResult);
	}

	/** Converts data from Map into List
	 * 
	 * @param input
	 * @return List<ReportingAssignmentRepresentation>
	 */
	protected List<ReportingAssignmentRepresentation> convertMapIntoList(Map<String, ReportingAssignmentRepresentation> input) {
		List<ReportingAssignmentRepresentation> result = new ArrayList<ReportingAssignmentRepresentation>();

		for (Map.Entry<String, ReportingAssignmentRepresentation> entry : input.entrySet()) {
			result.add(entry.getValue());
		}

		return result;		
	}
	
	private HashMap<String,HashMap<String,String>> convertToHashMap(List<ReportingAssignmentRepresentation> reportAssignments)
	{
		HashMap<String,HashMap<String,String>> map=new HashMap<String,HashMap<String,String>>();
		if(reportAssignments!=null)
		{
			for(ReportingAssignmentRepresentation assignment:reportAssignments)
			{
				String userId=assignment.userId;
				List<HospData> hospitals=assignment.hospitals;
				if(hospitals!=null)
				{
					for(HospData hospital:hospitals)
					{
						HashMap<String,String> details=new HashMap<String,String>();
						details.put("userId", userId);
						details.put("hospitalId", hospital.hospitalId);
						map.put(userId+"_"+hospital.hospitalId,details);
					}
				}
			}
		}		
		return map;
	}
	
	public static class ReportingAssignmentRepresentation {
		public String userId;
		public String userFullName;
		public List<HospData> hospitals = new ArrayList<HospData>(0);
	}

	public static class HospData implements Comparable<HospData> {
		public final String hospitalId;
		public String hospitalName;

		public HospData(@JsonProperty("hospitalId") String hospitalId, @JsonProperty("hospitalName") String hospitalName) {
			this.hospitalId = hospitalId;
			this.hospitalName = hospitalName;		
		}

		@Override
		public int hashCode() {
			final int prime = 31;
			int result = 1;
			result = prime * result + ((hospitalId == null) ? 0 : hospitalId.hashCode());

			return result;
		}

		@Override
		public boolean equals(Object obj) {
			if (this == obj)
				return true;
			if (obj == null)
				return false;
			if (getClass() != obj.getClass())
				return false;
			HospData other = (HospData) obj;
			if (hospitalId == null) {
				if (other.hospitalId != null)
					return false;
			} else if (!hospitalId.equals(other.hospitalId))
				return false;
			return true;
		}

		@Override
		public String toString() {
			StringBuffer result = new StringBuffer();
			result.append("hospitalId = " + hospitalId);

			return result.toString();
		}

		@Override
		public int compareTo(HospData o) {
		  if (this.hospitalId == null && o.hospitalId != null) {
		        return -1;
		    }
		    else if (this.hospitalId != null && o.hospitalId == null) {
		        return 1;
		    }
		    else {
		    	return this.hospitalId.compareTo(o.hospitalId);
		    }
		}
	}
}