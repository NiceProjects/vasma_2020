import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComService } from 'src/app/models/commercial-service.model';
import { FireService } from 'src/app/services/fire.service';
import { DataService } from 'src/app/services/data.service';
import { ProfileViewService } from 'src/app/services/profile-view.service';

@Component({
  selector: 'app-public-user-services',
  templateUrl: './public-user-services.component.html',
  styleUrls: ['./public-user-services.component.scss']
})
export class PublicUserServicesComponent implements OnInit {
  selService: ComService = null;
  selSerId: string;
  profileKey: string;
  services: ComService[];
  userId: string;
  isLoading = true;
  errLoadingList;
  errLoadingServ;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _fs: FireService,
    private _ds: DataService,
    private _pv: ProfileViewService
  ) { }

  ngOnInit() {
    // const routerParts = this._router.routerState.snapshot.url.split('/');
    // this.profileKey = routerParts[2];
    // this.selSerId = routerParts[4];
    // console.log('profileKey is: ' + this.profileKey);
    this._route.params.subscribe(params => {
      this.selSerId = params.serviceId;
      // console.log(this.selSerId);
    });

    this.userId = this._pv.getProfUID;
    this.loadServices();
    this._pv.onProfUidUpdate.subscribe(uid => {
      this.userId = uid;
      this.loadServices();
    });
  }

  loadServices() {
    if (this.userId) {
      if (!this.selSerId) this.getAllServices();
      else this.getSelectedService();
    }
  }

  getAllServices() {
    this._fs.getComServices(this.userId).orderByChild('publish').equalTo(true).once('value').then(snap => {
      if (snap.val()) this.services = Object.values(snap.val());
      this.isLoading = false;
    }).catch(err => {
      console.log(err);
      this.errLoadingList = true;
      this.isLoading = false;
    });

    this._fs.getComServices(this.userId).orderByChild('publish').equalTo(true).on('value', snap => {
      if (snap.val()) this.services = Object.values(snap.val());
      this.isLoading = false;
    }, err => {
      console.log(err);
      this.errLoadingList = true;
      this.isLoading = false;
    });
  }

  selThisService(service: ComService) {
    // console.log(service);
    this.selService = service;
    // this.selSerId = this.selService.uid;
  }

  getSelectedService() {
    this._fs.getComService(this.selSerId, this.userId).once('value').then(snap => {
      this.selService = snap.val();
      // console.log(this.selService);
      this.isLoading = false;
    }).catch(err => {
      this.errLoadingServ = true;
      // console.log(err);
      this.isLoading = false;
    });
    this._fs.getComService(this.selSerId, this.userId).on('value', snap => {
      this.selService = snap.val();
      this.isLoading = false;
    }, err => {
      this.errLoadingServ = true;
      // console.log(err);
      this.isLoading = false;
    });
  }
}
