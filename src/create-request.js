import {
  PRODUCTION_HOST_AVAILABILITY,
  PRODUCTION_HOST_PORT
} from './config';

const createRequest = (methodType, path) => ({
  host: PRODUCTION_HOST_AVAILABILITY,
  port: PRODUCTION_HOST_PORT,
  path: path,
  method: methodType
});

export default createRequest;
