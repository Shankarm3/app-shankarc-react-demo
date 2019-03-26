package com.operasolutions.rl.service.physician.dashboard.peformancecomparison;

import com.google.inject.AbstractModule;

public class PhysicianPerformanceComparisonModule extends AbstractModule {

    @Override
    protected void configure() {
        bind(PhysicianPerformanceComparisonResource.class);
    }
}
