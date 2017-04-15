'use strict';

const path = require('path');
const fs = require('co-fs');
const formstream = require('formstream');
const { postJSON } = require('./util');

/**
 * 上传多媒体文件，分别有图片（image）、语音（voice）、视频（video）和普通文件（file）
 * 详情请见：<http://qydev.weixin.qq.com/wiki/index.php?title=上传媒体文件>
 * Examples:
 * ```
 * api.uploadMedia('filepath', type);
 * ```
 * Result:
 * ```
 * {"type":"image","media_id":"0000001","created_at":123456789}
 * ```
 * Shortcut:
 *
 * - `exports.uploadImage(filepath);`
 * - `exports.uploadVoice(filepath);`
 * - `exports.uploadVideo(filepath);`
 * - `exports.uploadFile(filepath);`
 *
 * @param {String} filepath 文件路径
 * @param {String} type 媒体类型，可用值有image、voice、video、file
 */
exports.uploadMedia = async function(filepath, type) {
  const { accessToken }  = await this.ensureAccessToken();
  const stat = await fs.stat(filepath);

  const form = formstream();
  form.file('media', filepath, path.basename(filepath), stat.size);
  const url = this.prefix + 'media/upload?access_token=' + accessToken + '&type=' + type;
  const opts = {
    dataType: 'json',
    type: 'POST',
    timeout: 60000, // 60秒超时
    headers: form.headers(),
    data: form
  };
  return this.request(url, opts);
};

exports.uploadImage = async function(filepath) {
  return this.uploadMedia(filepath, 'image');
};
exports.uploadVoice = async function(filepath) {
  return this.uploadMedia(filepath, 'voice');
};
exports.uploadVideo = async function(filepath) {
  return this.uploadMedia(filepath, 'video');
};
exports.uploadFile = async function(filepath) {
  return this.uploadMedia(filepath, 'file');
};


/**
 * 根据媒体ID获取媒体内容
 * 详情请见：<http://qydev.weixin.qq.com/wiki/index.php?title=获取媒体文件>
 * Examples:
 * ```
 * const ret = await api.getMedia(mediaId);
 * ```
 * - `result`, 调用正常时得到的文件Buffer对象
 *
 * @param {String} mediaId 媒体文件的ID
 */
exports.getMedia = async function(mediaId) {
  const { accessToken }  = await this.ensureAccessToken();
  const url = this.prefix + 'media/get?access_token=' + accessToken + '&media_id=' + mediaId;
  const opts = {
    timeout: 60000 // 60秒超时
  };
  return this.request(url, opts);
};
