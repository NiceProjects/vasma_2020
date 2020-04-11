import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FireService } from 'src/app/services/fire.service';
import { AuthUserMeta, PublicUser } from 'src/app/models/user.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  viewSt = 0;
  mode = 'login';
  rippleColor = 'rgba(0, 0, 0, 0.15)';
  authInProgress = false;
  authFormSubmitTriggered = false;
  returnUrl;
  Email;
  Password;
  loginErr = false;
  loginErrMsg = null;
  actionUrl = null;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private as: AuthService,
    private fs: FireService
  ) { }

  ngOnInit() {
    this.actionUrl = window.localStorage.getItem('returnUrl');
    console.log(this.actionUrl);
    this.route.url.subscribe(url => {
      // // console.log(url[0]);
      this.mode = url[0].path;
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
    if (this.as.authenticated) {
      this.navigateOnLogin();
    }

    this.as.onAuthStateUpdate.subscribe(auth => {
      if (auth) {
        this.navigateOnLogin();
      }
    });
  }

  setMode(id) {
    this.viewSt = id;
  }

  onFormSubmit(fv, form) {
    if (this.authInProgress) {
      return;
    }
    // console.log(fv, form);
    this.authFormSubmitTriggered = true;
    if (fv) {
      this.authInProgress = true;
      switch (this.mode) {
        case 'login': {
          // console.log('loggin in');
          this.as.signInWithEP(this.Email, this.Password).then(result => {
            // console.log('Sign in result', result.user);
            this.navigateOnLogin();
          }).catch(err => {
            this.handleError(err.code);
            this.authInProgress = false;
          });
          break;
        }
        case 'register': {
          // console.log('registering');
          this.as.registerWithEP(this.Email, this.Password).then(result => {
            // console.log(result.additionalUserInfo, result.user);
            this.createUserAndSet(JSON.parse(JSON.stringify(result.user)));
          }).catch(err => {
            // console.log(err);
            this.handleError(err.code);
            this.authInProgress = false;
          });
          break;
        }
        case 'reset': {
          // console.log('resetting');
          this.as.resetRequest(this.Email).then(() => {
            alert(`Password reset email sent successfully to ${this.Email}`);
          }).catch(err => {
            this.handleError(err.code);
          });
          break;
        }
      }
    }
  }

  loginWithSocial(provider: string) {
    this.authInProgress = true;
    switch (provider) {
      case 'google': {
        this.as.loginWithGoogle().then(result => {
          const resultUser = JSON.parse(JSON.stringify(result.user));
          // console.log('login with google response', resultUser);
          this.checkNewUser(result.user.email, resultUser);
        }).catch(err => {
          this.handleError(err.code);
          // console.log(err.message);
          this.authInProgress = false;
        });
        break;
      }
      case 'fb': {
        this.as.loginWithFB().then(result => {
          const resultUser = JSON.parse(JSON.stringify(result.user));
          // console.log('login with facebook response', resultUser);
          this.checkNewUser(result.user.email, resultUser);
        }).catch(err => {
          this.handleError(err.code);
          // console.log(err, err.message);
          this.authInProgress = false;
        });
        break;
      }
      case 'twitter': {
        this.as.loginWithTwitter().then(result => {
          const resultUser = JSON.parse(JSON.stringify(result.user));
          // console.log('login with twitter response', resultUser);
          this.checkNewUser(result.user.email, resultUser);
        }).catch(err => {
          this.handleError(err.code);
          // console.log(err, err.message);
          this.authInProgress = false;
        });
        break;
      }
    }
  }

  checkNewUser(email, user) {
    this.fs.checkUserExistence(email).once('value').then(snapshot => {
      const snap = snapshot.val();
      if (snap) {
        // console.log('user existed', snap);
        this.navigateOnLogin();
        return;
      } else {
        // console.log('User not existed, May be new User');
        this.createUserAndSet(user);
      }
    });
  }

  createUserAndSet(data) {
    let user = new PublicUser();
    let userMeta = new AuthUserMeta();
    const nameArr = this.getSSD(data.displayName);

    //  Assign priliminary user data
    user.email = data.email;
    user.uid = data.uid;
    user.uniqueKey = data.uid;
    user.name.fName = nameArr[0] || null;
    user.name.lName = nameArr[1] || null;
    user.name.userName = data.displayName || data.email.split('@')[0];
    user.photoURL = data.photoURL || null;

    // Assign user meta
    userMeta.createdAt = data.createdAt;
    userMeta.uid = data.uid;
    userMeta.uniqueKey = data.uid;
    userMeta.email = data.email;
    userMeta.lastLoginAt = data.lastLoginAt;
    userMeta.providerId = data.providerData[0].providerId;
    userMeta.emailVerified = data.emailVerified;

    // console.log('User data created: ', user);
    // console.log('User meta data created: ', userMeta);

    this.fs.setUserDataOnRegister(user).then(() => {
      this.fs.setUserMeta(userMeta).then(() => {
        // console.log('User created successfully');
        this.router.navigate(['/']);
      });
    });
  }

  getSSD(str: string) {
    if (str) {
      return str.split(' ');
    } else {
      return [];
    }
  }

  handleError(code: string) {
    this.loginErr = true;
    // console.log(code);
    switch (code) {
      case 'auth/account-exists-with-different-credential': {
        this.loginErrMsg = 'Unable to login. Please try signing with different method.';
        break;
      }

      case 'auth/wrong-password': {
        this.loginErrMsg = 'Invalid password or email';
        break;
      }

      case 'auth/email-already-in-use': {
        this.loginErrMsg = 'Email already in use by another account. Please login or use another email address.';
        break;
      }

      case 'auth/invalid-credential': {
        this.loginErrMsg = 'Unable to login. Please try signing with different method.';
        break;
      }

      default: {
        this.loginErrMsg = 'Something went wrong. Please try again or contact support.';
        break;
      }
    }
  }

  navigateOnLogin() {
    // console.log('Navigating after login', this.returnUrl);
    if (this.actionUrl) return this.router.navigate([this.actionUrl]).then(() => window.localStorage.removeItem('returnUrl'));
    if (this.returnUrl) return this.router.navigateByUrl(this.returnUrl);
    return this.router.navigateByUrl('/');
  }

}
