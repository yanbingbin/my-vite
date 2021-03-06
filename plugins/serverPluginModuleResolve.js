const fs = require('fs').promises;
const moduleReg = /^\/@modules\//;
const { resolveVue } = require('./utils');


function moduleResolvePlugin({ app, root }) {
    const vueResolved = resolveVue(root); // 根据当前运行 vite 的目录解析出 vue 的文件表，包含 vue3 的所有模块
    app.use(async (ctx, next) => {
        if (!moduleReg.test(ctx.path)) {
            return next();
        }
        // 处理以 @modules 开头的请求路径

        const id = ctx.path.replace(moduleReg, ''); // 路径去除 @modules 
        ctx.type = 'js'; // 设置响应类型
        const content = await fs.readFile(vueResolved[id], 'utf-8');
        ctx.body = content;
    });
}

exports.moduleResolvePlugin = moduleResolvePlugin;