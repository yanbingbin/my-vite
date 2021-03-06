const Koa = require('koa');
const { serveStaticPlugin } = require('./plugins/servePluginServeStatic');
const { moduleRewritePlugin } = require('./plugins/serverPluginModuleRewrite');
const { moduleResolvePlugin } = require('./plugins/serverPluginModuleResolve');
const { htmlRewritePlugin } = require('./plugins/servePluginHtml');
const { vuePlugin } = require('./plugins/serverPluginVue');

function createServer() {
    const app = new Koa();
    const root = process.cwd();
    const context = {
        app,
        root // 根位置
    };
    const resolvePlugins = [ // 插件集合
        htmlRewritePlugin, // 注入脚本，添加 process 
        moduleRewritePlugin, // 解析 import 语句, 重写路径,增加 @modules
        moduleResolvePlugin, // 解析以 @modules 开头的内容，找到对应的结果
        vuePlugin, // Vue 文件解析
        serveStaticPlugin // 静态服务
    ];
    resolvePlugins.forEach(plugin => plugin(context));

    return app; 
}

module.exports = createServer;