import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardSidenavToggleService {
  sidenavToggleState = false;
  onStateUpdate = new Subject<boolean>();
  constructor() { }

  toggleSideNav(state?: boolean) {
    // console.log('init called');
    if (state !== null && state !== undefined) {
      this.sidenavToggleState = state;
    } else {
      this.sidenavToggleState = !this.sidenavToggleState;
    }
    // console.log('update sending');
    this.onStateUpdate.next(this.sidenavToggleState);
    // console.log('update sent');
  }

  getSideNavToggleState() {
    return this.sidenavToggleState;
  }
}
