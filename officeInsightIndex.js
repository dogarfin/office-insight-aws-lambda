var http = require('http');

// Replace with Microsoft Azure account where wrapper is located
var PRODUCTION_HOST_AVAILABILITY = 'localhost';
var PRODUCTION_HOST_PORT = '8080';
var MEETING_ROOM_AVAILABILITY = '/rest/meetingRoom/availability/FIFTY_ONE';
var MEETING_ROOM_AVAILABILITY_TIME = '?startTime=';
var MEETING_ROOM_ASSISTANCE = '/rest/meetingRoom/assistance';
var MEETING_ROOM_BOOK = '/rest/meetingRoom/book/';

var directions = {
  "Fifty_Three": {
    "Alpha": "northwest corner",
    "Beta": "north side",
    "Charlie": "north side",
    "Delta": "north side",
    "Echo": "northeast corner",
    "Foxtrot": "east side",
    "Golf": "east side",
    "Hotel": "east side",
    "India": "east side",
    "Juliette": "east side",
    "Kilo": "west side"
  },
  "Fifty_One": {
    "Lima": "northwest corner",
    "Mike": "northwest corner",
    "November": "northeast corner",
    "Oscar": "northeast corner",
    "Papa": "east side",
    "Quebec": "east side",
    "Romeo": "east side",
    "Sierra": "south side",
    "Tango": "north edge of the west side"
  }
};

exports.handler = function (event, context) {
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
    context.fail("Exception: " + e);
  }
};

function onIntent(intentRequest, session, context) {
  console.log("onIntent requestId=" + intentRequest.requestId + ", sessionId=" + session.sessionId);

  var intent = intentRequest.intent,
    intentName = intentRequest.intent.name;

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
}

function handleRoomsIntentBookRequest(intent, context) {
  console.log(intent);
  var sourceBook = MEETING_ROOM_BOOK + intent.slots.Room.value + "/" + intent.slots.Name.value + MEETING_ROOM_AVAILABILITY_TIME + intent.slots.Time.value;

  http.request(createRequest('POST', sourceBook), function (response) {
    response.on('data', function () {
      createResponse(null, "I have sent the booking request for " + intent.slots.Name.value + " for the room " + intent.slots.Room.value + " at " + intent.slots.Time.value, null, context);
    });
  }).end();
}

function handleRoomIntentAssistanceRequest(context) {
  http.request(createRequest('POST', MEETING_ROOM_ASSISTANCE), function () {
    createResponse(null, "I've sent along your request for assistance.  Someone will arrive shortly.", context);
  }).end();
}

function handleExitIntentRequest() {
  createResponse("Thanks for using Office Insights. Goodbye!");
}

function handleRoomIntentTimeRequest(intent, context) {
  var time = intent.slots.Time.value;
  http.request(createRequest('GET', MEETING_ROOM_AVAILABILITY + MEETING_ROOM_AVAILABILITY_TIME + time), function (response) {
    response.on('data', function (data) {
      createResponse("Ask about open rooms", "The meeting rooms open at " + time + " are " + data + ".", context);
    });
  }).end();
}

function handleRoomIntentDirectionRequest(intent, context) {
  var requestedRoom = intent.slots.MeetingRoom.value;
  return getMeetingRoom(requestedRoom, context);
}

function getMeetingRoom(room, context) {
  if (directions.Fifty_Three.hasOwnProperty(room)) {
    createResponse(null, room + " is located on the " + directions.Fifty_Three[room] + " of the Fifty Third Floor", context);
  } else if (directions.Fifty_One.hasOwnProperty(room)) {
    createResponse(null, room + " is located on the " + directions.Fifty_One[room] + " of the Fifty First floor", context);
  }
}

function handleRoomIntentNowRequest(context) {
  http.request(createRequest('GET', MEETING_ROOM_AVAILABILITY), function (response) {
    response.on('data', function (data) {
      createResponse("Ask about open rooms", "The current open meeting rooms are " + data + ".", context);
    });
  }).end();
}

function onLaunch(launchRequest, session, context) {
  console.log("onLaunch requestId=" + launchRequest.requestId
    + ", sessionId=" + session.sessionId);
  getEwsWrapperInfo(context);
}

function onSessionStarted(sessionStartedRequest, session) {
  console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId
    + ", sessionId=" + session.sessionId);
}

function onSessionEnded(sessionEndedRequest, session) {
  console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId
    + ", sessionId=" + session.sessionId);
}

function getEwsWrapperInfo(context) {
  return createResponse(null, "Welcome to Office Insights! Ask me about meeting rooms.", context);
}

function buildSpeechletResponse(output, repromptText, shouldEndSession) {
  return {
    outputSpeech: {
      type: "PlainText",
      text: output
    },
    reprompt: {
      outputSpeech: {
        type: "PlainText",
        text: repromptText
      }
    },
    shouldEndSession: shouldEndSession
  };
}

function buildResponse(sessionAttributes, speechletResponse) {
  return {
    version: "1.0",
    sessionAttributes: sessionAttributes,
    response: speechletResponse
  };
}

function createRequest(methodType, path) {
  return {
    host: PRODUCTION_HOST_AVAILABILITY,
    port: PRODUCTION_HOST_PORT,
    path: path,
    method: methodType
  };
}

function createResponse(responseData, text, context) {
  var sessionAttributes = {};
  if (responseData) {
    sessionAttributes = {
      "speechOutput": responseData,
      "repromptText": responseData
    };
  }
  context.succeed(buildResponse(sessionAttributes, buildSpeechletResponse(text, null, false)));
}