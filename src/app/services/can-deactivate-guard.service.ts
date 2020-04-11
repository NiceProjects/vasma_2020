import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { CanDeactivate } from '@angular/router/src/utils/preactivation';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root'
})

export class CanDeactivateGuardService implements CanDeactivate<CanComponentDeactivate> {
  constructor() { }

  canDeactivate(
    component: CanComponentDeactivate,
    currenRoute: ActivatedRouteSnapshot,
    curState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return component.canDeactivate();
  }
}
