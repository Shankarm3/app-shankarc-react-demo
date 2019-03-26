package com.operasolutions.rl.service.facilitypeformance;

import java.math.BigDecimal;

/**
 * GridDataResult
 *
 * @author Marcel Bodnar
 */
public class GridDataResult {

    /**
     * I am using separator in Maps to avoid conflicts between chargeCode and
     * description
     */
    protected static final String SEPARATOR = "$";

    /**
     * immutable - equals
     */
    public final String groupType;
    public Integer hitCount = new Integer(0);
    public BigDecimal hitValue = new BigDecimal(0);
    public final String groupDesc;
    public String procCode;

    // !!! Do not modify constructors, do not change parameter order, JOOQ mapping uses them
    /**
     * Constructor
     *
     * @param groupType
     * @param hitValue
     * @param hitCount
     */
    public GridDataResult(String groupType, BigDecimal hitValue, Integer hitCount) {
        this.groupType = groupType;
        this.hitValue = hitValue;
        this.hitCount = hitCount;
        this.groupDesc = null;
    }
// !!! Do not modify constructors, do not change parameter order, JOOQ mapping uses them

    /**
     * Constructor
     *
     * @param groupType
     * @param hitValue
     * @param hitCount
     * @param groupDesc
     * @param procCode
     */
    public GridDataResult(String groupType, BigDecimal hitValue, Integer hitCount, String groupDesc, String procCode) {
        this.groupType = groupType;
        this.hitValue = hitValue;
        this.hitCount = hitCount;
        this.groupDesc = groupDesc;
        this.procCode = procCode;
    }

    // !!! Do not modify constructors, do not change parameter order, JOOQ mapping uses them
    /**
     * Constructor
     *
     * @param groupType
     * @param groupDesc
     */
    public GridDataResult(String groupType, String groupDesc) {
        this.groupType = groupType;
        this.groupDesc = groupDesc;
    }

    // !!! Do not modify constructors, do not change parameter order, JOOQ mapping uses them
    /**
     * Constructor
     *
     * @param groupType
     * @param hitValue
     * @param groupDesc
     * @param groupTypeDummy - dummy attribute to allow JOOQ choose correct
     * constructor
     */
    public GridDataResult(String groupType, BigDecimal hitValue, String groupDesc, String groupTypeDummy) {
        this.groupType = groupType;
        this.hitValue = hitValue;
        this.groupDesc = groupDesc;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((groupType == null) ? 0 : groupType.hashCode());
        result = prime * result + ((groupDesc == null) ? 0 : groupDesc.hashCode());

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

        GridDataResult other = (GridDataResult) obj;
        if (groupType == null) {
            if (other.groupType != null) {
                return false;
            }
        } else if (!groupType.equalsIgnoreCase(other.groupType)) {
            return false;
        }
        if (groupDesc == null) {
            if (other.groupDesc != null) {
                return false;
            }
        } else if (!groupDesc.equalsIgnoreCase(other.groupDesc)) {
            return false;
        }

        return true;
    }

    /**
     * Gets record identifier based on fields which identify records
     *
     * @return String
     */
    public String getRecordIdentifier() {
        return groupType + SEPARATOR;
    }

    @Override
    public String toString() {
        StringBuffer buffer = new StringBuffer();

        buffer.append("groupType = " + groupType);
        buffer.append(", hitCount = " + hitCount);
        buffer.append(", hitValue = " + hitValue);
        buffer.append(", groupDesc = " + groupDesc);

        return buffer.toString();
    }
}
