package com.operasolutions.rl.service.reporting.assignment;

import com.google.inject.AbstractModule;

public class ReportingAssignmentModule extends AbstractModule {

    @Override
    protected void configure() {
        bind(ReportingAssignmentResource.class);
    }
}
