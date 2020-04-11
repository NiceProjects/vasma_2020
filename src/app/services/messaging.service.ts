import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/messaging';
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})

export class MessagingService {

  // messaging = firebase.messaging();
  currentMessage = new BehaviorSubject(null);

  constructor() { }

  updateToken(token) {
    firebase.auth().onAuthStateChanged((e) =>  {
      if (!e) return;
      const data = {[e.uid]: token }
      firebase.database().ref(`fcmTokens/`).update(data)
      .then(() => console.log('updated'))
      .catch(err => console.log(err));
    })
  }

  getPermission() {
    firebase.messaging().requestPermission()
    .then(() => {
      console.log('Notification permission granted.');
      return firebase.messaging().getToken()
    })
    .then(token => {
      console.log(token)
      this.updateToken(token)
    })
    .catch((err) => {
      console.log('Unable to get permission to notify.', err);
    });
  }

  receiveMessage() {
    firebase.messaging().onMessage((payload) => {
      console.log("Message received. ", payload);
      this.currentMessage.next(payload)
    });
  }
}