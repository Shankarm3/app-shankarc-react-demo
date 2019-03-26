/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.operasolutions.rl.service.physician.charges;

import com.google.inject.AbstractModule;

/**
 *
 * @author nirmal.kumar
 */
public class PhysicianChargesModule extends AbstractModule {

    @Override
    protected void configure() {
        bind(PhysicianChargesResource.class);
        bind(PhysicianChargesSubmitResource.class);
        bind(PhysicianLookupChargeMasterResource.class);
    }

}
