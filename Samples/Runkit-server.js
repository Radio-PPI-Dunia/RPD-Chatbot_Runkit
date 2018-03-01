//
// If you need a free node server, you can go to Runkit.com
// then in your notebook, you just copy and paste this code below
// setup your environment in enviroments settings and replace FOO with API_AI_KEY, BAR with your Client Access Token
//

const { API_AI_KEY } = process.env;
const URL = require("url");
const API_AI = require("apiai");
const DEFAULT_APP = API_AI_KEY ? API_AI(API_AI_KEY) : null;

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


exports.endpoint = function (req,res) {
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
};