const API = require('../');
const expect = require('expect.js');
const config = require('./config');

describe('api_common', function () {

  describe('mixin', function () {
    it('should ok', function () {
      API.mixin({sayHi() {}});
      expect(API.prototype).to.have.property('sayHi');
    });

    it('should not ok when override method', function () {
      const obj = {sayHi() {}};
      expect(API.mixin).withArgs(obj).to.throwException(/Don't allow override existed prototype method\./);
    });
  });

  describe('getAccessToken', function () {
    it('should ok', async function() {
      const api = new API(config.corpid, config.corpsecret);
      const token = await api.getAccessToken();
      expect(token).to.only.have.keys(['accessToken', 'expireTime']);
    });

    it('should not ok', async function() {
      const api = new API(config.corpid, 'corpsecret');
      try {
        await api.getAccessToken();
      } catch (err) {
        expect(err).to.have.property('name', 'WeChatAPIError');
        expect(err).to.have.property('message', 'invalid credential');
      }
    });
  });
});