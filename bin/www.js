#!/usr/bin/env node
// 使用node环境运行,使用 npm link 把这个包链接到全局

// 通过 http 启动一个模块，基于 koa
const createServer = require('../index');

// 创建一个 koa 服务

createServer().listen(4000, () => {
    console.log('server start 4000 port', 'http://localhost:4000/')
});