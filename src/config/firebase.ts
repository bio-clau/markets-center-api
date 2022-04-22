import admin from 'firebase-admin';
const serviceAccount = require('../private/serviceAccount.json')

export const firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// module.exports = {firebaseAdmin};