const firebase = require("firebase-admin");

var serviceAccount = require("../config/serviceAccountKey.json");

const db=firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "http://parkingslot-a9644.firebaseio.com"
});
module.exports = db;
