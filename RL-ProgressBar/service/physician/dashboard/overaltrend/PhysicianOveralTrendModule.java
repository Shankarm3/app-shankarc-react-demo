package com.operasolutions.rl.service.physician.dashboard.overaltrend;

import com.google.inject.AbstractModule;

public class PhysicianOveralTrendModule extends AbstractModule {

    @Override
    protected void configure() {
        bind(PhysicianOveralTrendResource.class);
    }
}
