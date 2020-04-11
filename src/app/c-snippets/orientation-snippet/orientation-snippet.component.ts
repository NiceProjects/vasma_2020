import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-orientation-snippet',
  templateUrl: './orientation-snippet.component.html',
  styleUrls: ['./orientation-snippet.component.scss']
})
export class OrientationSnippetComponent implements OnInit, AfterViewInit {
  screenOrientation;
  viewportWitdth = window.innerWidth;
  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.setWindowOrientation();
  }

  setWindowOrientation(e?: any) {
    // let screenOrientation = '';
    this.viewportWitdth = window.innerWidth;
    if (e) console.log(e);
    switch (window.orientation) {
      case 0: this.screenOrientation = 'portrait'; break;
      case 90: this.screenOrientation = 'landscape'; break;
      case 180: this.screenOrientation = 'portrait'; break;
      case -90: this.screenOrientation = 'landscape'; break;
      default: this.screenOrientation = 'unknown';
    }
    console.log(`orientation of the window is`, this.screenOrientation);
    // console.log(window.screen.orientation.angle, this.viewportWitdth);
  }
}
