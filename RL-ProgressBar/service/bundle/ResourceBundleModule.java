package com.operasolutions.rl.service.bundle;

import com.google.inject.AbstractModule;

public class ResourceBundleModule extends AbstractModule {

    @Override
    protected void configure() {
        bind(ResourceBundleResource.class);
    }
}
