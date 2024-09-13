const admin = require('firebase-admin');

var serviceAccount = require('./service_account.json'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // databaseURL: "https://moonbase-34e30.firebaseio.com"
});

module.exports = admin;
