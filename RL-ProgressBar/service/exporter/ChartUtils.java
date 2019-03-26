package com.operasolutions.rl.service.exporter;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * ChartUtils
 *
 * @author Nirmal Kumar
 */
public class ChartUtils {

    /**
     * Gets width from String SVG
     *
     * @param svg
     * @return Float
     */
    public static Float getWidthFromSvg(String svg) {
        if (svg == null) {
            throw new IllegalArgumentException("Input parameter 'svg' cannot be null.");
        }

        Pattern pattern = Pattern.compile("^<svg[^>]*width=\\\"([0-9]+)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(svg);

        if (matcher.lookingAt()) {
            return Float.valueOf(matcher.group(1));
        }

        return null;
    }
}
