import { Component, OnInit } from '@angular/core';
import { UserFollowService } from 'src/app/services/user-follow.service';
import { FireService } from 'src/app/services/fire.service';
import { CusService } from 'src/app/services/cus.service';
import { PublicUser } from 'src/app/models/user.model';

@Component({
  selector: 'app-user-prospects',
  templateUrl: './user-prospects.component.html',
  styleUrls: ['./user-prospects.component.scss']
})
export class UserProspectsComponent implements OnInit {
  authUser: PublicUser;
  viewList = 0;
  followersCount: number;
  followingCount: number;
  followers;
  following;
  prospects = [
    'HrtU841DV2cPAzsfYWsv63ZcxNk2',
    'TzNaycOLr2c5EVBKjwI30OVkHFk2',
    'giyhllAu7AQc4XmyFuqzL1Vlptu2',
    'oxyuMpREShdZvCEzL148A1VkAHB2',
    'w7cN5sI8TPW05LV9uItu4RnnCaz1',
    'xqOUpDRGjFNctS8SAjy6rjjyG9J3'
  ];
  constructor(
    private cus: CusService,
    private ufs: UserFollowService,
    private fs: FireService
  ) { }

  ngOnInit() {
    this.authUser = this.cus.getAuthUser();
    this.cus.onAuthUserUpdate.subscribe(user => this.authUser = user);
    this.fs.resetNPT(2000);
    this.ufs.getFollowers(this.authUser.uid).once('value').then(snap => {
      if (snap.val() !== null) {
        this.followers = Object.keys(snap.val());
      } else {
        this.followers = [];
      }
    });

    this.ufs.getFollowers(this.authUser.uid).on('value', snap => {
      if (snap.val() !== null) {
        this.followersCount = Object.keys(snap.val()).length;
      } else {
        this.followersCount = 0;
      }
    });

    this.ufs.getfollowing(this.authUser.uid).once('value').then(snap => {
      if (snap.val()) {
        this.following = Object.keys(snap.val());
      } else {
        this.following = [];
      }
    });

    this.ufs.getfollowing(this.authUser.uid).on('value', snap => {
      if (snap.val()) {
        this.followingCount = Object.keys(snap.val()).length;
      } else {
        this.followingCount = 0;
      }
    });
  }

  changeList(type: number) {
    this.viewList = type;
  }

}
