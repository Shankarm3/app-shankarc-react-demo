package com.operasolutions.rl.service.phys.auditor.assignment;

import java.util.Objects;

/**
 * PhysicianAuditorAssignmentResult
 *
 * @author Nirmal Kumar
 */
public class PhysAuditorAssignmentResult {

    public String source;
    public String costCenter;
    public String auditorId;
    public String queueAuditorId;
    public Integer total;

    @Override
    public int hashCode() {
        int hash = 5;
        hash = 89 * hash + Objects.hashCode(this.source);
        hash = 89 * hash + Objects.hashCode(this.costCenter);
        hash = 89 * hash + Objects.hashCode(this.auditorId);
        hash = 89 * hash + Objects.hashCode(this.queueAuditorId);
        hash = 89 * hash + Objects.hashCode(this.total);
        return hash;
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
        final PhysAuditorAssignmentResult other = (PhysAuditorAssignmentResult) obj;
        if (!Objects.equals(this.source, other.source)) {
            return false;
        }
        if (!Objects.equals(this.costCenter, other.costCenter)) {
            return false;
        }
        if (!Objects.equals(this.auditorId, other.auditorId)) {
            return false;
        }
        if (!Objects.equals(this.queueAuditorId, other.queueAuditorId)) {
            return false;
        }
        if (!Objects.equals(this.total, other.total)) {
            return false;
        }
        return true;
    }

   

}
