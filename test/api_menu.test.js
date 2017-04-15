const config = require('./config');
const API = require('../');
const expect = require('expect.js');

describe('api_menu', function () {
    const api = new API(config.corpid, config.corpsecret);

    describe('createMenu', function () {
        it('should ok', async function() {
            const ret = await api.createMenu(config.agentid, config.test_menu);
            expect(ret).to.only.have.keys(['errcode', 'errmsg']);
            expect(ret.errcode).to.be(0);
            expect(ret.errmsg).to.be("ok");
        });
    });

    describe('getMenu', function () {
        it('should ok', async function() {
            const ret = await api.getMenu(config.agentid);
            console.log(ret);
            expect(ret).to.only.have.keys(['errcode', 'errmsg']);
            expect(ret.errcode).to.be(0);
            expect(ret.errmsg).to.be("ok");
        });
    });

    describe('removeMenu', function () {
        it('should ok', async function() {
            const ret = await api.removeMenu(config.agentid);
            console.log(ret);
            expect(ret).to.only.have.keys(['errcode', 'errmsg']);
            expect(ret.errcode).to.be(0);
            expect(ret.errmsg).to.be("ok");
        });
    });


});
