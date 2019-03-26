package com.operasolutions.rl.service.exporter;

import com.itextpdf.text.Document;

/**
 * AbstractElement
 *
 * @author Nirmal Kumar
 */
public abstract class AbstractElement {

    /**
     * Method for transforming element into PDF representation
     *
     * @param document
     * @throws PDFGenerationException
     */
    public abstract void getPDFRepresentation(Document document) throws PDFGenerationException;
}
