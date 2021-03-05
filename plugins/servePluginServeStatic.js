const static = require('koa-static');
const path = require('path');

function serveStaticPlugin({ app, root }) {

    app.use(static(root)); // 以 vite 的运行目录作为启动目录
    app.use(static(path.join(root, 'public')));
}

exports.serveStaticPlugin = serveStaticPlugin;