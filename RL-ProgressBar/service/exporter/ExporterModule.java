package com.operasolutions.rl.service.exporter;

import com.google.inject.AbstractModule;

public class ExporterModule extends AbstractModule {

    @Override
    protected void configure() {
        bind(ExporterResource.class);
    }
}
