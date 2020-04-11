import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/functions';
import { CommentModel } from '../models/comment.model';
import { ComService } from '../models/commercial-service.model';
import { BusinessHours } from '../models/operation-hours.model';
import { TransactionObject } from '../models/transaction-object.model';
import { ChatMessage } from '../models/chat-box.model';

@Injectable({
  providedIn: 'root'
})
export class FireService {
  constructor() { }
  get uid() {
    return firebase.auth().currentUser.uid;
  }
  checkUserExistence(email: string) {
    return firebase.database().ref(`/accounts/meta/users`).orderByChild('email').equalTo(email).limitToFirst(2);
  }

  checkUniqProfId(key: string) {
    return firebase.database().ref(`/accounts/meta/users`).orderByChild('uniqueKey').equalTo(key).limitToFirst(2);
  }

  updateUniqProfId(key: string, uid: string) {
    firebase.database().ref(`/accounts/public/${uid}/uniqueKey`).set(key);
    return firebase.database().ref(`/accounts/meta/users/${uid}/uniqueKey`).set(key);
  }

  watchCurFirebaseUser(uid: string) {
    return firebase.database().ref(`/accounts/public/${uid}`);
  }

  watchPrivateUserData(uid: string) {
    return firebase.database().ref(`/accounts/private/${uid}`);
  }

  watchUserNotifications(uid: string) {
    return firebase.database().ref(`/privateList/notifications/${uid}`);
  }

  setUserContact(contacts) {
    return firebase.database().ref(`/accounts/private/${this.uid}/contact`).set(contacts);
  }

  updateBusinessOwners(dataObj) {
    return firebase.database().ref(`/accounts/private/${this.uid}/businessOwners`).set(dataObj);
  }

  // Firebase database reference for chat list item
  // clUid: Chat list uid
  getChatListItem(clUid?: string) {
    return firebase.database().ref(`/privateList/chatList/${clUid}`);
  }

  getChatListExistance(clUid?: string) {
    return firebase.database().ref(`/privateList/chatList/${clUid}/lu`);
  }

  createChatObject(clObj, clUid) {
    return firebase.database().ref(`/privateList/chatList/${clUid}`).set(clObj);
  }

  // Function to update chat list last seen
  updateChatLastSeen(clUid: string, uid?: string) {
    return firebase.database().ref(`/privateList/chatList/${clUid}/pt/${this.uid}/ls`).set(new Date().getTime());
  }

  chatListMessages(clUid: string) {
    return firebase.database().ref(`/privateList/chatList/${clUid}/msgs`);
  }

  chatParticipants(clUid) {
    return firebase.database().ref(`/privateList/chatList/${clUid}/pt`);
  }

  // ptUid = participant user Id.
  chatParticipantLastSeen(clUid, ptUid) {
    return firebase.database().ref(`/privateList/chatList/${clUid}/pt/${ptUid}`);
  }

  sendChatMessage(clUid: string, msgObj: ChatMessage) {
    return firebase.database().ref(`/privateList/chatList/${clUid}/msgs`).push(msgObj);
  }

  setUserDataOnRegister(data: any) {
    return firebase.database().ref(`/accounts/public/${data.uid}`).set(data);
  }

  setUserMeta(data) {
    return firebase.database().ref(`/accounts/meta/users/${data.uid}`).set(data);
  }

  setUserType(type, uid) {
    return firebase.database().ref(`/accounts/public/${uid}/userType`).set(type);
  }

  updateName(nameObj) {
    return firebase.database().ref(`/accounts/public/${this.uid}/name`).set(nameObj);
  }

  updateBio(bio) {
    return firebase.database().ref(`/accounts/public/${this.uid}/userBio`).set(bio);
  }

  updateAdd1(add) {
    return firebase.database().ref(`/accounts/public/${this.uid}/add1`).set(add);
  }

  updateBusinessName(name) {
    return firebase.database().ref(`/accounts/public/${this.uid}/businessName`).set(name);
  }

  updateArtistInfo(info) {
    return firebase.database().ref(`/accounts/public/${this.uid}/artistInfo`).set(info);
  }

  updateBusinessInfo(info) {
    return firebase.database().ref(`/accounts/public/${this.uid}/businessInfo`).set(info);
  }

  getUserPublicdata(uid) {
    return firebase.database().ref(`/accounts/public/${uid}`);
  }

  getAllUsers() {
    return firebase.database().ref(`/accounts/public`);
  }

  getUserType(uid) {
    return firebase.database().ref(`/accounts/public/${uid}/userType`);
  }

  getUserName(uid) {
    return firebase.database().ref(`/accounts/public/${uid}/name/userName`);
  }

  getBusinessName(uid) {
    return firebase.database().ref(`/accounts/public/${uid}/businessName`);
  }

  getUserDp(uid) {
    return firebase.database().ref(`/accounts/public/${uid}/photoURL`);
  }

  getUniqueId(uid?: string) {
    return firebase.database().ref(`/accounts/public/${uid}/uniqueKey`);
  }

  updateBusinessHours(bhData: BusinessHours, userId?: string) {
    return firebase.database().ref(`/accounts/public/${userId || this.uid}/bHours`).set(bhData);
  }

  getUserComments(userId: string) {
    return firebase.database().ref(`/publicList/comments/${userId}`);
  }

  submitComment(comment: CommentModel) {
    return firebase.database().ref(`/publicList/comments/${comment.cOn}`).push(comment);
  }

  getSingleCommentData(commentId) {
    return firebase.database().ref(`/publicList/comments/${this.uid}/${commentId}`);
  }

  getFinalTransactionObject(trId: string) {
    return firebase.database().ref(`/transactions/final/${trId}`);
  }

  getPublicCalendarEvents(userId?: string) {
    return firebase.database().ref(`/publicList/calendarEvents/${userId || this.uid}/`);
  }

  getPublicCalendarEventsFiltered(filterKey: string, filterValue: string | number, userId?: string) {
    return this.getPublicCalendarEvents(userId).orderByChild(filterKey).equalTo(filterValue);
  }

  updateLastLogin(timeStamp, uid) {
    const updateLoginAt = firebase.functions().httpsCallable('updateLastLogin');
    return updateLoginAt({TS: timeStamp, UID: uid});
  }

  createComService(service) {
    return firebase.database().ref(`/publicList/services/${this.uid}`).push(service);
  }

  updateComService(service: ComService, sid: string) {
    return firebase.database().ref(`/publicList/services/${this.uid}/${sid}`).set(service);
  }

  getComServices(uid?: string) {
    return firebase.database().ref(`/publicList/services/${uid || this.uid}`);
  }

  getAvlComServices(uid: string) {
    return this.getComServices(uid).orderByChild('state').equalTo('pub');
  }

  getComService(serviceId: string, userId?: string) {
    return firebase.database().ref(`/publicList/services/${userId || this.uid}/${serviceId}`);
  }

  updateComServPubSt(value: boolean, serviceId: string, userId?: string) {
    return firebase.database().ref(`/publicList/services/${userId || this.uid}/${serviceId}`).child('publish').set(value);
  }

  deleteComService(serviceId: string, userId?: string) {
    return firebase.database().ref(`/publicList/services/${userId || this.uid}/${serviceId}`).remove();
  }

  createTempTransactionId(transact: TransactionObject) {
    return firebase.database().ref(`transactions/_tmp`).push(transact);
  }

  updateTransactionObject(transact: TransactionObject) {
    return firebase.database().ref(`transactions/_tmp/${transact.trId}`).set(transact);
  }

  // Function to get user gallery
  getUserGalleryObject(userId: string) {
    return firebase.database().ref(`/publicList/userGallery/${userId}`);
  }

  // Function to get event
  getVenueEventWithEventId(eventId) {
    return firebase.database().ref(`/publicList/venue_events/${eventId}`);
  }

  // Database ref to add venue event
  venueEventsNode() {
    return firebase.database().ref(`/publicList/venue_events`);
  }

  // Updates and resets

  resetUNC(to: number) {
    setTimeout(() => {
      firebase.database().ref(`/accounts/private/${this.uid}/unc`).set(0);
    }, to);
  }

  resetNPT(to: number) {
    setTimeout(() => {
      firebase.database().ref(`/accounts/private/${this.uid}/npt`).set(0);
    }, to);
  }
}
