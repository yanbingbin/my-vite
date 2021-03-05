const Koa = require('koa');
const { serveStaticPlugin } = require('./plugins/servePluginServeStatic');

function createServer() {
    const app = new Koa();
    const root = process.cwd();
    const context = {
        app,
        root // 根位置
    };
    const resolvePlugins = [ // 插件集合
        serveStaticPlugin // 静态服务
    ];
    resolvePlugins.forEach(plugin => plugin(context));

    return app; 
}

module.exports = createServer;