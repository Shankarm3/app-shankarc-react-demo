package com.operasolutions.rl.service.auditorperformance;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
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
import com.operasolutions.rl.auth.AuthUtils;
import com.operasolutions.rl.common.DbUtils;
import com.operasolutions.rl.common.NumberConstants;
import com.operasolutions.rl.common.ReportConstants;
import com.operasolutions.rl.common.ReportUtils;
import com.operasolutions.rl.common.chart.ReportedPeriod;
import com.operasolutions.rl.common.chart.ReportedPeriodData;
import com.operasolutions.rl.common.chart.ReportedPeriodEnum;
import com.operasolutions.rl.common.chart.api.GraphData;
import com.operasolutions.rl.exception.RevenueLeakageException;
import com.operasolutions.rl.schema.enums.TPermission;
import com.operasolutions.rl.schema.enums.TUserRole;
import com.operasolutions.rl.service.exporter.FilterMapperEnum;
import com.sun.jersey.core.header.ContentDisposition;

/**
 * AuditorPerformanceResource
 *
 * @author Nirmal Kumar
 */
@Path("/" + AuditorPerformanceResource.URL_AUDITOR_PERFORMANCE)
@RequiresAuthentication
public class AuditorPerformanceResource {

    public static final String URL_AUDITOR_PERFORMANCE = "auditorPerformance";
    public static final String URL_AUDITOR_COMPARISON = "auditorComparison";
    public static final String URL_AUDITOR_TREND = "auditorTrend";
    protected static final Logger log = LoggerFactory.getLogger(AuditorPerformanceResource.class);

    private final AuditorPerformanceDao auditorPerformanceDao;

    @Context
    UriInfo uriInfo;

    @Inject
    public AuditorPerformanceResource(AuditorPerformanceDao auditorPerformanceDao) {
        this.auditorPerformanceDao = auditorPerformanceDao;
    }

    /**
     * Download Auditor Comparison Report as Excel sheet
     *
     * @param costCenterList
     * @param period
     * @return Response
     * @throws java.io.IOException
     */
    @GET
    @Path("/" + AuditorPerformanceResource.URL_AUDITOR_COMPARISON + "/" + AuthConstants.EXCEL_URL)
    @Produces(ReportConstants.MIME_TYPE_EXCEL_REPORT)
    public Response downloadAuditorComparisonReport(@QueryParam("costCenter") List<String> costCenterList, @QueryParam("period") Integer period) throws IOException {
        log.debug("downloadAuditorComparisonReport() - start, costCenter = " + costCenterList.size() + ", period = " + period);

        SecurityUtils.getSubject().checkPermission(TPermission.READ_AUDITOR_PERFORMANCE_REPORT.getPermission());

        String reportingUserId = null;
        if (SecurityUtils.getSubject().hasRole(TUserRole.PHYSICIAN_RPT_USER.getUType())) {
            reportingUserId = AuthUtils.getLoggedUserName();
        }

        java.sql.Timestamp timeStamp = new java.sql.Timestamp(new java.util.Date().getTime());
        String fileName = ReportConstants.PERFORMANCE_COMPARISON_REPORT_NAME + String.format(ReportConstants.FILE_NAME_SUFIX, timeStamp) + ReportConstants.FILE_EXTENSION_EXCEL;

        log.debug("Generating excel report...");

        XSSFWorkbook workBook = getAuditorPerformanceWorkBook(getResults(costCenterList, period, reportingUserId));

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
     * Download Auditor Comparison Report as PDF file
     *
     * @param costCenterList
     * @param period
     * @return Response
     * @throws RevenueLeakageException
     */
    @GET
    @Path("/" + AuditorPerformanceResource.URL_AUDITOR_COMPARISON + "/" + AuthConstants.PDF_URL)
    @Produces(ReportConstants.MIME_TYPE_PDF_REPORT)
    public Response downloadAuditorComparisonReportPDF(@QueryParam("costCenter") List<String> costCenterList, @QueryParam("period") Integer period) throws RevenueLeakageException {
        log.debug("downloadAuditorComparisonReportPDF() - start, costCenterList = " + costCenterList.size() + ", period = " + period);

        SecurityUtils.getSubject().checkPermission(TPermission.READ_AUDITOR_PERFORMANCE_REPORT.getPermission());

        String reportingUserId = null;
        if (SecurityUtils.getSubject().hasRole(TUserRole.PHYSICIAN_RPT_USER.getUType())) {
            reportingUserId = AuthUtils.getLoggedUserName();
        }

        java.sql.Timestamp timeStamp = new java.sql.Timestamp(new java.util.Date().getTime());
        String fileName = ReportConstants.AUDITOR_PERFORMANCE_REPORT_NAME + String.format(ReportConstants.FILE_NAME_SUFIX, timeStamp) + ReportConstants.FILE_EXTENSION_PDF;

        log.debug("Reading data from DB...");
        List<AuditorComparisonResult> results = getResults(costCenterList, period, reportingUserId);

        log.debug("Preparing filters...");
        Map<FilterMapperEnum, String> mapFilters = new TreeMap<FilterMapperEnum, String>();
        mapFilters.put(FilterMapperEnum.COST_CENTER, String.valueOf(costCenterList.size()));
        mapFilters.put(FilterMapperEnum.TIME_PERIOD, ReportedPeriodEnum.getReportedPeriod(period).getUiValue());
        log.debug("Generating PDF report...");
        ByteArrayOutputStream outputStream = getAuditorPerformancePDF(results, mapFilters);

        log.debug("PDF file has been written into outputStream.");

        Response.ResponseBuilder response = Response.ok(outputStream.toByteArray());
        
        log.debug("Adding cookie to response for showing/hiding progressbar during file download.");

        response.header("Set-Cookie", "fileDownload=true; Path=/");
        
        response.header("Content-Disposition", ContentDisposition.type("attachment").fileName(fileName).build());

        return response.build();
    }

    /**
     * Generates PDF document report
     *
     * @param auditorComparisonList
     * @param mapFilters
     * @return ByteArrayOutputStream
     * @throws RevenueLeakageException
     */
    protected ByteArrayOutputStream getAuditorPerformancePDF(List<AuditorComparisonResult> auditorComparisonList, Map<FilterMapperEnum, String> mapFilters) throws RevenueLeakageException {

        if (auditorComparisonList == null) {
            throw new IllegalArgumentException("Input parameter 'auditorComparisonList' cannot be null.");
        }
        if (mapFilters == null) {
            throw new IllegalArgumentException("Input parameter 'mapFilters' cannot be null.");
        }

        ByteArrayOutputStream bos = new ByteArrayOutputStream();

        Document document = ReportUtils.getPDFDocumentWithSettings();

        try {
            PdfWriter writer = PdfWriter.getInstance(document, bos);
            writer.setPageEvent(ReportUtils.getPdfPageEventHelper(writer, ReportConstants.AUDITOR_PERFORMANCE_TABLE_NAME));
            document.open();

            ReportUtils.addPageTitle(document, ReportConstants.AUDITOR_PERFORMANCE_TABLE_NAME);
            ReportUtils.addFilters(document, mapFilters);

            PdfPTable table = new PdfPTable(ReportConstants.AUDITOR_PERFORMANCE_REPORT_HEADER.length);
            table.setWidthPercentage(100);

            log.debug("Adding header...");
            for (int i = 0; i < ReportConstants.AUDITOR_PERFORMANCE_REPORT_HEADER.length; i++) {
                ReportUtils.addHeaderColumn(table, ReportConstants.AUDITOR_PERFORMANCE_REPORT_HEADER[i], ReportConstants.AUDITOR_PERFORMANCE_REPORT_HEADER_ALIGNMENT[i]);
            }

            log.debug("Adding data...");
            for (AuditorComparisonResult oneRecord : auditorComparisonList) {
                ReportUtils.addColumn(table, DbUtils.concatFullUserName(oneRecord.fName, oneRecord.lName), Element.ALIGN_LEFT);
                ReportUtils.addColumn(table, oneRecord.totalCostCenter);
                //ReportUtils.addColumn(table, oneRecord.totalAccount);
                ReportUtils.addColumn(table, oneRecord.reviewedAccount);
                ReportUtils.addColumn(table, oneRecord.hitAccount);
                ReportUtils.addColumnAsMoney(table, oneRecord.hitValue);
            }

            table.setWidths(new int[]{150, 130, 120, 80, 130});

            document.add(table);
            document.close();
        } catch (DocumentException e) {
            throw new RevenueLeakageException("An error during generation PDF document.");
        }

        return bos;
    }

    /**
     * Processes input parameters and returns data from DB
     *
     * @param costCenterList
     * @param period
     * @param reportingUserId
     * @return List<AuditorComparisonResult>
     */
    protected List<AuditorComparisonResult> getResults(List<String> costCenterList, Integer period, String reportingUserId) {

        if (costCenterList == null || costCenterList.isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }
        if (period == null) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        ReportedPeriodData reportPeriodData = ReportedPeriod.getReportedPeriod(Calendar.getInstance(), ReportedPeriodEnum.getReportedPeriod(period));
        List<AuditorComparisonResult> results = new ArrayList<AuditorComparisonResult>();

        results = auditorPerformanceDao.getAuditorComparisonData(new java.sql.Date(reportPeriodData.getMinDate().getTimeInMillis()), new java.sql.Date(reportPeriodData.getMaxDate().getTimeInMillis()), reportingUserId, costCenterList);

        return results;
    }

    /**
     * Gets data into grid
     *
     * @param costCenterList
     * @param period
     * @return AuditorComparisonRepresentation
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/" + AuditorPerformanceResource.URL_AUDITOR_COMPARISON)
    public AuditorComparisonRepresentation getAuditorComparisonData(@QueryParam("costCenter") List<String> costCenterList, @QueryParam("period") Integer period) {
        log.debug("getAuditorComparisonData() - start, costCenter = " + costCenterList + ", period = " + period);

        SecurityUtils.getSubject().checkPermission(TPermission.READ_AUDITOR_PERFORMANCE.getPermission());

        String reportingUserId = null;
        if (SecurityUtils.getSubject().hasRole(TUserRole.PHYSICIAN_RPT_USER.getUType())) {
            reportingUserId = AuthUtils.getLoggedUserName();
        }

        if (costCenterList == null || costCenterList.isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }
        if (period == null) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        ReportedPeriodData reportPeriodData = ReportedPeriod.getReportedPeriod(Calendar.getInstance(), ReportedPeriodEnum.getReportedPeriod(period));
        List<AuditorComparisonResult> results = new ArrayList<AuditorComparisonResult>();

        results = auditorPerformanceDao.getAuditorComparisonData(new java.sql.Date(reportPeriodData.getMinDate().getTimeInMillis()), new java.sql.Date(reportPeriodData.getMaxDate().getTimeInMillis()), reportingUserId, costCenterList);

        return getRepresentation(results, reportPeriodData);
    }

    /**
     * Gets trend data
     *
     * @param costCenterList
     * @param period
     * @param auditorId
     * @return AuditorTrendRepresentation
     */
    @GET
    @Path("/" + AuditorPerformanceResource.URL_AUDITOR_TREND)
    public AuditorTrendRepresentation getAuditorTrendData(@QueryParam("costCenter") List<String> costCenterList, @QueryParam("period") Integer period, @QueryParam("auditorId") String auditorId) {
        log.debug("getAuditorTrendData() - start, costCenter = " + costCenterList.size() + ", period = " + period + ", auditorId = " + auditorId);

        SecurityUtils.getSubject().checkPermission(TPermission.READ_AUDITOR_PERFORMANCE.getPermission());
        String reportingUserId = null;
        if (SecurityUtils.getSubject().hasRole(TUserRole.PHYSICIAN_RPT_USER.getUType())) {
            reportingUserId = AuthUtils.getLoggedUserName();
        }

        if (costCenterList == null || costCenterList.isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }
        if (period == null) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }
        if (auditorId == null || auditorId.trim().isEmpty()) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        ReportedPeriodData reportPeriodData = ReportedPeriod.getReportedPeriod(Calendar.getInstance(), ReportedPeriodEnum.getReportedPeriod(period));
        List<AuditorTrendResult> results = new ArrayList<AuditorTrendResult>();

        results = auditorPerformanceDao.getAuditorTrendData(new java.sql.Date(reportPeriodData.getMinDate().getTimeInMillis()), new java.sql.Date(reportPeriodData.getMaxDate().getTimeInMillis()), auditorId, reportingUserId, costCenterList);

        log.debug("Number of records from DAO: " + results.size());
        log.debug("Generating output data structure...");
        List<String> costList = auditorPerformanceDao.getCostCenter(new java.sql.Date(reportPeriodData.getMinDate().getTimeInMillis()), new java.sql.Date(reportPeriodData.getMaxDate().getTimeInMillis()), auditorId, reportingUserId, costCenterList);
        AuditorTrendOutputGenerator output = new AuditorTrendOutputGenerator(results, reportPeriodData, costList);
        AuditorTrendRepresentation result = output.generateChartData();

        return result;
    }

    /**
     * Get Auditor Comparison Report Work Book for PreBill and PostBill
     *
     * @param auditorComparisonList
     * @return XSSFWorkbook
     */
    public XSSFWorkbook getAuditorPerformanceWorkBook(List<AuditorComparisonResult> auditorComparisonList) {

        XSSFWorkbook workBook = new XSSFWorkbook();
        XSSFSheet workBookSheet = workBook.createSheet(ReportConstants.AUDITOR_PERFORMANCE_CHARGES_SHEET_NAME);
        XSSFRow row = null;
        XSSFCell cell = null;

        CellStyle cellStyleMoney = ReportUtils.getMoneyCellStyle(workBook);
        CellStyle cellStylePercentage = ReportUtils.getPercentageCellStyle(workBook);

        int rowNumber = 0;

        String[] reportHeader = ReportConstants.AUDITOR_PERFORMANCE_REPORT_HEADER;

        // header cell style
        CellStyle cellStyleHeader = ReportUtils.getExcelHeaderStyle(workBook);

        row = workBookSheet.createRow(rowNumber);
        for (int j = 0; j < reportHeader.length; j++) {
            cell = row.createCell(j);
            cell.setCellStyle(cellStyleHeader);
            cell.setCellValue(reportHeader[j]);
        }

        rowNumber++;

        for (AuditorComparisonResult oneRecord : auditorComparisonList) {
            row = workBookSheet.createRow(rowNumber);
            writeRowIntoExcel(row, cell, oneRecord, cellStyleMoney, cellStylePercentage);
            rowNumber++;
        }

        for (int j = 0; j < reportHeader.length; j++) {
            workBookSheet.autoSizeColumn(j);
        }

        return workBook;
    }

    /**
     * Writes the Row Data into Excel
     *
     * @param row
     * @param cell
     * @param oneRecord
     * @param cellStyleMoney
     * @param cellStylePercentage
     */
    private void writeRowIntoExcel(XSSFRow row, XSSFCell cell, AuditorComparisonResult oneRecord, CellStyle cellStyleMoney, CellStyle cellStylePercentage) {

        cell = row.createCell(0);
        cell.setCellValue(DbUtils.concatFullUserName(oneRecord.fName, oneRecord.lName));

        cell = row.createCell(1);
        cell.setCellValue(oneRecord.totalCostCenter);

//        cell = row.createCell(2);
//        cell.setCellValue(oneRecord.totalAccount);
        cell = row.createCell(2);
        cell.setCellValue(oneRecord.reviewedAccount);

        cell = row.createCell(3);
        cell.setCellValue(oneRecord.hitAccount);

        cell = row.createCell(4);
        cell.setCellValue(oneRecord.hitValue.setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE).doubleValue());
        cell.setCellStyle(cellStyleMoney);
    }

    /**
     * Produces data representation
     *
     * @param data
     * @param period
     * @return AuditorComparisonRepresentation
     */
    public AuditorComparisonRepresentation getRepresentation(List<AuditorComparisonResult> data, ReportedPeriodData period) {
        AuditorComparisonRepresentation result = new AuditorComparisonRepresentation();
        List<AuditorComparisonGridDataRepresentation> comparisonData = new ArrayList<AuditorComparisonGridDataRepresentation>();

        Integer sumTotalAccount = 0;
        Integer sumReviewedAccount = 0;
        Integer sumHitAccount = 0;
        BigDecimal sumHitValue = new BigDecimal(0);

        for (AuditorComparisonResult one : data) {

            //summary data
            sumTotalAccount = sumTotalAccount + one.totalCostCenter;
            sumReviewedAccount = sumReviewedAccount + one.reviewedAccount;
            sumHitAccount = sumHitAccount + one.hitAccount;
            sumHitValue = sumHitValue.add(one.hitValue.setScale(NumberConstants.RL_BIG_DECIMAL_SCALE));

            //grid data
            AuditorComparisonGridDataRepresentation comparisonData1 = new AuditorComparisonGridDataRepresentation();
            comparisonData1.auditorName = DbUtils.concatFullUserName(one.fName, one.lName);
            comparisonData1.totalCostCenter = one.totalCostCenter;

            comparisonData1.hitAccount = one.hitAccount;
            comparisonData1.reviewedAccount = one.reviewedAccount;
            comparisonData1.hitValue = one.hitValue.setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE);
            comparisonData.add(comparisonData1);
        }

        result.data = comparisonData;

        return result;
    }

    /**
     * Merges preBill and postBill data into one List, based on userId
     *
     * @param reportPeriodData
     * @param reportingUserId
     * @param costCenterList
     * @return List<AuditorComparisonResult>
     */
    public List<AuditorComparisonResult> mergeOverallData(ReportedPeriodData reportPeriodData, String reportingUserId, List<String> costCenterList) {
        List<AuditorComparisonResult> resultsPreBill = auditorPerformanceDao.getAuditorComparisonData(new java.sql.Date(reportPeriodData.getMinDate().getTimeInMillis()), new java.sql.Date(reportPeriodData.getMaxDate().getTimeInMillis()), reportingUserId, costCenterList);

        log.debug("preBill records count = " + resultsPreBill.size());

        List<AuditorComparisonResult> result = new ArrayList<AuditorComparisonResult>(resultsPreBill);

        log.debug("Grouping results by userId...");

        // order must be the same as from DAO
        class MyComparator implements Comparator<AuditorComparisonResult> {

            @Override
            public int compare(AuditorComparisonResult o1, AuditorComparisonResult o2) {
                if (o1.fName == null && o2.fName != null) {
                    return -1;
                } else if (o1.fName != null && o2.fName == null) {
                    return 1;
                } else {
                    return o1.fName.compareToIgnoreCase(o2.fName);
                }
            }
        }

        Collections.sort(result, new MyComparator());

        log.debug("Number of records after grouping and sorting = " + result.size());

        return result;
    }

    /**
     * Message class for ComparisonGridData
     */
    public static class AuditorComparisonGridDataRepresentation {

        public String auditorName;
        public Integer totalCostCenter = 0;
        public Integer reviewedAccount = 0;
        public Integer hitAccount = 0;
        public BigDecimal hitValue = new BigDecimal(0);
    }

    /**
     * Message class for ComparisonData
     */
    public static class AuditorComparisonRepresentation {

        public List<AuditorComparisonGridDataRepresentation> data;
    }

    /**
     * Message class for TrendData
     */
    public static class AuditorTrendRepresentation {

        public List<String> xAxis;
        public List<GraphData> yAxis;
    }
}
