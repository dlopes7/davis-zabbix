const zabbixAPI = require('zabbix-api');
const Promise = require("bluebird");
const _ = require('lodash');
const util = require('util')



class ZabbixAPI {
    constructor(davis) {
        this.zbx = new zabbixAPI(process.env.ZABBIX_USER, process.env.ZABBIX_PASSWORD, 'http://zabbix-server01.dc.nova/zabbix/api_jsonrpc.php');
        Promise.promisifyAll(this.zbx);
        this.logger = davis.logger;

        this.itemTypes = {
            cpu: ['cpu'],
            memory: ['memory', 'memoria', 'memória']
        };
    }

    getHostFromText(text) {
        var host = undefined;
        try {

            host = /d[ao] (.*)/.exec(text)[1];
            this.logger.debug(`Found the host "${host}"`);

        } catch (err) {
            this.logger.error(err);
            this.logger.debug(`Could not find a host on the string "${text}"`);
        }
        return host;

    }

    getMetricFromText(text) {
        var metricSpelled = undefined;
        try {
            metricSpelled = /^[zZ]abbix,* ([a-zA-z0-9]+)/.exec(text)[1];

            for (var itemType in this.itemTypes) {
                for (var i = 0; i < this.itemTypes[itemType].length; i++) {

                    var toCompare = this.itemTypes[itemType][i];
                    if (metricSpelled.toLowerCase() == toCompare) {
                        this.logger.debug(`Found the metric ${itemType}`)
                        return itemType;
                    }
                }
            }
        } catch (err) {
            this.logger.error(err);
            this.logger.debug(`Could not find a metric on the string "${text}"`);
        }
        return undefined;

    }

    getItemValue(exchange, callback) {
        var itemValue = undefined;

        const host = this.getHostFromText(exchange.getRawRequest());
        const metric = this.getMetricFromText(exchange.getRawRequest());

        const zabbix_metrics = {
            cpu: 'Processor Time',
            memory: 'vm.memory.size[pused]'
        }

        const eContext = {
            metric: metric,
            host: host
        };

        exchange.addExchangeContext(eContext);

        console.log(`Host: ${host}, Metric: ${metric}`);

        return this.zbx.requestAsync('item.get', {
                filter: {
                    host: host.toUpperCase()
                },
                search: {
                    key_: zabbix_metrics[metric]
                },
                selectHosts: 'extend'
            })
            .catch((err) => { console.log(`ZABBIX API - item.get - ${err}`); })
            .then((res) => {
                itemValue = res[0].lastvalue;
                console.log(`Host: ${host}, Metric: ${metric}: ${itemValue}`);
                return {
                    host: host,
                    metric: metric,
                    value: itemValue
                };
            });
    }



    createTriggers() {
        var current = Promise.resolve();
        console.log(current);

        this.zbx.requestAsync('trigger.get', {
                filter: {
                    value: 1
                },
                selectHosts: 'extend'
            })
            .catch((err) => { this.logger.error(`ZABBIX API - trigger.get - ${err}`); })
            .then((res) => { this.logger.debug(`ZABBIX API - trigger.get - Found ${res.length} triggers`); });


        /*
        this.logger.debug(`ZABBIX API: 'trigger.get'`);
        this.zbx.request('trigger.get', {
            filter: {
                value: 1
            },
            selectHosts: 'extend'
        }, function(err, res) {
            if (err) {} else {}
        });
        */

    }

}

module.exports = ZabbixAPI;