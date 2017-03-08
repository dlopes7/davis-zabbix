const zabbixAPI = require('zabbix-api');
const Promise = require("bluebird");



class ZabbixAPI {
    constructor(davis) {
        this.zbx = new zabbixAPI(process.env.ZABBIX_USER, process.env.ZABBIX_PASSWORD, 'http://zabbix-server01.dc.nova/zabbix/api_jsonrpc.php');
        Promise.promisifyAll(this.zbx);
        this.logger = davis.logger;
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
            .catch((err) => { console.log(err); })
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