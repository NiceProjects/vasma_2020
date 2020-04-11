import { Component, OnInit } from '@angular/core';
import { AppEventsService } from 'src/app/services/app-events.service';
import { scrollObject } from 'src/app/models/app-event.model';

@Component({
  selector: 'app-home-header',
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.scss', '../headers.scss']
})
export class HomeHeaderComponent implements OnInit {
  topScroll = 0;
  constructor(
    private _appEvent: AppEventsService
  ) { }

  ngOnInit() {
    this.topScroll = this._appEvent.getScroll();
    this._appEvent.onScroll.subscribe((offset: scrollObject) => this.topScroll = offset.scrollOffset);
  }

}
