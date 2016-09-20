import http from 'http';

import directions from './directions';
import createResponse from './create-response';

var GTFO_HOST = 'acheron.herokuapp.com';
var GTFO_PORT = '80';
var GTFO_PING = '/api/ping';
var GTFO_MAP_ANCHOR = 'west-lobby';

const createGTFORequest = (methodType, path, headers) => ({
  host: GTFO_HOST,
  port: GTFO_PORT,
  path: path,
  method: methodType,
  headers: headers
});

const getMeetingRoom = (room, context) => {
  var headers = {
    'id' : room.toLowerCase(),
    'anchor' : GTFO_MAP_ANCHOR
  };
  http.request(createGTFORequest('POST', GTFO_PING, headers), function (response) {
    response.on('data', function () {
      var response = room + " is located on the ";
      if (directions.Fifty_Three.hasOwnProperty(room)) {
        response += directions.Fifty_Three[room.toLowerCase()] + " of the Fifty Third floor.";
      } else if (directions.Fifty_One.hasOwnProperty(room)) {
        response += directions.Fifty_One[room.toLowerCase()] + " of the Fifty First floor.";
      }

      if (GTFO_MAP_ANCHOR) {
        response += " I've highlighted its location on the map for you.";
      }
      createResponse(null, response, context);
    });
  }).end();
};

export default getMeetingRoom;
