import { Component, OnInit, Input } from '@angular/core';
import { ComService } from 'src/app/models/commercial-service.model';
import { FireService } from 'src/app/services/fire.service';

@Component({
  selector: 'app-service-card-wide',
  templateUrl: './service-card-wide.component.html',
  styleUrls: ['./service-card-wide.component.scss']
})
export class ServiceCardWideComponent implements OnInit {
  @Input('data-object') service: ComService;
  @Input('data-index') i?: number;
  constructor(
    private _fs: FireService
  ) { }

  ngOnInit() {
    // console.log(this.service, this.i);
  }

  updateServicePublish() {
    this._fs.updateComServPubSt(!this.service.publish, this.service.uid);
  }

  deleteThisService(serviceId?: string) {
    const conf = confirm('Do you really want to delete this service?');
    if (conf)
    this._fs.deleteComService(serviceId)
    .then(() => alert('Service removed successfully.'))
    .catch(err => {
      // console.log(err);
      alert(`Something went wrong. Unable to delete the service. Please try again later`);
    });
  }
}
