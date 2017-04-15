'use strict';

const crypto = require('crypto');
const { postJSON } = require('./util');

const Ticket = function (ticket, expireTime) {
  if (!(this instanceof Ticket)) {
    return new Ticket(ticket, expireTime);
  }
  this.ticket = ticket;
  this.expireTime = expireTime;
};

Ticket.prototype.isValid = function () {
  return !!this.ticket && (new Date().getTime()) < this.expireTime;
};

/**
 * 多台服务器负载均衡时，ticketToken需要外部存储共享。
 * 需要调用此registerTicketHandle来设置获取和保存的自定义方法。
 *
 * Examples:
 * ```
 * api.registerTicketHandle(getTicketToken, saveTicketToken);
 * // getTicketToken
 * function getTicketToken* () {
 *  settingModel.getItem({key: 'weixin_ticketToken'}, function (err, setting) {
 *    if (err) return callback(err);
 *    callback(null, setting.value);
 *  });
 * }
 * // saveTicketToken
 * function saveTicketToken* (_ticketToken) {
 *  settingModel.setItem({key:'weixin_ticketToken', value: ticketToken}, function (err) {
 *    if (err) return callback(err);
 *    callback(null);
 *  });
 * }
 * ```
 *
 * @param {Function} getTicketToken 获取外部ticketToken的函数
 * @param {Function} saveTicketToken 存储外部ticketToken的函数
 */
exports.registerTicketHandle = function (getTicketToken, saveTicketToken) {
  if (!getTicketToken && !saveTicketToken) {
    this.ticketStore = {};
  }
  this.getTicketToken = getTicketToken || async function() {
    return this.ticketStore;
  };
  this.saveTicketToken = saveTicketToken || async function(ticket) {
    this.ticketStore = ticket;
    if (process.env.NODE_ENV === 'production') {
      console.warn('Don\'t save ticket in memory, when cluster or multi-computer!');
    }
  };
};

/**
 * 获取js sdk所需的有效js ticket
 *
 * Result:
 * - `errcode`, 0为成功
 * - `errmsg`, 成功为'ok'，错误则为详细错误信息
 * - `ticket`, js sdk有效票据，如：bxLdikRXVbTPdHSM05e5u5sUoXNKd8-41ZO3MhKoyN5OfkWITDGgnr2fwJ0m9E8NYzWKVZvdVtaUgWvsdshFKA
 * - `expires_in`, 有效期7200秒，开发者必须在自己的服务全局缓存jsapi_ticket
 *
 */
exports.getTicket = async function() {
  const { accessToken }  = await this.ensureAccessToken();
  const url = this.prefix + 'get_jsapi_ticket?access_token=' + accessToken;
  const opts = {dataType: 'json'};
  const ret = await this.request(url, opts);
  const expireTime = (new Date().getTime()) + (ret.expires_in - 10) * 1000;
  const ticket = new Ticket(ret.ticket, expireTime);
  await this.saveTicketToken(ticket);
  return ticket;
};

/*!
 * 生成随机字符串
 */
const createNonceStr = function () {
  return Math.random().toString(36).substr(2, 15);
};

/*!
 * 生成时间戳
 */
const createTimestamp = function () {
  return parseInt(new Date().getTime() / 1000) + '';
};

/*!
 * 排序查询字符串
 */
const raw = function (args) {
  const keys = Object.keys(args);
  keys = keys.sort();
  const newArgs = {};
  keys.forEach(function (key) {
    newArgs[key.toLowerCase()] = args[key];
  });

  const string = '';
  for (const k in newArgs) {
    string += '&' + k + '=' + newArgs[k];
  }
  return string.substr(1);
};

/*!
 * 签名算法
 *
 * @param {String} nonceStr 生成签名的随机串
 * @param {String} jsapi_ticket 用于签名的jsapi_ticket
 * @param {String} timestamp 时间戳
 * @param {String} url 用于签名的url，注意必须与调用JSAPI时的页面URL完全一致
 */
const sign = function (nonceStr, jsapi_ticket, timestamp, url) {
  const ret = {
    jsapi_ticket: jsapi_ticket,
    nonceStr: nonceStr,
    timestamp: timestamp,
    url: url
  };
  const string = raw(ret);
  const shasum = crypto.createHash('sha1');
  shasum.update(string);
  return shasum.digest('hex');
};

/**
 * 获取微信JS SDK Config的所需参数
 *
 * 注意事项
 *
 * 1. 签名用的noncestr和timestamp必须与wx.config中的nonceStr和timestamp相同。
 * 2. 签名用的url必须是调用JS接口页面的完整URL。
 * 3. 出于安全考虑，开发者必须在服务器端实现签名的逻辑。
 * Examples:
 * ```
 * const param = {
 *  debug:false,
 *  jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'],
 *  url: 'http://www.xxx.com' 
 * };
 * const result = await api.getJsConfig(param);
 * ```
 *
 * @param {Object} param 参数
 */
exports.getJsConfig = async function(param) {
  const ticket = await this.ensureTicket();
  
  const nonceStr = createNonceStr();
  const jsAPITicket = ticket.ticket;
  const timestamp = createTimestamp();
  const signature = sign(nonceStr, jsAPITicket, timestamp, param.url);
  const result = {
    debug: param.debug,
    appId: that.corpid,
    timestamp: timestamp,
    nonceStr: nonceStr,
    signature: signature,
    jsApiList: param.jsApiList
  };
  return result;
  
};

exports.ensureTicket = async function() {
  const ticket = await this.getTicketToken();
  if (ticket && new Ticket(ticket.ticket, ticket.expireTime).isValid()) {
    return ticket;
  } else {
    return this.getTicket();
  }
};