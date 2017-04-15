const config = require('./config');
const API = require('../');
const expect = require('expect.js');

describe('api_ip', function () {
    const api = new API(config.corpid, config.corpsecret);

    describe('getCallbackIP', function () {
        it('should ok', async function() {
            const data = await api.getCallbackIP();
            expect(data).to.only.have.keys('ip_list');
        });

    });
});
