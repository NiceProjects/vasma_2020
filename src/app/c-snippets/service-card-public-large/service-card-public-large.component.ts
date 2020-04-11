import { Component, OnInit, Input } from '@angular/core';
import { ComService } from 'src/app/models/commercial-service.model';
import { FireService } from 'src/app/services/fire.service';
import { ProfileViewService } from 'src/app/services/profile-view.service';

@Component({
  selector: 'app-service-card-public-large',
  templateUrl: './service-card-public-large.component.html',
  styleUrls: ['./service-card-public-large.component.scss']
})
export class ServiceCardPublicLargeComponent implements OnInit {
@Input('data-service') service: ComService;
  constructor(
    private _fs: FireService,
    private _pv: ProfileViewService
  ) { }

  ngOnInit() {
    // this.ProfUserId = this._pv.getProfUID;
    // this.getServiceData();
    // this._pv.onProfUidUpdate.subscribe(uid => {
    //   this.ProfUserId = uid;
    //   this.getServiceData();
    // });
  }

  getServiceData() {
    // if (this.ProfUserId && this.sericeUid)
    // this._fs.getComService(this.sericeUid, this.ProfUserId).once('value').then(snap => {
    //   if (snap.val()) {
    //     this.service = snap.val();
    //     this.isLoading = false;
    //   } else {
    //     this.serviceUnpublished = true;
    //     this.isLoading = false;
    //   }
    // });
  }

}
