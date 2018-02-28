## Node.js Middleware DialogFlow - Bot Engine/Web App Platform

A runkit runtime for connecting your Bot engine with your DialogFlow.

### Prerequisite
1. Clone or download this repo
2. Node.js is already installed
```
npm install
npm run start
```

3. Replace **YOUR_API_AI_KEY** with your Client Access Token in DialogFlow dashboard

> Note: if you want to make self production, remove **YOUR_API_KEY** from server.js and create .env file in your server

4. You will notice at path "/" and get "Hello World!". Just redirect to route "/api/bot" and you will get JSON with content Error.
This is normal! Now grab url: https://yourdomain.com/api/bot into you Bot Engine and set it up JSON API to your bot or if you have own node server, feel free to make HTTP call

> Note: it depends with your Bot engines setup

Need a free node server? Feel free deploy it to Heroku or drop a message irhamputraprasetyo@gmail.com