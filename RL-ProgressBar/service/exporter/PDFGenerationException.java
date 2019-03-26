package com.operasolutions.rl.service.exporter;

/**
 * PDFGenerationException
 *
 * @author Nirmal Kumar
 */
public class PDFGenerationException extends Exception {

    private static final long serialVersionUID = 3723099571229912214L;

    public PDFGenerationException(String message) {
        super(message);
    }

    public PDFGenerationException(Exception exception) {
        super(exception);
    }

    public PDFGenerationException(String message, Exception exception) {
        super(message, exception);
    }
}
