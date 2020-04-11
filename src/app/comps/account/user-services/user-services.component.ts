import { Component, OnInit } from '@angular/core';
import { ComService, DefKVPairs, AddCharges } from 'src/app/models/commercial-service.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FireService } from 'src/app/services/fire.service';
import { DataService } from 'src/app/services/data.service';
import { RegExps } from 'src/app/models/regExp.model';
import { AppDefService } from 'src/app/services/app-def.service';
import { CusService } from 'src/app/services/cus.service';
import { PublicUser } from 'src/app/models/user.model';

@Component({
  selector: 'app-user-services',
  templateUrl: './user-services.component.html',
  styleUrls: ['./user-services.component.scss']
})
export class UserServicesComponent implements OnInit {
  services: ComService[];
  selService: ComService = new ComService();
  regEx = new RegExps();
  mode: 'create_new' | 'update' | 'list' = 'list';
  servSelId: string;
  serviceFindErr = false;
  isLoading = true;
  formSubmitting = false;
  pricingModels: DefKVPairs[];
  minBookingLimArr = [];
  maxBookingLimArr = [];
  collAddCharges = false;
  checkboxErr = false;
  descUpdated = false;
  user: PublicUser;
  dayBuffer = [];
  hourBuffer = [];
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _fs: FireService,
    private _ds: DataService,
    private _ads: AppDefService,
    private _cus: CusService
  ) { }

  ngOnInit() {
    this.user = this._cus.getAuthUser();
    this._cus.onAuthUserUpdate.subscribe(user => this.user = user);
    this._route.params.subscribe(params => {
      console.log('Services route params', params);
      if (params.mode) {
        this.mode = params.mode;
        if (this.mode === 'create_new') {
          this.selService = new ComService();
          this.selService.sProvId = this.user.uid;
          this.isLoading = false;
        }
        if (params.id) {
          this.servSelId = params.id;
          this.getSelectedService(this.servSelId);
        }
      } else {
        this.mode = 'list';
        this.getAllServices();
      }
    });
    this.pricingModels = this._ads.defPricing;
    if (['create_new', 'update'].indexOf(this.mode) >= 0) {
      this.minBookingLimArr = this.getSlotsArray(1, 24);
      this.maxBookingLimArr = this.getSlotsArray((this.selService.minBookValue || 1), 24);
    }
  }

  getAllServices() {
    this._fs.getComServices().on('value', snap => {
      this.services = this._ds.getDataWithObjWithKeys(snap.val());
      if (this.services && this.services !== [])
      this.services = this.services.sort((a: ComService, b: ComService) => b.createdAt - a.createdAt);
      console.log(this.services);
      this.isLoading = false;
    }, err => {
      console.log(err);
      this.isLoading = false;
    });
  }

  getSelectedService(id: string) {
    this._fs.getComService(id).once('value').then(snap => {
      this.serviceFindErr = snap.val() !== null;
      if (snap.val()) {
        this.selService = snap.val();
        if (!this.selService.modified) this.selService.modified = [];
        if (!this.selService.addCharges) this.selService.addCharges = [];
        else this.collAddCharges = true;
        if (!this.selService.minBookValue) this.selService.minBookValue = 1;
        if (!this.selService.maxBookValue) this.selService.maxBookValue = 1;
        this.isLoading = false;
      } else {
        this.isLoading = false;
        this.selService = null;
        this.serviceFindErr = true;
      }
    }).catch(err => {
      console.log(err);
      this.isLoading = false;
      this.serviceFindErr = true;
    });
  }


  dummySubmit() {}

  onFormSubmit(fv, fp) {
    console.log('SelectedService on submit', this.selService);
    if (this.formSubmitting) return;
    else {
      console.log(fv, fp);
      if (fv && (!fp || this.descUpdated)) {
        this.formSubmitting = true;
        if (this.mode === 'create_new') {
          this.selService.createdAt = new Date().getTime();
          this.createService();
        }
        if (this.mode === 'update') {
          this.selService.modified.push({time: new Date().getTime()});
          this.updateService(this.selService, this.servSelId);
        }
      }
      console.log(this.selService);
    }
  }

  justSaveToDB(fv, fp) {
    this.selService.publish = false;
    this.onFormSubmit(fv, fp);
  }
  pushToPublic(fv, fp) {
    this.selService.publish = true;
    this.onFormSubmit(fv, fp);
  }

  createService() {
    this._fs.createComService(this.selService)
    .then(snap => this._router.navigate(['/my_account/services']))
    .catch(err => {
      this.formSubmitting = false;
      alert('Something went wrong. Unable to save your service. Please try again later.');
    });
  }

  updateService(service, sid) {
    this._fs.updateComService(service, sid).then(snap => {
      console.log('Service updated');
      this._router.navigate(['/my_account/services']);
    }).catch(err => {
      console.log(err);
      this.formSubmitting = false;
      alert('Something went wrong. Unable to save your service. Please try again later.');
    });
  }

  onPricingModelChange(e) {
    console.log(e);
    const unit = this.pricingModels.filter((E: DefKVPairs) => E.key === e)[0].defUnit;
    if (unit) this.selService.unit = unit;
  }

  onPriceChange(val) {
    // console.log(this.selService.price);
  }

  getSlotsArray(min, max) {
    let arr = [];
    for (let i = min; i <= max; i++ ) {
      arr.push(i);
    }
    return arr;
  }

  onMinMaxUpdate() {
    setTimeout(() => {
      const min = this.selService.minBookValue;
      const max = this.selService.maxBookValue;
      console.log('min: ', min, ' max: ', max);
      if (min && max) {
        if (min > max) {
          this.selService.maxBookValue = min;
          this.selService.minBookValue = max;
        }
      }

      this.maxBookingLimArr = this.getSlotsArray(this.selService.minBookValue, 24);
    }, 500);
    console.log('min: ', this.selService.minBookValue, ' max: ', this.selService.maxBookValue);
  }

  getQuillToolbar(id) {
    return this._ds.getQuillToolbar(id);
  }

  removeCharge(i: number) {
    this.selService.addCharges.splice(i, 1);
  }

  consoleIt(e: any) {
    // const v = e.checked;
    // console.log(v);
    console.log(e);
  }

  addCharges() {
    this.selService.addCharges.push(new AddCharges());
  }

  onBufferTypeSelect() {
    if (this.selService.BType == 'hours') return this.selService.BBFT = 3 * 3600000;
    if (this.selService.BType == 'days') return this.selService.BBFT = 1;
    if (this.selService.BType == 'beforeday') return this.selService.BBFT = 0;
  }

  getBufferArray() {
    let Arr = [];
    if (this.selService.BType == 'hours') {
      for (let i=1; i<=24; i++) {
        Arr.push(i);
      }
    }

    if (this.selService.BType == 'days') {
      for (let i=1; i<=3; i++) {
        Arr.push(i);
      }
    }
    return Arr;
  }
}
