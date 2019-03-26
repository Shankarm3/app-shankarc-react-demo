package com.operasolutions.rl.service.physician;

import com.google.inject.AbstractModule;

/**
 * PhysicianAccountDao
 *
 * @author Nirmal Kumar
 */
public class PhysicianAccountModule extends AbstractModule {

    @Override
    protected void configure() {
        bind(PhysicianAccountResource.class);
        bind(PhysicianAccountInfoResource.class);
        bind(SubmittedPhysicianAccountResource.class);
        bind(PhysicianAccountViewResource.class);
    }
}
