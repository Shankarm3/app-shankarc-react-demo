package com.operasolutions.rl.service.physician.auditor.assignment;

import java.util.Objects;

/**
 * PhysicianAuditorAssignmentResult
 *
 * @author Nirmal Kumar
 */
public class PhysicianAuditorAssignmentResult {

    public String source;
    public String costCenter;
    public String hospitalId;
    public String auditorId;
    public String queueAuditorId;
    public String shortName;
    public String hospitalName;
    public Integer total;

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 97 * hash + Objects.hashCode(this.source);
        hash = 97 * hash + Objects.hashCode(this.costCenter);
        hash = 97 * hash + Objects.hashCode(this.hospitalId);
        hash = 97 * hash + Objects.hashCode(this.auditorId);
        hash = 97 * hash + Objects.hashCode(this.queueAuditorId);
        hash = 97 * hash + Objects.hashCode(this.shortName);
        hash = 97 * hash + Objects.hashCode(this.hospitalName);
        hash = 97 * hash + Objects.hashCode(this.total);
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
        final PhysicianAuditorAssignmentResult other = (PhysicianAuditorAssignmentResult) obj;
        if (!Objects.equals(this.source, other.source)) {
            return false;
        }
        if (!Objects.equals(this.costCenter, other.costCenter)) {
            return false;
        }
        if (!Objects.equals(this.hospitalId, other.hospitalId)) {
            return false;
        }
        if (!Objects.equals(this.auditorId, other.auditorId)) {
            return false;
        }
        if (!Objects.equals(this.queueAuditorId, other.queueAuditorId)) {
            return false;
        }
        if (!Objects.equals(this.shortName, other.shortName)) {
            return false;
        }
        if (!Objects.equals(this.hospitalName, other.hospitalName)) {
            return false;
        }
        if (!Objects.equals(this.total, other.total)) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "PhysicianAuditorAssignmentResult{" + "source=" + source + ", costCenter=" + costCenter + ", hospitalId=" + hospitalId + ", auditorId=" + auditorId + ", queueAuditorId=" + queueAuditorId + ", shortName=" + shortName + ", hospitalName=" + hospitalName + ", total=" + total + '}';
    }

}
