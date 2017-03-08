'use strict';

class Zabbix {
    constructor(davis, options) {
        this.davis = davis;
        this.options = options;

        this.intents = {
            zabbix: {
                title: 'Get Zabbix metrics',
                usage: 'Phrases ending with "in Zabbix"',
                examples: [
                    'What happened yesterday in Zabbix?',
                ],
                phrases: [
                    "What happened yesterday in Zabbix?",
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
        //const tense = this.davis.utils.getTense(exchange);
        console.log(exchange);
    }

    respond(exchange) {
        //const tense = this.davis.utils.getTense(exchange);
        console.log(exchange);
        exchange.response('Porra nenhuma irmão!');

    }
}

module.exports = Zabbix;