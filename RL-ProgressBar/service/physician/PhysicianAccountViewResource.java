/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.operasolutions.rl.service.physician;

/**
 *
 * @author nirmal.kumar
 */
import java.net.URI;
import java.util.List;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
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
import com.operasolutions.rl.auth.AuthConstants;
import com.operasolutions.rl.auth.AuthUtils;
import com.operasolutions.rl.common.ReportConstants;
import com.operasolutions.rl.common.ReportUtils;
import com.operasolutions.rl.schema.enums.TPermission;
import com.operasolutions.rl.schema.tables.records.TDiagCodesRecord;
import com.operasolutions.rl.schema.tables.records.THcpcCodesRecord;
import com.operasolutions.rl.schema.tables.records.TProcCodesRecord;
import com.operasolutions.rl.service.diagnose.DiagnoseResource;
import com.operasolutions.rl.service.diagnose.DiagnoseResource.DiagnoseRepresentation;
import com.operasolutions.rl.service.hcpc.HcpcResource;
import com.operasolutions.rl.service.hcpc.HcpcResource.HcpcRepresentation;
import com.operasolutions.rl.service.physician.charges.PhysicianChargesResource;
import com.operasolutions.rl.service.procedure.ProcedureResource;
import com.operasolutions.rl.service.procedure.ProcedureResource.ProcedureRepresentation;
import com.sun.jersey.api.core.ResourceContext;
import com.sun.jersey.core.header.ContentDisposition;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.core.Response;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

@Path(PhysicianAccountViewResource.URL_ACCOUNTS)
@Produces(MediaType.APPLICATION_JSON)
@RequiresAuthentication
public class PhysicianAccountViewResource {

    public static final String URL_ACCOUNTS = "physicianAccountsView";
    public static final String QUERY_STRING_VIEW_TYPE = "viewType";
    public static final String DEFAULT_VIEW = "accountId";
    public static final String URL_DIAGNOSES = "diagnoses";
    public static final String URL_PROCEDURES = "procedures";
    public static final String URL_HCPCS = "hcpcs";
    protected static final Logger log = LoggerFactory.getLogger(PhysicianAccountViewResource.class);

    @Context
    UriInfo uriInfo;

    @Context
    ResourceContext rc;

    private final PhysicianAccountViewDao accountDao;

    @Inject
    public PhysicianAccountViewResource(PhysicianAccountViewDao accountDao) {
        this.accountDao = accountDao;
    }

    @GET
    public List<PhysicianAccountRepresentation> getAccounts(@QueryParam("hospitalId") String hospitalId, @QueryParam("auditorId") List<String> auditorList,
            @QueryParam(value = "costCenter") String costCenter, @DefaultValue(DEFAULT_VIEW) @QueryParam(QUERY_STRING_VIEW_TYPE) String viewType) {
        log.debug("getAccounts() - start, hospitalId = " + hospitalId);
        if (hospitalId == null || hospitalId.trim().isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }
        Boolean all = null;
        if (SecurityUtils.getSubject().isPermitted(TPermission.READ_ALL_ACCOUNTS.getPermission())) {
            all = true;
        } else if (SecurityUtils.getSubject().isPermitted(TPermission.READ_ASSIGNED_ACCOUNTS.getPermission())) {
            all = false;
        } else {
            throw new AuthorizationException();
        }
        String uriCharges = uriInfo.getBaseUriBuilder().path(PhysicianChargesResource.class).build("hospitalId", "accountId").toString();
        return accountDao.getAccountsConfig(hospitalId, AuthUtils.getLoggedUserName(), all, auditorList, viewType, costCenter, uriCharges);
    }

    /**
     * Download Confirm Charges for PreBill and PostBill
     *
     * @return Response
     */
    @GET
    @Produces(ReportConstants.MIME_TYPE_EXCEL_REPORT)
    @Path(AuthConstants.EXCEL_URL)
    public Response downloadGetAccounts(@QueryParam("hospitalId") String hospitalId, @QueryParam("auditorId") List<String> auditorList,
            @QueryParam(value = "costCenter") String costCenter, @DefaultValue(DEFAULT_VIEW) @QueryParam(QUERY_STRING_VIEW_TYPE) String viewType) throws IOException, SQLException {
        log.debug("getAccounts() - start, hospitalId = " + hospitalId);
        if (hospitalId == null || hospitalId.trim().isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }
        Boolean all = null;
        if (SecurityUtils.getSubject().isPermitted(TPermission.READ_ALL_ACCOUNTS.getPermission())) {
            all = true;
        } else if (SecurityUtils.getSubject().isPermitted(TPermission.READ_ASSIGNED_ACCOUNTS.getPermission())) {
            all = false;
        } else {
            throw new AuthorizationException();
        }

        ResultSet rs = accountDao.getAccountsConfigResult(hospitalId, AuthUtils.getLoggedUserName(), all, auditorList, viewType, costCenter);
        java.sql.Timestamp timeStamp = new java.sql.Timestamp(new java.util.Date().getTime());
        String fileName = ReportConstants.ACCOUNT_REVIEW_LIST + String.format(ReportConstants.FILE_NAME_SUFIX, timeStamp) + ReportConstants.FILE_EXTENSION_EXCEL;

        XSSFWorkbook workBook = getConfirmChargesWorkBook(rs);

        log.debug("Generating excel finished.");
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workBook.write(outputStream);

        log.debug("Sheet has been written into outputStream.");

        Response.ResponseBuilder response = Response.ok(outputStream.toByteArray());

        log.debug("Adding cookie to response for showing/hiding progressbar during file download.");

        response.header("Set-Cookie", "fileDownload=true; Path=/");

        response.header("Content-Disposition", ContentDisposition.type("attachment").fileName(fileName).build());
        return response.build();
    }

    /**
     * Get Confirm Charges WorkBook for PreBill and PostBill (which is also used
     * for Unit Testing Download Excel Functionality)
     *
     * @param rs
     * @return XSSFWorkbook
     */
    public XSSFWorkbook getConfirmChargesWorkBook(ResultSet rs) throws SQLException {

        XSSFWorkbook workBook = new XSSFWorkbook();
        XSSFSheet workBookSheet = workBook.createSheet(ReportConstants.ACCOUNT_REVIEW_LIST_SHEET_NAME);
        XSSFRow row = null;
        XSSFCell cell = null;
        int rowNumber = 0;
        CellStyle cellStyleHeader = ReportUtils.getExcelHeaderStyle(workBook);
        row = workBook.getSheetAt(0).createRow(rowNumber);
        int numColumns = rs.getMetaData().getColumnCount();
        ResultSetMetaData rsmd = rs.getMetaData();
        for (int x = 0; x < numColumns; x++) {
            cell = row.createCell(x);
            cell.setCellStyle(cellStyleHeader);
            cell.setCellValue(rsmd.getColumnLabel(x + 1));
        }
        rowNumber = 1;
        int sheetNumber = 0;
        while (rs.next()) {
            row = workBook.getSheetAt(sheetNumber).createRow(rowNumber);
            for (int y = 0; y < numColumns; y++) {
                row.createCell(y).setCellValue(rs.getString(y + 1));
            }
            rowNumber++;
        }
        log.debug("Autosizing columns...");
        for (int j = 0; j < numColumns; j++) {
            workBookSheet.autoSizeColumn(j);
        }

        return workBook;
    }

    public static class PhysicianAccountRepresentation {

        public URI uriCharges;
        public String hospitalId;
        public String shortName;
        public String accountId;
        public Integer age;
        public String gender;
        public java.sql.Date admitDate;
        public java.sql.Date dischargeDate;
        public String patType;
        public String patTypeWithDescription;
        public String insurance;
        public String insuranceName;
        public boolean isHighlighted;
        public String predCode;
        public int rank;
        public String patSubType;
        public String patSubTypeWithDescription;
        public boolean isPrimary;
        public String patientId;
        public String serviceLocation;
        public String name;
        public java.sql.Date dob;
        public java.sql.Date transferDate;
        public Double rankScore;
        public Double evScore;
        public Integer remainingTime;
        public String employedNpis;
    }

    /**
     * All procedures for account - expanded
     *
     * @param hospitalId
     * @param accountId
     * @return List<ProcedureRepresentation>
     */
    @GET
    @Path("/{hospitalId:.*}/{accountId:.*}/" + URL_PROCEDURES)
    public List<ProcedureRepresentation> getProceduresForAccount(@PathParam("hospitalId") String hospitalId, @PathParam("accountId") String accountId) {
        log.debug("getProceduresForAccount(), hospitalId = " + hospitalId + ", accountId = " + accountId);

        SecurityUtils.getSubject().checkPermission(TPermission.READ_PROCEDURES_FOR_ACCOUNT.getPermission());

        List<ProcedureRepresentation> result = new ArrayList<ProcedureRepresentation>();

        if (hospitalId == null || hospitalId.trim().isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }
        if (accountId == null || accountId.trim().isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        for (TProcCodesRecord oneRecord : accountDao.getAllProceduresForAccount(hospitalId, accountId)) {
            ProcedureRepresentation expandedProcedure = rc.getResource(ProcedureResource.class).getRepresentation(oneRecord);
            if (expandedProcedure != null) {
                result.add(expandedProcedure);
            }
        }

        return result;
    }

    /**
     * All diagnoses for account - expanded
     *
     * @param hospitalId
     * @param accountId
     * @return List<DiagnoseRepresentation>
     */
    @GET
    @Path("/{hospitalId:.*}/{accountId:.*}/" + URL_DIAGNOSES)
    public List<DiagnoseRepresentation> getDiagnosesForAccount(@PathParam("hospitalId") String hospitalId, @PathParam("accountId") String accountId) {
        log.debug("getDiagnosesForAccount(), hospitalId = " + hospitalId + ", accountId = " + accountId);

        SecurityUtils.getSubject().checkPermission(TPermission.READ_DIAGNOSES_FOR_ACCOUNT.getPermission());

        List<DiagnoseRepresentation> result = new ArrayList<DiagnoseRepresentation>();

        if (hospitalId == null || hospitalId.trim().isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }
        if (accountId == null || accountId.trim().isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        for (TDiagCodesRecord oneRecord : accountDao.getAllDiagnosesForAccount(hospitalId, accountId)) {
            DiagnoseRepresentation expandedDiagnose = rc.getResource(DiagnoseResource.class).getRepresentation(oneRecord);

            if (expandedDiagnose != null) {
                result.add(expandedDiagnose);
            }
        }

        return result;
    }

    /**
     * All hcpcs for account - expanded
     *
     * @param hospitalId
     * @param accountId
     * @return List<HcpcRepresentation>
     */
    @GET
    @Path("/{hospitalId:.*}/{accountId:.*}/" + URL_HCPCS)
    public List<HcpcRepresentation> getHcpcsForAccount(@PathParam("hospitalId") String hospitalId, @PathParam("accountId") String accountId) {
        log.debug("getHcpcsForAccount(), hospitalId = " + hospitalId + ", accountId = " + accountId);

        SecurityUtils.getSubject().checkPermission(TPermission.READ_HCPCS_FOR_ACCOUNT.getPermission());

        List<HcpcRepresentation> result = new ArrayList<HcpcRepresentation>();

        if (hospitalId == null || hospitalId.trim().isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }
        if (accountId == null || accountId.trim().isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        for (THcpcCodesRecord oneRecord : accountDao.getAllHcpcsForAccount(hospitalId, accountId)) {
            HcpcRepresentation expandedHcpc = rc.getResource(HcpcResource.class).getRepresentation(oneRecord);

            if (expandedHcpc != null) {
                result.add(expandedHcpc);
            }
        }

        return result;
    }
}
