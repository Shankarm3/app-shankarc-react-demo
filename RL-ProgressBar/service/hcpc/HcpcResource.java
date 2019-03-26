package com.operasolutions.rl.service.hcpc;

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
import com.operasolutions.rl.schema.tables.records.THcpcCodesRecord;
import com.sun.jersey.api.NotFoundException;

@Path("/" + HcpcResource.URL_HCPCS)
@Produces(MediaType.APPLICATION_JSON)
@RequiresAuthentication
public class HcpcResource {
	public static final String URL_HCPCS = "hcpcs";

	protected static final Logger log = LoggerFactory.getLogger(HcpcResource.class);

	private final HcpcDao hcpcDao;

	@Context
	UriInfo uriInfo;

	@Inject
	public HcpcResource(HcpcDao hcpcDao) {
		this.hcpcDao = hcpcDao;
	}

	@GET
	@Path("/{hcpcCode}")
	public HcpcRepresentation getHcpc(@PathParam("hcpcCode") String hcpcCode) {
	
		log.debug("getHcpc() - start, hcpcCode = " + hcpcCode);

		SecurityUtils.getSubject().checkPermission(TPermission.READ_HCPC.getPermission());

		if (hcpcCode == null || hcpcCode.isEmpty()) {
			throw new WebApplicationException(Status.BAD_REQUEST);
		}

		THcpcCodesRecord record = hcpcDao.getHcpcByCode(hcpcCode);

		if (record == null) {
			throw new NotFoundException("Hcpc not found.");
		}

		return getRepresentation(record);
	}	

	public HcpcRepresentation getRepresentation(THcpcCodesRecord record) {
		HcpcRepresentation result = new HcpcRepresentation();

		result.uri = uriInfo.getBaseUriBuilder().path(HcpcResource.class).path(record.getCodeValue()).build();
		result.hcpcCode = record.getCodeValue();
		result.description = record.getDescription();

		return result;
	} 

	/**
	 * HcpcRepresentation - message class
	 */
	public static class HcpcRepresentation {		
		public URI uri;
		
		public String hcpcCode;
		public String description;
	}
}