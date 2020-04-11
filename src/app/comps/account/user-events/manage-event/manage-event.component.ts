import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FireService } from 'src/app/services/fire.service';
import { DataService } from 'src/app/services/data.service';
import { AppDefService } from 'src/app/services/app-def.service';
import { CusService } from 'src/app/services/cus.service';
import { VenueEventData } from 'src/app/models/venue-event.model';
import { PublicUser } from 'src/app/models/user.model';
import { NgForm } from '@angular/forms';
import { RegExps } from 'src/app/models/regExp.model';
import { DevService } from 'src/app/services/dev.service';
import { TO_OBJ, TpOutput } from 'src/app/models/date-time-picker-output-model';
import { EventBannerUploadObj, FileMetaData, PhotoObject } from 'src/app/models/gallery-upload.model';
import { CanComponentDeactivate } from 'src/app/services/can-deactivate-guard.service';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/storage';

@Component({
  selector: 'app-manage-event',
  templateUrl: './manage-event.component.html',
  styleUrls: ['./manage-event.component.scss']
})
export class ManageEventComponent implements OnInit, CanComponentDeactivate {
  mode = 'create_new';
  editMode = false;
  isLoading = true;
  user: PublicUser;
  selEventId;
  eventLoadErr;
  workingEvent: VenueEventData;
  regEx = new RegExps();
  descUpdated = false;
  eventCreationErr = {
    startTimeErr: null,
    endTimeErr: null,
    bufferTimeErr: null
  };

  pageCanDeactivate = false;

  // Event Banner upload anagement
  uploadObj: EventBannerUploadObj = new EventBannerUploadObj();
  fileUpdated = false;
  formDataUpdated = false;
  dataUpdating = false;
  fileUploading = false;

  tmpEventDate;
  tmpEventStTime;
  tmpEventEndTime;
  efSubmitted = false;
  submitTriggered = false;
  eventDataUpdateInProgress = false;

  @ViewChild('timePickr2') startTimePicker: ElementRef;
  @ViewChild('eventForm') eventManageForm: NgForm;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _fs: FireService,
    private _ds: DataService,
    private _ads: AppDefService,
    private _cus: CusService,
    private _dev: DevService
  ) { }

  // TODO: Validations improvement for buffer time
  ngOnInit() {
    this.user = this._cus.getAuthUser();
    this._cus.onAuthUserUpdate.subscribe(user => this.user = user);
    this._route.params.subscribe(params => {
      console.log('Services route params', params);
      this.mode = params.mode;
      this.editMode = this.mode == 'edit';
      if (['create_new', 'edit'].indexOf(this.mode) < 0) return this._router.navigate(['/my_account/events']);
      if (this.mode == 'create_new') return this.followNewEventCreation();
      if (this.mode == 'edit' && params.id) return this.followEventModification(params.id);
    });
  }

  followEventModification(eventId: string) {
    console.log('Following event modification');
    this._fs.getVenueEventWithEventId(eventId).on('value', (snap) => {
      this.workingEvent = snap.val();
      this.uploadObj.blobVal = this.workingEvent.eventBanneImg.filePath;
      this.workingEvent.misc.version = Number(this.workingEvent.misc.version) + 1;
      this.stopLoading();
    }, err => {
      console.log('Error on loading event with event id: ' + eventId);
      this.eventLoadErr = true;
      this.stopLoading();
    })
  }

  followNewEventCreation() {
    console.log('Following event creation');
    this.workingEvent = new VenueEventData();
    this.workingEvent.eventOwnerId = this.user.uid;
    // const env = window.location.host;
    // if (env.startsWith('localhost')) {
    //   let we = this.workingEvent;
    //   we.eventEndTS = new Date(2019, 11, 30, 17, 30).getTime();
    //   we.eventStartTS = new Date(2019, 11, 30, 17, 30).getTime();
    // }
    this.stopLoading();
  }

  onFilesSelect(e) {
    console.log(e);
    const file: File = e.target.files[0];
    if (file) this.fileUpdated = true;
    console.log(file.name);
    const reader = new FileReader();
    reader.onload = res => {
      const fileExt = file.type.split('/')[1];
      const fileMeatName = this._ds.getMetaFielName(file.name);
      this.uploadObj = new EventBannerUploadObj();
      this.uploadObj.file = file;
      this.uploadObj.blobVal = reader.result;
      this.uploadObj.fileName = file.name;
      this.uploadObj.ext = fileMeatName.ext;
      this.uploadObj.size = file.size;
      this.uploadObj.type = file.type;
      let image = new Image()
      image.onload = () => {
        this.uploadObj.metaData = new FileMetaData(file.type, file.size, image.width, image.height);
        const tmpFileName1 = file.name.replace(fileExt, '');
        const tmpFileName2 = tmpFileName1.toString().replace('.', '') + '_ids_' + image.width + 'x' + image.height + '.' + fileExt;
        this.uploadObj.fileName = this._ds.replaceThumbString(tmpFileName2.toString());
      }
      image.src = reader.result as string;
      console.log(this.uploadObj);
    };
    reader.readAsDataURL(file);
  }

  showLoading() {
    this.isLoading = true;
  }

  stopLoading() {
    this.isLoading = false;
  }

  setEventType(e) {
    console.log(e, e.value);
    this.workingEvent.eventType = e.value;
  }

  getQuillToolbar(id) {
    return this._ds.getQuillToolbar(id);
  }

  onFormSubmit(form: NgForm) {
    console.log('form submitted', this.workingEvent);
    this.submitTriggered = true;
  }

  justSaveToDB(ef: NgForm) {
    if (this.decideFormSubmit(ef)) return console.log('Form submit decesion if false');
    console.log('Just save mode');
    let payLoad: VenueEventData = JSON.parse(JSON.stringify(this.workingEvent));
    payLoad.publish = false;
    this.updateDataObj(payLoad);
  }

  pushToPublic(ef: NgForm) {
    console.log(this.decideFormSubmit(ef));
    if (this.decideFormSubmit(ef)) return console.log('Form submit decesion if false');
    console.log('pushToPublic mode');
    let payLoad: VenueEventData = JSON.parse(JSON.stringify(this.workingEvent));
    payLoad.publish = true;
    this.updateDataObj(payLoad);
  }

  // Dfd: form data
  decideFormSubmit(fd: NgForm): boolean {
    console.log(fd.invalid, fd.pristine, this.fileUpdated, this.formDataUpdated);
    if (fd.invalid || (fd.pristine && !this.fileUpdated && !this.formDataUpdated)) {
      console.log(true);
      return true;
    }
    return false;
  }

  updateDataObj(payLoad: VenueEventData) {
    this.dataUpdating = true;
    console.log('payload', payLoad);
    if (!this.editMode) {
      this._fs.venueEventsNode().push(payLoad).then(snap => {
        this.workingEvent.eventId = snap.key;
        snap.ref.child('eventId').set(snap.key);
        console.log(snap);
        if (this.fileUpdated) return this.continueToFileUploadTask(snap.key);
        this.returnOnComplete();
      }).catch(err => {
        console.log('Error adding data into database', err);
        alert('Error adding data into database');
        this.dataUpdating = false;
      });
    } else {
      this._fs.venueEventsNode().child(payLoad.eventId).update(payLoad).then(() => {
        if (this.fileUpdated) return this.continueToFileUploadTask(payLoad.eventId);
        this.returnOnComplete();
      }).catch(err => {
        console.log(`Error updating data into database`, err);
        alert(`Error updating data into database`);
        this.dataUpdating = false;
      });
    }
  }

  returnOnComplete() {
    this.dataUpdating = false;
    this.fileUploading = false;
    this.formDataUpdated = false;
    this.uploadObj = new EventBannerUploadObj();
    this.fileUpdated = false;
    this._router.navigate(['/my_account/events']);
  }

  continueToFileUploadTask(eventId: string) {
    this.workingEvent.misc.thumbVersion = Number(this.workingEvent.misc.thumbVersion) + 1;
    console.log('Event banner image version upgraded to ', this.workingEvent.misc.thumbVersion);
    this.uploadBannerImg(eventId);
  }

  getEventStorageRef(eventId): any {
    return firebase.storage().ref(`/public/eventBanners/${eventId}/v${this.workingEvent.misc.thumbVersion}/`);
  }

  uploadBannerImg(eventId?: string) {
    console.log('Banner image upload request recieved', this.uploadObj);
    let upload = this.uploadObj;
    let uploadTask = this.getEventStorageRef(eventId).child(upload.fileName).put(upload.file, {contentType: upload.metaData.type, customMetadata: upload.metaData, cacheControl: 'public,max-age=3600'});
    uploadTask.on('state_changed', (snapshot) => {
      this.fileUploading = true;
      this.uploadObj.uploadStatus = 'uploading';
      this.uploadObj.uploadPerc = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log(this.uploadObj.uploadPerc);
    }, (error) => {
      this.uploadObj.uploadStatus = 'failed';
      console.log(error);
    }, (complted) => {
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        // Updating download url after upload complete
        // console.log('File available at', downloadURL);
        this.finalizeFileUpload(downloadURL);
      });

    })
    // setTimeout(() => this.dataUpdating = false, 7000)
  }

  finalizeFileUpload(downloadUrl) {
    this.updateThumbVersion();
    const ul = this.uploadObj;
    const event = this.workingEvent;
    const photoObj = new PhotoObject(downloadUrl, ul.fileName, new Date().getTime());
    this._fs.getVenueEventWithEventId(event.eventId).child('eventBanneImg').set(photoObj).then((resp) => {
      this.uploadObj.uploadStatus = 'completed';
      console.log(resp);
      setTimeout(() => {
        this.returnOnComplete();
      }, 5000);
    }).catch(err => {
      console.log('Errr on updating file url');
      this.dataUpdating = false;
    })

  }

  // TODO: write cloud functions to remove old version assets

  // Updates thumbnail version for the particular event
  updateThumbVersion() {
    this._fs.getVenueEventWithEventId(this.workingEvent.eventId).child('misc').update(this.workingEvent.misc);
  }

  openTimePicker(e) {
    if (e == 'timePickr2') this.startTimePicker.nativeElement.focus();
  }

  setEventStartDate(e) {
    this.workingEvent.eventStartDate = e;
    console.log(`Event start date: ${new Date(e)}`);
    this.setEventStartTimeTS();
  }

  setEventStartTime(e: TO_OBJ) {
    this.workingEvent.eventStartTime = e.raw;
    console.log(`Event start time`, e);
    this.setEventStartTimeTS();
  }

  setEventStartTimeTS() {
    if (this.workingEvent.eventStartTime && this.workingEvent.eventStartDate) {
      let timeObj = new TpOutput(this.workingEvent.eventStartTime);
      this.workingEvent.eventStartTS = this.workingEvent.eventStartDate + (timeObj.hours * 3600000) + (timeObj.minutes * 60000);
      if (!this.workingEvent.regBufferTS) {
        // let tObj = new TpOutput(this.workingEvent.eventStartTS - 3600000);
      }
      console.log(this.workingEvent.eventStartTS);
      this.setEventTimeErrs();
    }
  }

  setEventEndDate(e) {
    this.workingEvent.eventEndDate = e;
    console.log(`Event End date: ${new Date(e)}`);
    this.setEventEndTimeTS();
  }

  setEventEndTime(e: TO_OBJ) {
    this.workingEvent.eventEndTime = e.raw;
    console.log(`Event End time`, e);
    this.setEventEndTimeTS();
  }

  setEventEndTimeTS() {
    if (this.workingEvent.eventEndTime && this.workingEvent.eventEndDate) {
      let timeObj = new TpOutput(this.workingEvent.eventEndTime);
      this.workingEvent.eventEndTS = this.workingEvent.eventEndDate + (timeObj.hours * 3600000) + (timeObj.minutes * 60000);
      console.log(this.workingEvent.eventEndTS);
      this.setEventTimeErrs();
    }
  }

  setregBufferDate(e) {
    this.workingEvent.regBufferDate = e;
    console.log(`Event start date: ${new Date(e)}`);
    this.setregBufferTimeTS();
  }

  setregBufferTime(e: TO_OBJ) {
    this.workingEvent.regBufferTime = e.raw;
    console.log(`Event start time`, e);
    this.setregBufferTimeTS();
  }

  setregBufferTimeTS() {
    if (this.workingEvent.regBufferTime && this.workingEvent.regBufferDate) {
      let timeObj = new TpOutput(this.workingEvent.regBufferTime);
      this.workingEvent.regBufferTS = this.workingEvent.regBufferDate + (timeObj.hours * 3600000) + (timeObj.minutes * 60000);
      console.log(this.workingEvent.regBufferTS);
      this.setEventTimeErrs();
    }
  }

  setEventTimeErrs() {
    this.onFormUpdate('setEventTimeErrs');
    const we = this.workingEvent;
    const now = new Date().getTime();
    if (we.eventStartTS) this.eventCreationErr.startTimeErr = (we.eventStartTS - now) < (2 * 3600000);
    if (we.eventEndTS && we.eventStartTS) this.eventCreationErr.endTimeErr = (we.eventEndTS - we.eventStartTS) < (1 * 3600000);
    if (we.regBufferTS && we.eventStartTS) this.eventCreationErr.bufferTimeErr = (we.regBufferTS > we.eventStartTS) || (we.regBufferTS - now) < (1 * 3600000);
    console.log(this.eventCreationErr);
    this.pageCanDeactivate = false;
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    console.log({
      formDataUpdated: this.formDataUpdated,
      fileUpdated: this.fileUpdated,
      dataUpdating: this.dataUpdating
    });
    if (!this.formDataUpdated && !this.fileUpdated && !this.dataUpdating) return true;
    return confirm(`Do you really want to discard the changes`);
  }

  onFormUpdate(source?: any) {
    console.log('Form data updated', {source: source});
    this.formDataUpdated = true;
  }

  onQuillBlur(e) {
    this.onFormUpdate();
  }

}
