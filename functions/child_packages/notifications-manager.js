const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.checkingFunc = functions.database.ref(`/test/`).onWrite((snap, context) => {
  console.log(snap.val());
  return null;
});

module.exports = {
  doThis: () => {
    return admin.database().ref(`/tasks/`).once('value')
    .then(snap => snap.val())
    .catch(err => err)
  }
};