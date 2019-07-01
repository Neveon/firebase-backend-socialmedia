const functions = require('firebase-functions');

//const express = require('express');
//const app = express();
const app = require('express')();

const FBAuth = require('./util/fbAuth');

const { getAllThoughts, postOneThought } = require('./handlers/thoughts');
const { signup, login } = require('./handlers/users');

// Thought route
app.get('/thoughts', getAllThoughts);
app.post('/thought', FBAuth, postOneThought);

// Users route
app.post('/signup', signup);
app.post('/login', login);

// https://baseurl.com/api/
exports.api = functions.https.onRequest(app);
