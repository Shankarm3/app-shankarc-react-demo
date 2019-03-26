/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.operasolutions.rl.service.physician.confirmed;

import com.google.inject.AbstractModule;

/**
 *
 * @author nirmal.kumar
 */
public class PhysicianConfirmedChargeModule extends AbstractModule {

    @Override
    protected void configure() {
        bind(PhysicianConfirmedChargeResource.class);
        bind(ConfirmedChargeResource.class);
    }

}
