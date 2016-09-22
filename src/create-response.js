const buildResponse = (sessionAttributes, speechletResponse) => ({
  version: '1.0',
  sessionAttributes: sessionAttributes,
  response: speechletResponse
});

const buildSpeechletResponse = (output, repromptText, shouldEndSession) => ({
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
});

const createResponse = (responseData, text, context) => {
  const sessionAttributes = responseData ? {
    speechOutput: responseData,
    repromptText: responseData
  } : {};

  context.succeed(buildResponse(sessionAttributes, buildSpeechletResponse(text, null, false)));
};

export default createResponse;
