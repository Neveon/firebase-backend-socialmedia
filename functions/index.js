const functions = require('firebase-functions');
//const express = require('express');
//const app = express();
const app = require('express')();
const FBAuth = require('./util/fbAuth');

const { db } = require('./util/admin');

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
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsRead
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
app.get('/user/:handle', getUserDetails); // public route
app.post('/notifications', FBAuth, markNotificationsRead);

// https://baseurl.com/api/
exports.api = functions.https.onRequest(app);

// notif when thoughts are made - database triggers
exports.createNotificationOnLike = functions.firestore
  .document('likes/{id}')
  .onCreate(snapshot => {
    return db
      .doc(`/thoughts/${snapshot.data().thoughtId}`)
      .get()
      .then(doc => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'like',
            read: false,
            thoughtId: doc.id
          });
        }
      })
      .then(() => {
        return;
      })
      .catch(err => {
        console.error(err);
        return;
      });
  });

exports.deleteNotificationOnUnlike = functions.firestore
  .document('likes/{id}')
  .onDelete(snapshot => {
    db.doc(`/notifications/${snapshot.id}`)
      .delete()
      .then(() => {
        return;
      })
      .catch(err => {
        console.error(err);
        return;
      });
  });

exports.createNotificationOnComment = functions.firestore
  .document('comments/{id}')
  .onCreate(snapshot => {
    db.doc(`/thoughts/${snapshot.data().thoughtId}`)
      .get()
      .then(doc => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'comment',
            read: false,
            thoughtId: doc.id
          });
        }
      })
      .then(() => {
        return;
      })
      .catch(err => {
        console.error(err);
        return;
      });
  });
