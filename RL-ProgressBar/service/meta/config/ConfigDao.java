/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.operasolutions.rl.service.meta.config;

import com.google.inject.Inject;
import com.operasolutions.rl.schema.tables.TPhysMetaConfigJqgrid;
import com.operasolutions.rl.service.meta.config.ConfigResource.JqGridRepresentation;
import java.util.List;
import java.util.Map;
import org.jooq.FactoryOperations;

/**
 *
 * @author nirmal.kumar
 */
public class ConfigDao {

    private final FactoryOperations create;

    @Inject
    public ConfigDao(FactoryOperations jooqFactory) {
        this.create = jooqFactory;
    }

    public Map<String, Object> getJqGridConfig(Map<String, Object> map, String screenName) {
        List<String> colNames = create.select(TPhysMetaConfigJqgrid.T_PHYS_META_CONFIG_JQGRID.COLUMN_NAME).from(TPhysMetaConfigJqgrid.T_PHYS_META_CONFIG_JQGRID)
                .where(TPhysMetaConfigJqgrid.T_PHYS_META_CONFIG_JQGRID.SCREEN_NAME.eq(screenName)).orderBy(TPhysMetaConfigJqgrid.T_PHYS_META_CONFIG_JQGRID.RANK)
                .fetch(TPhysMetaConfigJqgrid.T_PHYS_META_CONFIG_JQGRID.COLUMN_NAME);
        List<JqGridRepresentation> colModel = create.select(TPhysMetaConfigJqgrid.T_PHYS_META_CONFIG_JQGRID.NAME, TPhysMetaConfigJqgrid.T_PHYS_META_CONFIG_JQGRID.WIDTH, TPhysMetaConfigJqgrid.T_PHYS_META_CONFIG_JQGRID.SORTABLE, TPhysMetaConfigJqgrid.T_PHYS_META_CONFIG_JQGRID.SORTTYPE, TPhysMetaConfigJqgrid.T_PHYS_META_CONFIG_JQGRID.FIXED, TPhysMetaConfigJqgrid.T_PHYS_META_CONFIG_JQGRID.CLASSES, TPhysMetaConfigJqgrid.T_PHYS_META_CONFIG_JQGRID.ALIGN, TPhysMetaConfigJqgrid.T_PHYS_META_CONFIG_JQGRID.HIDDEN)
                .from(TPhysMetaConfigJqgrid.T_PHYS_META_CONFIG_JQGRID)
                .where(TPhysMetaConfigJqgrid.T_PHYS_META_CONFIG_JQGRID.SCREEN_NAME.eq(screenName)).orderBy(TPhysMetaConfigJqgrid.T_PHYS_META_CONFIG_JQGRID.RANK)
                .fetchInto(JqGridRepresentation.class);
        map.put("colNames", colNames);
        map.put("colModel", colModel);
        return map;
    }

}
