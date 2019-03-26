/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.operasolutions.rl.service.modifier;

import com.operasolutions.rl.service.physician.charges.PhysicianLookupChargeMasterResource;
import java.util.List;
import org.jooq.FactoryOperations;
import com.google.inject.Inject;
import com.operasolutions.rl.schema.tables.TPhysHcpcModifier;
import com.operasolutions.rl.schema.tables.records.TPhysHcpcModifierRecord;
import com.operasolutions.rl.service.modifier.ModifierResource.ModifierResult;
import com.operasolutions.rl.service.physician.charges.SearchTypeEnum;
import org.jooq.Comparator;
import org.jooq.Field;
import org.jooq.SelectQuery;

/**
 * DiagnoseDao
 *
 * @author nirmal.kumar
 */
public class ModifierDao {

    private final FactoryOperations create;

    @Inject
    public ModifierDao(FactoryOperations jooqFactory) {
        this.create = jooqFactory;
    }

    /**
     * All diagnoses
     *
     * @return List of diagnoses
     */
    public List<TPhysHcpcModifierRecord> getAllDiagnoses() {
        return create.selectFrom(TPhysHcpcModifier.T_PHYS_HCPC_MODIFIER).fetch();
    }

    /**
     * Diagnose by code
     *
     * @param code
     * @return TDiagCodesRecord
     */
    public TPhysHcpcModifierRecord getModifier(String code) {
        if (code == null) {
            throw new IllegalArgumentException("Input parameter 'code' cannot be null.");
        }

        return create.selectFrom(TPhysHcpcModifier.T_PHYS_HCPC_MODIFIER).where(TPhysHcpcModifier.T_PHYS_HCPC_MODIFIER.MODIFIER.equal(code)).fetchOne();
    }

    /**
     * Searches for charges based on criteria
     *
     * @param criteria
     * @return List<LookupChargeMasterResult>
     */
    public List<ModifierResult> searchForCharges(List<PhysicianLookupChargeMasterResource.SearchCriteria> criteria) {
        if (criteria == null) {
            throw new IllegalArgumentException("Input parameter 'criteria' cannot be null.");
        }

        SelectQuery query = create.selectQuery();
        query.addFrom(TPhysHcpcModifier.T_PHYS_HCPC_MODIFIER);

        for (PhysicianLookupChargeMasterResource.SearchCriteria one : criteria) {

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
        query.addOrderBy(TPhysHcpcModifier.T_PHYS_HCPC_MODIFIER.RANK_ORDER);
        return query.fetchInto(ModifierResult.class);
    }
}
