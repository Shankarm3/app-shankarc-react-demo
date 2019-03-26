package com.operasolutions.rl.service.physician.dashboard.account.report;

import com.google.inject.AbstractModule;

public class PhysicianAccountReportModule extends AbstractModule {

    @Override
    protected void configure() {
        bind(PhysicianAccountReportResource.class);
    }
}
