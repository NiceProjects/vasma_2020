import { Component, OnInit } from '@angular/core';
import { ProfileViewService } from 'src/app/services/profile-view.service';
import { CusService } from 'src/app/services/cus.service';
import { PublicUser } from 'src/app/models/user.model';

@Component({
  selector: 'app-public-user-gallery',
  templateUrl: './public-user-gallery.component.html',
  styleUrls: ['./public-user-gallery.component.scss']
})
export class PublicUserGalleryComponent implements OnInit {
  userId;
  authUser: PublicUser;
  constructor(
    private _pv: ProfileViewService,
    private _cus: CusService
  ) { }

  ngOnInit() {
    this.userId = this._pv.getProfUID;
    this._pv.onProfUidUpdate.subscribe(uid => {
      this.userId = uid;
    });

    this.authUser = this._cus.getAuthUser();
    this._cus.onAuthUserUpdate.subscribe(data => this.authUser = data);
  }

}
