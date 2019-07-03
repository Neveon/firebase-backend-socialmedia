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

// firebase database must change rules to protect db
// allow read, write: if false;

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
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
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
      .catch(err => console.error(err));
  });

exports.deleteNotificationOnUnlike = functions.firestore
  .document('likes/{id}')
  .onDelete(snapshot => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .then(() => {
        return;
      })
      .catch(err => console.error(err));
  });

exports.createNotificationOnComment = functions.firestore
  .document('comments/{id}')
  .onCreate(snapshot => {
    return db
      .doc(`/thoughts/${snapshot.data().thoughtId}`)
      .get()
      .then(doc => {
        // Check doc exists, and receieve notifs from everyone but self
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
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
      .catch(err => console.error(err));
  });

exports.onUserImageChange = functions.firestore
  .document('/users/{userId}')
  .onUpdate(change => {
    //console.log(change.before.data());
    //console.log(change.after.data());
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      const batch = db.batch();
      return db
        .collection('thoughts')
        .where('userHandle', '==', change.before.data().handle)
        .get()
        .then(data => {
          data.forEach(doc => {
            const thought = db.doc(`/thoughts/${doc.id}`);
            batch.update(thought, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        });
    } else return true;
  });

exports.onThoughtDelete = functions.firestore
  .document('/thoughts/{thoughtId}')
  .onDelete((snapshot, context) => {
    // context holds parameters in url
    const thoughtId = context.params.thoughtId;
    const batch = db.batch();
    // deleting comments
    return db
      .collection('comments')
      .where('thoughtId', '==', thoughtId)
      .get()
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        //deleting likes
        return db
          .collection('likes')
          .where('thoughtId', '==', thoughtId)
          .get();
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection('notifications')
          .where('thoughtId', '==', thoughtId)
          .get();
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch(err => console.error(err));
  });
