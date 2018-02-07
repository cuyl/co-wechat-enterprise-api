Wechat Enterprise API(ES6版)
============================
微信企业号API。

## 模块状态
[![npm version](https://badge.fury.io/js/%40cuyl%2Fwechat-enterprise-api.svg)](https://badge.fury.io/js/%40cuyl%2Fwechat-enterprise-api)
[![Build Status](https://travis-ci.org/node-webot/co-wechat-enterprise-api.png?branch=master)](https://travis-ci.org/node-webot/co-wechat-enterprise-api)
[![David deps][david-image]][david-url]
[![Coverage Status](https://coveralls.io/repos/node-webot/co-wechat-enterprise-api/badge.png)](https://coveralls.io/r/node-webot/co-wechat-enterprise-api)

[david-image]: https://img.shields.io/david/cuyl/co-wechat-enterprise-api.svg?style=flat-square
[david-url]: https://david-dm.org/curl/co-wechat-enterprise-api

## 功能列表
- 主动消息
- 菜单操作
- 部门管理
- 用户管理
- 标签管理
- 媒体文件
- OAuth API（授权、获取基本信息）
- JS SDK 授权
- 管理企业号应用
- 通讯录批量操作接口
- 永久素材管理接口
- 企业号摇一摇周边接口


详细参见[API文档](http://doxmate.cool/node-webot/co-wechat-enterprise-api/api.html)

微信企业号官方文档(http://qydev.weixin.qq.com/wiki/index.php)

订阅号和服务号版本请前往：<https://github.com/node-webot/co-wechat-api>

## Installation

```sh
$ npm install co-wechat-enterprise-api
```

## Usage

```js
const API = require('co-wechat-enterprise-api');

const api = new API(corpid, corpsecret);
const result = await api.updateRemark('open_id', 'remarked');
```

### 多进程
当多进程时，token需要全局维护，以下为保存token的接口。
```js
const api = new API('corpid', 'corpsecret', async function() {
  // 传入一个获取全局token的方法
  const txt = await fs.readFile('access_token.txt', 'utf8');
  return JSON.parse(txt);
}, async function(token) {
  // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
  // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
  await fs.writeFile('access_token.txt', JSON.stringify(token));
});
```

## 内网节点如何通过代理访问
### 通过代理服务器访问

#### 场景

对于大规模的集群部署模式，为了安全和速度，会有一些负载均衡的节点放在内网的服务器上（即负载均衡的节点与主结点通过内网连接，并且内网服务器上没有外网的IP）。这时，就需要配置代理服务器来使内网的机器可以有限度的访问外网的资源。例如：微信套件中的各种主动调用接口。

如何架设代理服务器在这里不做赘述，一般推荐使用squid 3，免费、快速、配置简单。

#### 技术原理

由于需要访问的微信API服务器是https协议，所以普通的http代理模式不能使用。
而一般都是http协议的代理服务器。
我们要实现的就是通过http代理通道来走https的请求。

基本的步骤是2步：

- 连接到代理服务器，发送CONNECT命令，打开一个TCP连接。
- 使用上一步打开的TCP连接，发送https的请求。

#### 实现步骤

一、下载[node-tunnel](https://github.com/koichik/node-tunnel) 注意：npm上的版本较老，不支持node v0.10以上的版本。

二、使用 httpsOverHttp 这个agent。

三、将agent配置给httpx。

```js
const tunnel = require('tunnel');

const agent = tunnel.httpsOverHttp({
  proxy: {
    host: 'proxy_host_ip', // 代理服务器的IP
    port: 3128 // 代理服务器的端口
  }
});

api.setOpts({
   agent: agent
});

```

## License
The MIT license.
