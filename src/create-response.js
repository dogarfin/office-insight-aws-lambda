function buildResponse(sessionAttributes, speechletResponse) {
  return {
    version: '1.0',
    sessionAttributes: sessionAttributes,
    response: speechletResponse
  };
}

function buildSpeechletResponse(output, repromptText, shouldEndSession) {
  return {
    outputSpeech: {
      type: 'PlainText',
      text: output
    },
    reprompt: {
      outputSpeech: {
        type: 'PlainText',
        text: repromptText
      }
    },
    shouldEndSession: shouldEndSession
  };
}

function createResponse(responseData, text, context) {
  var sessionAttributes = {};
  if (responseData) {
    sessionAttributes = {
      speechOutput: responseData,
      repromptText: responseData
    };
  }
  context.succeed(buildResponse(sessionAttributes, buildSpeechletResponse(text, null, false)));
}

export default createResponse;
