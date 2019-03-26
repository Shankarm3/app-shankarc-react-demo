package com.operasolutions.rl.service.exporter;

import com.google.inject.AbstractModule;

public class PdfGeneratorModule extends AbstractModule {

    @Override
    protected void configure() {
        bind(ExporterResource.class);
    }
}
