'use strict';

// 本文件用于wechat API，基础文件，主要用于Token的处理和mixin机制
const httpx = require('httpx');

class AccessToken {
  constructor(accessToken, expireTime) {
    this.accessToken = accessToken;
    this.expireTime = expireTime;
  }

  /**
   * 检查AccessToken是否有效，检查规则为当前时间和过期时间进行对比 * Examples:
   * ```
   * token.isValid();
   * ```
   */
  isValid() {
    return this.accessToken && (new Date().getTime()) < this.expireTime;
  }
}
/**
 * 根据 corpid 和 appsecret 创建API的构造函数
 * CorpID是企业号的标识，每个企业号拥有一个唯一的CorpID；Secret是管理组凭证密钥。
 * 系统管理员可通过管理端的权限管理功能创建管理组，分配管理组对应用、通讯录的访问权限。
 * 完成后，管理组即可获得唯一的secret。
 * 系统管理员可通过权限管理查看所有管理组的secret，其他管理员可通过设置中的开发者凭据查看。
 * 当企业应用调用企业号接口时，企业号后台为根据此次访问的AccessToken,校验访问的合法性以及所对应的管理组的管理权限以返回相应的结果。
 * 注：你应该审慎配置管理组的权限，够用即好，权限过大会增加误操作可能性及信息安全隐患。
 * 如需跨进程跨机器进行操作Wechat API（依赖access token），access token需要进行全局维护
 * 使用策略如下：
 * 1. 调用用户传入的获取token的异步方法，获得token之后使用
 * 2. 使用corpid/corpsecret获取token。并调用用户传入的保存token方法保存 * Tips: * - 如果跨机器运行wechat模块，需要注意同步机器之间的系统时间。 * Examples:
 * ```
 * const API = require('co-wechat-enterprise-api').API;
 * let api = new API('corpid', 'corpsecret');
 * ```
 * 以上即可满足单进程使用。
 * 当多进程时，token需要全局维护，以下为保存token的接口。
 * 以下的例子使用了文本文件，实际使用中建议放到数据库中。
 * saveToken 方法接受的参数数据结构： { accessToken: 'aJvlZe6Q_vpYfdTFXWCSbJ7mVuMSXKvVGJU7BNy1wWBVE_41yOTM-ZE-axbsjNxWIWraYoOyJbcqIeyVpBHWtg' }
 * getToken 方法要保证返回的数据结构同上。
 *
 * ```
 * const api = new API('corpid', 'corpsecret', function* () {
 *   // 传入一个获取全局token的方法
 *   const txt = yield fs.readFile('access_token.txt', 'utf8');
 *   return JSON.parse(txt);
 * }, function* (token) {
 *   // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
 *   // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
 *   yield fs.writeFile('access_token.txt', JSON.stringify(token));
 * });
 * ```
 * @param {String} corpid 企业号的 corpid
 * @param {String} corpsecret 在公众平台上申请得到的corpsecret
 * @param {Generator} getToken 可选的。获取全局token对象的方法，多进程模式部署时需在意
 * @param {Generator} saveToken 可选的。保存全局token对象的方法，多进程模式部署时需在意
 */
const API = function (corpid, corpsecret, getToken, saveToken) {
  this.corpid = corpid;
  this.corpsecret = corpsecret;

  this.getToken = getToken || function* () {
    return this.store;
  };
  this.saveToken = saveToken || function* (token) {
    this.store = token;
    if (process.env.NODE_ENV === 'production') {
      console.warn('Don\'t save token in memory, when cluster or multi-computer!');
    }
  };
  this.prefix = 'https://qyapi.weixin.qq.com/cgi-bin/';
  this.defaults = {};
  // set default js ticket handle
  this.registerTicketHandle();
};

/**
 * 用于设置urllib的默认options * Examples:
 * ```
 * api.setOpts({timeout: 15000});
 * ```
 * @param {Object} opts 默认选项
 */
API.prototype.setOpts = function (opts) {
  this.defaults = opts;
};

/**
 * 设置urllib的hook
 */
API.prototype.request = function* (url, opts) {
  let options = {};
  Object.assign(options, this.defaults);
  opts || (opts = {});
  for (const key of Object.keys(opts)) {
    if (key !== 'headers') {
      options[key] = opts[key];
    } else {
      if (opts.headers) {
        options.headers = options.headers || {};
        Object.assign(options.headers, opts.headers);
      }
    }
  }
  const res = yield httpx.request(url, options);
  if (res.statusCode < 200 || res.statusCode > 204) {
    const err = new Error(`url: ${url}, status code: ${res.statusCode}`);
    err.name = 'WeChatAPIError';
    throw err;
  }

  const buffer = yield httpx.read(res);
  const contentType = res.headers['content-type'] || '';
  if (contentType.indexOf('application/json') !== -1) {
    let data;
    try {
      data = JSON.parse(buffer);
    } catch (ex) {
      const err = new Error('JSON.parse error. buffer is ' + buffer.toString());
      err.name = 'WeChatAPIError';
      throw err;
    }
    if (data && data.errcode) {
      const err = new Error(data.errmsg);
      err.name = 'WeChatAPIError';
      err.code = data.errcode;
      throw err;
    }

    return data;
  }

  return buffer;
};

/*!
 * 根据创建API时传入的 corpid 和 corpsecre t获取 access_token
 * 进行后续所有API调用时，需要先获取 access_token
 * 详细请看：<http://qydev.weixin.qq.com/wiki/index.php?title=主动调用> * 应用开发者无需直接调用本API。 * Examples:
 * ```
 * let token = yield api.getAccessToken();
 * ```
 * - `err`, 获取access token出现异常时的异常对象
 * - `result`, 成功时得到的响应结果 * Result:
 * ```
 * {"access_token": "ACCESS_TOKEN","expires_in": 7200}
 * ```
 */
API.prototype.getAccessToken = function* () {
  const url = `${this.prefix}gettoken?corpid=${this.corpid}&corpsecret=${this.corpsecret}`;
  const data = yield this.request(url);

  // 过期时间，因网络延迟等，将实际过期时间提前10秒，以防止临界点
  const expireTime = (new Date().getTime()) + (data.expires_in - 10) * 1000;
  const token = new AccessToken(data.access_token, expireTime);
  yield this.saveToken(token);
  return token;
};

/*!
 * 需要access token的接口调用如果采用ensureAccessToken进行封装后，就可以直接调用。
 * 无需依赖getAccessToken为前置调用。
 * 应用开发者无需直接调用此API。
 * Examples:
 * ```
 * yield api.ensureAccessToken();
 * ```
 */
API.prototype.ensureAccessToken = function* () {
  // 调用用户传入的获取token的异步方法，获得token之后使用（并缓存它）。
  const token = yield this.getToken();
  if (token && token.accessToken && token.expireTime) {
    const accessToken = new AccessToken(token.accessToken, token.expireTime);
    if(accessToken.isValid()) return accessToken;
  }
    return yield this.getAccessToken();
};

/**
 * 用于支持对象合并。将对象合并到API.prototype上，使得能够支持扩展
 * Examples:
 * ```
 * // 媒体管理（上传、下载）
 * API.mixin(require('./lib/api_media'));
 * ```
 * @param {Object} obj 要合并的对象
 */
API.mixin = function (obj) {
  for (const key of Object.keys(obj)) {
    if (API.prototype.hasOwnProperty(key)) {
      throw new Error('Don\'t allow override existed prototype method. method: '+ key);
    }
    API.prototype[key] = obj[key];
  }
};

API.AccessToken = AccessToken;

module.exports = API;
