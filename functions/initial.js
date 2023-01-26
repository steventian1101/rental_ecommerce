var admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert('./path/to/serviceAccountKey.json')
});
