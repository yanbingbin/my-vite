const { Readable } = require('stream');

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

exports.readBody = readBody;