package com.operasolutions.rl.service.exporter;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.operasolutions.rl.common.ReportConstants;
import com.sun.jersey.core.header.ContentDisposition;
import com.sun.jersey.multipart.FormDataBodyPart;
import com.sun.jersey.multipart.FormDataMultiPart;

/**
 * ExporterResource
 *
 * @author Nirmal Kumar
 */
@Path("/" + ExporterResource.URL_EXPORTER)
@RequiresAuthentication
public class ExporterResource {

    public static final String URL_EXPORTER = "exporter";
    public static final String URL_EXPORTER_PDF = "pdf";

    protected static final String DEFAULT_FILE_NAME = "export" + ReportConstants.FILE_EXTENSION_PDF;

    protected static final Logger log = LoggerFactory.getLogger(ExporterResource.class);

    @POST
    @Path(URL_EXPORTER_PDF)
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(ReportConstants.MIME_TYPE_PDF_REPORT)
    public Response getPdfForDownload(FormDataMultiPart formParams) throws PDFGenerationException {
        log.debug("getPdfForDownload() - start");

        String fileNameString = DEFAULT_FILE_NAME;
        FormDataBodyPart fileName = formParams.getField(PDFGeneratorConstants.CHART_FILE_NAME);
        if (fileName != null && !fileName.getValue().trim().isEmpty()) {
            fileNameString = fileName.getValue() + ReportConstants.FILE_EXTENSION_PDF;
        }

        ResponseBuilder response = Response.ok(new PDFGenerator(formParams).generatePDF().toByteArray());
        response.header("Content-Disposition", ContentDisposition.type("attachment").fileName(fileNameString).build());

        log.debug("getPdfForDownload() - end");

        return response.build();
    }
}
