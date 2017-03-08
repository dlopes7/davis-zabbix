'use strict';

const util = require('util')
const zabbixAPI = require('zabbix-api');


class Zabbix {
    constructor(davis, options) {
        this.davis = davis;
        this.options = options;
        this.zbx = new zabbixAPI(process.env.ZABBIX_USER, process.env.ZABBIX_PASSWORD, 'http://zabbix-server01.dc.nova/zabbix/api_jsonrpc.php');

        console.log(this.zbx)

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
        console.log(isTriggers)


        this.zbx.request('trigger.get', {
            filter: {
                value: 1
            },
            selectHosts: 'extend'
        }, function(err, res) {
            if (err) {
                console.log(err.message);
            } else {
                // console.log(res);
            }
        });

        const tense = this.davis.utils.getTense(exchange);
        console.log(util.inspect(exchange.getRawRequest(), false, null))
        console.log(util.inspect(tense));
    }

    respond(exchange) {
        //const tense = this.davis.utils.getTense(exchange);
        //console.log(exchange);
        exchange.response('Porra nenhuma irmão!');

    }
}

module.exports = Zabbix;