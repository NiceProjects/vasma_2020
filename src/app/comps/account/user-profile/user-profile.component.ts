import { Component, OnInit } from '@angular/core';
import {
  PublicUser, AddressModel, UserBio,
  PrivateUserData, ContactNum, ArtistInfo,
  BusinessInfo, Person
} from 'src/app/models/user.model';
import { CusService } from 'src/app/services/cus.service';
import { FireService } from 'src/app/services/fire.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppDefService } from 'src/app/services/app-def.service';
import { RegExps } from 'src/app/models/regExp.model';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { DataService } from 'src/app/services/data.service';
import { BusinessHours, OpHours } from 'src/app/models/operation-hours.model';
import { DefKVPairs } from 'src/app/models/commercial-service.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  regExp = new RegExps();
  authUser: PublicUser = null;
  pud: PrivateUserData = null;
  selAccordionId: any = 0;
  uniqueIdTaken = false;
  uniqueIdAvailable = false;
  isArtist = false;
  isVenue = false;
  isStudio = false;
  estError = false;
  minDate = new Date('1900-1-1');
  maxDate = new Date();
  tmpEstDate = null;
  artistInfoFormInvalid = false;
  artistFormSubmitTriggered = false;
  appDefs;
  weekDays = ['sunday', 'monday', 'tuesday', 'wednusday', 'thursday', 'friday', 'saturday'];
  businessHours: DefKVPairs[];
  defStates = [];
  userTypes = {
    defArtistTypes: [],
    defVenueTypes: [],
    defStyles: [],
    defStudioTypes: []
  };
  selBOid = null;
  selBO: Person; // Selected Business owner
  constructor(
    private cus: CusService,
    private fs: FireService,
    private ads: AppDefService,
    private _scrollToService: ScrollToService,
    private ds: DataService
  ) { }

  ngOnInit() {
    this.authUser = this.ds.copyObjData(this.cus.getAuthUser());
    this.pud = this.ds.copyObjData(this.cus.getAuthPdt());
    this.adjustAuthUserData();
    this.adjustPUD();
    this.cus.onAuthUserUpdate.subscribe(data => {
      this.authUser = this.ds.copyObjData(data);
      this.adjustAuthUserData();
    });
    this.cus.onAuthpdtUpdate.subscribe(data => {
      this.pud = this.ds.copyObjData(data);
      this.adjustPUD();
    });
    this.appDefs = this.ads.appDefs;
    this.defStates = this.ads.defStates;
    this.userTypes = this.ads.defUserTypes;
    this.businessHours = this.ads._businessHours;
  }

  get getCurYear() {
    return new Date().getFullYear();
  }

  adjustAuthUserData() {
    switch (this.authUser.userType) {
      case 'artist': this.isArtist = true; break;
      case 'venue': this.isVenue = true; break;
      case 'studio': this.isStudio = true; break;
    }
    if (!this.authUser.uniqueKey)  this.authUser.uniqueKey = this.authUser.uid;
    if (!this.authUser.add1) this.authUser.add1 = new AddressModel();
    if (!this.authUser.userBio) this.authUser.userBio = new UserBio();
    else this.tmpEstDate = new Date(this.authUser.userBio.est);

    switch (this.authUser.userType) {
      case 'artist': {
        if (!this.authUser.artistInfo)this.authUser.artistInfo = new ArtistInfo();
        break;
      }

      case 'venue': {
        if (!this.authUser.venueInfo) if (!this.authUser.businessInfo) this.authUser.businessInfo = new BusinessInfo();
        if (!this.authUser.bHours) this.authUser.bHours = new BusinessHours();
        break;
      }
      case 'studio': {
        if (!this.authUser.studioInfo)
        if (!this.authUser.businessInfo) {
            this.authUser.businessInfo = new BusinessInfo();
          }
        if (!this.authUser.bHours) this.authUser.bHours = new BusinessHours();
        break;
      }
    }
    // console.log(this.authUser);
  }

  adjustPUD() {
    if (!this.pud) this.pud = new PrivateUserData();
    if (!this.pud.contact) this.pud.contact = [ new ContactNum()];
    if (!this.pud.businessOwners) this.pud.businessOwners = [];
  }

  toggleAccor(id) {
    if (id === this.selAccordionId) this.selAccordionId = null;
    else this.selAccordionId = id;
  }

  getAsDate(dt) {
    return new Date(dt);
  }

  addNewContact() {
    this.pud.contact.push(new ContactNum());
  }

  addNewBOcontact() {
    this.selBO.contact.push(new ContactNum());
  }

  removeContact(id) {
    this.pud.contact.splice(id, 1);
  }

  removeBOcontact(id) {
    this.selBO.contact.splice(id, 1);
  }

  onBioDateChange(e) {
    this.authUser.userBio.est = new Date(e).getTime();
  }

  submitBasicInfo(fv) {
    // console.log(fv);
    if (fv) {
      // this.authUser.name.userName = this.authUser.name.fName + ' ' + this.authUser.name.lName;
      this.authUser.name.userName = this.ds.trimData(this.authUser.name.userName);
      this.fs.updateName(this.authUser.name);
    }
  }

  onEstChange() {
    if (this.authUser.userBio.est < 1900 || this.authUser.userBio.est > this.getCurYear) {
      this.estError = true;
    } else {
      this.estError = false;
    }
    // console.log('Est error: ', this.estError);
  }

  submitUserBio(fv, fp) {
    // console.log(fv, this.authUser.userBio);
    if (fv && !fp) {
      // console.log('Updating the data');
      this.fs.updateBio(this.authUser.userBio);
    }
  }

  submitAdd1(fv, fp) {
    // console.log(fv, fp, this.authUser.add1);

    if (fv && !fp) {
      this.fs.updateAdd1(this.authUser.add1);
    }
  }

  submitContact(fv, fp) {
    // console.log(fv, fp, this.pud.contact);
    if (fv && !fp) {
      this.fs.setUserContact(this.pud.contact);
    }
  }

  submitArtistInfo(fv, fp) {
    this.artistFormSubmitTriggered = true;
    this.artistInfoFormInvalid = this.authUser.artistInfo.type.length < 1 || this.authUser.artistInfo.styles.length < 1;
    // console.log(fv, fp, this.artistInfoFormInvalid, this.authUser.artistInfo);
    if (!this.artistInfoFormInvalid) {
      this.fs.updateArtistInfo(this.authUser.artistInfo);
    }
  }

  submitBusinessInfo(fv, fp) {
    // console.log(fv, fp, this.authUser.businessInfo);
    if (fv && !fp) {
      this.fs.updateBusinessInfo(this.authUser.businessInfo);
    }
  }

  onArtistTypeChange(e) {
    this.authUser.artistInfo.type = e;
    // console.log(this.authUser.artistInfo);
  }

  onArtistStyleChange(e) {
    this.authUser.artistInfo.styles = e;
    // console.log(this.authUser.artistInfo);
  }

  onArtistInterestsUpdate(e) {
    this.authUser.artistInfo.interests = e;
    // console.log(this.authUser.artistInfo);
  }

  onBusinessTypeChange(e) {
    this.authUser.businessInfo.type = e;
    // console.log(this.authUser.businessInfo);
  }

  onPrelGenresUpdated(e) {
    this.authUser.businessInfo.prelGenres = e;
  }

  updateStudioVenueName(fv, fp) {
    // console.log(fv, fp, this.authUser.businessName);
    if (fv && !fp) {
      this.fs.updateBusinessName(this.authUser.businessName);
    }
  }

  addNewBO() {
    this.selBOid = null;
    this.selBO = new Person();
  }

  selectBO(id) {
    this.selBOid = id;
    this.selBO = this.ds.copyObjData(this.pud.businessOwners[id]);
    if (!this.selBO.contact) {
      this.selBO.contact = [];
    }
  }

  unselectBO() {
    this.selBO = null;
    this.selBOid = null;
  }

  removeBO(id) {
    const boName = this.pud.businessOwners[id].name.fName + ' ' +  this.pud.businessOwners[id].name.lName;
    const conf = confirm(`Do you really want to delete ${boName}?`);
    if (conf) {
      let dataObj = [...this.pud.businessOwners];
      dataObj.splice(id, 1);
      // console.log(dataObj);
      this.updateBo(dataObj);
    }
  }

  submitBO(fv, fp) {
    // console.log(fv, fp, this.selBO);
    if (fv) {
      let dataObj = [...this.pud.businessOwners];
      if (this.selBOid !== null && this.selBOid !== undefined) {
        dataObj[this.selBOid] = this.selBO;
      } else {
        dataObj.push(this.selBO);
      }
      // console.log(dataObj);
      this.updateBo(dataObj);
    }
  }

  updateBo(dataObj) {
    this.fs.updateBusinessOwners(dataObj).then(() => {
      this.unselectBO();
    }).catch(err => {
      console.log(err);
    });
  }

  updateUniquePrifileId(fv, fp) {
    // console.log(fv, fp, this.authUser.uniqueKey);
    if (fv && !fp && this.uniqueIdAvailable) {
      this.fs.updateUniqProfId(this.authUser.uniqueKey.toLowerCase(), this.authUser.uid).then(() => {
        alert(`Unique profile id successfully updated to ${this.authUser.uniqueKey}`);
      });
    }
  }

  onUniqueIdUpdated(e: string, fv) {
    const key = e.toLowerCase();
    if (e.length >= 5 && fv) {
      this.fs.checkUniqProfId(key).once('value').then(snap => {
        // console.log(snap.val());
        if (snap.val() === null) {
          this.uniqueIdAvailable = true;
          this.uniqueIdTaken = false;
        } else {
          if (Object.keys(snap.val())[0] === this.authUser.uid && Object.keys(snap.val()).length === 1) {
            this.uniqueIdAvailable = true;
            this.uniqueIdTaken = false;
          } else {
            this.uniqueIdAvailable = false;
            this.uniqueIdTaken = true;
          }
        }
      });
    }
  }

  consoleItOnload(destination, offSet) {
    // console.log('It has loaded');
    // const config: ScrollToConfigOptions = {
    //   container: 'custom-container',
    //   target: destination,
    //   duration: 500,
    //   easing: 'easeOutElastic',
    //   offset: 0
    // };
    // this._scrollToService.scrollTo(config);
  }

  onBusinessDayClose(day: string, e: any) {
    this.authUser.bHours[day].OP = e;
    this.authUser.bHours[day].FD = e;
    this.authUser.bHours[day].OH = [new OpHours()];
  }

  setTo24Hours(day: string, e) {
    this.authUser.bHours[day].FD = e;
    this.authUser.bHours[day].OH = [new OpHours()];
  }

  removeSlot(day: string, id: number) {
    this.authUser.bHours[day].OH.splice(id, 1);
    if (this.authUser.bHours[day].OH.length < 1) {
      this.setTo24Hours(day, true);
    }
  }

  addSlot(day: string) {
    this.authUser.bHours[day].OH.push(new OpHours());
  }

  onSlotValueChange(day: string, val: number) {

  }

  onBHSubmit(fv, form) {
    for (let week of this.weekDays) {
      for (let i in this.authUser.bHours[week].OH) {
        if (this.authUser.bHours[week].OH[i].eT !== 0 &&
          (this.authUser.bHours[week].OH[i].eT < this.authUser.bHours[week].OH[i].sT)) {
            this.authUser.bHours[week].OH[i] = {sT: this.authUser.bHours[week].OH[i].eT, eT: this.authUser.bHours[week].OH[i].sT};
        }
      }
      if (this.authUser.bHours[week].OH && this.authUser.bHours[week].OH.length > 1)
      this.authUser.bHours[week].OH = this.authUser.bHours[week].OH.sort((a: OpHours, b: OpHours) => a.sT - b.sT);
    }
    // console.log(this.authUser.bHours);
    if (fv) {
      this.fs.updateBusinessHours(this.authUser.bHours, this.authUser.uid).then(snap => {
        alert('Business hours updated successfully.');
      }).catch(err => {
        // console.log(err);
        alert('Something went wrong. Failed to update business hours.');
      });
    }
  }

  consoleThisEvent(e) {
    // console.log(e);
  }
}
