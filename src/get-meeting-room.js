import http from 'http';

import directions from './directions';
import createResponse from './create-response';

import {
  GTFO_HOST, GTFO_PORT, GTFO_PING, GTFO_MAP_ANCHOR, GTFO_ID, NEW_ROOM_PING,
} from './config';

const getMeetingRoom = (room, context) => {
  const headers = {
    targetId: room.toLowerCase(),
    id: GTFO_ID,
    event: NEW_ROOM_PING,
    anchor: GTFO_MAP_ANCHOR,
  };

  https
    .request(createGTFORequest('POST', GTFO_PING, headers), (response) => {
      response.on('data', () => {
        let response = `${room} is located on the `;
        if (directions.Fifty_Three.hasOwnProperty(room)) {
          response += `${directions.Fifty_Three[room.toLowerCase()]} of the Fifty Third floor.`;
        } else if (directions.Fifty_One.hasOwnProperty(room)) {
          response += `${directions.Fifty_One[room.toLowerCase()]} of the Fifty First floor.`;
        }

        if (GTFO_MAP_ANCHOR) {
          response += ' I\'ve highlighted its location on the map for you.';
        }
        createResponse(null, response, context);
      });
    })
    .end();
};

export default getMeetingRoom;
