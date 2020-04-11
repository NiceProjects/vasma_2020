import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer-lg',
  templateUrl: './footer-lg.component.html',
  styleUrls: ['./footer-lg.component.scss']
})
export class FooterLgComponent implements OnInit {
  year = new Date().getFullYear();
  constructor() { }

  ngOnInit() {
  }

}
