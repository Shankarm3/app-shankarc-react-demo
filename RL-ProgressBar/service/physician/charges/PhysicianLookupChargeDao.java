package com.operasolutions.rl.service.physician.charges;

import java.math.BigDecimal;
import java.util.List;

import org.jooq.Comparator;
import org.jooq.FactoryOperations;
import org.jooq.Field;
import org.jooq.Record;
import org.jooq.SelectQuery;

import com.google.inject.Inject;
import com.operasolutions.rl.schema.tables.TChargeMaster;
import com.operasolutions.rl.schema.tables.TPhysChargeMasterLookup;
import com.operasolutions.rl.schema.tables.TPhysHcpcModifier;
import com.operasolutions.rl.service.physician.charges.PhysicianLookupChargeMasterResource.LookupChargeMasterResult;
import com.operasolutions.rl.service.physician.charges.PhysicianLookupChargeMasterResource.SearchCriteria;
import org.jooq.JoinType;

/**
 * LookupChargeDao
 *
 * @author Nirmal Kumar
 */
public class PhysicianLookupChargeDao {

    private final FactoryOperations create;

    @Inject
    public PhysicianLookupChargeDao(FactoryOperations jooqFactory) {
        this.create = jooqFactory;
    }

    /**
     * Searches for charges based on criteria
     *
     * @param criteria
     * @return List<LookupChargeMasterResult>
     */
    public List<LookupChargeMasterResult> searchForCharges(List<SearchCriteria> criteria) {
        if (criteria == null) {
            throw new IllegalArgumentException("Input parameter 'criteria' cannot be null.");
        }

        SelectQuery query = create.selectQuery();
        query.setDistinct(true);
        query.addSelect(TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.DESCRIPTION, TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.HCPC, TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.MODIFIER, TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.REVENUE_CODE, TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.PRICE, TPhysHcpcModifier.T_PHYS_HCPC_MODIFIER.DESCRIPTION.as("modDesc"));
        query.addFrom(TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP);
        query.addJoin(TPhysHcpcModifier.T_PHYS_HCPC_MODIFIER, JoinType.LEFT_OUTER_JOIN, TPhysHcpcModifier.T_PHYS_HCPC_MODIFIER.MODIFIER.eq(TPhysChargeMasterLookup.T_PHYS_CHARGE_MASTER_LOOKUP.MODIFIER));
        for (SearchCriteria one : criteria) {

            SearchTypeEnum typeCheck = one.searchType;
            String valueCheck = one.value.trim();
            Field<String> field = one.field;

            if (null != typeCheck) {
                switch (typeCheck) {
                    case EQUALS: {
                        Comparator comparator = Comparator.EQUALS;
                        query.addConditions(one.field.compare(comparator, valueCheck));
                        break;
                    }
                    case BEGINS_WITH: {
                        Comparator comparator = Comparator.LIKE;
                        String value = valueCheck + "%";
                        query.addConditions(field.compare(comparator, value));
                        break;
                    }
                    case ENDS_WITH: {
                        Comparator comparator = Comparator.LIKE;
                        String value = "%" + valueCheck;
                        query.addConditions(field.compare(comparator, value));
                        break;
                    }
                    case CONTAINS: {
                        Comparator comparator = Comparator.LIKE;
                        String value = "%" + valueCheck + "%";
                        query.addConditions(field.compare(comparator, value));
                        break;
                    }
                    default:
                        break;
                }
            }
        }

        // if no criteria were specified, return all records, limit 500
        query.addLimit(500);

        return query.fetchInto(LookupChargeMasterResult.class);
    }

}
