const { readBody } = require('./utils');

function htmlRewritePlugin({ app, root }) {
    const inject = `
        <script>
            window.process = {};
            window.process.env = {
            "NODE_ENV": 'development'
            }
        </script>
    `;
    app.use(async (ctx, next) => {
        await next();
        if (ctx.response.is('html')) {
            const html = await readBody(ctx.body);
            ctx.body = html.replace(/<head>/, `$&${inject}`); // $&: 原有的匹配
            
        }
    });
}

exports.htmlRewritePlugin = htmlRewritePlugin;