# Office Insight AWS Lambda
Contains the aws lambda function file -> officeInsightIndex.js

Interaction Model contains:
 - intents.json -> Intents file to be added to the alexa skill
 - RoomListSlot -> The list of meeting room names that alexa will search through
 - SampleUtterances -> The utterance list for the alexa skill

## Getting Started
Move the contents of the files to:
 - AWS Lambda
 - Alexa Skills kit

Replace the PRODUCTION_HOST_AVAILABILITY in the officeInsightIndex file with the location of the service.

# Deployment
Run `npm run build` and copy the contents `dist/bundle.js` into the lambda.

If the size is too large to copy, run `npm run zip` and upload `dist/lambda.zip`.
