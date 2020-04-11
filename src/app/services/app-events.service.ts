import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { scrollObject } from '../models/app-event.model';
// import Bowser from "bowser";
// import * as Bowser from "bowser";
// https://lancedikson.github.io/bowser/docs/

@Injectable({
  providedIn: 'root'
})
export class AppEventsService {
  scroll = 0;
  scrollDirection = null;
  browser = null;
  constructor() { }

  init() {
    // this.browser = Bowser.parse(window.navigator.userAgent);
  }

  onScroll = new Subject<scrollObject>();
  updateScroll(offset) {
    let dir;
    const dist = Math.abs(offset - this.scroll);
    if (offset - this.scroll) dir = 'down';
    else dir = 'up';
    this.scroll = offset;
    this.onScroll.next(new scrollObject(offset, dir, dist));
  }

  getScroll() {
    return this.scroll;
  }
}
