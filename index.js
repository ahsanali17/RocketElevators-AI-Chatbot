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

// Function to get the info of a specified elevator
function getElevatorInfo(agent) {
    const id = agent.parameters.id;
    return axios.get(`https://rest-api-burroughs.herokuapp.com/api/elevators/${id}`)
    .then((result) => {
        var serial_number = result.data.serial_number;
        var model = result.data.model;
        var building_type = result.data.building_type;
        var status = result.data.status;
        var date_of_commissioning = result.data.date_of_commissioning;
        var date_of_last_inspection = result.data.date_of_last_inspection;
        var certificate_of_inspection = result.data.certificate_of_inspection;
        var information = result.data.information;
        var notes = result.data.notes;
        var created_at = result.data.updated_at;
        var updated_at = result.data.updated_at;
        var column_id = result.data.column_id;
        agent.add(`Elevator ${id}'s info:\n\
            Serial Number: ${serial_number}\n\
            Model: ${model}\n\
            Building Type: ${building_type}\n\
            Status: ${status}\n\
            Commission Date: ${date_of_commissioning}\n\
            Last Inspection: ${date_of_last_inspection}\n\
            Inspection Certificate: ${certificate_of_inspection}\n\
            Information: ${information}\n\
            Notes: ${notes}\n\
            Created: ${created_at}\n\
            Last Updated: ${updated_at}\n\
            Column ID: ${column_id}`);
    });
}

// Function to change the status of a specified elevator
function changeElevatorStatus(agent) {
    const id = agent.parameters.id;
    const newStatus = agent.parameters.newStatus;

    return axios.put(`https://rest-api-burroughs.herokuapp.com/api/elevators/${id}/status`, {
        "id": `${id}`, 
        "status": `${newStatus}`
        })
            .then(agent.add(`Elevator ${id}'s status has been changed to ${newStatus}.`)
    );
}

// Function to submit an intervention
function submitIntervention(agent) {
    const customer_id = agent.parameters.customer_id;
    const building_id = agent.parameters.building_id;
    const battery_id = agent.parameters.battery_id;
    const column_id = agent.parameters.column_id;
    const elevator_id = agent.parameters.elevator_id;
    const report = agent.parameters.report;

    return axios.post(`https://rest-api-burroughs.herokuapp.com/api/interventions`, {
        "customer_id": `${customer_id}`,
        "building_id": `${building_id}`,
        "battery_id": `${battery_id}`,
        "column_id": `${column_id}`,
        "elevator_id": `${elevator_id}`,
        "report": `${report}`,
        "status": "Pending"
        })
        .then(agent.add(`Your intervention request has been submitted. An agent of Rocket Elevators will contact you soon.`)
    );
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
intentMap.set('changeElevatorStatus', changeElevatorStatus);
intentMap.set('submitIntervention', submitIntervention);
intentMap.set('getElevatorInfo', getElevatorInfo);
agent.handleRequest(intentMap);
});