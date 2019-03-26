/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.operasolutions.rl.service.meta.config;

import com.google.inject.AbstractModule;

/**
 *
 * @author nirmal.kumar
 */
public class ConfigModule extends AbstractModule {

    @Override
    protected void configure() {
        bind(ConfigResource.class);
    }
}
