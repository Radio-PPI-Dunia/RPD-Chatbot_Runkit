//
// This code will be the same as the node.js server
// in your Glitch account create new project and install some package that you need.
// then you copy all the code to your Glitch project
//

const express = require("express");
const bodyParser = require("body-parser");
const { API_AI_KEY } = process.env || 'YOUR_API_KEY_DIALOGFLOW';
const URL = require("url");
const API_AI = require("apiai");
const DEFAULT_APP = API_AI_KEY ? API_AI(API_AI_KEY) : null;

const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Config Bot engines - DialogFlow
let randomize = (arr) => arr[Math.floor(Math.random() * arr.length)];

let sendResponse = ({ response, message }) => {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(message));
};

let createTextMsg = (text) => {
    return { messages: [{ text }] };
};

let handleResponse = (response) => ({ result, sessionId }) => {
    let message;
    if (result.source === 'agent') {
        let randomMsg = randomize(result.fulfillment.messages);
        message = randomMsg.payload ? randomMsg.payload : createTextMsg(randomMsg.speech);
    } else if (result.source === 'domains') {
        message = createTextMsg(result.fulfillment.speech);
    }

    message.set_attributes = Object.assign(message.set_attributes || {}, { DF_SESSION_ID: sessionId });
    sendResponse({ response, message });
};

let handleError = (response) => (error) => {
    let message = { error };
    sendResponse({ response, message });
};

// Routes
app.get("/", (req, res) => {
    res.send("Hello World!")
});

app.get("/api/bot", (req, res) => {
    let query = URL.parse(req.url, true).query;
    let app = (query.API_AI_KEY) ? API_AI(query.API_AI_KEY) : DEFAULT_APP;
    let newSessionId = (!query.DF_SESSION_ID || query.DF_SESSION_ID === "0") ? Math.random().toString().slice(2) : 0;
    let sessionId = (query.DF_SESSION_ID && query.DF_SESSION_ID != "0") ? query.DF_SESSION_ID : newSessionId;
    let contexts = [{
        name: query.DF_CONTEXT || 'DEFAULT',
        parameters: query,
    }];

    // REMINDER: you need to put queryString as the attribute.
    let request = app.textRequest(query.queryString, { sessionId, contexts });

    request.on('response', handleResponse(res));
    request.on('error', handleError(res));
    request.end();
});

let server = app.listen(PORT, () => {
    console.log("Listening on port %s", server.address().port)
});
