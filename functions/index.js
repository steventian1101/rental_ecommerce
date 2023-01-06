const functions = require("firebase-functions");
// var admin = require("firebase-admin");
// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
// var serviceAccount = require("./path/to/serviceAccountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

const algoliasearch = require('algoliasearch');
const APP_ID = functions.config().algolia.app;
const ADMIN_KEY = functions.config().algolia.key;
const client = algoliasearch(APP_ID, ADMIN_KEY);
const index = client.initIndex('items');

exports.addToIndex = functions.firestore.document('rental_items/{docId}')

    .onCreate(snapshot => {
        const data = snapshot.data();
        const objectID = snapshot.id;
        return index.saveObject({ ...data, objectID });
    });
exports.updateIndex = functions.firestore.document('rental_items/{docId}')

    .onUpdate((change) => {
        const newData = change.after.data();
        const objectID = change.after.id;
        return index.saveObject({ ...newData, objectID });
    });
exports.deleteFromIndex = functions.firestore.document('rental_items/{docId}')

    .onDelete(snapshot => index.deleteObject(snapshot.id));