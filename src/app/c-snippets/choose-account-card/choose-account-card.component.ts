import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-choose-account-card',
  templateUrl: './choose-account-card.component.html',
  styleUrls: ['./choose-account-card.component.scss']
})
export class ChooseAccountCardComponent implements OnInit {
  @Input('data-bg-img') bgImg: string;
  @Input('data-title') title: string;
  @Input('data-list') lists: any[];
  @Input('data-button') button: {link: string, path: 'string'};

  listOpen = false;
  constructor() { }

  ngOnInit() {
  }

  toggleCardList() {
    this.listOpen = !this.listOpen;
  }

}
