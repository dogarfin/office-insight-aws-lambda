var PRODUCTION_HOST_AVAILABILITY = 'localhost';
var PRODUCTION_HOST_PORT = '8080';

const createRequest = (methodType, path) => ({
  host: PRODUCTION_HOST_AVAILABILITY,
  port: PRODUCTION_HOST_PORT,
  path: path,
  method: methodType
});

export default createRequest;
