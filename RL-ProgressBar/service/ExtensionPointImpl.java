package com.operasolutions.rl.service;

import java.io.Serializable;
import java.lang.annotation.Annotation;

public class ExtensionPointImpl implements ExtensionPoint, Serializable {

    private static final long serialVersionUID = -1403596717312468926L;
    private final Class<?> value;

    public ExtensionPointImpl(Class<?> value) {
        this.value = value;
    }

    public Class<?> value() {
        return this.value;
    }

    public int hashCode() {
        // This is specified in java.lang.Annotation.
        return (127 * "value".hashCode()) ^ value.hashCode();
    }

    public boolean equals(Object o) {
        if (!(o instanceof ExtensionPoint)) {
            return false;
        }

        ExtensionPoint other = (ExtensionPoint) o;

        return value.equals(other.value());
    }

    public String toString() {
        return "@" + ExtensionPoint.class.getName() + "(value=" + value + ")";
    }

    public Class<? extends Annotation> annotationType() {
        return ExtensionPoint.class;
    }
}
