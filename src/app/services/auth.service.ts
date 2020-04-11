import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { CusService } from './cus.service';
import { FireService } from './fire.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn: boolean;
  lastSignInTime: number;
  onAuthStateUpdate = new Subject<boolean>();
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private cus: CusService,
    private fire: FireService
  ) {
    this.afAuth.authState.subscribe((auth: firebase.User) => {
      // console.log('auth service auth state', auth);
      this.isLoggedIn = auth !== null;
      this.onAuthStateUpdate.next(this.isLoggedIn);
      if (this.isLoggedIn) {
        this.lastSignInTime = new Date(auth.metadata.lastSignInTime).getTime();
        // this.fire.updateLastLogin(this.lastSignInTime, auth.uid).then((res) => {
        //   console.log(res, 'LastloginTime updated');
        // }).catch(err => console.log('Error on last login update: ', err ));
        this.fire.watchCurFirebaseUser(auth.uid).on('value', snap => this.cus.setAuthUser(snap.val()));
        this.fire.watchPrivateUserData(auth.uid).on('value', snap => this.cus.setAuthPdt(snap.val()));
        this.fire.watchUserNotifications(auth.uid).on('value', snap => this.cus.setNotifications(snap.val()));

        this.fire.watchUserNotifications(auth.uid).on('child_added', snap => {
          // console.log(snap.val())
        });
      } else {
        this.lastSignInTime = null;
        this.cus.setAuthUser(null);
      }
    });
  }

  get authenticated() {
    return this.isLoggedIn;
  }

  signInWithEP(email, pwd) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, pwd);
  }

  registerWithEP(email, pwd) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, pwd);
  }

  loginWithGoogle() {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  loginWithFB() {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
  }

  loginWithTwitter() {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.TwitterAuthProvider());
  }

  logout() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigateByUrl('/login');
    });
  }

  resetRequest(email: string) {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }
}
