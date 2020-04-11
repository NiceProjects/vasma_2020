import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ComService } from 'src/app/models/commercial-service.model';
import { PriceCalcService } from 'src/app/services/price-calc.service';

@Component({
  selector: 'app-service-list-card-public',
  templateUrl: './service-list-card-public.component.html',
  styleUrls: ['./service-list-card-public.component.scss']
})
export class ServiceListCardPublicComponent implements OnInit {
  @Input('data-service') service: ComService;
  @Input('data-detailMode') dtMode?: boolean;
  @Output('onSelect') onSelect = new EventEmitter<ComService>();
  constructor(
    public _pc: PriceCalcService
  ) { }

  ngOnInit() {
  }

  selThisService(serv) {
    this.onSelect.emit(serv);
  }

}
