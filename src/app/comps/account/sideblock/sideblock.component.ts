import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { PublicUser } from 'src/app/models/user.model';
import { CusService } from 'src/app/services/cus.service';
import { AppDefService } from 'src/app/services/app-def.service';
import { UserFollowService } from 'src/app/services/user-follow.service';
import { size } from 'lodash';
import { NotificationModel } from 'src/app/models/notification.model';
import { DashboardSidenavToggleService } from 'src/app/services/dashboard-sidenav-toggle.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sideblock',
  templateUrl: './sideblock.component.html',
  styleUrls: ['./sideblock.component.scss', './sideblock-adj.css']
})
export class SideblockComponent implements OnInit, OnDestroy {

  @Output('onClose') closeIt = new EventEmitter<any>();
  authUser: PublicUser;
  followerCount: number;
  followingCount: number;
  followers;
  following;
  notifications: NotificationModel[];

  constructor(
    private cus: CusService,
    private ad: AppDefService,
    private ufs: UserFollowService,
    private _sideNavToggleServ: DashboardSidenavToggleService,
    private _as: AuthService
  ) { }

  ngOnInit() {
    this.authUser = this.cus.getAuthUser();
    this.cus.onAuthUserUpdate.subscribe(user => {
      this.authUser = user;
      this.getFollowCount();
    });
    console.log(this.authUser);
    this.getFollowCount();

    this.notifications = this.cus.getNotifications();
    this.cus.onNotificationsUpdated.subscribe(nData => this.notifications = nData);
  }

  getAvatarBg(url: string) {
    if (url) {
      return url;
    } else {
      return this.ad.appDefs.userAvatar;
    }
  }

  getFollowCount() {
    if (this.authUser) {
      // this.followers = this.ufs.getFollowers();
      // this.followers.snapshotChanges().subscribe(followers => {
      //   this.followerCount = this.countFollowers(followers.payload.val());
      // });
      this.ufs.getFollowers(this.authUser.uid).on('value', snap => {
        this.followerCount = this.countFollowers(snap.val());
      });
      this.following = this.ufs.getfollowing(this.authUser.uid);
      this.following.on('value', snap => {
        // console.log(snap.val());
        this.followingCount = this.countFollowers(snap.val());
      });
    }

  }

  private countFollowers(followers) {
    if (followers === null) {
      return 0;
    } else {
      return size(followers);
    }
  }

  closeSideNav() {
    this.closeIt.emit();
  }

  ngOnDestroy() {
    // this.followers.unsubscribe();
    // this.following.off();
  }

  toggleSideBlock() {
    this._sideNavToggleServ.toggleSideNav();
  }

  logout() {
    this._as.logout();
  }

  swipeToClose(e) {
    const distanceX = e.deltaX;
    if (distanceX < -50) return this.closeSideNav();
  }

}
