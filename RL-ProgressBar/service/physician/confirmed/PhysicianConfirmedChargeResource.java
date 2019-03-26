package com.operasolutions.rl.service.physician.confirmed;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
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
import com.operasolutions.rl.common.DbUtils;
import com.operasolutions.rl.common.NumberConstants;
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
import java.util.Date;

/**
 * ConfirmedChargeResource
 *
 * @author Nirmal Kumar
 */
@Path("/" + PhysicianConfirmedChargeResource.URL_CONFIRMED_CHARGES)
@RequiresAuthentication
public class PhysicianConfirmedChargeResource {

    public static final String URL_CONFIRMED_CHARGES = "physicianConfirmedCharges";
    public static final String URL_SEARCH = "search";
    protected static final Logger log = LoggerFactory.getLogger(PhysicianConfirmedChargeResource.class);
    private final PhysicianConfirmedChargeDao confirmDao;
    private final ActivityLogUtils activityLogUtils;

    @Context
    UriInfo uriInfo;

    @Inject
    public PhysicianConfirmedChargeResource(PhysicianConfirmedChargeDao confirmDao, ActivityLogUtils activityLogUtils) {
        this.confirmDao = confirmDao;
        this.activityLogUtils = activityLogUtils;
    }

    /**
     * Get Confirm Charges WorkBook for PreBill and PostBill (which is also used
     * for Unit Testing Download Excel Functionality)
     *
     * @param params
     * @param methodType
     * @return XSSFWorkbook
     */
    public XSSFWorkbook getConfirmChargesWorkBook(MyInput params) {

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
//        Timestamp startDateTimestamp = new Timestamp(params.startDate.value().getTime());
//
//        // add one day for correct search
//        Calendar cal = Calendar.getInstance();
//        cal.setTime(params.endDate.value());
//        cal.add(Calendar.DATE, 1);
//
//        Timestamp endDateTimestamp = new Timestamp(cal.getTimeInMillis());

        XSSFWorkbook workBook = new XSSFWorkbook();
        XSSFSheet workBookSheet = workBook.createSheet(ReportConstants.CONFIRMED_CHARGES_SHEET_NAME);
        XSSFRow row = null;
        XSSFCell cell = null;

        int rowNumber = 0;

        String[] reportHeader = ReportConstants.PHYSICIAN_CONFIRMED_CHARGES_REPORT_HEADER;

        row = workBookSheet.createRow(rowNumber);

        // header cell style
        CellStyle cellStyleHeader = ReportUtils.getExcelHeaderStyle(workBook);
        int reportHeaderLength = reportHeader.length;
        for (int j = 0; j < reportHeaderLength; j++) {
            cell = row.createCell(j);
            cell.setCellStyle(cellStyleHeader);
            cell.setCellValue(reportHeader[j]);
        }

        rowNumber++;
        boolean isAuditor = false;

        if (SecurityUtils.getSubject().hasRole(TUserRole.PHYSICIAN_AUDITOR.getUType())) {
            isAuditor = true;
        }
        List<ConfirmChargesResultForExcel> data = confirmDao.getConfirmChargesForExcel(params.hospitalList, startDateTimestamp, endDateTimestamp, params.rejectedCharges, isAuditor, currentUser, params.auditorList);
        for (ConfirmChargesResultForExcel oneRecord : data) {

            row = workBookSheet.createRow(rowNumber);
            writeRowIntoExcel(row, cell, oneRecord);
            rowNumber++;
        }

        log.debug("Autosizing columns...");

        for (int j = 0; j < reportHeader.length; j++) {
            workBookSheet.autoSizeColumn(j);
        }

        return workBook;

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
    public Response downloadConfirmedCharges(@InjectParam MyInput params) throws IOException {
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
    public List<ConfirmChargesRepresentation> getAllConfirmedCharges(@InjectParam MyInput params
    ) {
        log.debug("getAllConfirmedCharges() - start()");

        SecurityUtils.getSubject().checkPermission(TPermission.READ_CONFIRMED_CHARGES.getPermission());

        if (params == null) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }
        log.debug("getAllConfirmedCharges() - hospitalList = " + params.hospitalList + ", startDate = " + params.startDate + ", endDate = " + params.endDate + ", rejectedCharges = " + params.rejectedCharges);

        if (!isInputParameterValid(params)) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }
        List<ConfirmChargesRepresentation> result = new ArrayList<ConfirmChargesRepresentation>();
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
        for (ConfirmChargesResult oneRecord : confirmDao.getConfirmCharges(params.hospitalList, startDateTimestamp, endDateTimestamp, params.rejectedCharges, isAuditor, currentUser, params.auditorList)) {
            result.add(getRepresentation(oneRecord));
        }
        return result;
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

        List<ConfirmChargesRepresentation> result = new ArrayList<ConfirmChargesRepresentation>();
        log.debug("Converting dates into timestamps...");

        for (ConfirmChargesResult oneRecord : confirmDao.getConfirmChargesSearch(accountId, isAuditor, currentUser)) {
            result.add(getRepresentation(oneRecord));
        }

        return result;
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
     * Gets representation for PreBill and PostBill
     *
     * @param oneRecord
     * @return ConfirmChargesRepresentation
     */
    private ConfirmChargesRepresentation getRepresentation(ConfirmChargesResult oneRecord) {

        ConfirmChargesRepresentation result = new ConfirmChargesRepresentation();
        String[] converted = DbUtils.splitDchgCode(oneRecord.dchgCode);

        result.hospitalId = oneRecord.hospitalId;
        result.hospitalName = oneRecord.hospitalName;
        result.shortName = oneRecord.shortName;
        result.accountId = oneRecord.accountId;
        result.hcpcCode = oneRecord.hcpcCode;
        result.auditorId = oneRecord.auditorId;
        result.desc = oneRecord.desc;
        result.deptCode = converted[0];
        result.chargeCode = converted[1];
        result.chargeDesc = oneRecord.description;
        result.quantity = oneRecord.cenAuditorQty;
        result.comments = oneRecord.cenAuditorComments;
        result.billType = oneRecord.billType;
        if (oneRecord.cenAuditingTime != null) {
            Timestamp value = Timestamp.valueOf(oneRecord.cenAuditingTime);
            if (value != null) {
                result.confirmTime = new SimpleDateFormat(ReportConstants.REPORT_DATETIME_FORMAT).format(value);
            }
        }
        result.found = oneRecord.found;

        BigDecimal computedValue = null;
        BigDecimal priceValue = oneRecord.price;
        Integer qty = oneRecord.cenAuditorQty;

        if (priceValue != null && qty != null) {
            BigDecimal qtyValue = new BigDecimal(qty);
            computedValue = priceValue.multiply(qtyValue).setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE);
        } else {
            computedValue = new BigDecimal(0);
        }

        result.chargeAmount = computedValue;
        result.extAuditorComments = oneRecord.extAuditorComments;
        result.extAuditorFlag = oneRecord.extAuditorFlag;
        result.age = oneRecord.age;
        result.patientId = oneRecord.patientId;
        result.dob = oneRecord.dob;
        result.name = oneRecord.name;
        result.serviceLocation = oneRecord.serviceLocation;
        // gender, T_TYPE_LOOKUP
        String genderValue = oneRecord.sex;
        String genderDescription = oneRecord.genderDescription;
        if (genderDescription != null) {
            genderValue = genderDescription;
        }

        result.gender = genderValue;
        result.admitDate = oneRecord.admitDate;
        result.dischargeDate = oneRecord.dischargeDate;
        result.transferDate = oneRecord.transferDate;

        // patType, T_TYPE_LOOKUP
        String patTypeWithDescription = null;
        String patType = oneRecord.patientType;
        String patTypeDescription = oneRecord.patTypeDescription;

        if (patTypeDescription != null) {
            patTypeWithDescription = patType + " - " + patTypeDescription;
        } else {
            patTypeWithDescription = patType;
        }

        result.patType = patType;
        result.patTypeWithDescription = patTypeWithDescription;

        // patSubType, T_TYPE_LOOKUP
        String patSubTypeWithDescription = null;
        String patSubType = oneRecord.patientSubtype;
        String patSubTypeDescription = oneRecord.patSubTypeDescription;

        if (patSubTypeDescription != null) {
            patSubTypeWithDescription = patSubType + " - " + patSubTypeDescription;
        } else {
            patSubTypeWithDescription = patSubType;
        }

        result.patSubType = patSubType;
        result.patSubTypeWithDescription = patSubTypeWithDescription;

        result.insurance = oneRecord.payerCode;
        result.insuranceName = oneRecord.payerDesc;
        result.costCenter = oneRecord.costCenter;
        result.source = oneRecord.source;
        result.guarantorId = oneRecord.guarantorId;
        result.uri = uriInfo.getRequestUri();
        result.uriCharges = uriInfo.getBaseUriBuilder().path(PhysicianChargesResource.class).queryParam(ISCONFIRM, true).queryParam(ISSUBMITTED, true).build(result.hospitalId, result.accountId);
        return result;
    }

    /**
     * Writes the Row Data into Excel
     *
     * @param row
     * @param cell
     * @param oneRecord
     *
     */
    private void writeRowIntoExcel(XSSFRow row, XSSFCell cell, ConfirmChargesResultForExcel oneRecord) {

        String[] converted = DbUtils.splitDchgCode(oneRecord.dchgCode);

        log.debug("Pred Key :: " + oneRecord.predKey);

        cell = row.createCell(0);
        cell.setCellValue(oneRecord.predKey);

        cell = row.createCell(1);
        java.sql.Date predDateValue = (oneRecord.predictionDate);
        if (predDateValue != null) {
            cell.setCellValue(new SimpleDateFormat(ReportConstants.REPORT_DATE_FORMAT).format(predDateValue));
        }

        cell = row.createCell(2);
        cell.setCellValue(oneRecord.shortName);

        cell = row.createCell(3);
        cell.setCellValue(oneRecord.hospitalName);

        cell = row.createCell(4);
        cell.setCellValue(oneRecord.costCenter);

        cell = row.createCell(5);
        cell.setCellValue(oneRecord.source);

        cell = row.createCell(6);
        cell.setCellValue(oneRecord.guarantorId);

        cell = row.createCell(7);
        cell.setCellValue(oneRecord.auditorId);

        cell = row.createCell(8);
        cell.setCellValue(oneRecord.accountId);

        cell = row.createCell(9);
        cell.setCellValue(oneRecord.name);

        cell = row.createCell(10);
        cell.setCellValue(oneRecord.sex);

        cell = row.createCell(11);
        cell.setCellValue(oneRecord.patientType);

        cell = row.createCell(12);
        cell.setCellValue(oneRecord.patientSubtype);

        cell = row.createCell(13);
        cell.setCellValue(oneRecord.financialClass);

        cell = row.createCell(14);
        cell.setCellValue(oneRecord.payerDesc);

        cell = row.createCell(15);
        java.sql.Date admitDateValue = (oneRecord.admitDate);
        if (admitDateValue != null) {
            cell.setCellValue(new SimpleDateFormat(ReportConstants.REPORT_DATE_FORMAT).format(admitDateValue));
        }

        cell = row.createCell(16);
        java.sql.Date dischargeDateValue = (oneRecord.dischargeDate);
        if (dischargeDateValue != null) {
            cell.setCellValue(new SimpleDateFormat(ReportConstants.REPORT_DATE_FORMAT).format(dischargeDateValue));
        }

        cell = row.createCell(17);
        java.sql.Date dateOfService = (oneRecord.dateOfService);
        if (dateOfService != null) {
            cell.setCellValue(new SimpleDateFormat(ReportConstants.REPORT_DATE_FORMAT).format(dateOfService));
        }

        cell = row.createCell(18);
        cell.setCellValue(oneRecord.predCode);
        cell = row.createCell(19);
        cell.setCellValue(oneRecord.predNbr);
        cell = row.createCell(20);
        cell.setCellValue(oneRecord.hcpcCode);

        cell = row.createCell(21);
        BigDecimal priceValue = oneRecord.price;
        Integer qty = oneRecord.cenAuditorQty;

        if (priceValue != null && qty != null) {
            BigDecimal qtyValue = new BigDecimal(qty);
            cell.setCellValue(priceValue.multiply(qtyValue).setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE).doubleValue());
        } else {
            cell.setCellValue(new BigDecimal(0).doubleValue());
        }

        cell = row.createCell(22);
        cell.setCellValue(oneRecord.cenAuditorQty);
        cell = row.createCell(23);
        cell.setCellValue(oneRecord.cenAuditorComments);

        cell = row.createCell(24);
        Timestamp value = Timestamp.valueOf(oneRecord.cenAuditingTime);
        if (value != null) {
            cell.setCellValue(new SimpleDateFormat(ReportConstants.REPORT_DATETIME_FORMAT).format(value));
        }
        cell = row.createCell(25);
        cell.setCellValue(oneRecord.desc);

        cell = row.createCell(26);
        cell.setCellValue(oneRecord.found);

        cell = row.createCell(27);
        cell.setCellValue(oneRecord.erPhysCode);
        cell = row.createCell(28);
        cell.setCellValue(oneRecord.erPhys);
        cell = row.createCell(29);
        cell.setCellValue(oneRecord.erPhysNpi);
        cell = row.createCell(30);
        cell.setCellValue(oneRecord.admitPhysCode);
        cell = row.createCell(31);
        cell.setCellValue(oneRecord.admitPhys);
        cell = row.createCell(32);
        cell.setCellValue(oneRecord.admitPhysNpi);

    }

    /**
     * Message class
     */
    public static class ConfirmChargesRepresentation {

        public URI uri;
        public URI uriCharges;
        public URI uriDiagnoses;
        public URI uriProcedures;
        public URI uriHcpcs;

        public Integer age;
        public String gender;
        public Date admitDate;
        public Date dischargeDate;
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
        public String billType;
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
    }

    /**
     * JOOQ Record Result Mapping Class
     */
    public static class ConfirmChargesResult {

        public Integer age;
        public String sex;
        public String genderDescription;
        public java.sql.Date admitDate;
        public java.sql.Date dischargeDate;
        public String patientType;
        public String patTypeDescription;
        public String payerDesc;
        public String payerCode;

        public String hospitalId;
        public String accountId;
        public String hcpcCode;
        public String dchgCode;
        // public String chargeDescription;
        public String description;
        public BigDecimal price;
        public Integer cenAuditorQty;
        public String cenAuditorComments;
        public String cenAuditingTime;
        public int found;
        public String desc;
        public String extAuditorFlag;
        public String extAuditorComments;
        public String billType;
        public String patientSubtype;
        public String patSubTypeDescription;
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
    }

    /**
     * JOOQ Record Result Mapping Class,for excel
     */
    public static class ConfirmChargesResultForExcel {

        public Integer age;
        public String sex;
        public String genderDescription;
        public java.sql.Date admitDate;
        public java.sql.Date dischargeDate;
        public String patientType;
        public String patTypeDescription;
        public String payerDesc;
        public String payerCode;

        public String hospitalId;
        public String accountId;
        public String hcpcCode;
        public String dchgCode;
        public String description;
        public BigDecimal price;
        public Integer cenAuditorQty;
        public String cenAuditorComments;
        public String cenAuditingTime;
        public int found;
        public String desc;
        public String extAuditorFlag;
        public String extAuditorComments;
        public String billType;

        // public String facilityName;
        public String auditorId;
        public java.sql.Date predictionDate;

        public Integer predKey;
        public String financialClass;
        public String patientSubtype;
        public String patSubTypeDescription;
        public String hospitalName;
        public String shortName;
        public String patientId;
        public String serviceLocation;
        public String name;
        public java.sql.Date dob;
        public java.sql.Date transferDate;
        public String source;
        public String costCenter;
        public java.sql.Date dateOfService;
        public String predCode;
        public String revenueCode;
        public String method;
        public String predNbr;
        public String guarantorId;
        public String erPhys;
        public String erPhysCode;
        public String erPhysNpi;
        public String admitPhys;
        public String admitPhysCode;
        public String admitPhysNpi;
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
}
