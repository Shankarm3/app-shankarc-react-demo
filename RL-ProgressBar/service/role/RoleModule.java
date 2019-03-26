package com.operasolutions.rl.service.role;

import com.google.inject.AbstractModule;

/**
 * RoleModule
 *
 * @author Nirmal Kumar
 */
public class RoleModule extends AbstractModule {

    @Override
    protected void configure() {
        bind(RoleResource.class);
    }
}
