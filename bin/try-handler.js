var handlerModule = require("../dist/bundle.js");

var fakeLambdaContext = {
  succeed(results) {
    console.log(results);
    process.exit(0);
  },
  fail(results) {
    console.log(results);
    process.exit(1);
  }
};

console.log(handlerModule);

handlerModule.handler({}, fakeLambdaContext);
