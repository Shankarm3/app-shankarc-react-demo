package com.operasolutions.rl.service.exporter.report;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.StringReader;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.batik.transcoder.TranscoderException;
import org.apache.batik.transcoder.TranscoderInput;
import org.apache.batik.transcoder.TranscoderOutput;
import org.apache.batik.transcoder.image.PNGTranscoder;

import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Image;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.operasolutions.rl.common.ReportUtils;
import com.operasolutions.rl.service.exporter.ChartUtils;
import com.operasolutions.rl.service.exporter.PDFGenerationException;
import com.operasolutions.rl.service.exporter.PDFGenerator;
import com.operasolutions.rl.service.exporter.PDFGenerator.InitObject;
import com.operasolutions.rl.service.exporter.PDFGeneratorConstants;
import com.sun.jersey.multipart.FormDataBodyPart;
import com.sun.jersey.multipart.FormDataMultiPart;

/**
 * PerformanceComparisonChart
 *
 * @author Nirmal Kumar
 */
public class PerformanceComparisonChart extends AbstractComplexChart {

    protected static final String parameterPatternString = "^" + PDFGeneratorConstants.CHART_SVG + "(\\d+)$";
    protected static final Pattern parameterPattern = Pattern.compile(parameterPatternString);
    protected static String[] divisionList;
    protected Map<Integer, ChartPair> pairs = new TreeMap<Integer, ChartPair>();

    /**
     * Constructor
     *
     * @param initObject
     * @param formParams
     */
    public PerformanceComparisonChart(InitObject initObject, FormDataMultiPart formParams) {
        super(initObject, formParams);

        FormDataBodyPart divisions = formParams.getField(PDFGeneratorConstants.DIVISIONS);
        divisionList = divisions.getValue().replaceAll("\\[|\\]", "").replaceAll("\"", "").split(",");
        parseInputParameters();
    }

    /* (non-Javadoc)
	 * @see com.operasolutions.rl.service.exporter.report.AbstractComplexChart#generatePDF()
     */
    @Override
    public void generatePDF() throws DocumentException {
        int divisionIndex = 0;
        for (Map.Entry<Integer, ChartPair> entry : pairs.entrySet()) {
            Paragraph par = new Paragraph("", ReportUtils.getPDFDocumentFont());
            ChartPair onePair = entry.getValue();

            try {
                par.add(new Phrase(divisionList[divisionIndex].replace(":", "\n"), ReportUtils.getPDFDocumentFiltersFont()));
                document.add(par);
                generateOneChart(onePair.chart1, 0.9f);
                generateOneChart(onePair.chart2, 0.8f);
                document.newPage();
                divisionIndex++;
            } catch (PDFGenerationException e) {
                // ignore if one pair fail

                log.error("Generation of one pair failed, ignoring...");
            }
        }
    }

    /**
     * Parses input parameters needed for this PDF file. It pairs charts as
     * well.
     */
    protected void parseInputParameters() {

        log.debug("Parsing input parameters...");

        Map<String, List<FormDataBodyPart>> data = formParams.getFields();

        for (String key : data.keySet()) {

            Matcher matcher = parameterPattern.matcher(key);
            if (matcher.find()) {
                String index = matcher.group(1);

                List<FormDataBodyPart> valuesForKey = data.get(key);
                String valueFromRequest = valuesForKey.get(0).getValue();

                Integer indexInt = Integer.parseInt(index);
                Integer indexInMap = (indexInt - 1) / 2;

                ChartPair current = pairs.get(indexInMap);
                if (current == null) {
                    current = new ChartPair();
                    pairs.put(indexInMap, current);
                }

                if ((indexInt - 1) % 2 == 0) {
                    current.chart1 = valueFromRequest;
                } else {
                    current.chart2 = valueFromRequest;
                }
            }
        }

        log.debug("Parsing input parameters finished.");
    }

    /**
     * Generates one chart into PDF file
     *
     * @param svg
     * @param scale
     * @throws PDFGenerationException
     */
    protected void generateOneChart(String svg, Float scale) throws PDFGenerationException {
        try {
            PNGTranscoder prm = new PNGTranscoder();

            Float width = ChartUtils.getWidthFromSvg(svg);
            if (width != null && width != 0.00) {
                Float computedSVG = width * scale;
                Float maxPDF = document.getPageSize().getWidth() - 2 * PDFGenerator.MARGIN_SIZE;

                Float exportedWidth = Math.min(computedSVG, maxPDF);
                prm.addTranscodingHint(PNGTranscoder.KEY_WIDTH, exportedWidth);
            }

            TranscoderInput ti = new TranscoderInput(new StringReader(svg));
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            TranscoderOutput to = new TranscoderOutput(outputStream);
            prm.transcode(ti, to);

            outputStream.flush();
            outputStream.close();

            Image image = Image.getInstance(outputStream.toByteArray());
            document.add(image);
        } catch (DocumentException e) {
            throw new PDFGenerationException(e);
        } catch (TranscoderException e) {
            throw new PDFGenerationException(e);
        } catch (IOException e) {
            throw new PDFGenerationException(e);
        }
    }

    protected static class ChartPair {

        String chart1;
        String chart2;

        @Override
        public String toString() {
            StringBuffer result = new StringBuffer();
            result.append("chart1 = " + chart1);
            result.append("chart2 = " + chart2);

            return result.toString();
        }
    }
}
