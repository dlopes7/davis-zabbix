#!/usr/bin/env node

'use strict';

const BbPromise = require('bluebird');

(() => BbPromise.resolve().then(() => {
    const Davis = require('@dynatrace/davis');

    const davis = new Davis({
        logLevel: 'debug',
        userPlugins: ['./zabbix']
    });

    return davis.run();
}))();