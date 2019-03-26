package com.operasolutions.rl.service.facilitypeformance;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

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
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.inject.Inject;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.operasolutions.rl.auth.AuthConstants;
import com.operasolutions.rl.common.DateFormatConstant;
import com.operasolutions.rl.common.NumberConstants;
import com.operasolutions.rl.common.ReportConstants;
import com.operasolutions.rl.common.ReportUtils;
import com.operasolutions.rl.common.chart.ReportedPeriod;
import com.operasolutions.rl.common.chart.ReportedPeriodData;
import com.operasolutions.rl.common.chart.ReportedPeriodEnum;
import com.operasolutions.rl.exception.RevenueLeakageException;
import com.operasolutions.rl.schema.enums.TPermission;
import com.operasolutions.rl.service.exporter.FilterMapperEnum;
import com.sun.jersey.api.core.ResourceContext;
import com.sun.jersey.core.header.ContentDisposition;
import java.math.BigInteger;

/**
 * FacilityPerformanceResource
 *
 * @author Marcel Bodnar
 * @author Ravi Teja
 * @author Jatin Suri
 */
@Path("/" + FacilityPerformanceResource.URL_FACILITY_PERFORMANCE)
@RequiresAuthentication
public class FacilityPerformanceResource {

    public static final String URL_FACILITY_PERFORMANCE = "facilityPerformance";
    protected static final Logger log = LoggerFactory.getLogger(FacilityPerformanceResource.class);
    protected static final String OTHERS = "All Others";
    protected static final String EMPTY_VALUE = "";

    protected FacilityPerformanceRepresentation result = new FacilityPerformanceRepresentation();
    protected FacilityPerformanceGroupType groupType;
    private final FacilityPerformanceDao facilityDao;
    private static final Integer RECORDS_LIMIT = 20;
    private static final Integer RECORDS_LIMIT_CHARGE_CODE = 10;

    @Context
    ResourceContext rc;

    @Context
    UriInfo uriInfo;

    @Inject
    public FacilityPerformanceResource(FacilityPerformanceDao facilityDao) {
        this.facilityDao = facilityDao;
    }

    /**
     * Download Department and Patient (Facility Performance) Report as Excel
     * sheet
     *
     * @param costCenterList
     * @param reportType
     * @param period
     * @param hospitalList
     * @return Response
     * @throws java.io.IOException
     */
    @GET
    @Produces(ReportConstants.MIME_TYPE_EXCEL_REPORT)
    @Path(AuthConstants.EXCEL_URL)
    public Response downloadFacilityPerformanceReport(@QueryParam("costCenter") List<String> costCenterList, @QueryParam("reportType") String reportType, @QueryParam(value = "hospitalId") List<String> hospitalList, @QueryParam("period") Integer period) throws IOException {

        log.debug("downloadFacilityPerformanceReport() - start, costCenter = " + costCenterList.size() + ", hospitalId = " + hospitalList + ", period = " + period + ", reportType = " + reportType);

        SecurityUtils.getSubject().checkPermission(TPermission.READ_FACILITY_PERFORMANCE_REPORT.getPermission());

        generateDataExcel(reportType, hospitalList, period, costCenterList);

        java.sql.Timestamp timeStamp = new java.sql.Timestamp(new java.util.Date().getTime());
        String fileName = groupType.getReportFileName() + String.format(ReportConstants.FILE_NAME_SUFIX, timeStamp) + ReportConstants.FILE_EXTENSION_EXCEL;

        XSSFWorkbook workBook = getFacilityPerformaceChargesWorkBook(result);

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
     * Download Department and Patient (Facility Performance) Report as PDF file
     *
     * @param costCenterList
     * @param reportType
     * @param hospitalList
     * @param period
     * @return Response
     * @throws RevenueLeakageException
     */
    @GET
    @Produces(ReportConstants.MIME_TYPE_PDF_REPORT)
    @Path(AuthConstants.PDF_URL)
    public Response downloadFacilityPerformanceReportPDF(@QueryParam("costCenter") List<String> costCenterList, @QueryParam("reportType") String reportType, @QueryParam(value = "hospitalId") List<String> hospitalList, @QueryParam("period") Integer period) throws RevenueLeakageException {

        log.debug("downloadFacilityPerformanceReportPDF() - start, costCenter = " + costCenterList.size() + ", hospitalId = " + hospitalList + ", period = " + period + ", reportType = " + reportType);

        SecurityUtils.getSubject().checkPermission(TPermission.READ_FACILITY_PERFORMANCE_REPORT.getPermission());

        generateData(reportType, hospitalList, period, costCenterList);

        java.sql.Timestamp timeStamp = new java.sql.Timestamp(new java.util.Date().getTime());
        String fileName = groupType.getReportFileName() + String.format(ReportConstants.FILE_NAME_SUFIX, timeStamp) + ReportConstants.FILE_EXTENSION_PDF;

        log.debug("Preparing filters...");

        Map<FilterMapperEnum, String> mapFilters = new TreeMap<FilterMapperEnum, String>();
        mapFilters.put(FilterMapperEnum.COST_CENTER, Integer.toString(costCenterList.size()));
        mapFilters.put(FilterMapperEnum.TIME_PERIOD, ReportedPeriodEnum.getReportedPeriod(period).getUiValue());
        mapFilters.put(FilterMapperEnum.FACILITY, Integer.toString(hospitalList.size()));

        log.debug("Generating PDF report...");

        ByteArrayOutputStream outputStream = getFacilityPerformaceChargesPDF(result, mapFilters);

        log.debug("PDF file has been written into outputStream.");

        Response.ResponseBuilder response = Response.ok(outputStream.toByteArray());

        log.debug("Adding cookie to response for showing/hiding progressbar during file download.");

        response.header("Set-Cookie", "fileDownload=true; Path=/");

        response.header("Content-Disposition", ContentDisposition.type("attachment").fileName(fileName).build());

        return response.build();
    }

    /**
     * Get facility performance report - grid data
     *
     * @param costCenterList
     * @param reportType
     * @param hospitalList
     * @param period
     * @return FacilityPerformanceRepresentation
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public FacilityPerformanceRepresentation getFacilityPerformanceReport(@QueryParam("costCenter") List<String> costCenterList, @QueryParam("reportType") String reportType, @QueryParam(value = "hospitalId") List<String> hospitalList, @QueryParam("period") Integer period) {

        log.debug("getFacilityPerformanceReport() - start, costCenter = " + costCenterList.size() + ", hospitalId = " + hospitalList + ", period = " + period + ", reportType = " + reportType);

        SecurityUtils.getSubject().checkPermission(TPermission.READ_FACILITY_PERFORMANCE.getPermission());

        generateData(reportType, hospitalList, period, costCenterList);

        return result;
    }

    /**
     * Get Department and Patient Report WorkBook for PreBill and PostBill
     *
     * @param reportData
     * @return XSSFWorkbook
     */
    public XSSFWorkbook getFacilityPerformaceChargesWorkBook(FacilityPerformanceRepresentation reportData) {

        XSSFWorkbook workBook = new XSSFWorkbook();
        XSSFSheet workBookSheet = workBook.createSheet(groupType.getExcelSheetName());
        CellStyle cellStyleMoney = ReportUtils.getMoneyCellStyle(workBook);
        XSSFCellStyle cellStyleCenter = ReportUtils.getCenterStyleAlignment(workBook);

        XSSFRow row = null;
        XSSFCell cell = null;

        int rowNumber = 0;

        String[] reportHeader = getReportHeader(reportData).columnNames;

        row = workBookSheet.createRow(rowNumber);

        // header cell style
        CellStyle cellStyleHeader = ReportUtils.getExcelHeaderStyle(workBook);
        for (int j = 0; j < reportHeader.length; j++) {
            cell = row.createCell(j);
            cell.setCellStyle(cellStyleHeader);
            cell.setCellValue(reportHeader[j]);
        }

        rowNumber++;

        if (reportData.data.size() > 0) {
            for (int i = 0; i < reportData.data.size(); i++) {
                row = workBookSheet.createRow(rowNumber);
                writeRowIntoExcel(row, cell, reportData.data.get(i), i, cellStyleMoney, cellStyleCenter);
                rowNumber++;
            }
        }

        log.debug("Autosizing columns...");

        for (int j = 0; j < reportHeader.length; j++) {
            workBookSheet.autoSizeColumn(j);
        }

        return workBook;
    }

    /**
     * Generates PDF file
     *
     * @param reportData
     * @param mapFilters
     * @return ByteArrayOutputStream
     * @throws RevenueLeakageException
     */
    protected ByteArrayOutputStream getFacilityPerformaceChargesPDF(FacilityPerformanceRepresentation reportData, Map<FilterMapperEnum, String> mapFilters) throws RevenueLeakageException {

        if (reportData == null) {
            throw new IllegalArgumentException("Input parameter 'reportData' cannot be null.");
        }
        if (mapFilters == null) {
            throw new IllegalArgumentException("Input parameter 'mapFilters' cannot be null.");
        }

        Headers headers = getReportHeader(reportData);

        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        Document document = ReportUtils.getPDFDocumentWithSettings();

        try {
            PdfWriter writer = PdfWriter.getInstance(document, bos);
            writer.setPageEvent(ReportUtils.getPdfPageEventHelper(writer, groupType.getReportHeader()));
            document.open();

            ReportUtils.addPageTitle(document, groupType.getReportHeader());
            ReportUtils.addFilters(document, mapFilters);

            PdfPTable table = new PdfPTable(headers.columnNames.length);
            table.setWidthPercentage(100);

            log.debug("Adding header...");
            for (int i = 0; i < headers.columnNames.length; i++) {
                ReportUtils.addHeaderColumn(table, headers.columnNames[i], headers.horizontalAlignment[i]);
            }

            log.debug("Adding data...");

            for (int index = 0; index < reportData.data.size(); index++) {
                GridDataResult oneRecord = reportData.data.get(index);
                ReportUtils.addColumn(table, oneRecord.groupType);
                ReportUtils.addColumn(table, oneRecord.groupDesc);
                ReportUtils.addColumnAsMoney(table, oneRecord.hitValue);
                ReportUtils.addColumn(table, oneRecord.hitCount);
                table.setWidths(new int[]{100, 100, 80, 80});
            }
            document.add(table);
            document.close();
        } catch (DocumentException e) {
            throw new RevenueLeakageException("An error during generation PDF document.");
        }

        return bos;
    }

    /**
     * Writes the Row Data into Excel
     *
     * @param row
     * @param cell
     * @param oneRecord
     * @param index
     * @param cellStyleMoney
     * @param cellStyleCenter
     */
    protected void writeRowIntoExcel(XSSFRow row, XSSFCell cell, GridDataResult oneRecord, int index, CellStyle cellStyleMoney, XSSFCellStyle cellStyleCenter) {

        cell = row.createCell(0);
        cell.setCellValue(oneRecord.groupType);
        cell = row.createCell(1);
        cell.setCellValue(oneRecord.groupDesc);
        cell = row.createCell(2);
        cell.setCellValue(oneRecord.hitValue.setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE).doubleValue());
        cell.setCellStyle(cellStyleMoney);
        cell = row.createCell(3);
        cell.setCellValue(oneRecord.hitCount);

    }

    /**
     * Generates output data based on input parameters
     *
     * @param reportType
     * @param hospitalList
     * @param period
     * @param costCenterList
     */
    protected void generateData(String reportType, List<String> hospitalList, Integer period, List<String> costCenterList) {

        if (reportType == null || reportType.trim().isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }
        if (hospitalList == null || hospitalList.isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }
        if (period == null) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        groupType = FacilityPerformanceGroupType.getTypeFromString(reportType);
        log.debug("groupType as enum = " + groupType);
        if (groupType == null) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        ReportedPeriodData reportPeriodData = ReportedPeriod.getReportedPeriod(Calendar.getInstance(), ReportedPeriodEnum.getReportedPeriod(period));

        // previous month
        Calendar calStartPrevious = Calendar.getInstance();
        calStartPrevious.add(Calendar.MONTH, -1);
        calStartPrevious.set(Calendar.DATE, calStartPrevious.getActualMinimum(Calendar.DATE));
        calStartPrevious.set(Calendar.HOUR, 0);
        calStartPrevious.set(Calendar.MINUTE, 0);
        calStartPrevious.set(Calendar.SECOND, 0);
        calStartPrevious.set(Calendar.MILLISECOND, 0);

        Calendar calEndPrevious = (Calendar) calStartPrevious.clone();
        calEndPrevious.set(Calendar.DATE, calEndPrevious.getActualMaximum(Calendar.DATE));
        calEndPrevious.set(Calendar.HOUR, 0);
        calEndPrevious.set(Calendar.MINUTE, 0);
        calEndPrevious.set(Calendar.SECOND, 0);
        calEndPrevious.set(Calendar.MILLISECOND, 0);

        // previous previous month
        Calendar calStartPreviousPrevious = Calendar.getInstance();
        calStartPreviousPrevious.add(Calendar.MONTH, -2);
        calStartPreviousPrevious.set(Calendar.DATE, calStartPreviousPrevious.getActualMinimum(Calendar.DATE));
        calStartPreviousPrevious.set(Calendar.HOUR, 0);
        calStartPreviousPrevious.set(Calendar.MINUTE, 0);
        calStartPreviousPrevious.set(Calendar.SECOND, 0);
        calStartPreviousPrevious.set(Calendar.MILLISECOND, 0);

        Calendar calEndPreviousPrevious = (Calendar) calStartPreviousPrevious.clone();
        calEndPreviousPrevious.set(Calendar.DATE, calEndPreviousPrevious.getActualMaximum(Calendar.DATE));
        calEndPreviousPrevious.set(Calendar.HOUR, 0);
        calEndPreviousPrevious.set(Calendar.MINUTE, 0);
        calEndPreviousPrevious.set(Calendar.SECOND, 0);
        calEndPreviousPrevious.set(Calendar.MILLISECOND, 0);

        result.previousMonth = new SimpleDateFormat(DateFormatConstant.MONTH_YEAR).format(calStartPrevious.getTime()).toUpperCase();
        result.previousPreviousMonth = new SimpleDateFormat(DateFormatConstant.MONTH_YEAR).format(calStartPreviousPrevious.getTime()).toUpperCase();

        List<GridDataResult> allData = new ArrayList<GridDataResult>(0);

        List<GridDataResult> inputDeptChargeList = new ArrayList<GridDataResult>();

        allData = facilityDao.getAllData(new java.sql.Date(reportPeriodData.getMinDate().getTimeInMillis()), new java.sql.Date(reportPeriodData.getMaxDate().getTimeInMillis()), hospitalList, groupType, costCenterList);
        if (groupType == FacilityPerformanceGroupType.DEPT || groupType == FacilityPerformanceGroupType.COST_CENTER || groupType == FacilityPerformanceGroupType.REGION || groupType == FacilityPerformanceGroupType.NPI) {
            String reportTypeGroup = "";
            if (null != groupType) {
                switch (groupType) {
                    case DEPT:
                        reportTypeGroup = "DEPT_PROC";
                        break;
                    case COST_CENTER:
                        reportTypeGroup = "COST_CENTER_PROC_CODE";
                        break;
                    case REGION:
                        reportTypeGroup = "REGION_NPI";
                        break;
                    case NPI:
                        reportTypeGroup = "NPI_PROC_CODE";
                        break;
                    default:
                        break;
                }
            }
            inputDeptChargeList = facilityDao.getAllData(new java.sql.Date(reportPeriodData.getMinDate().getTimeInMillis()), new java.sql.Date(reportPeriodData.getMaxDate().getTimeInMillis()), hospitalList, FacilityPerformanceGroupType.getTypeFromString(reportTypeGroup), costCenterList);
        }

        log.debug("Count of all results = " + allData.size());

        log.debug("Executing ranking...");
        if (groupType == FacilityPerformanceGroupType.DEPT || groupType == FacilityPerformanceGroupType.COST_CENTER || groupType == FacilityPerformanceGroupType.REGION || groupType == FacilityPerformanceGroupType.NPI) {
            FacilityPerformanceDataProcessor processor = new FacilityPerformanceDataProcessor(allData, inputDeptChargeList);

            log.debug("Executing ranking has finished...");

            result.data = processor.processInputCollection();

            //if (result.data.size() > RECORDS_LIMIT) {
            log.debug("Length of charges data is greater than " + RECORDS_LIMIT);

            result.data = limitFacilityPeformanceGridData(result.data, processor.getInputDeptChargeList());
            //}
        } else {

            FacilityPerformanceDataProcessor processor = new FacilityPerformanceDataProcessor(allData);

            log.debug("Executing ranking has finished...");

            result.data = processor.processInputCollection();

            if (result.data.size() > RECORDS_LIMIT) {
                log.debug("Length of charges data is greater than " + RECORDS_LIMIT);

                result.data = limitFacilityPeformanceGridData(result.data);
            }
        }

    }

    /**
     * Generates output data based on input parameters
     *
     * @param reportType
     * @param hospitalList
     * @param period
     * @param costCenterList
     */
    protected void generateDataExcel(String reportType, List<String> hospitalList, Integer period, List<String> costCenterList) {

        if (reportType == null || reportType.trim().isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }
        if (hospitalList == null || hospitalList.isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }
        if (period == null) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        groupType = FacilityPerformanceGroupType.getTypeFromString(reportType);
        log.debug("groupType as enum = " + groupType);
        if (groupType == null) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        ReportedPeriodData reportPeriodData = ReportedPeriod.getReportedPeriod(Calendar.getInstance(), ReportedPeriodEnum.getReportedPeriod(period));

        // previous month
        Calendar calStartPrevious = Calendar.getInstance();
        calStartPrevious.add(Calendar.MONTH, -1);
        calStartPrevious.set(Calendar.DATE, calStartPrevious.getActualMinimum(Calendar.DATE));
        calStartPrevious.set(Calendar.HOUR, 0);
        calStartPrevious.set(Calendar.MINUTE, 0);
        calStartPrevious.set(Calendar.SECOND, 0);
        calStartPrevious.set(Calendar.MILLISECOND, 0);

        Calendar calEndPrevious = (Calendar) calStartPrevious.clone();
        calEndPrevious.set(Calendar.DATE, calEndPrevious.getActualMaximum(Calendar.DATE));
        calEndPrevious.set(Calendar.HOUR, 0);
        calEndPrevious.set(Calendar.MINUTE, 0);
        calEndPrevious.set(Calendar.SECOND, 0);
        calEndPrevious.set(Calendar.MILLISECOND, 0);

        // previous previous month
        Calendar calStartPreviousPrevious = Calendar.getInstance();
        calStartPreviousPrevious.add(Calendar.MONTH, -2);
        calStartPreviousPrevious.set(Calendar.DATE, calStartPreviousPrevious.getActualMinimum(Calendar.DATE));
        calStartPreviousPrevious.set(Calendar.HOUR, 0);
        calStartPreviousPrevious.set(Calendar.MINUTE, 0);
        calStartPreviousPrevious.set(Calendar.SECOND, 0);
        calStartPreviousPrevious.set(Calendar.MILLISECOND, 0);

        Calendar calEndPreviousPrevious = (Calendar) calStartPreviousPrevious.clone();
        calEndPreviousPrevious.set(Calendar.DATE, calEndPreviousPrevious.getActualMaximum(Calendar.DATE));
        calEndPreviousPrevious.set(Calendar.HOUR, 0);
        calEndPreviousPrevious.set(Calendar.MINUTE, 0);
        calEndPreviousPrevious.set(Calendar.SECOND, 0);
        calEndPreviousPrevious.set(Calendar.MILLISECOND, 0);

        result.previousMonth = new SimpleDateFormat(DateFormatConstant.MONTH_YEAR).format(calStartPrevious.getTime()).toUpperCase();
        result.previousPreviousMonth = new SimpleDateFormat(DateFormatConstant.MONTH_YEAR).format(calStartPreviousPrevious.getTime()).toUpperCase();

        List<GridDataResult> allData = new ArrayList<GridDataResult>(0);

        List<GridDataResult> inputDeptChargeList = new ArrayList<GridDataResult>();

        allData = facilityDao.getAllData(new java.sql.Date(reportPeriodData.getMinDate().getTimeInMillis()), new java.sql.Date(reportPeriodData.getMaxDate().getTimeInMillis()), hospitalList, groupType, costCenterList);
        if (groupType == FacilityPerformanceGroupType.DEPT || groupType == FacilityPerformanceGroupType.COST_CENTER || groupType == FacilityPerformanceGroupType.REGION || groupType == FacilityPerformanceGroupType.NPI) {
            String reportTypeGroup = "";
            if (null != groupType) {
                switch (groupType) {
                    case DEPT:
                        reportTypeGroup = "DEPT_PROC";
                        break;
                    case COST_CENTER:
                        reportTypeGroup = "COST_CENTER_PROC_CODE";
                        break;
                    case REGION:
                        reportTypeGroup = "REGION_NPI";
                        break;
                    case NPI:
                        reportTypeGroup = "NPI_PROC_CODE";
                        break;
                    default:
                        break;
                }
            }
            inputDeptChargeList = facilityDao.getAllData(new java.sql.Date(reportPeriodData.getMinDate().getTimeInMillis()), new java.sql.Date(reportPeriodData.getMaxDate().getTimeInMillis()), hospitalList, FacilityPerformanceGroupType.getTypeFromString(reportTypeGroup), costCenterList);
        }

        log.debug("Count of all results = " + allData.size());
        log.debug("Executing ranking...");
        if (groupType == FacilityPerformanceGroupType.DEPT || groupType == FacilityPerformanceGroupType.COST_CENTER || groupType == FacilityPerformanceGroupType.REGION || groupType == FacilityPerformanceGroupType.NPI) {
            FacilityPerformanceDataProcessor processor = new FacilityPerformanceDataProcessor(allData, inputDeptChargeList);

            log.debug("Executing ranking has finished...");

            result.data = processor.processInputCollection();

            //if (result.data.size() > RECORDS_LIMIT) {
            log.debug("Length of charges data is greater than " + RECORDS_LIMIT);

            result.data = limitFacilityPeformanceGridDataExcel(result.data, processor.getInputDeptChargeList());
            //}
        } else {

            FacilityPerformanceDataProcessor processor = new FacilityPerformanceDataProcessor(allData);

            log.debug("Executing ranking has finished...");

            result.data = processor.processInputCollection();

//            if (result.data.size() > RECORDS_LIMIT) {
//                log.debug("Length of charges data is greater than " + RECORDS_LIMIT);
//
//                result.data = limitFacilityPeformanceGridData(result.data);
//            }
        }

    }

    /**
     * Limit charges data and adding Others as last row
     *
     * @param data
     * @return List<GridDataResult>
     */
    protected List<GridDataResult> limitFacilityPeformanceGridData(List<GridDataResult> data) {
        List<GridDataResult> chargesData = new ArrayList<GridDataResult>();

        BigDecimal hitValueTemp = new BigDecimal(0);
        Integer hitCountTemp = 0;

        for (int counter = 0; counter < data.size(); counter++) {
            if (counter >= RECORDS_LIMIT - 1) {
                hitValueTemp = hitValueTemp.add(data.get(counter).hitValue != null ? data.get(counter).hitValue.setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE) : new BigDecimal(0));
                hitCountTemp += data.get(counter).hitCount != null ? data.get(counter).hitCount : new Integer(0);
            } else {
                chargesData.add(data.get(counter));
            }
        }
        GridDataResult othersData = new GridDataResult(OTHERS, hitValueTemp, EMPTY_VALUE, "");
        othersData.hitCount = hitCountTemp;
        chargesData.add(othersData);
        return chargesData;
    }

    protected List<GridDataResult> limitFacilityPeformanceGridData(List<GridDataResult> data, List<GridDataResult> inputDeptChargeList) {
        List<GridDataResult> chargesData = new ArrayList<GridDataResult>();
        BigDecimal hitValueTemp = new BigDecimal(0);
        Integer hitCountTemp = 0;
        // List<String> groupTypeList = new ArrayList<String>();
        int counter = 0;
        for (counter = 0; counter < data.size(); counter++) {
            if (counter >= RECORDS_LIMIT - 1) {
                hitValueTemp = hitValueTemp.add(data.get(counter).hitValue != null ? data.get(counter).hitValue.setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE) : new BigDecimal(0));
                hitCountTemp += data.get(counter).hitCount != null ? data.get(counter).hitCount : new Integer(0);
                //groupTypeList.add(data.get(counter).groupType);
            } else {
                chargesData.add(data.get(counter));
                chargesData.addAll(limitFacilityPeformanceGridDataChargeCode(inputDeptChargeList, data.get(counter).groupDesc, data.get(counter).groupType));
            }
        }
        if (counter >= RECORDS_LIMIT - 1) {
            if (hitValueTemp.compareTo(new BigDecimal(BigInteger.ZERO)) != 0) {
                GridDataResult othersData = new GridDataResult(OTHERS, hitValueTemp, EMPTY_VALUE, "");
                othersData.hitCount = hitCountTemp;
                othersData.procCode = EMPTY_VALUE;
                chargesData.add(othersData);
            }
            //chargesData.addAll(limitFacilityPeformanceGridDataChargeCodeOther(inputDeptChargeList, groupTypeList));
        }
        return chargesData;
    }

    protected List<GridDataResult> limitFacilityPeformanceGridDataExcel(List<GridDataResult> data, List<GridDataResult> inputDeptChargeList) {
        List<GridDataResult> chargesData = new ArrayList<GridDataResult>();
        for (GridDataResult data1 : data) {
            GridDataResult result = new GridDataResult(data1.groupType.concat("(Overall)"), data1.groupDesc);
            result.hitCount = data1.hitCount;
            result.hitValue = data1.hitValue;
            chargesData.add(result);
            chargesData.addAll(limitFacilityPeformanceGridDataChargeCodeExcel(inputDeptChargeList, data1.groupDesc, data1.groupType));
        }
        return chargesData;
    }

    protected List<GridDataResult> limitFacilityPeformanceGridDataChargeCode(List<GridDataResult> data, String deptCode, String groupType) {
        List<GridDataResult> chargesData = new ArrayList<GridDataResult>();

        BigDecimal hitValueTemp = new BigDecimal(0);
        Integer hitCountTemp = 0;
        int counter = 0;
        for (GridDataResult dataResult : data) {
            if (groupType.equalsIgnoreCase(dataResult.groupType)) {
                if (counter >= RECORDS_LIMIT_CHARGE_CODE - 1) {
                    hitValueTemp = hitValueTemp.add(dataResult.hitValue != null ? dataResult.hitValue.setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE) : new BigDecimal(0));
                    hitCountTemp += dataResult.hitCount != null ? dataResult.hitCount : new Integer(0);
                } else {
                    chargesData.add(dataResult);
                }
                counter++;
            }
        }
        if (counter >= RECORDS_LIMIT_CHARGE_CODE - 1) {
            if (hitValueTemp.compareTo(new BigDecimal(BigInteger.ZERO)) != 0) {
                GridDataResult othersData = new GridDataResult(groupType, hitValueTemp, OTHERS, "");
                othersData.hitCount = hitCountTemp;
                othersData.procCode = EMPTY_VALUE;
                chargesData.add(othersData);
            }
        }
        return chargesData;
    }

    protected List<GridDataResult> limitFacilityPeformanceGridDataChargeCodeExcel(List<GridDataResult> data, String deptCode, String groupType) {
        List<GridDataResult> chargesData = new ArrayList<GridDataResult>();
        for (GridDataResult dataResult : data) {
            if (groupType.equalsIgnoreCase(dataResult.groupType)) {
                chargesData.add(dataResult);
            }
        }

        return chargesData;
    }

    /**
     * Returns header data
     *
     * @param reportData
     * @return Headers
     */
    protected Headers getReportHeader(FacilityPerformanceRepresentation reportData) {

        Headers result = new Headers();

        String column1Header1 = "";
        String column1Header2 = ReportConstants.FACILITY_PERFORMANCE_HEADER2;
        String column1Header3 = ReportConstants.FACILITY_PERFORMANCE_HEADER3;

        if (null != groupType) {
            switch (groupType) {
                case COST_CENTER:
                    column1Header1 = ReportConstants.FACILITY_PERFORMANCE_HEADER1_COST_CENTER;
                    break;
                case DEPT:
                    column1Header1 = ReportConstants.FACILITY_PERFORMANCE_HEADER1_DEPT;
                    break;
                case REGION:
                    column1Header1 = ReportConstants.FACILITY_PERFORMANCE_HEADER1_REGION;
                    break;
                case NPI:
                    column1Header1 = ReportConstants.FACILITY_PERFORMANCE_HEADER1_NPI;
                    break;
                default:
                    break;
            }
        }

        result.horizontalAlignment = new int[]{Element.ALIGN_LEFT, Element.ALIGN_CENTER, Element.ALIGN_CENTER, Element.ALIGN_CENTER};
        if (groupType.equals(FacilityPerformanceGroupType.DEPT)) {
            result.columnNames = new String[]{column1Header1, ReportConstants.FACILITY_PERFORMANCE_HEADER3_PROC_CODE_DESC, column1Header2, column1Header3};
        }
        if (groupType.equals(FacilityPerformanceGroupType.COST_CENTER)) {
            result.columnNames = new String[]{column1Header1, ReportConstants.FACILITY_PERFORMANCE_HEADER3_PROC_CODE_DESC, column1Header2, column1Header3};
        }
        if (groupType.equals(FacilityPerformanceGroupType.REGION)) {
            result.columnNames = new String[]{column1Header1, ReportConstants.FACILITY_PERFORMANCE_HEADER1_NPI, column1Header2, column1Header3};
        }
        if (groupType.equals(FacilityPerformanceGroupType.NPI)) {
            result.columnNames = new String[]{column1Header1, ReportConstants.FACILITY_PERFORMANCE_HEADER3_PROC_CODE_DESC, column1Header2, column1Header3};
        }
        return result;
    }

    /**
     * Message class
     */
    public static class FacilityPerformanceRepresentation {

        public String previousPreviousMonth;
        public String previousMonth;
        public List<GridDataResult> data = new ArrayList<GridDataResult>();
    }

    /**
     * Header configuration class
     */
    private static class Headers {

        String[] columnNames;
        int[] horizontalAlignment;
    }
}
