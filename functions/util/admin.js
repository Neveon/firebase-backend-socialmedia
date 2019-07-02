const admin = require('firebase-admin');
const serviceAccount = require('../../../social-media-4c489-fe4ee349eaf7.json');
//{credential: admin.credential.cert(serviceAccount)}
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const db = admin.firestore();

module.exports = { admin, db };
