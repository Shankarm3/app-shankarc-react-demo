package com.operasolutions.rl.service.bundle;

import com.google.inject.AbstractModule;

public class LoginResourceBundleModule extends AbstractModule {

    @Override
    protected void configure() {
        bind(LoginResourceBundleResource.class);
    }

}
