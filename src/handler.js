import http from 'http';

import directions from './directions';
import createRequest from './create-request';
import createResponse from './create-response';
import {
  MEETING_ROOM_AVAILABILITY,
  MEETING_ROOM_AVAILABILITY_TIME,
  MEETING_ROOM_ASSISTANCE,
  MEETING_ROOM_BOOK,
  GTFO_HOST,
  GTFO_PORT,
  GTFO_PING,
  GTFO_MAP_ANCHOR,
  GTFO_ID
} from './config';

export const handler = (event, context) => {
  try {
    if (event.session && event.session.new) {
      onSessionStarted({requestId: event.request.requestId}, event.session);
    }
    if (event.request.type === "LaunchRequest") {
      onLaunch(event.request, event.session, context);
    } else if (event.request.type === "IntentRequest") {
      onIntent(event.request, event.session, context);
    } else if (event.request.type === "SessionEndedRequest") {
      onSessionEnded(event.request, event.session);
      context.succeed();
    }
  } catch (e) {
    context.fail(`Exception: ${e}`);
  }
};

const onIntent = (intentRequest, session, context) => {
  console.log(`onIntent requestId=${intentRequest.requestId}, sessionId=${session.sessionId}`);

  const { intent } = intentRequest;
  const intentName = intent.name;

  // dispatch custom intents to handlers here
  if ("RoomsIntentNow" === intentName) {
    handleRoomIntentNowRequest(context);
  } else if ("RoomsIntentTime" === intentName) {
    handleRoomIntentTimeRequest(intent, context);
  } else if ("RoomsIntentDirection" === intentName) {
    handleRoomIntentDirectionRequest(intent, context);
  } else if ("RoomsIntentAssistance" === intentName) {
    handleRoomIntentAssistanceRequest(context);
  } else if ("RoomsIntentBook" === intentName) {
    handleRoomsIntentBookRequest(intent, session, context);
  } else if ("ExitIntent" === intentName) {
    handleExitIntentRequest(context);
  } else {
    throw "Invalid intent";
  }
};

const handleRoomsIntentBookRequest = (intent, context) => {
  console.log(intent)
  const { Room, Name, Time } = intent.slots;
  const sourceBook = `${MEETING_ROOM_BOOK}${Room.value}/${Name.value}${MEETING_ROOM_AVAILABILITY_TIME}${Time.value}`;

  http.request(createRequest('POST', sourceBook), (response) => {
    response.on('data', () => {
      createResponse(null, `I have sent the booking request for ${Name.value} for the room ${Room.value} at ${Time.value}`, null, context);
    });
  }).end();
};

const handleRoomIntentAssistanceRequest = (context) => {
  http.request(createRequest('POST', MEETING_ROOM_ASSISTANCE), () => {
    createResponse(null, 'I\'ve sent along your request for assistance. Someone will arrive shortly.', context);
  }).end();
};

const handleExitIntentRequest = () => {
  createResponse("Thanks for using Office Insights. Goodbye!");
};

const handleRoomIntentTimeRequest = (intent, context) => {
  const { Time } = intent.slots;
  http.request(createRequest('GET', `${MEETING_ROOM_AVAILABILITY}${MEETING_ROOM_AVAILABILITY_TIME}${Time.value}`), (response) => {
    response.on('data', (data) => {
      createResponse('Ask about open rooms', `The meeting rooms open at ${Time.value} are ${data}.`, context);
    });
  }).end();
};

const handleRoomIntentDirectionRequest = ({ slots }, context) => getMeetingRoom(slots.MeetingRoom.value, context);

const getMeetingRoom = (room, context) => {
  const headers = {
    targetId: room.toLowerCase(),
    anchor: GTFO_MAP_ANCHOR,
    id: GTFO_ID
  };

  http.request(createGTFORequest('POST', GTFO_PING, headers), (response) => {
    response.on('data', () => {
      var response = room + " is located on the ";
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
  }).end();
};

const handleRoomIntentNowRequest = (context) => {
  http.request(createRequest('GET', MEETING_ROOM_AVAILABILITY), (response) => {
    response.on('data', (data) => {
      createResponse('Ask about open rooms', `The current open meeting rooms are ${data}.`, context);
    });
  }).end();
};

const onLaunch = (launchRequest, session, context) => {
  console.log(`onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}`);
  getEwsWrapperInfo(context);
};

const onSessionStarted = (sessionStartedRequest, session) => {
  console.log(`onSessionStarted requestId=${sessionStartedRequest.requestId}, sessionId=${session.sessionId}`);
};

const onSessionEnded = (sessionEndedRequest, session) => {
  console.log(`onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}`);
};

const getEwsWrapperInfo = (context) => createResponse(null, 'Welcome to Office Insights! Ask me about meeting rooms.', context);

const createGTFORequest = (methodType, path, headers) => ({
  host: GTFO_HOST,
  port: GTFO_PORT,
  path: path,
  method: methodType,
  headers: headers
});
