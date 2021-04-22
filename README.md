# RocketElevators-AI-Chatbot

This week, we were tasked with creating a ChatBot using Google DialogFlow that will integrate with a slack environment.

The required interactions with the ChatBot included a greeting message that gives the user various information about the Rocket Elevators MySQL database. The second part of the requirements asked for a user to be able to ask about the status of a specific elevator. Both of these queries are possible with the chatbot, and work correctly.

Additional intents were added for extra functionality with the chatbot. A user can also request specific parts of the greeting message, such as the number of buildings or elevators. In addition, the user can change the status of a given elevator, get all of the information about a specified elevator, as well as post an intervention to the database.

All of these queries are possible through the use of a REST API, which is available at https://rest-api-burroughs.herokuapp.com, and the code can be seen at https://github.com/ACLTearr/Rest-API-Rocket-Elevators. New endpoints were added this week to get the greeting message as well as the individual parts of that message, and old endpoints were used for other parts of the intents as well.

In the provided commands.txt file, a brief description of all of the intents added can be reviewed, as well as their training phrases and what their outcome is expected to be.

In the index.js file, all of the code for the intents can be seen, and the specific API calls for each intent and how their returns are handled.