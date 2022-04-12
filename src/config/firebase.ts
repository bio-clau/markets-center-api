import admin from 'firebase-admin';
const serviceAccount = require('../private/serviceAccount.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;