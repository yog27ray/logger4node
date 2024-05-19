const build = require('pino-abstract-transport');
const { pipeline, Transform } = require('stream');

module.exports = function (options) {
  return build(function (source) {
    const myTransportStream = new Transform({
      autoDestroy: true,
      objectMode: true,
      transform(chunk, enc, cb) {
        chunk.message = chunk.msg;
        delete chunk.msg;
        this.push(`${JSON.stringify(chunk)}\n`);
        cb();
      },
    });
    pipeline(source, myTransportStream, () => {});
    return myTransportStream;
  }, { enablePipelining: true });
}
