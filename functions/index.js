const functions = require('firebase-functions');
//const express = require('express');
//const app = express();
const app = require('express')();

const FBAuth = require('./util/fbAuth');

const {
  getAllThoughts,
  postOneThought,
  getThought,
  commentOnThought,
  likeThought,
  unlikeThought,
  deleteThought
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
app.delete('/thought/:thoughtId', FBAuth, deleteThought);
app.get('/thought/:thoughtId/like', FBAuth, likeThought);
app.get('/thought/:thoughtId/unlike', FBAuth, unlikeThought);
app.post('/thought/:thoughtId/comment', FBAuth, commentOnThought);

// Users route
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);

// https://baseurl.com/api/
exports.api = functions.https.onRequest(app);
