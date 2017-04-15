const config = require('./config');
const API = require('../');
const expect = require('expect.js');

describe('api_agent', function () {
    const api = new API(config.corpid, config.corpsecret);

    describe('listAgent', function () {
        it('should ok', async function() {
            const ret = await api.listAgent();
            expect(ret).to.only.have.keys(['errcode', 'errmsg', 'agentlist']);
            expect(ret.errcode).to.be(0);
            expect(ret.errmsg).to.be("ok");
            expect(ret.agentlist).to.be.an(Array);
        });
    });

    describe('getAgent', function () {
        it('should ok', async function() {
            const agentid = config.agentid;
            const ret = await api.getAgent(agentid);
            expect(ret.errcode).to.be(0);
            expect(ret.errmsg).to.be("ok");
            expect(ret.agentid).to.eql(agentid);
        });
    });

    describe('setAgent', function () {
        it('should ok', async function() {
            const agentid = config.agentid;
            const agent_info = {
                agentid: agentid,
                name: '企业小助手',
                description: '由setAgent在' + new Date() + '设置',
            };
            const ret = await api.setAgent(agent_info);
            expect(ret.errcode).to.be(0);
            expect(ret.errmsg).to.be("ok");
        });
    });


});
