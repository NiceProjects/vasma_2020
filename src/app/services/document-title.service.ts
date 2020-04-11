import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentTitleService {
  docTitle = 'VASMA';
  routerTitle = 'Home';
  onRouterChange = new Subject<string>();
  constructor(
    private _router: Router
  ) {
    this._router.events.subscribe((e:any) => {
      // console.log(e instanceof NavigationEnd);
      if (e instanceof NavigationEnd) {
        console.log(e.url);
        const route = e.url;
        if (route === '/') return this.setDocumentTitle('Home');
        if (route === '/my_account/bookings') return this.setDocumentTitle('Bookings');
        if (route === '/my_account') return this.setDocumentTitle('Dashboard');
        if (route === '/my_account/dashboard') return this.setDocumentTitle('Dashboard');
        if (route === '/my_account/events') return this.setDocumentTitle('Events');
        if (route === '/my_account/prospects') return this.setDocumentTitle('Prospects');
        if (route === '/my_account/services') return this.setDocumentTitle('Services');
        if (route === '/my_account/gallery') return this.setDocumentTitle('Gallery');
        if (route === '/my_account/notifications') return this.setDocumentTitle('Notifications');
        if (route === '/my_account/profile_edit') return this.setDocumentTitle('Manage Profile');
        else return this.setDocumentTitle(null);
      }
    });
  }

  init() {
    return 'initiating';
  }

  setDocumentTitle(title) {
    if (title)  {
      this.docTitle = `${title} | VASMA`;
      this.routerTitle = title;
      this.onRouterChange.next(this.routerTitle);
    }
    else this.docTitle = `VASMA`;
    document.title = this.docTitle;
  }

  getRouterTitle() {
    return this.routerTitle;
  }
}
