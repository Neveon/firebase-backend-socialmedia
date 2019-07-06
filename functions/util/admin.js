const admin = require('firebase-admin');
const serviceAccount = {
  type: 'service_account',
  project_id: 'PROJECT_ID',
  private_key_id: 'KEY_ID',
  private_key: 'PRIVATE_KEY',
  client_email: 'CLIENT_EMAIL',
  client_id: 'CLIENT_ID',
  auth_uri: 'AUTH_URI',
  token_uri: 'TOKEN_URI',
  auth_provider_x509_cert_url: 'CERT_URL',
  client_x509_cert_url: 'CLIENT_CERT_URL'
};
//{credential: admin.credential.cert(serviceAccount)}
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const db = admin.firestore();

module.exports = { admin, db };
