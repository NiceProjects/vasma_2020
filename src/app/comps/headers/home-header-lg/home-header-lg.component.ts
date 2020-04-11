import { Component, OnInit } from '@angular/core';
import { AppEventsService } from 'src/app/services/app-events.service';
import { scrollObject } from 'src/app/models/app-event.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home-header-lg',
  templateUrl: './home-header-lg.component.html',
  styleUrls: ['./home-header-lg.component.scss']
})
export class HomeHeaderLgComponent implements OnInit {
  topScroll = 0;
  authState = false;
  constructor(
    private _appEvent: AppEventsService,
    private _as: AuthService
  ) { }

  ngOnInit() {
    this.topScroll = this._appEvent.getScroll();
    this._appEvent.onScroll.subscribe((offset: scrollObject) => this.topScroll = offset.scrollOffset);
    this.authState = this._as.authenticated;
    this._as.onAuthStateUpdate.subscribe(auth => this.authState = this._as.authenticated);
  }

  logout() {
    this._as.logout();
  }

}
