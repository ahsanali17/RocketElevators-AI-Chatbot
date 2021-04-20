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

// Function to call the full greeting API
function greeting(agent) {
    return axios.get(`https://rest-api-burroughs.herokuapp.com/api/greetings`)
    .then((result) => {
        agent.add(result.data);
    });
}

// Broken down calls of what is returned in the greeting
function elevatorCount(agent) {
    return axios.get(`https://rest-api-burroughs.herokuapp.com/api/elevators/count`)
    .then((result) => {
        agent.add('There are ' + result.data + ' elevators currently deployed.');
    });
}

function buildingCount(agent) {
    return axios.get(`https://rest-api-burroughs.herokuapp.com/api/buildings/count`)
    .then((result) => {
        agent.add('There are currently ' + result.data + ' buildings served by Rocket Elevators.');
    });
}

function customerCount(agent) {
    return axios.get(`https://rest-api-burroughs.herokuapp.com/api/customers/count`)
    .then((result) => {
        agent.add('Rocket Elevators currently serves ' + result.data + ' customers.');
    });
}

function batteryCount(agent) {
    return axios.get(`https://rest-api-burroughs.herokuapp.com/api/batteries/count`)
    .then((result) => {
        agent.add('There are currently ' + result.data + ' Rocket Elevators batteries in service.');
    });
}

function elevatorsNotRunning(agent) {
    return axios.get(`https://rest-api-burroughs.herokuapp.com/api/elevators/inactive-count`)
    .then((result) => {
        agent.add('There are currently ' + result.data + ' elevators not active.');
    });
}

function quoteCount(agent) {
    return axios.get(`https://rest-api-burroughs.herokuapp.com/api/quotes/count`)
    .then((result) => {
        agent.add('There are currently ' + result.data + ' quotes awaiting processing.');
    });
}

function leadCount(agent) {
    return axios.get(`https://rest-api-burroughs.herokuapp.com/api/leads/count`)
    .then((result) => {
        agent.add('There are currently ' + result.data + ' leads in the contact requests.');
    });
}

// Function to get the status of a specified elevator
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
intentMap.set('elevatorCount', elevatorCount);
intentMap.set('buildingCount', buildingCount);
intentMap.set('batteryCount', batteryCount);
intentMap.set('customerCount', customerCount);
intentMap.set('quoteCount', quoteCount);
intentMap.set('leadCount', leadCount);
intentMap.set('elevatorsNotRunning', elevatorsNotRunning);
agent.handleRequest(intentMap);
});