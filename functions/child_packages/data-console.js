const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.it = (a, b, c, d) => {
  return admin.database().ref('/appMetaData/console/').push([a || null, b || null, c || null, d || null]);
}