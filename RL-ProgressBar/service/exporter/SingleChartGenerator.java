package com.operasolutions.rl.service.exporter;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.StringReader;

import org.apache.batik.transcoder.TranscoderException;
import org.apache.batik.transcoder.TranscoderInput;
import org.apache.batik.transcoder.TranscoderOutput;
import org.apache.batik.transcoder.image.PNGTranscoder;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Image;

/**
 * SingleChartGenerator
 *
 * @author Nirmal Kumar
 */
public class SingleChartGenerator {

    /**
     * Generates single chart
     *
     * @param document
     * @param svg
     * @param scale
     * @throws PDFGenerationException
     */
    public static void generateSingleChart(Document document, String svg, Float scale) throws PDFGenerationException {
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
            image.setAlignment(Element.ALIGN_CENTER);
            document.add(image);
        } catch (DocumentException e) {
            throw new PDFGenerationException(e);
        } catch (TranscoderException e) {
            throw new PDFGenerationException(e);
        } catch (IOException e) {
            throw new PDFGenerationException(e);
        }
    }
}
