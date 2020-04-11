import { Component, OnInit } from '@angular/core';
import { AppEventsService } from 'src/app/services/app-events.service';
import { scrollObject } from 'src/app/models/app-event.model';
import { DocumentTitleService } from 'src/app/services/document-title.service';
import { DashboardSidenavToggleService } from 'src/app/services/dashboard-sidenav-toggle.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-header-sm',
  templateUrl: './dashboard-header-sm.component.html',
  styleUrls: ['./dashboard-header-sm.component.scss']
})
export class DashboardHeaderSmComponent implements OnInit {
  scrollOffset = 0;
  docTitle;
  constructor(
    private _appEvents: AppEventsService,
    private _docTitleServ: DocumentTitleService,
    private _sideNavToggleServ: DashboardSidenavToggleService,
    private _router: Router
  ) {}

  ngOnInit() {
    this.docTitle = this._docTitleServ.getRouterTitle();
    this._docTitleServ.onRouterChange.subscribe(title => this.docTitle = title);
    this.scrollOffset = this._appEvents.getScroll();
    // console.log(this.scrollOffset);

    this._appEvents.onScroll.subscribe((scrollObj: scrollObject) => {
      // console.log(this.scrollOffset);
      this.scrollOffset = scrollObj.scrollOffset;
    });
  }

  goBack() {
    const url = this._router.url;
    const curUrl = url.split('/');
    console.log(curUrl);
    if (curUrl[2] == 'dashboard') return this._router.navigate(['/']);
    if (url.startsWith('/my_account/events/create_new')) return this._router.navigate(['/my_account/events']);
    if (url.startsWith('/my_account/events/edit/')) return this._router.navigate(['/my_account/events']);
    if (url.startsWith('/my_account/services/create_new')) return this._router.navigate(['/my_account/services']);
    if (url.startsWith('/my_account/services/update/')) return this._router.navigate(['/my_account/services']);
    else return this._router.navigate(['/my_account/dashboard']);
  }

  toggleSideblock() {
    this._sideNavToggleServ.toggleSideNav();
  }

}
