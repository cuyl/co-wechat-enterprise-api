'use strict';

const { postJSON, wx_emotion } = require('./util');

/**
 * 创建会话
 * 详细请看：http://qydev.weixin.qq.com/wiki/index.php?title=%E4%BC%81%E4%B8%9A%E4%BC%9A%E8%AF%9D%E6%8E%A5%E5%8F%A3%E8%AF%B4%E6%98%8E
 *
 * Examples:
 * ```
 * const result = await api.createChat(chatid, name, owner, userlist);
 * ```
 * @param {String} chatid 会话id。字符串类型，最长32个字符。只允许字符0-9及字母a-zA-Z, 如果值内容为64bit无符号整型：要求值范围在[1, 2^63)之间，[2^63, 2^64)为系统分配会话id区间
 * @param {String} name 会话标题
 * @param {String} owner 管理员userid，必须是该会话userlist的成员之一
 * @param {Array} userlist 会话成员列表，成员用userid来标识。会话成员必须在3人或以上，1000人以下
 */
exports.createChat = async function(chatid, name, owner, userlist) {
  const { accessToken } = await this.ensureAccessToken();
  const url = this.prefix + 'chat/create?access_token=' + accessToken;
  const data = {
  	chatid: chatid,
  	name: name,
  	owner: owner,
  	userlist: userlist,
  };
  return this.request(url, postJSON(data));
};

/**
 * 获取会话
 *
 * Examples:
 * ```
 * let result = await api.getChat(chatid);
 * ```
 * @param {Number} chatid 成员ID
 */
exports.getChat = async function(chatid) {
  const { accessToken } = await this.ensureAccessToken();
  const url = this.prefix + 'chat/get?access_token=' + accessToken + '&chatid=' + chatid;
  const opts = {dataType: 'json'};
  return this.request(url, opts);
};

/**
 * 更新会话
 *
 * Examples:
 * ```
 * const result = await api.updateChat(chatid, op_user, name, owner, add_user_list, del_user_list);
 * ```
 * @param {Number} chatid 成员ID
 */
exports.updateChat = async function(chatid, op_user, name, owner, add_user_list, del_user_list) {
  const { accessToken } = await this.ensureAccessToken();
  const url = this.prefix + 'chat/update?access_token=' + accessToken;
  const data = {
  	chatid: chatid,
  	op_user: op_user
  };
  if (name) {
  	data.name = name;
  }
  if (add_user_list && add_user_list.length) {
  	data.add_user_list = add_user_list;
  }
  if (del_user_list && del_user_list.length) {
  	data.del_user_list = del_user_list;
  }
  return this.request(url, postJSON(data));
};

/**
 * 退出会话
 *
 * Examples:
 * ```
 * const result = await api.quitChat(chatid, op_user);
 * ```
 * @param {Number} chatid 成员ID
 */
exports.quitChat = async function(chatid, op_user) {
  const { accessToken } = await this.ensureAccessToken();
  const url = this.prefix + 'chat/quit?access_token=' + accessToken;
  const data = {
  	chatid: chatid,
  	op_user: op_user
  };
  return this.request(url, postJSON(data));
};

/**
 * 清除会话未读状态
 *
 * Examples:
 * ```
 * const result = await api.clearnotifyChat(op_user, chat);
 * ```
 * @param {Number} chatid 成员ID
 */
exports.clearnotifyChat = async function(op_user, chat) {
  const { accessToken } = await this.ensureAccessToken();
  const url = this.prefix + 'chat/clearnotify?access_token=' + accessToken;
  const data = {
  	chat: chat,
  	op_user: op_user
  };
  return this.request(url, postJSON(data));
};

/**
 * 发送消息（文本）
 *
 * Examples:
 * ```
 * const result = await api.sendTextChat(type, receiver, sender, text);
 * ```
 * @param {String} type 接收人类型：single|group，分别表示：群聊|单聊
 * @param {String} receiver 接收人
 * @param {String} sender 发送人
 * @param {String} text 消息内容
 */
exports.sendTextChat = async function(type, receiver, sender, text) {
  const { accessToken } = await this.ensureAccessToken();
  const url = this.prefix + 'chat/send?access_token=' + accessToken;
  const data = {
  	receiver: {
  		type: type,
  		id: receiver
  	},
  	sender: sender,
  	msgtype: "text",
  	text: {
  		content: text
  	}
  };
  return this.request(url, postJSON(data));
};

/**
 * 发送消息（图片）
 *
 * Examples:
 * ```
 * const result = await api.sendImageChat(type, receiver, sender, media_id);
 * ```
 * @param {String} type 接收人类型：single|group，分别表示：群聊|单聊
 * @param {String} receiver 接收人
 * @param {String} sender 发送人
 * @param {String} media_id 消息内容
 */
exports.sendImageChat = async function(type, receiver, sender, media_id) {
  const { accessToken } = await this.ensureAccessToken();
  const url = this.prefix + 'chat/send?access_token=' + accessToken;
  const data = {
  	receiver: {
  		type: type,
  		id: receiver
  	},
  	sender: sender,
  	msgtype: "image",
  	image: {
  		media_id: media_id
  	}
  };
  return this.request(url, postJSON(data));
};

/**
 * 发送消息（文件）
 *
 * Examples:
 * ```
 * const result = await api.sendFileChat(type, receiver, sender, media_id);
 * ```
 * @param {String} type 接收人类型：single|group，分别表示：群聊|单聊
 * @param {String} receiver 接收人
 * @param {String} sender 发送人
 * @param {String} media_id 消息内容
 */
exports.sendFileChat = async function(type, receiver, sender, media_id) {
  const { accessToken } = await this.ensureAccessToken();
  const url = this.prefix + 'chat/send?access_token=' + accessToken;
  const data = {
  	receiver: {
  		type: type,
  		id: receiver
  	},
  	sender: sender,
  	msgtype: "file",
  	file: {
  		media_id: media_id
  	}
  };
  return this.request(url, postJSON(data));
};

/**
 * 发送消息（语音）
 *
 * Examples:
 * ```
 * const result = await api.sendVoiceChat(type, receiver, sender, media_id);
 * ```
 * @param {String} type 接收人类型：single|group，分别表示：群聊|单聊
 * @param {String} receiver 接收人
 * @param {String} sender 发送人
 * @param {String} media_id 消息内容
 */
exports.sendVoiceChat = async function(type, receiver, sender, media_id) {
  const { accessToken }= await this.ensureAccessToken();
  const url = this.prefix + 'chat/send?access_token=' + accessToken;
  const data = {
  	receiver: {
  		type: type,
  		id: receiver
  	},
  	sender: sender,
  	msgtype: "voice",
  	voice: {
  		media_id: media_id
  	}
  };
  return this.request(url, postJSON(data));
};

/**
 * 设置成员新消息免打扰
 *
 * Examples:
 * ```
 * const result = await api.setmuteChat(user_mute_list);
 * ```
 * @param {Array} user_mute_list 成员新消息免打扰参数，数组，最大支持10000个成员
 */
exports.setmuteChat = async function(user_mute_list) {
  const { accessToken }= await this.ensureAccessToken();
  const url = this.prefix + 'chat/setmute?access_token=' + accessToken;
  const data = {
  	user_mute_list: user_mute_list,
  };
  return this.request(url, postJSON(data));
};

exports.wx_emotion = wx_emotion;
