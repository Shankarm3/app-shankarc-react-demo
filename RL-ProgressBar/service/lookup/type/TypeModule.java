package com.operasolutions.rl.service.lookup.type;

import com.google.inject.AbstractModule;

public class TypeModule extends AbstractModule {

    @Override
    protected void configure() {
        bind(TypeResource.class);
    }
}
