import { Component, OnInit } from '@angular/core';
import { ProfileViewService } from 'src/app/services/profile-view.service';
import { CusService } from 'src/app/services/cus.service';
import { PublicUser } from 'src/app/models/user.model';
import { Router, ActivatedRoute } from '@angular/router';
import { VenueEventData } from 'src/app/models/venue-event.model';

@Component({
  selector: 'app-public-user-events',
  templateUrl: './public-user-events.component.html',
  styleUrls: ['./public-user-events.component.scss']
})
export class PublicUserEventsComponent implements OnInit {
  userId;
  authUser: PublicUser;
  userEventsLoaded = false;
  profPublicData: PublicUser = undefined;
  publicEventsList: any[] = undefined;
  isLoading = true;
  activeEventId = null;
  constructor(
    private _pv: ProfileViewService,
    private _cus: CusService,
    private _router: Router,
    private _route: ActivatedRoute
  ) { }

  ngOnInit() {
    this._route.params.subscribe(params => {
      this.activeEventId = params.id;
      console.log(this.activeEventId);
    });

    // STEP1: To get user id of particular user profile
    this.userId = this._pv.getProfUID;
    this._pv.onProfUidUpdate.subscribe(uid => {
      this.userId = uid;
      this.getProfilePublicData();
    });

    if (this.userId) this.getProfilePublicData();

    // STEP2: To get logged user public data
    this.authUser = this._cus.getAuthUser();
    this._cus.onAuthUserUpdate.subscribe(data => {
      this.authUser = data;
    });
  }

  // Get user public data by user id
  getProfilePublicData() {
    if (!this.userId) return null;
    this.profPublicData = this._pv.getSelProfData;
    this._pv.onSelProfPublicDataUpdated.subscribe(data => {
      console.log('Response recieved onSelProfPublicDataUpdated', data);
      this.profPublicData = data;
      if (data) this.getUserEvents();
      else this.publicEventsList = [];
    });
    if (!this.profPublicData) return this.publicEventsList = [];
    this.getUserEvents();
  }

  getUserEvents() {
    if (!this.profPublicData.eventsList) return this.publicEventsList = [];
    else {
      const arr = Object.values(this.profPublicData.eventsList);
      console.log(arr);
      const publishedEvents = arr.filter(a => a.publishSt);
      if (publishedEvents.length < 1) return this.publicEventsList = [];
      this.publicEventsList = publishedEvents.sort((a, b) => b.creationTime - a.creationTime);
      console.log('public events updated', this.publicEventsList);
    }
  }
}
