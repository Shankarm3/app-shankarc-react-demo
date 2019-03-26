package com.operasolutions.rl.service.physician.confirmed;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriInfo;

import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.inject.Inject;
import com.operasolutions.rl.auth.AuthConstants;
import com.operasolutions.rl.auth.AuthUtils;
import com.operasolutions.rl.common.ActivityLogUtils;
import com.operasolutions.rl.common.ReportConstants;
import com.operasolutions.rl.common.ReportUtils;
import com.operasolutions.rl.common.param.DateParam;
import com.operasolutions.rl.schema.enums.TPermission;
import com.operasolutions.rl.schema.enums.TUserRole;
import static com.operasolutions.rl.service.physician.PhysicianAccountResource.ISCONFIRM;
import com.operasolutions.rl.service.physician.charges.PhysicianChargesResource;
import static com.operasolutions.rl.service.physician.charges.PhysicianChargesResource.ISSUBMITTED;
import com.sun.jersey.api.core.InjectParam;
import com.sun.jersey.core.header.ContentDisposition;
import java.net.URI;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;

/**
 * ConfirmedChargeResource
 *
 * @author Ravi Teja
 * @author Marcel Bodnar
 */
@Path("/" + ConfirmedChargeResource.URL_CONFIRMED_CHARGES)
@RequiresAuthentication
public class ConfirmedChargeResource {

    public static final String URL_CONFIRMED_CHARGES = "confirmedCharges";
    public static final String URL_SEARCH = "search";
    protected static final Logger log = LoggerFactory.getLogger(ConfirmedChargeResource.class);
    private final ConfirmedChargeDao confirmDao;
    private final ActivityLogUtils activityLogUtils;
    @Context
    UriInfo uriInfo;

    @Inject
    public ConfirmedChargeResource(ConfirmedChargeDao confirmDao, ActivityLogUtils activityLogUtils) {
        this.confirmDao = confirmDao;
        this.activityLogUtils = activityLogUtils;
    }

    /**
     * Download Confirm Charges for PreBill and PostBill
     *
     * @param params
     * @return Response
     */
    @GET
    @Produces(ReportConstants.MIME_TYPE_EXCEL_REPORT)
    @Path(AuthConstants.EXCEL_URL)
    public Response downloadConfirmedCharges(@InjectParam MyInput params) throws IOException, Exception {
        log.debug("downloadConfirmedCharges() - start()");

        SecurityUtils.getSubject().checkPermission(TPermission.READ_CONFIRMED_CHARGES_REPORT.getPermission());

        if (params == null) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        log.debug("downloadConfirmedCharges() - hospitalList = " + params.hospitalList + ", startDate = " + params.startDate + ", endDate = " + params.endDate);

        if (!isInputParameterValid(params)) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        java.sql.Timestamp timeStamp = new java.sql.Timestamp(new java.util.Date().getTime());
        String fileName = ReportConstants.CONFIRMED_CHARGES_REPORT_NAME + String.format(ReportConstants.FILE_NAME_SUFIX, timeStamp) + ReportConstants.FILE_EXTENSION_EXCEL;

        XSSFWorkbook workBook = getConfirmChargesWorkBook(params);

        log.debug("Generating excel finished.");
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workBook.write(outputStream);

        log.debug("Sheet has been written into outputStream.");

        ResponseBuilder response = Response.ok(outputStream.toByteArray());

        log.debug("Adding cookie to response for showing/hiding progressbar during file download.");

        response.header("Set-Cookie", "fileDownload=true; Path=/");

        response.header("Content-Disposition", ContentDisposition.type("attachment").fileName(fileName).build());
        return response.build();
    }

    /**
     * Gets Confirm Charges for PreBill and PostBill
     *
     * @param params
     * @param methodType
     * @return List<ConfirmChargesRepresentation>
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<ConfirmChargesRepresentation> getAllConfirmedCharges(@InjectParam MyInput params) {
        log.debug("getAllConfirmedCharges() - start()");

        SecurityUtils.getSubject().checkPermission(TPermission.READ_CONFIRMED_CHARGES.getPermission());

        if (params == null) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        log.debug("getAllConfirmedCharges() - hospitalList = " + params.hospitalList + ", startDate = " + params.startDate + ", endDate = " + params.endDate + ", rejectedCharges = " + params.rejectedCharges);

        if (!isInputParameterValid(params)) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        boolean isAuditor = false;
        String currentUser = AuthUtils.getLoggedUserName();
        if (SecurityUtils.getSubject().hasRole(TUserRole.PHYSICIAN_AUDITOR.getUType())) {
            isAuditor = true;
        }
        log.debug("Converting dates into timestamps...");

        String userTimeZone = activityLogUtils.getUserTimeZone(currentUser);
        Timestamp startDateTimestamp = activityLogUtils.getStartDateTimeStamp(userTimeZone, params.startDate);

        // add one day for correct search
//        Calendar cal = Calendar.getInstance();
//        cal.setTime(params.endDate.value());
//        cal.add(Calendar.DATE, 1);
        Timestamp endDateTimestamp = activityLogUtils.getEndDateTimeStamp(userTimeZone, params.endDate);

        String uriCharges = uriInfo.getBaseUriBuilder().path(PhysicianChargesResource.class).queryParam(ISCONFIRM, true).queryParam(ISSUBMITTED, true).build("hospitalId", "accountId").toString();

        return confirmDao.getConfirmCharges(params.hospitalList, startDateTimestamp, endDateTimestamp, params.rejectedCharges, isAuditor, currentUser, params.auditorList, uriCharges);

    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/" + URL_SEARCH)
    public List<ConfirmChargesRepresentation> getAllConfirmedChargesSearch(@QueryParam("accountId") String accountId) {
        log.debug("getAllConfirmedCharges() - start()");

        SecurityUtils.getSubject().checkPermission(TPermission.READ_CONFIRMED_CHARGES.getPermission());

        if (accountId == null) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }
        boolean isAuditor = false;
        String currentUser = AuthUtils.getLoggedUserName();
        if (SecurityUtils.getSubject().hasRole(TUserRole.PHYSICIAN_AUDITOR.getUType())) {
            isAuditor = true;
        }
        log.debug("getAllConfirmedCharges() - accountId = " + accountId);
        String uriCharges = uriInfo.getBaseUriBuilder().path(PhysicianChargesResource.class).queryParam(ISCONFIRM, true).queryParam(ISSUBMITTED, true).build("hospitalId", "accountId").toString();
        return confirmDao.getConfirmChargesSearch(accountId, isAuditor, currentUser, uriCharges);

    }

    /**
     * Checks input parameters
     *
     * @param params
     * @return result - true/false
     */
    private boolean isInputParameterValid(MyInput params) {
        boolean result = true;

        if (params.hospitalList == null || params.hospitalList.size() == 0) {
            result = false;
        }

        if (params.startDate == null) {
            result = false;
        }

        if (params.endDate == null) {
            result = false;
        }

        return result;
    }

    /**
     * Message class
     */
    public static class ConfirmChargesRepresentation {

        public URI uriCharges;
        public Integer age;
        public String gender;
        public java.sql.Date admitDate;
        public java.sql.Date dischargeDate;
        public String patType;
        public String patTypeWithDescription;
        public String insurance;
        public String insuranceName;
        public String hospitalId;
        public String accountId;
        public String hcpcCode;
        public String deptCode;
        public String chargeCode;
        public String chargeDesc;
        public BigDecimal chargeAmount;
        public Integer quantity;
        public String comments;
        public String confirmTime;
        public int found;
        public String desc;
        public String extAuditorFlag;
        public String extAuditorComments;
        public String patSubType;
        public String patSubTypeWithDescription;
        public String hospitalName;
        public String shortName;
        public String auditorId;
        public String patientId;
        public String serviceLocation;
        public String name;
        public java.sql.Date dob;
        public java.sql.Date transferDate;
        public String source;
        public String costCenter;
        public String guarantorId;
        public String pos;
        public String modifier;
        public String diag;
        public String primaryDiag;
        public String npi;
        public String claimNumber;
        public String custom1;
        public String custom2;
        public String custom3;
        public String custom4;
        public String dept;
    }

    /**
     * Query Params
     */
    public static class MyInput {

        @QueryParam(value = "hospitalId")
        public List<String> hospitalList;

        @QueryParam(value = "startDate")
        public DateParam startDate;

        @QueryParam(value = "endDate")
        public DateParam endDate;

        @QueryParam(value = "rejectedCharges")
        public String rejectedCharges;

        @QueryParam(value = "auditorId")
        public List<String> auditorList;
    }

    /**
     * Get Confirm Charges WorkBook for PreBill and PostBill (which is also used
     * for Unit Testing Download Excel Functionality)
     *
     * @param params
     * @param methodType
     * @return XSSFWorkbook
     */
    public XSSFWorkbook getConfirmChargesWorkBook(MyInput params) throws SQLException {

        if (params == null) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        log.debug("downloadConfirmedCharges() - hospitalList = " + params.hospitalList + ", startDate = " + params.startDate + ", endDate = " + params.endDate);

        if (!isInputParameterValid(params)) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        log.debug("Converting dates into timestamps...");

        String currentUser = AuthUtils.getLoggedUserName();
        String userTimeZone = activityLogUtils.getUserTimeZone(currentUser);
        Timestamp startDateTimestamp = activityLogUtils.getStartDateTimeStamp(userTimeZone, params.startDate);

        // add one day for correct search
//        Calendar cal = Calendar.getInstance();
//        cal.setTime(params.endDate.value());
//        cal.add(Calendar.DATE, 1);
        Timestamp endDateTimestamp = activityLogUtils.getEndDateTimeStamp(userTimeZone, params.endDate);

        XSSFWorkbook workBook = new XSSFWorkbook();
        XSSFSheet workBookSheet = workBook.createSheet(ReportConstants.CONFIRMED_CHARGES_SHEET_NAME);
        XSSFRow row = null;
        XSSFCell cell = null;
        int rowNumber = 0;
        CellStyle cellStyleHeader = ReportUtils.getExcelHeaderStyle(workBook);
        boolean isAuditor = false;

        if (SecurityUtils.getSubject().hasRole(TUserRole.PHYSICIAN_AUDITOR.getUType())) {
            isAuditor = true;
        }

        log.debug("Generating excel report for preBill...");
        ResultSet rs = confirmDao.getConfirmChargesForExcel(params.hospitalList, startDateTimestamp, endDateTimestamp, params.rejectedCharges, isAuditor, currentUser, params.auditorList);
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
//                if (rowNumber == 65001) {
//                    log.info("Sheet " + sheetNumber + "written; moving onto to sheet " + (sheetNumber + 1));
//                    sheetNumber++;
//                    rowNumber = 1;
//                }
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
}
