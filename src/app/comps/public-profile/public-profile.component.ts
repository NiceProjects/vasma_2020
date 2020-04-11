import { Component, OnInit, OnDestroy } from '@angular/core';
import { PublicUser } from 'src/app/models/user.model';
import { FireService } from 'src/app/services/fire.service';
import { ActivatedRoute } from '@angular/router';
import { CusService } from 'src/app/services/cus.service';
import { UserFollowService } from 'src/app/services/user-follow.service';
import { size } from 'lodash';
import { ProfileViewService } from 'src/app/services/profile-view.service';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.scss']
})
export class PublicProfileComponent implements OnInit, OnDestroy {
  userData: PublicUser = null;
  userDataLoaded = false;
  userId: string;
  profileKey: string;
  authUser: PublicUser;
  isArtist;
  isVenue;
  isStudio;
  isFollowing;
  followersCount;
  followingCount;
  constructor(
    private fs: FireService,
    private route: ActivatedRoute,
    private cus: CusService,
    private ufs: UserFollowService,
    private _pv: ProfileViewService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.profileKey = params.uid;
      // console.log('profileKey is: ' + this.profileKey);
      this._pv.setProfKey(this.profileKey);
    });
    this.userId = this._pv.getProfUID;
    if (this.userId) this.doChecking();
    this._pv.onProfUidUpdate.subscribe(uid =>  {
      // console.log('detected uid: ', uid);
      this.userId = uid;
      this.doChecking();
    });
    // console.log('page initiated');
  }

  ngOnDestroy() {
    // console.log('profile page destroyed');
    this._pv.setProfKey(null);
  }

  doChecking() {
    this.isArtist = null;
    this.isVenue = null;
    this.isStudio = null;
    this.userData = null;
    this.isFollowing = null;
    this.followersCount = null;
    this.followingCount = null;
    // console.log('doing checking');
    if (this.userId) this.fs.getUserPublicdata(this.userId).once('value').then(res => {
      this.userData = res.val();
      // console.log(res.val());
      this.setUserType();
      this.subscribeToUserData();
      this.subscribeToFollowing();
    }).catch(err => console.log(err));

    // this.fs.checkUniqProfId(this.profileKey).once('value').then(snap => {
    //   console.log('User data loaded', snap.val());
    //   if (snap.val() !== null) {
    //     this.userId = Object.keys(snap.val())[0];
    //     this.fs.getUserPublicdata(this.userId).once('value').then(res => {
    //       this.userData = res.val();
    //       console.log(res.val());
    //       this.setUserType();
    //       this.subscribeToUserData();
    //       this.subscribeToFollowing();
    //     });
    //   }
    // });

    this.authUser = this.cus.getAuthUser();
    this.cus.onAuthUserUpdate.subscribe(data => {
      this.authUser = data;
      this.subscribeToFollowing();
    });
    this.subscribeToFollowing();
  }

  setUserType() {
    // console.log('checking acc type', this.userData);
    if (!this.userData) {
      return 0;
    } else {
      switch (this.userData.userType) {
        case 'artist': this.isArtist = true; break;
        case 'venue': this.isVenue = true; break;
        case 'studio': this.isStudio = true; break;
      }
    }
  }

  subscribeToUserData() {
    this.fs.getUserPublicdata(this.userId).on('value', res => {
      // console.log(res.val());
      this.userData = res.val();
      this.userDataLoaded = true;
    }, err => {
      console.log(err);
    });
  }

  subscribeToFollowing() {
    if (this.authUser && this.userId) {
      // console.log('Is following checking', this.userId);
      this.ufs.getIsFollowing(this.userId).once('value').then(snap => {
        this.isFollowing = snap.val();
      });
      this.ufs.getIsFollowing(this.userId).on('value', snap => {
        this.isFollowing = snap.val() !== null;
        // console.log('Is following data recieved', snap.val());
      });
    }
    this.getFolloweCount();
  }

  getFolloweCount() {
    this.ufs.getFollowers(this.userId).once('value').then(snap => {
      this.followersCount = this.getCount(snap.val());
    });
    this.ufs.getfollowing(this.userId).once('value').then(snap => {
      this.followingCount = this.getCount(snap.val());
    });
    this.ufs.getFollowers(this.userId).on('value', snap => {
      this.followersCount = this.getCount(snap.val());
    });
    this.ufs.getfollowing(this.userId).on('value', snap => {
      this.followingCount = this.getCount(snap.val());
    });
  }

  getCount(data) {
    if (!data) {
      return 0;
    } else {
      return size(data);
    }
  }

  follow() {
    this.ufs.follow(this.userId, this.authUser.uid);
  }

  unFollow() {
    this.ufs.unfollow(this.userId, this.authUser.uid);
  }

}
