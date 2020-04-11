import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-payee-reciept',
  templateUrl: './payee-reciept.component.html',
  styleUrls: ['./payee-reciept.component.scss']
})
export class PayeeRecieptComponent implements OnInit {
  @Input('data-reciept') reciept;
  @Input('data-reciept-msg') recieptMsg: string;
  constructor() { }

  ngOnInit() {
  }

}
