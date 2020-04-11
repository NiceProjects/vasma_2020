import { Component, OnInit } from '@angular/core';
import { AppEventsService } from 'src/app/services/app-events.service';
import { scrollObject } from 'src/app/models/app-event.model';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss']
})
export class BottomNavComponent implements OnInit {
  scrollOffset = 0;
  bottomMode = false;
  lastScrollTime = 0;
  scrollViewing = false;
  bottomSideNavOpen = false;
  timeInterval;
  sideNavOPen = false;
  constructor(
    private _appEvents: AppEventsService
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.showBottomNav();
    }, 1000);
    this.scrollOffset = this._appEvents.getScroll();
    this._appEvents.onScroll.subscribe((scrollObj: scrollObject) => {
      this.bottomMode = false;
      this.scrollOffset = scrollObj.scrollOffset;
      if (!this.scrollViewing) {
        this.lastScrollTime = new Date().getTime();
        this.showIfScrollStops();
      }
    })
  }

  showBottomNav() {
    setTimeout(() => {
      this.bottomMode = true
    }, 50);
  }

  showIfScrollStops() {
    this.timeInterval = setInterval(() => {
      const now = new Date().getTime();
      if (now - this.lastScrollTime > 200) {
        this.bottomMode = true;
        this.scrollViewing = false;
        clearInterval(this.timeInterval);
      }
      else return null;
    }, 50);
  }

  sideNavToggle(st?: boolean) {
    if(st == true || st == false) this.sideNavOPen = st;
    else this.sideNavOPen = !this.sideNavOPen;
  }

  swipeToClose(e) {
    // console.log('Sidenav swipe event', e);
    const distanceX = e.deltaX;
    // const xStart = e.srcEvent.pageX - Math.abs(distanceX);
    // console.log(xStart, distanceX)
    if (distanceX < -50) return this.sideNavToggle(false);
    // if (this.viewPort.width <= 575.98 && xStart < 200 && distanceX >= 60) {
    //   if (from == 'chatPannel') return this._chat._selectChatListItem(null);
    //   if (from == 'chatList') return this._chat._toggleChatWindow();
    // }
  }
}
