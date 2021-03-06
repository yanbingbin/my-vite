const { Readable } = require('stream');
const path = require('path');

async function readBody(stream) {
    if (stream instanceof Readable) { // 只处理流文件
        return new Promise((resolve, reject) => {
            let res = '';
            stream.on('data', data => {
                res += data;
            });
            stream.on('end', () => {
                resolve(res); // 内容解析完成
            });
        });
    } else {
        return stream.toString();
    }
}


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

exports.readBody = readBody;
exports.resolveVue = resolveVue;