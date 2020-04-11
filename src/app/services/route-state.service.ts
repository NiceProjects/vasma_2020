import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouteStateService {
  routeObj;
  constructor(
    private _router: Router
  ) { }

  init() {
    this._router.events.subscribe((e:any) => {
      // console.log(e instanceof NavigationEnd);
      if (e instanceof NavigationEnd) {
        console.log(e.url);
        const route = e.url;
      }
    });
  }
}
