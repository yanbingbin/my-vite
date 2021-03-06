const { readBody } = require('./utils');
const { parse } = require('es-module-lexer'); // 解析 import
const MagicString = require('magic-string');

function rewriteImports(source) {
    let imports = parse(source)[0];
    // parse(source):[
    //     [
    //       { n: 'vue', s: 27, e: 30, ss: 0, se: 31, d: -1 },
    //       { n: './App.vue', s: 49, e: 58, ss: 32, se: 59, d: -1 }
    //     ],
    //     [],
    //     false
    //   ]
    let magicString = new MagicString(source); // 重写
    if (imports.length) { // 说明有 import 语句
        for (let i = 0; i < imports.length; i++) {
            let { s, e, n } = imports[i];
            if (/^[^/.]/.test(n)) { // 当前开头不是 / 或者 . 的需要重写
                n = `/@modules/${n}`; // 添加 @modules
                magicString.overwrite(s, e, n);
            }
        }
    }
    return magicString.toString();
}

function moduleRewritePlugin({ app, root }) {
    app.use(async (ctx, next) => {
        await next();

        // 获取流中的数据
        if (ctx.body && ctx.response.is('js')) {
            let content = await readBody(ctx.body);
            const result = rewriteImports(content);
            ctx.body = result;
        }
        // 
    });
}

exports.moduleRewritePlugin = moduleRewritePlugin;