/* eslint-disable promise/no-nesting */
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const spawn = require('child-process-promise').spawn;
const path = require('path');
const {Storage} = require('@google-cloud/storage');
const sharp = require('sharp');
const cors = require('cors')({origin: true});
const storage = new Storage();
const os = require('os');
const fs = require('fs');

// Child package imports
const events = require('./child_packages/events-manager');
const notificationService = require('./child_packages/notifications-manager');
// const nodemailer = require('nodemailer');

// Constants for resizeing images
// defIS => default Image Sizes
const defIS = {
  xl: {dim: 1200, size: 200},
  lg: {dim: 900, size: 150},
  md: {dim: 600, size: 100},
  sm: {dim: 300, size: 50}
}

// Test url for temporary testing purpose
exports.testUrl = functions.https.onRequest((req, res) => {
  // notificationService.addUserNotification("a", "b", "c");
  notificationService.doThis().then(e => console.log(e)).catch(err => console.log(err));
  res.send('Ok');
});

exports.onFileChange = functions.storage.object().onFinalize(async object => {
  const fileBucket = object.bucket;                   // The Storage bucket that contains the file.
  const filePath = object.name;                       // File path in the bucket.
  const contentType = object.contentType;             // File content type.
  const fileName = path.basename(filePath);           // Get the file name.
  const pA = filePath.split('/');                     // path params
  // Exit if this is triggered on a file that is not an image.
  if (!contentType.startsWith('image/')) {
    return console.log('This is not an image.');
  }

  // Exit if the image is already a thumbnail.
  if (fileName.startsWith('_thumb_')) {
    console.log('already a thumbnail');
    const bucket = admin.storage().bucket(fileBucket);
    return await bucket.file(path.normalize(filePath)).getSignedUrl({
      action: 'read',
      expires: '01-01-2100'
    }).then(url => {
      console.log('Thumbnail url created', url[0]);
      return updateThumbNailUrl(
        url[0], pA[4].toLowerCase().slice(7, 9), {userId: pA[1], objectKey: pA[3]}
      );
    });
  }

  // Check if gallery item or not
  if (pA[0] === 'userAssets' && pA[2] === 'galleryItems' && pA.length === 5)  {
    console.log('Gallery image');
    const bucket = admin.storage().bucket(fileBucket);
    const tmpFilePath = path.join(os.tmpdir(), path.basename(filePath));
    await bucket.file(filePath).download({destination: tmpFilePath})
    console.log('Image downloaded locally to', tmpFilePath);
    const _tmpMeta = object.metadata;
    const meta = {
      data: _tmpMeta || false,
      width: Number(_tmpMeta.width) || false,
      height: Number(_tmpMeta.height) || false,
      size: Number(_tmpMeta.size) || false
    }

    if (checkThumbReq(meta, 'sm')) {
      console.log(`Creating small thumb.`);
      createThumbFor('sm', fileBucket, filePath, fileName, tmpFilePath, contentType);
    } else {
    	console.log(`Skipping small thumb creation`);
    }

    if (checkThumbReq(meta, 'md')) {
      console.log(`Creating medium thumb.`);
      createThumbFor('md', fileBucket, filePath, fileName, tmpFilePath, contentType);
    } else {
    	console.log(`Skipping medium thumb creation`);
    }

    if (checkThumbReq(meta, 'lg')) {
      console.log(`Creating large thumb.`);
      createThumbFor('lg', fileBucket, filePath, fileName, tmpFilePath, contentType);
    } else {
    	console.log(`Skipping large thumb creation`);
    }

    if (checkThumbReq(meta, 'xl')) {
      console.log(`Creating extra large thumb.`);
      createThumbFor('xl', fileBucket, filePath, fileName, tmpFilePath, contentType);``
    } else {
    	console.log(`Skipping extra large thumb creation`);
    }
    return null;
  } else console.log('Notgallery image');
  // console.log('File meta data', object);
  return console.log(`Need to create a thumbnail for ${filePath}`, object);
});

// Unique function to create all the thumbs
function createThumbFor(size, fileBucket, filePath, fileName, tmpFilePath, contentType) {
  const now = getTimeNow();
  console.log(`${size.toUpperCase()} thumb generation started, 0`);
  const thumbName = `_thumb_${size}_` + fileName;
  const resizeDim = `${defIS[size].dim}x${defIS[size].dim}`;
  const tmpThumbPath = path.join(os.tmpdir(), thumbName);
  const thumbPath = path.join(path.dirname(filePath), thumbName);
  return spawn('convert', [tmpFilePath, '-resize', resizeDim, tmpThumbPath]).then(() => {
    console.log(`${size.toUpperCase()} thumb created at tmp path ${tmpThumbPath}, ${getTimeNow() - now}`);
    return admin.storage().bucket(fileBucket)
    .upload(tmpThumbPath, {gzip: true, destination: thumbPath, metaData: {contentType: contentType, cacheControl: 'public,max-age=3600'}})
    .then(() => console.log(`${size.toUpperCase()} thumb uploaded successfully, `, getTimeNow() - now))
    .catch(err => console.log(`${size.toUpperCase()} thumb upload failed`, err));
  });
}

// function to check weather to create thumbnail or not
function checkThumbReq(metaObj, checkSize) {
  const mO = metaObj;                   // mO     => Metadata object
  const sz = checkSize;                 // string => 'sm' | 'md' | 'lg' | 'xl'
  var sSize = false;                    // sSize  => small in size compared to pre-defined size limit
  var sWidth = false;
  var sHeight = false;

  // Return true if meta data not available
  if (!mO.data) return true;

  // Check the size in KB is below pre-defined size limit
  if (mO.size) sSize = mO.size <= (defIS[sz].size * 1024);
  if (mO.width) sWidth = mO.width <= defIS[sz].dim;
  if (mO.height) sHeight = mO.height <= defIS[sz].dim;

  // Returning false if size is around pre-defined size limit
  if (sSize) return false;
  if (sWidth && sHeight) return false;
  // Returning true if size is above pre-defined size limit
  return true;
}

// Events triggers
// On new event created just update it in the owner events list
exports.onEventCreated = functions.database.ref(`/publicList/venue_events/{eventId}/`).onCreate((snapshot, context) => {
  return events.onEventCreated(snapshot.val(), context);
});

// On event modified
exports.onEventModified = functions.database.ref(`/publicList/venue_events/{eventId}/`).onUpdate((change, context) => {
  return events.onEventModified(change, context);
});

// Register for event
exports.registerForEvent = functions.https.onCall((data, context) => {
  return events.onEventRegister(data, context);
})

// Register for event after payment
exports.completeEventRegistrationOnPayment = functions.https.onCall((data, context) => {
  return events.onEventPayment(data, context);
});

exports.cancelEventRegistration = functions.https.onCall((data, context) => {
  return events.onCancelEventRegistration(data, context);
});


// On gallery item deleted
exports.onGalleryItemDeleted = functions.database.ref('/publicList/userGallery/{userId}/{galleryItemId}').onDelete((snapshot, context) => {
  const params = context.params;
  const snap = snapshot.val();
  const fileBucket = 'vasma-production.appspot.com';
  const bucket = storage.bucket(fileBucket);
  return bucket.deleteFiles({force: true, prefix: `userAssets/${params.userId}/galleryItems/${params.galleryItemId}`}).then(() => {
    return console.log(`All files in directory "${params.userId}/${params.galleryItemId}" has deleted.`);
  }).catch(err => console.log(err));
})

exports.onUnexpectedThumbDelete = functions.database.ref('/publicList/userGallery/{userId}/{galleryItemId}/{thumbId}').onDelete((snapshot, context) => {
  const params = context.params;
  const val = snapshot.val();
  console.log(val);
  if (['_smPath', '_mdPath', '_lgPath', '_xlPath'].indexOf(params.thumbId) >= 0) {
    setTimeout(() => {
      const BasePath = `/publicList/userGallery/${params.userId}/${params.galleryItemId}/`;
      return admin.database().ref(`${BasePath}`).once('value').then((snap) => {
        const snapData = snap.val();
        const now = getTimeNow();
        if (snapData && snapData.filePath && ((now - snapData.upTime) < 120000)) {
          return admin.database().ref(`${BasePath}/${params.thumbId}`).set(val);
        }
        else return console.log('No need to delete');
      })
    }, 1000);
  }
  return null;
});


// Function to update thumbnail
function updateThumbNailUrl(url, size, objectRef) {
  console.log('Updating thumb nail url', url);
  return admin.database().ref(`/publicList/userGallery/${objectRef.userId}/${objectRef.objectKey}/_${size}Path`).set(url);
}


exports.onNewCommentRecieved = functions.database.ref(`/publicList/comments/{userId}/{commentId}`).onCreate((snapshot, context) => {
  var comment = snapshot.val();
  comment.cid = context.params.commentId;
  console.log(comment);
  if (context.params.commentId === context.params.userId) return null;
  sendCommentNotification(comment, context.params, 'comment');
  return createNotificationAndProceed(comment, 'comment');
});

exports.onNewProspectAdded = functions.database.ref(`/followersData/followers/{followerId}/{followedBy}`).onCreate((snap, context) => {
  const dataObj = snap.val();
  createNotificationAndProceed([context.params.followerId, context.params.followedBy], 'prospect');
  return admin.database().ref(`/accounts/private/${context.params.followerId}/npt`).transaction(e => (e || 0) + 1);
});

exports.onNewServiceCreated = functions.database.ref(`/publicList/services/{userId}/{serviceId}`).onCreate((snap, context) => {
  return snap.ref.child('uid').set(context.params.serviceId);
});

// Database trigger for temporary transaction object created

// exports.onTmpTransactionCreated = functions.database.ref(`transactions/_tmp/{tmpTrId}`).onCreate((snap, context) => {
//   return assignTmpTrId(context.params.tmpTrId);
// });


// Database trigger for transaction completion detection.
// Triggered on temporary transaction  object on realtime database "trStatus" key value changed to "completed".

exports.onTmpTransactionCompleted = functions.database.ref(`transactions/_tmp/{tmpTrId}`).onUpdate((change, context) => {
  // console.log(change.after.val(), change.before.val());
  const after = change.after.val();
  const before = change.before.val();
  console.log(after.trStatus, before.trStatus);
  if (after.trStatus === 'completed' && before.trStatus === 'init') {
    proceedWithTransactionSuccess(after);
  }
  return null;
});

// Database trigger for transaction finalization
exports.OnFinalTransactionCreated = functions.database.ref(`/transactions/final/{trId}`).onCreate((snapshot, context) => {
  transaction = snapshot.val();
  return assignTrId(context.params.trId, transaction);
});

// exports.onTransactionMade = functions.database.ref(`accounts/private/{userId}/transactions`).onCreate((snapshot, context) => {
//   return createNotificationAndProceed(snapshot.val(), 'booking');
// });

// Http function trigger to handle booking request by service provider
// Sample data object
// data = {
//   action: 'accept',
//   trId: 'hsdjfbjhbhdfbvhdfbhdfbh'
// }

exports.handleBookingRequest = functions.https.onCall((data, context) => {
  console.log(data);
  if (data.action && data.trId) {
    const action = data.action;
    if (action === 'accept') {
      acceptBookingRequest(data.trId, context.auth.uid)
    }
    if (action === 'cancel') {
      cancelBookingRequest(data.trId, context.auth.uid);
    }
    if (action === 'acceptCancellation') {
      acceptCancellationRequest(data.trId, context.auth.uid);
    }
    if (action === 'completeBooking') {
      completeBookingRequest(data.trId, context.auth.uid);
    }
  }
  return null;
});

// Trigger on chat list participants created
exports.onChatParticipantAdded = functions.database.ref(`/privateList/chatList/{chatId}/pt/{participantId}`).onCreate((snapshot, context) => {
  const cParams = context.params;
  console.log('Creating chat list item in user chat list');
  return admin.database().ref(`/accounts/private/${cParams.participantId}/chatList/${cParams.chatId}`).set({
    clUid: cParams.chatId, lu: getTimeNow()
  })
});

// Trigger to handle last update of conversation object
exports.onNewMessageInConversation = functions.database.ref(`/privateList/chatList/{chatId}/msgs/{msgId}`).onCreate((snapShot, context) => {
  const cP = context.params;        // Context params
  // console.log('new Message created', snapShot.val());
  return admin.database().ref(`/privateList/chatList/${cP.chatId}/pt`).once('value').then(snap => {
    // console.log(snap);
    const pt = Object.keys(snap.val());
    // console.log(pt);
    pt.forEach(e => {
      admin.database().ref(`/accounts/private/${e}/chatList/${cP.chatId}/lu`).set(getTimeNow());
    })
    return null;
  }).catch(err => console.log(err));
});

// Function to Complete the booking request
function completeBookingRequest(transactionId, reqId) {
  console.log(`Completing booking request: ${transactionId}, ${reqId}`);
  return admin.database().ref(`/transactions/final/${transactionId}`).once('value').then(snap => {
    const trObj = snap.val();
    console.log(trObj.trTo, reqId);
    if (trObj.trTo === reqId) {
      return followCompletingBooking(transactionId);
    }
    return null
  }).catch(err => console.log(err));
}

// Function to follow completing booking
function followCompletingBooking(transactionId) {
  admin.database().ref(`/transactions/final/${transactionId}/bookingST`).set('completed').then(() => {
    return writeTransactionLog(transactionId, {msg: 'Booking completed by service provider', time: getTimeNow()});
  }).catch(err => {
    console.log(err);
  });
}

// Function to accept the booking request
function acceptBookingRequest(transactionId, reqId) {
  console.log(`Accepting booking request: ${transactionId}, ${reqId}`);
  return admin.database().ref(`/transactions/final/${transactionId}`).once('value').then(snap => {
    const trObj = snap.val();
    console.log(trObj.trTo, reqId);
    if (trObj.trTo === reqId) {
      return followBookingAcceptance(transactionId);
    }
    return null
  }).catch(err => console.log(err));
}

// Function to follow accepting booking
function followBookingAcceptance(transactionId) {
  admin.database().ref(`/transactions/final/${transactionId}/bookingST`).set('confirm-by-sp').then(() => {
    return writeTransactionLog(transactionId, {msg: 'Booking confirmed by service provider', time: getTimeNow()});
  }).catch(err => {
    console.log(err);
  });
}

// Function to cancel the booking request by serviceProvider
function cancelBookingRequest(transactionId, reqId) {
  console.log(`Cancel requested for booking id ${transactionId}`);
  return admin.database().ref(`/transactions/final/${transactionId}`).once('value').then(snap => {
    const trObj = snap.val();
    if (trObj.trTo === reqId) {
      followBookingCancellation(transactionId, 'reject-by-sp');
    }
    if (trObj.trBy === reqId) {
      followBookingCancellation(transactionId, 'cancel-by-py');
    }
    return null
  }).catch(err => console.log(err));
}

// Function follow booking cancellation
function followBookingCancellation(transactionId, cancellationCode) {
  return admin.database().ref(`/transactions/final/${transactionId}/bookingST`).set(cancellationCode).then(snap => {
    if (cancellationCode === 'reject-by-sp') {
      writeTransactionLog(transactionId, {msg: 'Booking cancelled by service provider', time: getTimeNow()});
    }
    if (cancellationCode === 'cancel-by-py') {
      writeTransactionLog(transactionId, {msg: 'Booking cancellation requested by payee', time: getTimeNow()});
    }
    return null;
  }).catch(err => console.log(err));
}

// Function to accept booking cancellation
function acceptCancellationRequest(transactionId, reqId) {
  console.log(`Accepting booking cancellation request: ${transactionId}, ${reqId}`);
  return admin.database().ref(`/transactions/final/${transactionId}`).once('value').then(snap => {
    const trObj = snap.val();
    console.log(trObj.trTo, reqId);
    if (trObj.trTo === reqId) {
      return followCancellationAcceptance(transactionId);
    }
    return null
  }).catch(err => console.log(err));
}

// Function to follow booking cancellation request acceptance
function followCancellationAcceptance(transactionId) {
  admin.database().ref(`/transactions/final/${transactionId}/bookingST`).set('cancel-acpt-by-sp').then(() => {
    return writeTransactionLog(transactionId, {msg: 'Cancellation request accepted by service provider', time: getTimeNow()});
  }).catch(err => {
    console.log(err);
  });
}

// Function to proceed with transaction object log
function writeTransactionLog(trId, logData) {
  return admin.database().ref(`/transactions/final/${trId}/bookingStMsg`).push(logData);
}

// Function to proceed with transaction success flow
function proceedWithTransactionSuccess(trObj) {
  console.log(trObj);
  transaction = trObj;
  transaction.bookingST = 'review-by-sp';
  transaction.bookingStMsg = {
    initLogMsg: {
      msg: 'Booking placed',
      time: getTimeNow()
    }
  }
  return admin.database().ref(`/transactions/final/${transaction.trId}`).set(transaction);
}

// Function to create notification object and proceed
function createNotificationAndProceed(dataObj, type) {
  var notification;
  if (type === 'comment') {
    notification = {
      type: 'comment',
      nTime: dataObj.cTime,
      refObjId: dataObj.cid,
      refUserId: dataObj.cBy
    };
    return submitNotification(notification, dataObj.cOn);
    // return admin.database().ref(`/privateList/notifications/${dataObj.cOn}`).push(notification).then(snap => {
    //   return admin.database().ref(`/accounts/private/${dataObj.cOn}/unc`).transaction(e => {
    //     return (e || 0) + 1;
    //   })
    // });
  }
  if (type === 'prospect') {
    notification = {
      type: type,
      nTime: getTimeNow(),
      refUserId: dataObj[1]
    };
    return submitNotification(notification, dataObj[0]);
    // return admin.database().ref(`/privateList/notifications/${dataObj[0]}`).push(notification).then(snap => {
    //   return admin.database().ref(`/accounts/private/${dataObj[0]}/unc`).transaction(e => {
    //     return (e || 0) + 1;
    //   })
    // });
  }
  // if (type === 'booking') {
  //   notification = {
  //     type: type,
  //     nTime: getTimeNow(),
  //     refUserId: dataObj[1]
  //   };
  //   return submitNotification(notification, dataObj[0]);
  //   // return admin.database().ref(`/privateList/notifications/${dataObj[0]}`).push(notification).then(snap => {
  //   //   return admin.database().ref(`/accounts/private/${dataObj[0]}/unc`).transaction(e => {
  //   //     return (e || 0) + 1;
  //   //   })
  //   // });
  // }
  return null;
}

function submitNotification(nObj, userId) {
  return admin.database().ref(`/privateList/notifications/${userId}`).push(nObj).then(snap => {
    return admin.database().ref(`/accounts/private/${userId}/unc`).transaction(e => {
      return (e || 0) + 1;
    })
  });
}

// Function to assign transaction ref id
function assignTrId(trId, transaction) {
  console.log('Final transaction is initiated: ', trId);
  admin.database().ref(`appStats/trCount`).once('value').then(e => {
    setTransactionNumber(e.val(), trId, transaction);
    return e.ref.transaction(e => (e || 0) + 1);
  }).catch(err => {
    console.log('err', err);
    return null;
  });
}

function setTransactionNumber(e, trId, transaction) {
  const dt = new Date().getFullYear();
  const bookingId = `VAS-${dt}${adjustToFourDigit(e)}`;
  return admin.database().ref(`transactions/final/${trId}/bId`).set(bookingId).then(x => {
    var tr = transaction;
    tr.bId = bookingId;
    return assignTransactions(tr);
  }).catch(err => console.log(err));
}

function adjustToFourDigit(num) {
  fNumber = Number(num);
  nm = Number(num);
  if (nm < 10) fNumber = '000' + nm;
  if (nm >= 10 && nm < 100) fNumber = '00' + nm;
  if (nm >= 100 && nm < 1000) fNumber = '0' + nm;
  return fNumber;
}

// Function to assign transaction data to both parties
function assignTransactions(tr) {
  console.log('Assigning transaction to users');
  const transactionObj = {
    trid: tr.trId,
    trTo: tr.trTo,
    trBy: tr.trBy,
    bId: tr.bId,
    reciept: tr.bookingData.reciept,
    trTime: getTimeNow()
    };
  admin.database().ref(`accounts/private/${tr.trBy}/transactions/${tr.trId}`).set(transactionObj);
  admin.database().ref(`accounts/private/${tr.trTo}/transactions/${tr.trId}`).set(transactionObj);
  return bookingConversationChatListCreate(transactionObj);
}

// Function to set booking related conversation
function bookingConversationChatListCreate(transaction) {
  console.log(`Creating conversations for booking id ${transaction.trId}`);
  _tmpChatListItem = {
    cType: 'booking',
    lu: transaction.trTime,
    subj: transaction.bId,
    pt: {_: null},
    msgs: {
      0: {
        msg: `Booking order placed with booking referrence id: ${transaction.bId}.`,
        time: getTimeNow()
      },
      1: {
        msg: `You can communicate here for any help required.`,
        time: getTimeNow()
      }
    }
  };
  _tmpChatListItem.pt[transaction.trBy] = {ls: transaction.trTime};
  _tmpChatListItem.pt[transaction.trTo] = {ls: transaction.trTime};
  return admin.database().ref(`/privateList/chatList/bid-${transaction.trid}`).set(_tmpChatListItem);
}

// Function to whether check existance
function isExist(data) {
  if (data !== null && data === undefined) return true;
  else return false;
}

function getTimeNow(dt) {
  if (dt) return new Date(dt).getTime();
  else return new Date().getTime();
}

function sendCommentNotification(data, params, notificationType) {
  if (notificationType === 'comment') {
    admin.database().ref(`/accounts/public/${data.cBy}`).once('value', snapshot => {
      const snap = snapshot.val();
      const payload = {
        notification: {
          title: `${snap.businessName || snap.name.fName} commented on your profile`,
          body: `${data.cText}`,
          icon: `${snap.photoURL || null}`
        }
      };
      return admin.database().ref(`fcmTokens/${params.userId}`).once('value').then(snapshot => {
        const userFcmToken = snapshot.val();
        if (!userFcmToken) return;
        else {
          // eslint-disable-next-line consistent-return
          return admin.messaging().sendToDevice(userFcmToken, payload)
                .then(() => console.log(`Message sent successfully`))
                .catch(err => console.log(err));
          }
      })
    }, err => {
      console.log(err)
    })
  }
  return;
}

// Function to console data
function consoleIt(a, b, c, d) {
  return admin.database().ref('/appMetaData/console/').push([a || null, b || null, c || null, d || null]);
}

