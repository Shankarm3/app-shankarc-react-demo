package com.operasolutions.rl.service.procedure;

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
import com.operasolutions.rl.schema.tables.records.TProcCodesRecord;
import com.sun.jersey.api.NotFoundException;

@Path("/" + ProcedureResource.URL_PROCEDURES)
@Produces(MediaType.APPLICATION_JSON)
@RequiresAuthentication
public class ProcedureResource {
	public static final String URL_PROCEDURES = "procedures";

	protected static final Logger log = LoggerFactory.getLogger(ProcedureResource.class);

	private final ProcedureDao procedureDao;

	@Context
	UriInfo uriInfo;

	@Inject
	public ProcedureResource(ProcedureDao procedureDao) {
		this.procedureDao = procedureDao;
	}

	@GET
	@Path("/{procedureCode}")
	public ProcedureRepresentation getProcedureByCode(@PathParam("procedureCode") String procedureCode) {

		log.debug("getProcedureByCode() - start, procedureCode = " + procedureCode);

		SecurityUtils.getSubject().checkPermission(TPermission.READ_PROCEDURE.getPermission());

		if (procedureCode == null || procedureCode.trim().isEmpty()) {
			throw new WebApplicationException(Status.BAD_REQUEST);
		}

		TProcCodesRecord record = procedureDao.getProcedureByCode(procedureCode);
		
		if (record == null) {
			throw new NotFoundException("Procedure not found.");
		}

		return getRepresentation(record);
	}

	public ProcedureRepresentation getRepresentation(TProcCodesRecord record) {
		ProcedureRepresentation result = new ProcedureRepresentation();

		result.uri = uriInfo.getBaseUriBuilder().path(ProcedureResource.class).path(record.getCodeValue()).build();
		result.procCode = record.getCodeValue();
		result.description = record.getDescription();

		return result;
	}

	/**
	 * ProcedureRepresentation - message class
	 *
	 */
	public static class ProcedureRepresentation {
		public URI uri;

		public String procCode;
		public String description;
	}
}