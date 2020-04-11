import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class UserFollowService {

  constructor(
    private db: AngularFireDatabase
  ) { }

  getFollowers(userId?: string) {
    // const uid = firebase.auth().currentUser.uid;
    return firebase.database().ref(`/followersData/followers/${userId}`);
    // return this.db.object(`/followersData/followers/${userId}`);
  }

  getfollowing(userId?: string) {
    // const uid = firebase.auth().currentUser.uid;
    return firebase.database().ref(`/followersData/following/${userId}`);
    // return this.db.object(`/followersData/following`).query();
  }

  getIsFollowing(followerId: string) {
    const uid = firebase.auth().currentUser.uid;
    return firebase.database().ref(`/followersData/following/${uid}/${followerId}`);
    // return this.db.object(`/followersData/following/${followerId}/${followId}`);
  }

  follow(followerId: string, followIda?: string) {
    const myUserId = firebase.auth().currentUser.uid;
    this.db.object(`/followersData/followers/${followerId}`).update({[myUserId]: true});
    this.db.object(`/followersData/following/${myUserId}`).update({[followerId]: true});
  }

  unfollow(followerId: string, followedIda?: string) {
    const myUserId = firebase.auth().currentUser.uid;
    this.db.object(`/followersData/followers/${followerId}/${myUserId}`).remove();
    this.db.object(`/followersData/following/${myUserId}/${followerId}`).remove();
  }
}
