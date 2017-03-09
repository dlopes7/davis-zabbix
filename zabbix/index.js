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

        if (isTriggers) {
            this.zabbixApi.createTriggers();
        }
        if (isItems) {
            this.zabbixApi.getItems(exchange);
        }

        const tense = this.davis.utils.getTense(exchange);
        console.log(util.inspect(exchange.getRawRequest(), false, null))
        console.log(util.inspect(tense));

        //fs.writeFileSync('../exchange.json', util.inspect(exchange, false, null), 'utf-8');
    }

    respond(exchange) {
        //const tense = this.davis.utils.getTense(exchange);
        //console.log(exchange);
        exchange.response('Porra nenhuma irmão!');
    }
}

module.exports = Zabbix;