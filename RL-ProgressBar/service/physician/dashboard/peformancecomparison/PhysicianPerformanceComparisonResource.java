package com.operasolutions.rl.service.physician.dashboard.peformancecomparison;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
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
import com.operasolutions.rl.common.NumberConstants;
import com.operasolutions.rl.common.ReportConstants;
import com.operasolutions.rl.common.ReportUtils;
import com.operasolutions.rl.common.chart.ReportedPeriod;
import com.operasolutions.rl.common.chart.ReportedPeriodData;
import com.operasolutions.rl.common.chart.ReportedPeriodEnum;
import com.operasolutions.rl.exception.RevenueLeakageException;
import com.operasolutions.rl.schema.enums.TPermission;
import com.operasolutions.rl.service.exporter.FilterMapperEnum;
import com.sun.jersey.core.header.ContentDisposition;

/**
 * PhysicianPerformanceComparisonResource
 *
 * @author Nirmal Kumar
 */
@Path("/" + PhysicianPerformanceComparisonResource.URL_PERFORMANCE_COMPARISON)
@Produces(MediaType.APPLICATION_JSON)
@RequiresAuthentication
public class PhysicianPerformanceComparisonResource {

    public static final String URL_PERFORMANCE_COMPARISON = "physicianPerformanceComparison";
    public static final String URL_LIST_VIEW = "listView";
    public static final String URL_CHART_VIEW = "chartView";

    protected static final Logger log = LoggerFactory.getLogger(PhysicianPerformanceComparisonResource.class);

    protected final PhysicianPerformanceComparisonDao businessDao;

    @Context
    UriInfo uriInfo;

    @Inject
    public PhysicianPerformanceComparisonResource(PhysicianPerformanceComparisonDao businessDao) {
        this.businessDao = businessDao;
    }

    /**
     * Get list view
     *
     * @param period
     * @param hospitalList
     * @param costCenterList
     * @return ListViewRepresentation
     */
    @GET
    @Path(PhysicianPerformanceComparisonResource.URL_LIST_VIEW)
    public ListViewRepresentation getComparisonDataForListView(@QueryParam("period") Integer period, @QueryParam("hospitalId") List<String> hospitalList, @QueryParam("costCenter") List<String> costCenterList) {

        log.debug("getComparisonDataForListView() - start, , period = " + period);

        SecurityUtils.getSubject().checkPermission(TPermission.READ_LIST_VIEW.getPermission());

        if (period == null) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }
        ListViewRepresentation result = new ListViewRepresentation();
        log.debug("Generating listView data...");

        result.data = getListViewData(period, hospitalList, costCenterList);

        return result;
    }

    /**
     * Get list view - Excel report
     *
     * @param period
     * @param hospitalList
     * @param costCenterList
     * @return ListViewRepresentation
     * @throws IOException
     */
    @GET
    @Path("/" + PhysicianPerformanceComparisonResource.URL_LIST_VIEW + "/" + AuthConstants.EXCEL_URL)
    public Response getComparisonDataForListViewReport(@QueryParam("period") Integer period, @QueryParam("hospitalId") List<String> hospitalList, @QueryParam("costCenter") List<String> costCenterList) throws IOException {

        log.debug("getComparisonDataForListViewReport() - start,period = " + period);

        SecurityUtils.getSubject().checkPermission(TPermission.READ_LIST_VIEW_REPORT.getPermission());

        List<HospitalListData> result = getListViewData(period, hospitalList, costCenterList);

        java.sql.Timestamp timeStamp = new java.sql.Timestamp(new java.util.Date().getTime());
        String fileName = ReportConstants.PERFORMANCE_COMPARISON_REPORT_NAME + String.format(ReportConstants.FILE_NAME_SUFIX, timeStamp) + ReportConstants.FILE_EXTENSION_EXCEL;

        log.debug("Generating Excel report...");

        XSSFWorkbook workBook = generateExcelReport(result);

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
     * Generates Excel report
     *
     * @param input
     * @return XSSFWorkbook
     */
    protected XSSFWorkbook generateExcelReport(List<HospitalListData> input) {

        XSSFWorkbook workBook = new XSSFWorkbook();
        XSSFSheet workBookSheet = workBook.createSheet(ReportConstants.PERFORMANCE_COMPARISON_SHEET_NAME);
        XSSFRow row = null;
        XSSFCell cell = null;

        CellStyle cellStyleMoney = ReportUtils.getMoneyCellStyle(workBook);
        CellStyle cellStylePercentage = ReportUtils.getPercentageCellStyle(workBook);

        int rowNumber = 0;

        String[] reportHeader = ReportConstants.PERFORMANCE_COMPARISON_REPORT_HEADER;

        row = workBookSheet.createRow(rowNumber);

        // header cell style
        CellStyle cellStyleHeader = ReportUtils.getExcelHeaderStyle(workBook);
        for (int j = 0; j < reportHeader.length; j++) {
            cell = row.createCell(j);
            cell.setCellStyle(cellStyleHeader);
            cell.setCellValue(reportHeader[j]);
        }

        rowNumber++;

        for (HospitalListData oneRecord : input) {
            row = workBookSheet.createRow(rowNumber);

            cell = row.createCell(0);
            cell.setCellValue(oneRecord.hospitalId);

            cell = row.createCell(1);
            cell.setCellValue(oneRecord.hospitalShortName);

            cell = row.createCell(2);
            cell.setCellValue(oneRecord.hospitalName);

            cell = row.createCell(3);
            cell.setCellValue(oneRecord.fullAuditorName);

            cell = row.createCell(4);
            cell.setCellValue(oneRecord.totalAccounts);

            cell = row.createCell(5);
            cell.setCellValue(oneRecord.reviewRate != null ? oneRecord.reviewRate.setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, RoundingMode.HALF_UP).doubleValue() : new BigDecimal(0).doubleValue());
            cell.setCellStyle(cellStylePercentage);

            cell = row.createCell(6);
            cell.setCellValue(oneRecord.hitRate != null ? oneRecord.hitRate.setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, RoundingMode.HALF_UP).doubleValue() : new BigDecimal(0).doubleValue());
            cell.setCellStyle(cellStylePercentage);

            cell = row.createCell(7);
            cell.setCellValue(oneRecord.hitValue.setScale(NumberConstants.RL_BIG_DECIMAL_SCALE, NumberConstants.RL_ROUNDING_MODE).doubleValue());
            cell.setCellStyle(cellStyleMoney);

            rowNumber++;
        }

        for (int j = 0; j < reportHeader.length; j++) {
            workBookSheet.autoSizeColumn(j);
        }

        return workBook;
    }

    /**
     * Get list view - PDF report
     *
     * @param hospitalList
     * @param period
     * @return ListViewRepresentation
     * @throws RevenueLeakageException
     */
    @GET
    @Path(PhysicianPerformanceComparisonResource.URL_LIST_VIEW + "/" + AuthConstants.PDF_URL)
    public Response getComparisonDataForListViewReportPDF(@QueryParam("period") Integer period, @QueryParam("hospitalId") List<String> hospitalList, @QueryParam("costCenter") List<String> costCenterList) throws RevenueLeakageException {
        log.debug("getComparisonDataForListViewReportPDF() - start, period = " + period);

        SecurityUtils.getSubject().checkPermission(TPermission.READ_LIST_VIEW_REPORT.getPermission());

        java.sql.Timestamp timeStamp = new java.sql.Timestamp(new java.util.Date().getTime());
        String fileName = ReportConstants.PERFORMANCE_COMPARISON_REPORT_NAME + String.format(ReportConstants.FILE_NAME_SUFIX, timeStamp) + ReportConstants.FILE_EXTENSION_PDF;

        log.debug("Reading data from DB...");
        List<HospitalListData> result = getListViewData(period, hospitalList, costCenterList);

        log.debug("Preparing filters...");
        Map<FilterMapperEnum, String> mapFilters = new TreeMap<FilterMapperEnum, String>();
        mapFilters.put(FilterMapperEnum.TIME_PERIOD, ReportedPeriodEnum.getReportedPeriod(period).getUiValue());
        mapFilters.put(FilterMapperEnum.FACILITY, Integer.toString(hospitalList.size()));

        log.debug("Generating PDF report...");
        ByteArrayOutputStream outputStream = getAuditorPerformancePDF(result, mapFilters);

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
     * @param input
     * @param mapFilters
     * @return ByteArrayOutputStream
     * @throws RevenueLeakageException
     */
    protected ByteArrayOutputStream getAuditorPerformancePDF(List<HospitalListData> input, Map<FilterMapperEnum, String> mapFilters) throws RevenueLeakageException {
        if (input == null) {
            throw new IllegalArgumentException("Input parameter 'input' cannot be null.");
        }
        if (mapFilters == null) {
            throw new IllegalArgumentException("Input parameter 'mapFilters' cannot be null.");
        }

        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        Document document = ReportUtils.getPDFDocumentWithSettings();

        try {
            PdfWriter writer = PdfWriter.getInstance(document, bos);
            writer.setPageEvent(ReportUtils.getPdfPageEventHelper(writer, ReportConstants.PERFORMANCE_COMPARISON_TABLE_NAME));
            document.open();

            ReportUtils.addPageTitle(document, ReportConstants.PERFORMANCE_COMPARISON_TABLE_NAME);
            ReportUtils.addFilters(document, mapFilters);

            PdfPTable table = new PdfPTable(ReportConstants.PERFORMANCE_COMPARISON_REPORT_HEADER.length);
            table.setWidthPercentage(100);

            log.debug("Adding header...");
            for (int i = 0; i < ReportConstants.PERFORMANCE_COMPARISON_REPORT_HEADER.length; i++) {
                ReportUtils.addHeaderColumn(table, ReportConstants.PERFORMANCE_COMPARISON_REPORT_HEADER[i], ReportConstants.PERFORMANCE_COMPARISON_REPORT_HEADER_ALIGNMENT[i]);
            }

            log.debug("Adding data...");
            for (HospitalListData oneRecord : input) {
                ReportUtils.addColumn(table, oneRecord.hospitalId, Element.ALIGN_LEFT);
                ReportUtils.addColumn(table, oneRecord.hospitalShortName);
                ReportUtils.addColumn(table, oneRecord.hospitalName);
                ReportUtils.addColumn(table, oneRecord.fullAuditorName);
                ReportUtils.addColumn(table, oneRecord.totalAccounts);
                ReportUtils.addColumnAsPercentage(table, oneRecord.reviewRate);
                ReportUtils.addColumnAsPercentage(table, oneRecord.hitRate);
                ReportUtils.addColumnAsMoney(table, oneRecord.hitValue);
            }

            table.setWidths(new int[]{60, 100, 180, 120, 80, 80, 50, 100});

            document.add(table);
            document.close();
        } catch (DocumentException e) {
            throw new RevenueLeakageException("An error during generation PDF document.");
        }

        return bos;
    }

    /**
     * Generates data for output
     *
     * @param period
     * @param hospitalList
     * @param costCenterList
     * @return List<HospitalListData>
     */
    protected List<HospitalListData> getListViewData(Integer period, List<String> hospitalList, List<String> costCenterList) {

        if (period == null) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        ReportedPeriodData reportPeriodData = ReportedPeriod.getReportedPeriod(Calendar.getInstance(), ReportedPeriodEnum.getReportedPeriod(period));

        log.debug("Generating listView data...");

        return new ListViewData(reportPeriodData, businessDao, hospitalList, costCenterList).generateListViewData();
    }

    /**
     * Get chart view
     *
     * @param period
     * @param chartType
     * @param hospitalList
     * @param costCenterList
     * @return ChartViewRepresentation
     */
    @GET
    @Path(PhysicianPerformanceComparisonResource.URL_CHART_VIEW)
    public ChartViewRepresentation getComparisonDataForChartView(@QueryParam("period") Integer period, @QueryParam("chartType") String chartType,
            @QueryParam("hospitalId") List<String> hospitalList, @QueryParam("costCenter") List<String> costCenterList) {

        log.debug("getComparisonDataForChartView() - start,   period = " + period + ", chartType = " + chartType + ", hospitalList = " + hospitalList);

        SecurityUtils.getSubject().checkPermission(TPermission.READ_CHART_VIEW.getPermission());

        if (period == null) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        ChartType chartTypeEnum = ChartType.getTypeFromString(chartType);
        log.debug("chartTypeEnum as enum = " + chartTypeEnum);

        if (chartTypeEnum == null) {
            throw new WebApplicationException(Status.BAD_REQUEST);
        }

        ReportedPeriodData reportPeriodData = ReportedPeriod.getReportedPeriod(Calendar.getInstance(), ReportedPeriodEnum.getReportedPeriod(period));
        ReportedPeriodData reportPeriodDataYTD = ReportedPeriod.getReportedPeriod(Calendar.getInstance(), ReportedPeriodEnum.YEAR_TO_DATE);

        ChartViewRepresentation result = new ChartViewRepresentation();
        // !!! processing hospitalList is in DAO only !!!
        log.debug("Generating chartView data...");
        result.data = new ChartViewData(reportPeriodData, reportPeriodDataYTD, businessDao, hospitalList, chartTypeEnum, costCenterList).generateChartViewData();

        return result;
    }

    /**
     * Message class for chart view
     */
    public static class ChartViewRepresentation {

        public List<DivisionData> data = new ArrayList<DivisionData>();
    }

    public static class DivisionData {

        public String divisionName;
        public String costCenter;
        public BigDecimal hitValue = new BigDecimal(0);
        public BigDecimal reviewRate = new BigDecimal(0);
        public BigDecimal hitValueYTD = new BigDecimal(0);
        public BigDecimal reviewRateYTD = new BigDecimal(0);
        public Integer reviewedCount = 0;
        public Integer hitCount = 0;
        public Integer totalAccounts = 0;
        public Integer reviewedCountYTD = 0;
        public Integer totalAccountsYTD = 0;
        public BigDecimal variance = new BigDecimal(0);
        public BigDecimal rescaleValue = new BigDecimal(0);
        public List<HospitalChartData> hospitalData = new ArrayList<HospitalChartData>();
    }

    public static class HospitalChartData {

        public String hospitalName;
        public String hospitalShortName;
        public BigDecimal reviewRate = new BigDecimal(0);
        public BigDecimal hitValue = new BigDecimal(0);
        public Integer reviewedCount = 0;
        public Integer hitCount = 0;
        public Integer totalAccounts = 0;
        public BigDecimal hitValueYTD = new BigDecimal(0);
        public Integer reviewedCountYTD = 0;
        public Integer totalAccountsYTD = 0;
        public BigDecimal rescaleValue = new BigDecimal(0);
        public BigDecimal variance = new BigDecimal(0);
    }

    /**
     * Message class list view
     */
    public static class ListViewRepresentation {

        public List<HospitalListData> data = new ArrayList<HospitalListData>();
    }

    public static class HospitalListData {

        public String hospitalId;
        public String fullAuditorName;
        public String hospitalName;
        public String hospitalShortName;
        public BigDecimal hitRate = new BigDecimal(0);
        public BigDecimal reviewRate = new BigDecimal(0);
        public BigDecimal hitValue = new BigDecimal(0);
        public Integer reviewedCount = 0;
        public Integer totalAccounts = 0;
        public Integer hitCount = 0;
    }

}
