package com.operasolutions.rl.service.exporter.report;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.batik.transcoder.TranscoderException;

import com.itextpdf.text.BadElementException;
import com.itextpdf.text.BaseColor;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Image;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.operasolutions.rl.common.ReportUtils;
import com.operasolutions.rl.service.exporter.PDFGenerationException;
import com.operasolutions.rl.service.exporter.PDFGenerator.InitObject;
import com.operasolutions.rl.service.exporter.PDFGeneratorConstants;
import com.sun.jersey.multipart.FormDataBodyPart;
import com.sun.jersey.multipart.FormDataMultiPart;

/**
 * PerformanceComparisonTabReport
 *
 * @author Nirmal Kumar
 */
public class PerformanceComparisonTabReport extends AbstractComplexChart {

    protected static final String CHART_HEADER = "Header";
    protected static final String CHART_VALUE = "Value";

    // Division chart
    protected static final String parameterPatternChartSvgString = "^" + PDFGeneratorConstants.CHART_SVG + "(\\d+)$";
    protected static final String parameterPatternChartHeaderString = "^" + PDFGeneratorConstants.CHART_SVG + "(\\d+)" + CHART_HEADER + "$";
    protected static final String parameterPatternChartValueString = "^" + PDFGeneratorConstants.CHART_SVG + "(\\d+)" + CHART_VALUE + "$";

    // Hospital chart
    protected static final String parameterPatternSubChartSvgString = "^" + PDFGeneratorConstants.CHART_SVG + "(\\d+)_(\\d+)$";
    protected static final String parameterPatternSubChartHeaderString = "^" + PDFGeneratorConstants.CHART_SVG + "(\\d+)_(\\d+)" + CHART_HEADER + "$";
    protected static final String parameterPatternSubChartValueString = "^" + PDFGeneratorConstants.CHART_SVG + "(\\d+)_(\\d+)" + CHART_VALUE + "$";

    // patterns for Division chart
    protected static final Pattern patternChartSvg = Pattern.compile(parameterPatternChartSvgString);
    protected static final Pattern patternChartHeader = Pattern.compile(parameterPatternChartHeaderString);
    protected static final Pattern patternChartValue = Pattern.compile(parameterPatternChartValueString);

    // patterns for Hospital chart
    protected static final Pattern patternSubChartSvg = Pattern.compile(parameterPatternSubChartSvgString);
    protected static final Pattern patternSubChartHeader = Pattern.compile(parameterPatternSubChartHeaderString);
    protected static final Pattern patternSubChartValue = Pattern.compile(parameterPatternSubChartValueString);

    protected static final Integer bottomPadding = 5;
    protected static final Integer leftHeaderPadding = 20;
    protected static final Integer mainTablePadding = 58;

    protected static final String TEXT_TOP = "TOP 5 FACILITIES";
    protected static final String TEXT_BOTTOM = "BOTTOM 5 FACILITIES";
    protected static final String TEXT_REMAINING = "REMAINING FACILITIES";

    protected Map<Integer, Division> parsedData = new TreeMap<Integer, Division>();

    /**
     * Constructor
     *
     * @param initObject
     * @param formParams
     */
    public PerformanceComparisonTabReport(InitObject initObject, FormDataMultiPart formParams) {
        super(initObject, formParams);

        parseInputParameters();
    }

    /* (non-Javadoc)
	 * @see com.operasolutions.rl.service.exporter.report.AbstractComplexChart#generatePDF()
     */
    @Override
    public void generatePDF() throws PDFGenerationException {
        log.debug("generatePDF() - start");

        // margin for legend
        Paragraph paragraphWithMargin = new Paragraph();
        paragraphWithMargin.setSpacingBefore(60);

        PdfPTable mainTable = new PdfPTable(2);
        mainTable.setWidthPercentage(100);

        try {
            addLegend();

            for (Map.Entry<Integer, Division> division : parsedData.entrySet()) {
                generateOneDivision(division.getValue(), mainTable);
            }

            // iTextPDF needs to have valid table with all columns!
            if (parsedData.size() % 2 != 0) {
                PdfPCell emptyCell = new PdfPCell(new Phrase(""));
                emptyCell.setBorder(PdfPCell.NO_BORDER);
                mainTable.addCell(emptyCell);
            }

            log.debug("Adding generated tables into final PDF file...");

            paragraphWithMargin.add(mainTable);
            document.add(paragraphWithMargin);
        } catch (TranscoderException e) {
            throw new PDFGenerationException(e);
        } catch (IOException e) {
            throw new PDFGenerationException(e);
        } catch (BadElementException e) {
            throw new PDFGenerationException(e);
        } catch (DocumentException e) {
            throw new PDFGenerationException(e);
        }

        log.debug("generatePDF() - end");
    }

    /**
     * Adds legend at the beginning of the PDF file
     *
     * @throws IOException
     * @throws DocumentException
     */
    protected void addLegend() throws DocumentException, IOException {

        PdfContentByte canvas = writer.getDirectContent();
        BaseFont bf = BaseFont.createFont();
        canvas.beginText();
        canvas.setFontAndSize(bf, 8);
        canvas.showTextAligned(PdfContentByte.ALIGN_LEFT, TEXT_TOP, 125, 470, 0);
        canvas.showTextAligned(PdfContentByte.ALIGN_LEFT, TEXT_BOTTOM, 245, 470, 0);
        canvas.showTextAligned(PdfContentByte.ALIGN_LEFT, TEXT_REMAINING, 375, 470, 0);
        canvas.endText();

        Rectangle rectGreen = new Rectangle(100, 470, 120, 490);
        rectGreen.setBackgroundColor(new BaseColor(0, 128, 0));
        canvas.rectangle(rectGreen);

        Rectangle rectRed = new Rectangle(220, 470, 240, 490);
        rectRed.setBackgroundColor(new BaseColor(204, 0, 0));
        canvas.rectangle(rectRed);

        Rectangle rectOrange = new Rectangle(350, 470, 370, 490);
        rectOrange.setBackgroundColor(new BaseColor(255, 101, 1));
        canvas.rectangle(rectOrange);
    }

    /**
     * Generates one division part of PDF file
     *
     * @param division
     * @param mainTable
     * @throws TranscoderException
     * @throws IOException
     * @throws BadElementException
     */
    protected void generateOneDivision(Division division, PdfPTable mainTable) throws TranscoderException, IOException, BadElementException {
        Float scale = 1f;

        log.debug("Generation representation for one division...");

        PdfPTable innerTable = new PdfPTable(3);
        innerTable.setWidthPercentage(100);
        PdfPCell innerCell = new PdfPCell(innerTable);
        innerCell.setBorder(PdfPCell.NO_BORDER);
        innerCell.setPaddingLeft(mainTablePadding);
        innerCell.setPaddingRight(mainTablePadding);

        // header
        PdfPCell header = new PdfPCell(new Phrase(division.header, ReportUtils.getPDFDocumentFontBold()));
        header.setColspan(2);
        header.setHorizontalAlignment(Element.ALIGN_LEFT);
        header.setBorder(PdfPCell.NO_BORDER);
        header.setPaddingBottom(bottomPadding);
        innerTable.addCell(header);

        // value
        PdfPCell value = new PdfPCell(new Phrase(division.value, ReportUtils.getPDFDocumentFont()));
        value.setHorizontalAlignment(Element.ALIGN_RIGHT);
        value.setBorder(PdfPCell.NO_BORDER);
        value.setPaddingBottom(bottomPadding);
        innerTable.addCell(value);

        ByteArrayOutputStream outputStream = ReportUtils.convertSVGIntoPNG(document, division.svg, scale);

        // chart
        PdfPCell chart = new PdfPCell(Image.getInstance(outputStream.toByteArray()));
        chart.setColspan(3);
        chart.setBorder(PdfPCell.NO_BORDER);
        chart.setHorizontalAlignment(Element.ALIGN_RIGHT);
        innerTable.addCell(chart);

        log.debug("Generation representation for all hospitals...");
        for (Map.Entry<Integer, Hospital> oneHospital : division.hospitals.entrySet()) {
            generateOneHospital(oneHospital.getValue(), innerTable);
        }

        mainTable.addCell(innerCell);
    }

    /**
     * Generates one hospital into PDF file
     *
     * @param hospital
     * @param innerTable
     * @throws TranscoderException
     * @throws IOException
     * @throws BadElementException
     */
    protected void generateOneHospital(Hospital hospital, PdfPTable innerTable) throws TranscoderException, IOException, BadElementException {
        Float scale = 1f;

        // one more table to prevent separating one hospital data into two pages
        PdfPTable oneMoreTable = new PdfPTable(3);

        // value
        PdfPCell value = new PdfPCell(new Phrase(hospital.value, ReportUtils.getPDFDocumentFont()));
        value.setColspan(3);
        value.setBorder(PdfPCell.NO_BORDER);
        value.setHorizontalAlignment(Element.ALIGN_RIGHT);
        value.setPaddingBottom(bottomPadding);
        value.setPaddingTop(bottomPadding);
        oneMoreTable.addCell(value);

        // header
        PdfPCell header = new PdfPCell(new Phrase(hospital.header, ReportUtils.getPDFDocumentFont()));
        header.setHorizontalAlignment(Element.ALIGN_LEFT);
        header.setBorder(PdfPCell.NO_BORDER);
        header.setPaddingLeft(leftHeaderPadding);
        oneMoreTable.addCell(header);

        ByteArrayOutputStream outputStream = ReportUtils.convertSVGIntoPNG(document, hospital.svg, scale);

        // chart
        PdfPCell chart = new PdfPCell(Image.getInstance(outputStream.toByteArray()));
        chart.setHorizontalAlignment(Element.ALIGN_RIGHT);
        chart.setBorder(PdfPCell.NO_BORDER);
        chart.setColspan(2);
        oneMoreTable.addCell(chart);

        // add to innerTable
        PdfPCell cell = new PdfPCell(oneMoreTable);
        cell.setColspan(3);
        cell.setBorder(PdfPCell.NO_BORDER);
        cell.setHorizontalAlignment(Element.ALIGN_RIGHT);

        innerTable.addCell(cell);
    }

    /**
     * Parses input parameters needed for this PDF file. It pairs charts as
     * well.
     */
    protected void parseInputParameters() {

        log.debug("Parsing input parameters...");

        Map<String, List<FormDataBodyPart>> data = formParams.getFields();

        for (String key : data.keySet()) {

            List<FormDataBodyPart> valuesForKey = data.get(key);
            String valueFromRequest = valuesForKey.get(0).getValue();

            Matcher matcherSvg = patternChartSvg.matcher(key);
            Matcher matcherHeader = patternChartHeader.matcher(key);
            Matcher matcherValue = patternChartValue.matcher(key);
            Matcher matcherSubChartSvg = patternSubChartSvg.matcher(key);
            Matcher matcherSubChartHeader = patternSubChartHeader.matcher(key);
            Matcher matcherSubChartValue = patternSubChartValue.matcher(key);

            if (matcherSvg.find()) {
                String index = matcherSvg.group(1);
                Division div = getDivision(index);

                div.svg = valueFromRequest;
            } else if (matcherHeader.find()) {
                String index = matcherHeader.group(1);
                Division div = getDivision(index);

                div.header = valueFromRequest;
            } else if (matcherValue.find()) {
                String index = matcherValue.group(1);
                Division div = getDivision(index);

                div.value = valueFromRequest;
            } else if (matcherSubChartSvg.find()) {
                String index = matcherSubChartSvg.group(1);
                String subIndex = matcherSubChartSvg.group(2);

                Hospital hospital = getHospital(index, subIndex);
                hospital.svg = valueFromRequest;
            } else if (matcherSubChartHeader.find()) {
                String index = matcherSubChartHeader.group(1);
                String subIndex = matcherSubChartHeader.group(2);

                Hospital hospital = getHospital(index, subIndex);
                hospital.header = valueFromRequest;
            } else if (matcherSubChartValue.find()) {
                String index = matcherSubChartValue.group(1);
                String subIndex = matcherSubChartValue.group(2);

                Hospital hospital = getHospital(index, subIndex);
                hospital.value = valueFromRequest;
            }
        }

        log.debug("Parsing input parameters finished.");
    }

    /**
     * Gets division from parsedData
     *
     * @param index
     * @return Division
     */
    protected Division getDivision(String index) {
        Integer indexInt = Integer.parseInt(index);

        Division result = parsedData.get(indexInt);
        if (result == null) {
            result = new Division();
            parsedData.put(indexInt, result);
        }

        return result;
    }

    /**
     * Gets hospital from parsedData
     *
     * @param index
     * @param subIndex
     * @return Hospital
     */
    protected Hospital getHospital(String index, String subIndex) {
        Integer indexInt = Integer.parseInt(index);
        Integer subIndexInt = Integer.parseInt(subIndex);

        Division division = parsedData.get(indexInt);
        if (division == null) {
            division = new Division();
            parsedData.put(indexInt, division);
        }

        Hospital hospital = division.hospitals.get(subIndexInt);
        if (hospital == null) {
            hospital = new Hospital();
            division.hospitals.put(subIndexInt, hospital);
        }

        return hospital;
    }

    protected static class Division {

        String svg;
        String header;
        String value;

        Map<Integer, Hospital> hospitals = new TreeMap<Integer, Hospital>();

        @Override
        public String toString() {
            StringBuffer result = new StringBuffer();
            result.append("header = " + header);
            result.append(", value = " + value);
            result.append(", hospitals = " + hospitals);

            return result.toString();
        }
    }

    protected static class Hospital {

        String svg;
        String header;
        String value;

        @Override
        public String toString() {
            StringBuffer result = new StringBuffer();
            result.append("header = " + header);
            result.append(", value = " + value);

            return result.toString();
        }
    }
}
