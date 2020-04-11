import { Component, OnInit } from '@angular/core';
import { AppEventsService } from 'src/app/services/app-events.service';
import { scrollObject } from 'src/app/models/app-event.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home-header-sm',
  templateUrl: './home-header-sm.component.html',
  styleUrls: ['./home-header-sm.component.scss', '../headers.scss']
})
export class HomeHeaderSmComponent implements OnInit {
  scrollOffset = 0;
  constructor(
    private _appEvents: AppEventsService,
    private as: AuthService
  ) {
    this.isAuthenticated = this.as.authenticated;
    this.as.onAuthStateUpdate.subscribe(auth => this.isAuthenticated = auth);
  }

  ngOnInit() {
    this.scrollOffset = this._appEvents.getScroll();
    this._appEvents.onScroll.subscribe((scrollObj: scrollObject) => {
      this.scrollOffset = scrollObj.scrollOffset;
    })
  }
  isAuthenticated = false;
  logout() {
    this.as.logout();
  }
}
