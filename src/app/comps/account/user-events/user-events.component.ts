import { Component, OnInit } from '@angular/core';
import { CusService } from 'src/app/services/cus.service';
import { PublicUser, PublicVenueEvent } from 'src/app/models/user.model';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import 'firebase/database';

@Component({
  selector: 'app-user-events',
  templateUrl: './user-events.component.html',
  styleUrls: ['./user-events.component.scss']
})
export class UserEventsComponent implements OnInit {
  isLoading = true;
  authUser: PublicUser;
  userAccessStatus;
  firebaseDataloadMessage;
  eventsList: PublicVenueEvent[] = null;
  constructor(
    private _cus: CusService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.authUser = this._cus.getAuthUser();
    this.checkUserAccess();
    this._cus.onAuthUserUpdate.subscribe(user => {
      this.authUser == user;
      this.checkUserAccess();
    });
  }

  checkUserAccess() {
    if (!this.authUser) return;
    if (this.authUser.userType !== 'venue') return  this._router.navigate(['/my_account/dashboard']);
    if (this.authUser.eventsList) this.eventsList = Object.values(this.authUser.eventsList);
    else this.eventsList = null;
    if (this.eventsList !== [] && this.eventsList) this.eventsList = this.eventsList.sort((a: PublicVenueEvent, b: PublicVenueEvent) => b.creationTime - a.creationTime);
    this.isLoading = false;
  }
}
