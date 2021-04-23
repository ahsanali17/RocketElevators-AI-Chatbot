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
    // Calling the greeting API controller that gets all the info and formats it into a string that gets returned
    return axios.get(`https://rest-api-burroughs.herokuapp.com/api/greetings`)
    .then((result) => {
        // Setting the returned string to the agent to be shown to the user
        agent.add(result.data);
    });
}

// Broken down calls of what is returned in the greeting
function elevatorCount(agent) {
    // Calling the API to get the amount of elevators in the table
    return axios.get(`https://rest-api-burroughs.herokuapp.com/api/elevators/count`)
    .then((result) => {
        // Adding the returned number to the string to show the user
        agent.add('There are ' + result.data + ' elevators currently deployed.');
    });
}

function buildingCount(agent) {
    // Calling the API to get the amount of buildings in the table
    return axios.get(`https://rest-api-burroughs.herokuapp.com/api/buildings/count`)
    .then((result) => {
        // Adding the returned number to the string to show the user
        agent.add('There are currently ' + result.data + ' buildings served by Rocket Elevators.');
    });
}

function customerCount(agent) {
    // Calling the API to get the amount of customers in the table
    return axios.get(`https://rest-api-burroughs.herokuapp.com/api/customers/count`)
    .then((result) => {
        // Adding the returned number to the string to show the user
        agent.add('Rocket Elevators currently serves ' + result.data + ' customers.');
    });
}

function batteryCount(agent) {
    // Calling the API to get the amount of batteries in the table
    return axios.get(`https://rest-api-burroughs.herokuapp.com/api/batteries/count`)
    .then((result) => {
        // Adding the returned number to the string to show the user
        agent.add('There are currently ' + result.data + ' Rocket Elevators batteries in service.');
    });
}

function elevatorsNotRunning(agent) {
    // Calling the API to get the amount of elevators that are not "Active" in the table
    return axios.get(`https://rest-api-burroughs.herokuapp.com/api/elevators/inactive-count`)
    .then((result) => {
        // Adding the returned number to the string to show the user
        agent.add('There are currently ' + result.data + ' elevators not active.');
    });
}

function quoteCount(agent) {
    // Calling the API to get the amount of quotes in the table
    return axios.get(`https://rest-api-burroughs.herokuapp.com/api/quotes/count`)
    .then((result) => {
        // Adding the returned number to the string to show the user
        agent.add('There are currently ' + result.data + ' quotes awaiting processing.');
    });
}

function leadCount(agent) {
    // Calling the API to get the amount of leads in the table
    return axios.get(`https://rest-api-burroughs.herokuapp.com/api/leads/count`)
    .then((result) => {
        // Adding the returned number to the string to show the user
        agent.add('There are currently ' + result.data + ' leads in the contact requests.');
    });
}

// Function to get the status of a specified elevator
function getElevatorStatus(agent) {
    // Setting the id taken from the user input to a variable
    var id = agent.parameters.id;
    // Calling the API to return the status of the given elevator
    return axios.get(`https://rest-api-burroughs.herokuapp.com/api/elevators/${id}/status`)
    .then((result) => {
        // Setting a string to notify the user that the status was chagned
        agent.add(`The status of elevator ${id} is: ` + result.data);
    });
}

// Function to get the info of a specified elevator
function getElevatorInfo(agent) {
    // Setting the id taken from the user input to a variable
    var id = agent.parameters.id;
    // Calling the API to get a specific elevator object
    return axios.get(`https://rest-api-burroughs.herokuapp.com/api/elevators/${id}`)
    .then((result) => {
        // Setting all of results from the API to variables to be passed to the string to return to the user
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
        // Creating the string of elevator info to return to the user
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
    // Taking the id and requested status of the elevator from the user input
    var id = agent.parameters.id;
    var newStatus = agent.parameters.newStatus;
    // Calling the API with a PUT request to modify the status of the elevevator, and setting the JSON for the request
    return axios.put(`https://rest-api-burroughs.herokuapp.com/api/elevators/${id}/status`, {
        "id": `${id}`, 
        "status": `${newStatus}`
        })
        .then((result) => {
            // Setting the agent to the string returned from the API to notify the user of the cahnge
            agent.add(result.data);
        });
}

// Function to submit an intervention
function submitIntervention(agent) {
    // Setting the agent parameters given by the user to variables to be given ot the JSON
    var customer_id = agent.parameters.customer_id;
    var building_id = agent.parameters.building_id;
    var battery_id = agent.parameters.battery_id;
    var column_id = agent.parameters.column_id;
    var elevator_id = agent.parameters.elevator_id;
    var report = agent.parameters.report;
    // Calling the API to POST an intervention with the given parameters
    return axios.post(`https://rest-api-burroughs.herokuapp.com/api/interventions`, {
        "customer_id": `${customer_id}`,
        "building_id": `${building_id}`,
        "battery_id": `${battery_id}`,
        "column_id": `${column_id}`,
        "elevator_id": `${elevator_id}`,
        "report": `${report}`,
        "status": "Pending"
        })
        // Setting a string to return to the user confirming their submission 
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
