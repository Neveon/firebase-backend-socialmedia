const functions = require('firebase-functions');
//const express = require('express');
//const app = express();
const app = require('express')();

const FBAuth = require('./util/fbAuth');

const {
  getAllThoughts,
  postOneThought,
  getThought,
  commentOnThought
} = require('./handlers/thoughts');
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser
} = require('./handlers/users');

// Thought route
app.get('/thoughts', getAllThoughts);
app.post('/thought', FBAuth, postOneThought);
app.get('/thought/:thoughtId', getThought);
// TODO: delete thought
// TODO: like a thought
// TODO: unliking a thought
// TODO: comment on thought
app.post('/thought/:thoughtId/comment', FBAuth, commentOnThought);

// Users route
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);

// https://baseurl.com/api/
exports.api = functions.https.onRequest(app);
