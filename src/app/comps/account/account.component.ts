import { Component, OnInit } from '@angular/core';
import { PublicUser } from 'src/app/models/user.model';
import { CusService } from 'src/app/services/cus.service';
import { FireService } from 'src/app/services/fire.service';
import { AppEventsService } from 'src/app/services/app-events.service';
import { DashboardSidenavToggleService } from 'src/app/services/dashboard-sidenav-toggle.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss', './acc.adjustments.css']
})
export class AccountComponent implements OnInit {
  authUser: PublicUser;
  sideblkOpen = false;
  constructor(
    private cus: CusService,
    private fs: FireService,
    private _appEvents: AppEventsService,
    private _sideNavToggleService: DashboardSidenavToggleService
  ) {
    this.authUser = this.cus.getAuthUser();
    this.cus.onAuthUserUpdate.subscribe(user => this.authUser = user);
  }

  ngOnInit() {
    this.sideblkOpen = this._sideNavToggleService.getSideNavToggleState();
    this._sideNavToggleService.onStateUpdate.subscribe(state => {
      // console.log('update recieved', state);
      this.sideblkOpen = state;
    });
  }


  setUserType(type: string) {
    const conf = confirm(`Do you really want to continue as ${type}`);
    if (conf) {
      this.fs.setUserType(type, this.authUser.uid);
    }
  }

  toggleSideblock() {
    this._sideNavToggleService.toggleSideNav();
    // this._sideNavToggleService.toggleSideNav();
  }

  getBg() {
    switch (this.authUser.userType) {
      case 'artist': {
        return '/assets/img/user-types/artist-bg.jpg';
        break;
      }
      case 'venue': {
        return '/assets/img/user-types//venue-bg.jpg';
        break;
      }
      case 'studio': {
        return '/assets/img/user-types/studio-bg.jpg';
        break;
      }
    }
  }

  onBoxScroll(e) {
    const scrolledTop = document.getElementById('account-main-block').scrollTop;
    // console.log(scrolledTop);
    this._appEvents.updateScroll(scrolledTop);
  }
}
