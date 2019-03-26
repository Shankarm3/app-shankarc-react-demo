package com.operasolutions.rl.service.physician.dashboard.topprocedurecode;

import com.google.inject.AbstractModule;

public class TopProcedureCodeModule extends AbstractModule {

    @Override
    protected void configure() {
        bind(TopProcedureCodeResource.class);
    }

}
