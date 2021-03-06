const fs = require('fs').promises;
const path = require('path');
const moduleReg = /^\/@modules\//;


function resolveVue(root) {
    const complierPkgPath = path.join(root, 'node_modules', '@vue/compiler-sfc/package.json');
    const complierPkg = require(complierPkgPath); // 获取 package.json 内容
    const compilerPath = path.join(path.dirname(complierPkgPath), complierPkg.main); // 拿到的是 commonjs 规范的， dirname 当前路径父路径:node_modules/@vue/compiler-sfc  main：dist/compiler-sfc.cjs.js

    const resolvePath = name => path.resolve(root, 'node_modules', `@vue/${name}/dist/${name}.esm-bundler.js`); 

    const runtimeDomPath = resolvePath('runtime-dom');
    const runtimeCorePath = resolvePath('runtime-core');
    const reactivityPath = resolvePath('reactivity');
    const sharedPath = resolvePath('shared');

    return {
        compiler: compilerPath, // 用于后端进行编译的文件路径 node_modules/@vue/compiler-sfc/dist/compiler-sfc.cjs.js
        '@vue/runtime-dom': runtimeDomPath,
        '@vue/runtime-core': runtimeCorePath,
        '@vue/reactivity': reactivityPath,
        '@vue/shared': sharedPath,
        vue: runtimeDomPath
    };
}

function moduleResolvePlugin({ app, root }) {
    const vueResolved = resolveVue(root); // 根据当前运行 vite 的目录解析出 vue 的文件表，包含 vue3 的所有模块
    console.log('vueResolved: ', vueResolved);
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