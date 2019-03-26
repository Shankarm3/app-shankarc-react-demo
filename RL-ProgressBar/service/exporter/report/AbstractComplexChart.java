package com.operasolutions.rl.service.exporter.report;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.pdf.PdfWriter;
import com.operasolutions.rl.service.exporter.PDFGenerationException;
import com.operasolutions.rl.service.exporter.PDFGenerator.InitObject;
import com.sun.jersey.multipart.FormDataMultiPart;

/**
 * AbstractComplexChart
 *
 * @author Nirmal Kumar
 */
public abstract class AbstractComplexChart {

    protected static final Logger log = LoggerFactory.getLogger(AbstractComplexChart.class);

    protected Document document;
    protected PdfWriter writer;
    protected FormDataMultiPart formParams;

    /**
     * Constructor
     *
     * @param initObject
     * @param formParams
     */
    public AbstractComplexChart(InitObject initObject, FormDataMultiPart formParams) {
        if (initObject == null) {
            throw new IllegalArgumentException("Input parameter 'initObject' cannot be null.");
        }
        if (initObject.getDocument() == null) {
            throw new IllegalArgumentException("Input parameter 'initObject.getDocument()' cannot be null.");
        }
        if (initObject.getWriter() == null) {
            throw new IllegalArgumentException("Input parameter 'initObject.getWriter()' cannot be null.");
        }
        if (formParams == null) {
            throw new IllegalArgumentException("Input parameter 'formParams' cannot be null.");
        }

        this.document = initObject.getDocument();
        this.writer = initObject.getWriter();
        this.formParams = formParams;
    }

    /**
     * Converts SVGs into PDF representation, adds metadata. Do not close
     * document in this method.
     *
     * @throws PDFGenerationException
     * @throws DocumentException
     */
    public abstract void generatePDF() throws PDFGenerationException, DocumentException;
}
