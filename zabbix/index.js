'use strict';

const fs = require("fs")
const util = require('util')
const ZabbixAPI = require('./classes/ZabbixAPI');



class Zabbix {
    constructor(davis, options) {
        this.davis = davis;
        this.options = options;

        this.zabbixApi = new ZabbixAPI(davis);

        this.intents = {
            zabbix: {
                title: 'Get Zabbix metrics',
                usage: 'Phrases ending with "in Zabbix"',
                examples: [
                    'What happened yesterday in Zabbix?',
                ],
                phrases: [
                    "What happened yesterday in Zabbix?",
                    "What are the active triggers in Zabbix?",
                    "Zabbix, {{METRIC}} da {{HOST}}"
                ],
                lifecycleEvents: [
                    'gatherData',
                    'respond',
                ],
                nlp: true,
                clarification: 'I think you were asking about Zabbix.',
            },
        };

        this.hooks = {
            'zabbix:gatherData': this.gatherData.bind(this),
            'zabbix:respond': this.respond.bind(this),
        };
    }

    gatherData(exchange) {

        const isTriggers = /[tT]rigger/i.test(exchange.getRawRequest());
        const isItems = /^[zZ]abbix/i.test(exchange.getRawRequest());


        if (isItems) {

            return this.zabbixApi.getItemValue(exchange)
                .then((res) => {

                    exchange.addContext({ zabbixResponse: res });
                    console.log('Item value', res);
                    return exchange;
                });
        }
    }

    respond(exchange, context) {
        const templates = this.davis.pluginManager.responseBuilder.getTemplates(this);

        exchange.response(templates) // respond to the user
            .smartEnd(); // end the conversation if appropriate
    }

}

module.exports = Zabbix;