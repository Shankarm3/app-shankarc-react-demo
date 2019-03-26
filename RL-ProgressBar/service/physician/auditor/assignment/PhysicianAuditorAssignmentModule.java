package com.operasolutions.rl.service.physician.auditor.assignment;

import com.google.inject.AbstractModule;
import com.operasolutions.rl.service.phys.auditor.assignment.PhysAuditorAssignmentResource;

public class PhysicianAuditorAssignmentModule extends AbstractModule {

    @Override
    protected void configure() {
        bind(PhysicianAuditorAssignmentResource.class);
        bind(PhysicianSummaryResource.class);
        bind(PhysAuditorAssignmentResource.class);
    }
}
