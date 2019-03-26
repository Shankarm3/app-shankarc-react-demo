package com.operasolutions.rl.service.exporter;

import java.io.ByteArrayOutputStream;
import java.lang.reflect.Constructor;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.itextpdf.text.Chunk;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.PdfWriter;
import com.operasolutions.rl.common.ReportUtils;
import com.operasolutions.rl.common.chart.ReportedPeriodEnum;
import com.operasolutions.rl.service.exporter.report.AbstractComplexChart;
import com.operasolutions.rl.service.exporter.report.ReportEnum;
import com.operasolutions.rl.service.physician.dashboard.peformancecomparison.MetricType;
import com.sun.jersey.multipart.FormDataBodyPart;
import com.sun.jersey.multipart.FormDataMultiPart;

/**
 * PDFGenerator
 *
 * @author Nirmal Kumar
 */
public class PDFGenerator {

    public static final Float MARGIN_SIZE = 30f;

    protected static final Logger log = LoggerFactory.getLogger(PDFGenerator.class);

    protected FormDataMultiPart formParams;
    protected String title;
    protected Map<FilterMapperEnum, String> filters = new HashMap<FilterMapperEnum, String>();
    protected String reportId;

    /**
     * Constructor
     *
     * @param formParams
     */
    public PDFGenerator(FormDataMultiPart formParams) {
        if (formParams == null) {
            throw new IllegalArgumentException("Input parameter 'formParams' cannot be null.");
        }

        this.formParams = formParams;

        FormDataBodyPart titleForm = formParams.getField(PDFGeneratorConstants.CHART_TITLE);
        if (titleForm != null && titleForm.getValue() != null && !titleForm.getValue().trim().isEmpty()) {
            title = titleForm.getValue();
        }

        FormDataBodyPart dataFiltersForm = formParams.getField(PDFGeneratorConstants.CHART_FILTER);
        if (dataFiltersForm != null && dataFiltersForm.getValue() != null && !dataFiltersForm.getValue().trim().isEmpty()) {
            filters = ReportUtils.parseFilters(dataFiltersForm.getValue());
        }

        FormDataBodyPart reportIdForm = formParams.getField(PDFGeneratorConstants.REPORT_ID);
        if (reportIdForm != null && reportIdForm.getValue() != null && !reportIdForm.getValue().trim().isEmpty()) {
            reportId = reportIdForm.getValue();
        }
    }

    /**
     * Public method for generating PDF file
     *
     * @return ByteArrayOutputStream
     * @throws PDFGenerationException
     */
    public ByteArrayOutputStream generatePDF() throws PDFGenerationException {
        log.debug("generatePDF() - start");

        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        InitObject initObject = null;
        try {
            initObject = getDocumentAndWriter(bos);
        } catch (DocumentException e) {
            throw new PDFGenerationException(e);
        }

        if (reportId == null) {
            log.debug("Processing single chart...");

            FormDataBodyPart dataSvg = formParams.getField(PDFGeneratorConstants.CHART_SVG);
            String dataSvgString = null;
            if (dataSvg != null) {
                dataSvgString = dataSvg.getValue();
                if (dataSvgString != null && !dataSvgString.trim().isEmpty()) {
                    Float scaleFloat = 1f;
                    FormDataBodyPart scale = formParams.getField(PDFGeneratorConstants.CHART_SCALE);
                    if (scale != null) {
                        try {
                            scaleFloat = Float.parseFloat(scale.getValue());
                        } catch (NumberFormatException e) {
                            // ignore, I can continue with value 1
                        }
                    }

                    SingleChartGenerator.generateSingleChart(initObject.document, dataSvgString, scaleFloat);
                }
            }
        } else {
            log.debug("Processing complex chart...");

            ReportEnum instance = ReportEnum.getInstance(reportId);
            if (instance != null) {
                Class<? extends AbstractComplexChart> reportClass = instance.getClazz();
                try {
                    Constructor<? extends AbstractComplexChart> c = reportClass.getConstructor(InitObject.class, FormDataMultiPart.class);
                    AbstractComplexChart chart = (AbstractComplexChart) c.newInstance(initObject, formParams);

                    chart.generatePDF();
                } catch (Exception e) {
                    throw new PDFGenerationException(e);
                }
            } else {
                String message = "Report with reportId = " + reportId + " doesn't exist.";
                log.error(message);

                throw new PDFGenerationException(message);
            }
        }

        initObject.document.close();

        return bos;
    }

    /**
     * Setup document, document title, filters
     *
     * @param bos
     * @return InitObject
     * @throws DocumentException
     */
    protected InitObject getDocumentAndWriter(ByteArrayOutputStream bos) throws DocumentException {
        log.debug("Initializing iText and Document...");

        Document document = new Document(PageSize.LEGAL.rotate());;
        PdfWriter writer = PdfWriter.getInstance(document, bos);
        document.open();
        document.setMargins(MARGIN_SIZE, MARGIN_SIZE, MARGIN_SIZE, MARGIN_SIZE);

        ReportUtils.addPageTitle(document, title);
        addFilters(document);

        document.add(Chunk.NEWLINE);

        return new InitObject(document, writer);
    }

    /**
     * Adds filters into PDF file
     *
     * @param document
     * @throws DocumentException
     */
    protected void addFilters(Document document) throws DocumentException {

        Paragraph par = new Paragraph("", ReportUtils.getPDFDocumentFont());
        par.setAlignment(Element.ALIGN_CENTER);
        par.add(new Phrase(ReportUtils.FILTER_INFORMATION, ReportUtils.getPDFDocumentFiltersFontBold()));

        StringBuffer filterData = new StringBuffer();
        for (Map.Entry<FilterMapperEnum, String> filter : filters.entrySet()) {
            String oneFilterValue = filter.getValue();

            // convert number into string format
            if (filter.getKey() == FilterMapperEnum.TIME_PERIOD) {
                ReportedPeriodEnum instancePeriod = ReportedPeriodEnum.getReportedPeriod(Integer.parseInt(filter.getValue()));
                oneFilterValue = instancePeriod.getUiValue();
            }

            // for MetricType ReviewRate, $ found
            if (filter.getKey() == FilterMapperEnum.METRIC_TYPE) {
                MetricType metricTypeEnum = MetricType.getTypeFromString(filter.getValue());
                oneFilterValue = metricTypeEnum.getFilterValue();
            }

            // number of selected facilities
            if (filter.getKey() == FilterMapperEnum.FACILITY) {
                oneFilterValue = oneFilterValue + ReportUtils.SELECTED;
            }

            filterData.append(filter.getKey().getUiValue() + ": " + oneFilterValue + " ");
        }

        par.add(new Phrase(filterData.toString(), ReportUtils.getPDFDocumentFiltersFont()));
        document.add(par);
    }

    public static class InitObject {

        private final Document document;
        private final PdfWriter writer;

        public InitObject(Document document, PdfWriter writer) {
            this.document = document;
            this.writer = writer;
        }

        public Document getDocument() {
            return document;
        }

        public PdfWriter getWriter() {
            return writer;
        }
    }
}
