'use strict';

const { postJSON } = require('./util');

/**
 * 发送客服消息（文本）
 * 支持文本、图片、文件消息。sender和receiver有且只有一个类型为kf。当sender为客服时，表示客服从其它IM工具回复客户，并同步消息到客服的微信上
 * Examples:
 * ```
 * const result = await api.sendTextKF(sender, receiver, text);
 * ```
 * @param {String} sender 发送人
 * @param {String} receiver 接收人
 * @param {String} text 消息内容
 */
exports.sendTextKF = async function(sender, receiver, text) {
  const { accessToken }  = await this.ensureAccessToken();
  const url = this.prefix + 'kf/send?access_token=' + accessToken;
  const data = {
  	sender: sender,
  	receiver: receiver,
  	msgtype: "text",
  	text: {
  		content: text
  	}
  };
  return this.request(url, postJSON(data));
};

/**
 * 发送客服消息（图片）
 *
 * Examples:
 * ```
 * const result = await api.sendImageKF(sender, receiver, media_id);
 * ```
 * @param {String} type 接收人类型：single|group，分别表示：群聊|单聊
 * @param {String} receiver 接收人
 * @param {String} sender 发送人
 * @param {String} media_id 消息内容
 */
exports.sendImageKF = async function(sender, receiver, media_id) {
  const { accessToken }  = await this.ensureAccessToken();
  const url = this.prefix + 'kf/send?access_token=' + accessToken;
  const data = {
  	sender: sender,
  	receiver: receiver,
  	msgtype: "image",
  	image: {
  		media_id: media_id
  	}
  };
  return this.request(url, postJSON(data));
};

/**
 * 发送客服消息（文件）
 *
 * Examples:
 * ```
 * const result = await api.sendFileKF(sender, receiver, media_id);
 * ```
 * @param {String} type 接收人类型：single|group，分别表示：群聊|单聊
 * @param {String} receiver 接收人
 * @param {String} sender 发送人
 * @param {String} media_id 消息内容
 */
exports.sendFileKF = async function(sender, receiver, media_id) {
  const { accessToken }  = await this.ensureAccessToken();
  const url = this.prefix + 'kf/send?access_token=' + accessToken;
  const data = {
  	sender: sender,
  	receiver: receiver,
  	msgtype: "file",
  	file: {
  		media_id: media_id
  	}
  };
  return this.request(url, postJSON(data));
};

/**
 * 发送客服消息（语音）
 *
 * Examples:
 * ```
 * const result = await api.sendVoiceKF(sender, receiver, media_id);
 * ```
 * @param {String} type 接收人类型：single|group，分别表示：群聊|单聊
 * @param {String} receiver 接收人
 * @param {String} sender 发送人
 * @param {String} media_id 消息内容
 */
exports.sendVoiceKF = async function(sender, receiver, media_id) {
  const { accessToken }  = await this.ensureAccessToken();
  const url = this.prefix + 'kf/send?access_token=' + accessToken;
  const data = {
  	sender: sender,
  	receiver: receiver,
  	msgtype: "voice",
  	voice: {
  		media_id: media_id
  	}
  };
  return this.request(url, postJSON(data));
};

/**
 * 获取客服列表
 *
 * Examples:
 * ```
 * const result = await api.listKF(type);
 * ```
 * @param {String} type 客服类型 1.internal 只获取内部客服列表; 2.external 只获取外部客服列表; 不填时，同时返回内部、外部客服列表
 */
exports.listKF = async function(type) {
  const { accessToken }  = await this.ensureAccessToken();
  let url = this.prefix + 'kf/list?access_token=' + accessToken;
  if (type) {
  	url += '&type=' + type;
  }
  const opts = {dataType: 'json'};
  return this.request(url, opts);
};