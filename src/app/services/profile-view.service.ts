import { Injectable, EventEmitter } from '@angular/core';
import { ComService } from '../models/commercial-service.model';
import { CommentModel } from '../models/comment.model';
import { FireService } from './fire.service';
import { Subject } from 'rxjs';
import { PublicUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileViewService {
  selProfUid: string = null;
  selProfPublicData: PublicUser;
  onSelProfPublicDataUpdated = new EventEmitter<PublicUser>();
  selProfUsername: string = null;
  onProfUidUpdate = new Subject<string>();
  selProfServices: ComService[];
  selProfComments: CommentModel[];
  constructor(
    private _fs: FireService
  ) { }

  get getProfUID(): string {
    return this.selProfUid;
  }

  setProfKey(profKey: string) {
    if (!profKey) {
      this.selProfUsername = null;
      this.selProfUid = null;
      return null;
    }
    if (this.selProfUsername !== profKey) {
      this.selProfUsername = profKey;
      this.setProfUid();
    }
  }

  setProfUid() {
    // console.log('Setting profile uid');
    this._fs.checkUniqProfId(this.selProfUsername).once('value').then(snap => {
      // console.log('Uid call data: ', snap.val());
      if (snap.val() !== null) this.selProfUid = Object.keys(snap.val())[0];
      else this.selProfUid = null;
      this.onProfUidUpdate.next(this.selProfUid);
      this.setProfPublicData(this.selProfUid);
    }).catch(err => console.log(err));
  }

  // get profile public data
  get getSelProfData(): PublicUser {
    return this.selProfPublicData;
  }

  // Set profile public data
  setProfPublicData(uid: string) {
    console.log('setProfPublicData function initiated');
    if (!uid) return null;
    // this._fs.getUserPublicdata(uid).once('value').then(snap => {
    //   this.selProfPublicData = snap.val();
    //   this.onSelProfPublicDataUpdated.next(this.selProfPublicData);
    // });
    this._fs.getUserPublicdata(uid).on('value', snap => {
      console.log('Response recieved for profile public data: ', snap.val());
      this.selProfPublicData = snap.val();
      this.onSelProfPublicDataUpdated.next(this.selProfPublicData);
    });
  }
}
