import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FireService } from 'src/app/services/fire.service';
import { UserFollowService } from 'src/app/services/user-follow.service';
import { PublicUser } from 'src/app/models/user.model';
import { CusService } from 'src/app/services/cus.service';


@Component({
  selector: 'app-user-prospect-card',
  templateUrl: './user-prospect-card.component.html',
  styleUrls: ['./user-prospect-card.component.scss', './adjustment.css']
})

export class UserProspectCardComponent implements OnInit, OnDestroy {
  @Input('data-userId') uid: string;
  userData: PublicUser = null;
  isFollowing;
  checkFollow;
  authUser: PublicUser;
  constructor(
    private fs: FireService,
    private ufs: UserFollowService,
    private cus: CusService
  ) { }

  ngOnInit() {
    this.fs.getUserPublicdata(this.uid).once('value').then(snap => {
      this.userData = snap.val();
      if (snap.val() !== null) {
        this.checkFollowing();
      }
    });

    this.authUser = this.cus.getAuthUser();
    this.cus.onAuthUserUpdate.subscribe(udt => this.authUser = udt);
  }

  checkFollowing() {
    this.checkFollow = this.ufs.getIsFollowing(this.uid);
    this.checkFollow.on('value', snap => {
      this.isFollowing = snap.val() === true;
    });
  }

  follow() {
    this.ufs.follow(this.uid);
  }

  unFollow() {
    this.ufs.unfollow(this.uid);
  }

  ngOnDestroy() {
    // this.checkFollow.off();
  }
}
