const { db } = require('../util/admin');

exports.getAllThoughts = (req, res) => {
  db.collection('thoughts')
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
      let thoughts = [];
      data.forEach(doc => {
        thoughts.push({
          thoughtId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
          userImage: doc.data().userImage
        });
      });
      return res.json(thoughts);
    })
    .catch(err => console.error(err));
};

exports.postOneThought = (req, res) => {
  if (req.body.body.trim() === '') {
    return res.status(400).json({ body: 'Body must not be empty' });
  }

  const newThought = {
    body: req.body.body,
    // from FBAuth
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0
  };

  db.collection('thoughts')
    .add(newThought)
    .then(doc => {
      const resThought = newThought;
      resThought.thoughtId = doc.id;
      res.json(resThought);
    })
    .catch(err => {
      res.status(500).json({ error: 'something went wrong' });
      console.error(err);
    });
};

// Fetching thought
exports.getThought = (req, res) => {
  let thoughtData = {};
  db.doc(`/thoughts/${req.params.thoughtId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Thought not found' });
      }
      thoughtData = doc.data();
      thoughtData.thoughtId = doc.id;
      return db
        .collection('comments')
        .orderBy('createdAt', 'desc') // query requires index
        .where('thoughtId', '==', req.params.thoughtId)
        .get();
    })
    .then(data => {
      // array of comments
      thoughtData.comments = [];
      data.forEach(doc => {
        thoughtData.comments.push(doc.data());
      });
      return res.json(thoughtData);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

// Comment on a thought
exports.commentOnThought = (req, res) => {
  if (req.body.body.trim() === '')
    return res.status(400).json({ comment: 'Must not be empty' });

  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    thoughtId: req.params.thoughtId,
    // from FBAuth middleware
    userHandle: req.user.handle,
    userImage: req.user.imageUrl
  };

  db.doc(`/thoughts/${req.params.thoughtId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Thought not found' });
      }
      // to update must use .ref
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
      return db.collection('comments').add(newComment);
    })
    .then(() => {
      res.json(newComment); // returned back to user, for UI
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });
};

// Like a thought
exports.likeThought = (req, res) => {
  // like array limited to one document
  const likeDocument = db
    .collection('likes')
    .where('userHandle', '==', req.user.handle)
    .where('thoughtId', '==', req.params.thoughtId)
    .limit(1);

  const thoughtDocument = db.doc(`/thoughts/${req.params.thoughtId}`);

  let thoughtData;

  thoughtDocument
    .get()
    .then(doc => {
      if (doc.exists) {
        thoughtData = doc.data();
        thoughtData.thoughtId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: 'Thought not found' });
      }
    })
    .then(data => {
      //likeDocument .limit(1) array data
      if (data.empty) {
        // if array is empty - checking with empty property
        // prevents user from 'double liking'
        return db
          .collection('likes')
          .add({
            thoughtId: req.params.thoughtId,
            userHandle: req.user.handle
          })
          .then(() => {
            thoughtData.likeCount++;
            return thoughtDocument.update({ likeCount: thoughtData.likeCount });
          })
          .then(() => {
            return res.json(thoughtData);
          });
      } else {
        return res.status(400).json({ error: 'Thought already liked' });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.unlikeThought = (req, res) => {
  // like array limited to one document
  // req.user from FBAuth middleware
  const likeDocument = db
    .collection('likes')
    .where('userHandle', '==', req.user.handle)
    .where('thoughtId', '==', req.params.thoughtId)
    .limit(1);

  const thoughtDocument = db.doc(`/thoughts/${req.params.thoughtId}`);

  let thoughtData;

  thoughtDocument
    .get()
    .then(doc => {
      if (doc.exists) {
        thoughtData = doc.data();
        thoughtData.thoughtId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: 'Thought not found' });
      }
    })
    .then(data => {
      //likeDocument .limit(1) array data
      if (data.empty) {
        return res.status(400).json({ error: 'Thought not liked' });
      } else {
        // data.doc[0] for query snapshot
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            thoughtData.likeCount--;
            return thoughtDocument.update({ likeCount: thoughtData.likeCount });
          })
          .then(() => {
            res.json(thoughtData);
          });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

//Delete thought
// TODO: Delete all comments and likes associated with thought
exports.deleteThought = (req, res) => {
  const document = db.doc(`/thoughts/${req.params.thoughtId}`);
  document
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Thought not found' });
      }
      if (doc.data().userHandle !== req.user.handle) {
        return res.status(403).json({ error: 'Unauthorized' });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      res.json({ message: 'Thought deleted successfully' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};
