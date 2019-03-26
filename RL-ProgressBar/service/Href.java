package com.operasolutions.rl.service;

import java.net.URI;

public final class Href {

    public final URI ref;
    public final String rel;

    public Href(final URI ref, final String rel) {
        this.ref = ref;
        this.rel = rel;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((ref == null) ? 0 : ref.hashCode());
        result = prime * result + ((rel == null) ? 0 : rel.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        Href other = (Href) obj;
        if (ref == null) {
            if (other.ref != null) {
                return false;
            }
        } else if (!ref.equals(other.ref)) {
            return false;
        }
        if (rel == null) {
            if (other.rel != null) {
                return false;
            }
        } else if (!rel.equals(other.rel)) {
            return false;
        }
        return true;
    }

}
