'use strict';
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const axios = require('axios');
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  function greeting(agent) {
      return axios.get(`https://rest-api-burroughs.herokuapp.com/api/greetings`)
      .then((result) => {
          agent.add(result.data);
        });
  }

  function getElevatorStatus(agent) {
      const id = agent.parameters.id;
      return axios.get(`https://rest-api-burroughs.herokuapp.com/api/elevators/${id}/status`)
        .then((result) => {
            agent.add(`The status of elevator ${id} is: ` + result.data);
        });
  }

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('greeting', greeting);
  intentMap.set('getElevatorStatus', getElevatorStatus);
  agent.handleRequest(intentMap);
});