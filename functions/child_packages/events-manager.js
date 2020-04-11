/* eslint-disable promise/no-nesting */
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const consoleIt = require('./data-console');

// On new event created just update it in the owner events list
exports.onEventCreated = (data, context) => {
  const eventData = data;
  const userId = eventData.eventOwnerId;
  const eventId = context.params.eventId;
  consoleIt.it('event creation occured', {eventData: eventData});
  if (!userId || !eventData.creationTime) {
    consoleIt.it({message: 'Event created but some error occured', ref: context.ref});
    return admin.database().ref('/appMetaData/errors/event-creation/').push({data: eventData, path: context.ref});
  }
  return updateEventDataOnOwner(eventData);
}

// Function to update user with event short object
// trigger => 'modified | 'created';
function updateEventDataOnOwner(eventData, trigger) {
  var _tmpEventObj = {
    eventId: eventData.eventId,
    publishSt: eventData.publish,
    creationTime: eventData.creationTime,
    eventStartTS: eventData.eventStartTS
  };

  if (trigger === 'm') _tmpEventObj.last_modified = new Date().getTime();
  return admin.database().ref(`/accounts/public/${userId}/eventsList/${eventId}/`)
  .set({eventId: eventId, publishSt: eventData.publish, creationTime: eventData.creationTime});
}

// On event modified
exports.onEventModified = (change, context) => {
  const oldData = change.before.val();
  const newData = change.after.val();

  if (!oldData) return;

  if (newData.publish !== oldData.publish) {
    if (newData.eventId && newData.eventOwnerId) updateVenueEventPublishST(newData)
  }
  return;
}

// Function to update publish state
function updateVenueEventPublishST(newEventData) {
  return admin.database().ref(`/accounts/public/${newEventData.eventOwnerId}/eventsList/${newEventData.eventId}`)
  .update({publishSt: publish, last_modified: new Date().getTime()});
}

exports.onEventRegister = (data, context) => {
  const eventId = data.eventId;
  const res_uid = data.res_uid;
  console.log(data);
  if (res_uid && eventId) return addEventRegAction(eventId, res_uid, 'register').then(actionSnap => {
    setRegistrationActionFlags(eventId, actionSnap.key, 'INITIATING_REGISTRATION');
    return admin.database().ref(`publicList/venue_events/${eventId}/`).once('value').then(eventSnapshot => {
      eventObj = eventSnapshot.val();
      if (!eventObj) {
        setRegistrationActionFlags(eventId, actionSnap.key, 'EVNET_DATA_NOT_LOADED');
        throw new functions.https.HttpsError('not-found', 'EVNET_DATA_NOT_LOADED', `Unable to find event data with event id ${eventId}`);
      }
      if (eventObj.responseCount >= 0 && eventObj.avlSlots >= 0) {
        if ((eventObj.avlSlots - eventObj.responseCount) <= 0) {
          setRegistrationActionFlags(eventId, actionSnap.key, 'REACHED_MAX_SLOTS');
          throw new functions.https.HttpsError('out-of-range',  'REACHED_MAX_SLOTS', `Event bookings reached max slots.`);
        }
      }
      setRegistrationActionFlags(eventId, actionSnap.key, 'EVENT_DATA_LOADED');
      return admin.database().ref(`accounts/public/${res_uid}`).once('value').then(userDataSnapshot => {
        userObj = userDataSnapshot.val();
        if (!userObj) {
          setRegistrationActionFlags(eventId, actionSnap.key, 'USER_DATA_NOT_LOADED');
          throw new functions.https.HttpsError('not-found',  'USER_DATA_NOT_LOADED', `Unable to find user data with userId ${res_uid}`);
        }
        if (userObj.uid === eventObj.eventOwnerId) {
          setRegistrationActionFlags(eventId, actionSnap.key, 'EVENT_OWNER_NOT_ALLOWED');
          throw new functions.https.HttpsError('permission-denied', `EVENT_OWNER_NOT_ALLOWED`, `Event owner not allowed to register for self`);
        }
        if (eventObj.entryFee > 0) {
          setRegistrationActionFlags(eventId, actionSnap.key, 'REQUESTING_PAYMENT');
          return {actionKey: actionSnap.key, status: 'PAYMENT_REQUIRED', amount: eventObj.entryFee};
        }
        setRegistrationActionFlags(eventId, actionSnap.key, 'REGISTRATION_SUBMITTING');
        return followEVentRegistration(eventId, res_uid, actionSnap.key).then(eventRegRes => {
          setRegistrationActionFlags(eventId, actionSnap.key, 'REGISTRATION_SUBMITTED');
          return {actionKey: actionSnap.key, status: 'OK'};
        }).catch(err => {
          setRegistrationActionFlags(eventId, actionSnap.key, 'REGISTRATION_SUBMIT_FAILED');
          throw new functions.https.HttpsError('unknown', err);
        })
      }).catch(err => {
        setRegistrationActionFlags(eventId, actionSnap.key, 'FAILED_TO_LOAD_USER_DATA');
        throw new functions.https.HttpsError('unknown', err);
      })
    }).catch(err =>  {
      setRegistrationActionFlags(eventId, actionSnap.key, 'FAILED_TO_LOAD_EVENT_DATA');
      throw new functions.https.HttpsError('unknown', err);
    });
  }).catch(err => {
    throw new functions.https.HttpsError('not-found', err);
  });
  throw new functions.https.HttpsError('invalid-argument', `Invalid arguments passed. eventId and res_uid are required.`, `Invalid arguments passed. eventId and res_uid are required.`);
}

exports.onCancelEventRegistration = (data, context) => {
  const userId = data.res_uid;
  const eventId = data.eventId;
  if (userId || eventId)  return addEventRegAction(eventId, userId, 'cancel').then(actionSnap => {
    actionKey = actionSnap.key;
    setEventRegCount(eventId, 'down');
    return admin.database().ref(`/privateList/venue_event_responses/${eventId}/registrants/${userId}`).set({registered: false, actionKey: actionKey, time: new Date().getTime()})
    .then(() => {
      return {'actionKey': actionKey, 'status': 'OK'};
    });
  }).catch(err => {
    consoleIt.it(err);
    throw new functions.https.HttpsError('unknown', err.message);
  });
  throw new functions.https.HttpsError('invalid-argument', `Invalid arguments passed. eventId and res_uid are required.`, `Invalid arguments passed. eventId and res_uid are required.`);
}

exports.onEventPayment = (data, context) => {
  const eventId = data.eventId;
  const res_uid = data.res_uid;
  const actionKey = data.actionKey;
  const paymentId = data.paymentId;
  if (!eventId || !res_uid || !actionKey || !paymentId) throw new functions.https.HttpsError('invalid-argument', 'Invalid data orguments');
  // setRegistrationActionFlags(eventId, actionSnap.key, 'VERIFYING_PAYMENT_INFO');
  setRegistrationActionFlags(eventId, actionKey, 'REGISTRATION_SUBMITTING_AFTER_PAYMENT');
  return followEVentRegistration(eventId, res_uid, actionKey).then(() => {
    setRegistrationActionFlags(eventId, actionKey, 'REGISTRATION_SUBMITTED_AFTER_PAYMENT');
    return {actionKey: actionKey, status: 'OK'};
  }).catch(err => {
    setRegistrationActionFlags(eventId, actionKey, 'REGISTRATION_SUBMIT_FAILED_AFTER_PAYMENT');
    throw new functions.https.HttpsError('unknown', err);
  });
}

exports.onRegistrationCancel = (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('auth_not_found', 'Authentication required to execute this request');
  if (!data.userId) throw new functions.https.HttpsError('no_user_id_found', 'User id is required for executing this request');
  if (!data.eventId) throw new functions.https.HttpsError('no_event_id_found', 'Event id is required for executing this request');
  if (data.userId !== context.auth.uid) throw new functions.https.HttpsError('access_denied', 'You are not allowed to this operation');
  // admin.database().ref(`/privateList/venue_event_responses/${eventId}/${userId}/`);
  return null;
}

function followEVentRegistration(eventId, userId, actionKey) {
  setEventRegCount(eventId, 'up');
  return admin.database().ref(`/privateList/venue_event_responses/${eventId}/registrants/${userId}`).set({registered: true, actionKey: actionKey, time: new Date().getTime()})
}

function addEventRegAction(eventId, userId, action) {
  return admin.database().ref(`/privateList/venue_event_responses/${eventId}/actions`).push({action: action, res_uid: userId, time: new Date().getTime()});
}

function setRegistrationActionFlags(eventId, actionKey, actionItem, miscData) {
  admin.database().ref(`/privateList/venue_event_responses/${eventId}/actions/${actionKey}/actionFlags`).push({action: actionItem, time: new Date().getTime(), misc: miscData || null});
  return null;
}

function setEventRegCount(eventId, type) {
  if (type === 'up') return admin.database().ref(`/publicList/venue_events/${eventId}/responseCount`).transaction(e => (e || 0) + 1);
  return admin.database().ref(`/publicList/venue_events/${eventId}/responseCount`).transaction(e => {
    if (e > 0) return e - 1;
    return 0
  });
}

