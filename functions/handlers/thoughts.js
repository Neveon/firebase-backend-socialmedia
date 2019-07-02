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
          createdAt: doc.data().createdAt
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
    userHandle: req.user.handle,
    createdAt: new Date().toISOString()
  };

  db.collection('thoughts')
    .add(newThought)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully` });
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
    return res.status(400).json({ error: 'Must not be empty' });

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
