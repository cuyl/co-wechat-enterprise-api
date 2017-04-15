'use strict';

const { postJSON } = require('./util');

/**
 * 创建自定义菜单
 * 详细请看：<http://qydev.weixin.qq.com/wiki/index.php?title=创建应用菜单>
 *
 * Menu:
 * ```
 * {
 *  "button":[
 *    {
 *      "type":"click",
 *      "name":"今日歌曲",
 *      "key":"V1001_TODAY_MUSIC"
 *    },
 *    {
 *      "name":"菜单",
 *      "sub_button":[
 *        {
 *          "type":"view",
 *          "name":"搜索",
 *          "url":"http://www.soso.com/"
 *        },
 *        {
 *          "type":"click",
 *          "name":"赞一下我们",
 *          "key":"V1001_GOOD"
 *        }]
 *      }]
 *    }
 *  ]
 * }
 * ```
 * Examples:
 * ```
 * const result = await api.createMenu(agentid, menu);
 * ```
 *
 * Result:
 * ```
 * {"errcode":0,"errmsg":"ok"}
 * ```
 * @param {String} agentid APP
 * @param {Object} menu 菜单对象
 */
exports.createMenu = async function(agentid, menu) {
  const { accessToken }  = await this.ensureAccessToken();
  const url = this.prefix + 'menu/create?access_token=' + accessToken + '&agentid=' + agentid;
  return this.request(url, postJSON(menu));
};

/**
 * 获取菜单
 * 详细请看：<http://qydev.weixin.qq.com/wiki/index.php?title=获取菜单列表>
 *
 * Examples:
 * ```
 * const result = await api.getMenu(agentid);
 * ```
 *
 * Result:
 * ```
 * // 结果示例
 * {
 *  "menu": {
 *    "button":[
 *      {"type":"click","name":"今日歌曲","key":"V1001_TODAY_MUSIC","sub_button":[]},
 *      {"type":"click","name":"歌手简介","key":"V1001_TODAY_SINGER","sub_button":[]},
 *      {"name":"菜单","sub_button":[
 *        {"type":"view","name":"搜索","url":"http://www.soso.com/","sub_button":[]},
 *        {"type":"view","name":"视频","url":"http://v.qq.com/","sub_button":[]},
 *        {"type":"click","name":"赞一下我们","key":"V1001_GOOD","sub_button":[]}]
 *      }
 *    ]
 *  }
 * }
 * ```
 * @param {String} agentid APP
 */
exports.getMenu = async function(agentid) {
  const { accessToken }  = await this.ensureAccessToken();
  const url = this.prefix + 'menu/get?access_token=' + accessToken + '&agentid=' + agentid;
  const opts = {dataType: 'json'};
  return this.request(url, opts);
};

/**
 * 删除自定义菜单
 * 详细请看：<http://mp.weixin.qq.com/wiki/index.php?title=自定义菜单删除接口>
 * Examples:
 * ```
 * const result = await api.removeMenu(agentid);
 * ```
 *
 * Result:
 * ```
 * {"errcode":0,"errmsg":"ok"}
 * ```
 * @param {String} agentid 回调函数
 */
exports.removeMenu = async function(agentid) {
  const { accessToken }  = await this.ensureAccessToken();
  const url = this.prefix + 'menu/delete?access_token=' + accessToken + '&agentid=' + agentid;
  const opts = {dataType: 'json'};
  return this.request(url, opts);
};