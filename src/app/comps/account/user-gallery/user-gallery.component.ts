import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { GalleryItem, GalleryUploadObject, FileMetaData, ISize } from 'src/app/models/gallery-upload.model';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { CusService } from 'src/app/services/cus.service';
import { PublicUser } from 'src/app/models/user.model';
import * as sizeOf from 'image-size';
import { Observable, fromEvent } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { RegExps } from 'src/app/models/regExp.model';


// var {promisify} = require('util');
// var sizeOf = promisify(require('image-size'));


@Component({
  selector: 'app-user-gallery',
  templateUrl: './user-gallery.component.html',
  styleUrls: ['./user-gallery.component.scss']
})
export class UserGalleryComponent implements OnInit, OnDestroy {
  // @Input('data-userId') userId: string;
  // @Input('data-gallery-role') role: 'update' | 'present';
  regEx = new RegExps();
  _URL = window.URL || (window as any).webkitURL;
  files: FileList[] = [];
  uploads: GalleryUploadObject[] = [];
  albumName = `Uploads ${new Date().getFullYear()}`;
  albums = ['Uploads', 'Others'];
  uploadStatus: 'init' | 'uploading' | 'completed' = 'init';
  authUser: PublicUser;
  maxUploadLimit = 10;
  constructor(
    private _cus: CusService,
    private _ds: DataService
  ) { }

  ngOnInit() {
    this.authUser = this._cus.getAuthUser();
    this._cus.onAuthUserUpdate.subscribe(user => this.authUser = user);
  }

  ngOnDestroy() {
    this.resetUploads();
  }

  onFilesAdded(event) {
    let files = [];
    let tmpEventFiles: any[] = event.target.files;
    const uploadAllowedCount = this.maxUploadLimit - this.uploads.length;
    if (!uploadAllowedCount) return;
    let allowedUploads = [];
    let eventFiles = [];
    eventFiles.push(...tmpEventFiles);
    allowedUploads.push(...(eventFiles.slice(0, uploadAllowedCount)));
    files.push(...allowedUploads);
    files.forEach((eachFile: File) => {
      const reader = new FileReader();
      reader.onload = eve => {
        const fileExt = eachFile.type.split('/')[1];
        let upload = new GalleryUploadObject();
        upload.file = eachFile;
        upload.blobVal = reader.result;
        upload.fileName = this.replaceThumbString(eachFile.name.replace(' ', '_'));
        upload.size = eachFile.size;
        upload.type = eachFile.type;
        upload.uploadObj.fileName = eachFile.name.replace(' ', '_');
        upload.uploadObj.album = this._ds.trimData(this.albumName);
        upload.uploadObj.upTime = new Date().getTime();
        let image = new Image()
        image.onload = () => {
          upload.metaData = new FileMetaData(eachFile.type, eachFile.size, image.width, image.height);
          const tmpFileName1 = eachFile.name.replace(fileExt, '');
          const tmpFileName2 = tmpFileName1.toString().replace('.', '') + '_ids_' + image.width + 'x' + image.height + '.' + fileExt;
          upload.fileName = this.replaceThumbString(tmpFileName2.toString());
          this.uploads.push(upload);
          console.log(upload);
        }
        image.src = reader.result as string;
        // sizeOf(reader.result).then(dimensions => {
        //   console.log('Image dimensions', dimensions.width, dimensions.height);
        // }).catch(err => console.log(err));

        // console.log(this.uploads, upload);
      }
      reader.readAsDataURL(eachFile);
    })
  }

  replaceThumbString(name: string) {
    const thumbs = ['_thumb_xl_', '_thumb_sm_', '_thumb_md_', '_thumb_lg_'];
    if (name.startsWith('_thumb_xl_' || '_thumb_sm_' || '_thumb_md_' || '_thumb_lg_')) return name.slice(10, name.length - 1);
    return name;
  }

  removeUploadItem(id: number) {
    this.uploads.splice(id, 1);
    console.log(this.uploads);
  }

  updateAlbumName(val: string) {
    if (val == 'Others') {

    } else {
      this.albumName = val;
      this.updateAlbum();
    }
  }

  updateAlbum() {
    for (let i in this.uploads) {
      this.uploads[i].uploadObj.album = this.albumName;
    }
  }

  uploadImages() {
    if (this.uploads.length < 1) return alert('Please add images to upload');
    for (let i in this.uploads) {
      this.uploads[i].uploadObj.album = this.albumName.toLowerCase();
    }
    if (!this.albumName || this.albumName == '' || this.albumName.length < 5) return alert('Invalid album name. Please enter valid album name.');
    if (!this.authUser || this.uploadStatus == 'uploading' || this.uploadStatus == 'completed') return null;
    this.albumName = '';
    this.uploadStatus = 'uploading';
    console.log('Upload task started');
    // console.log(this.uploads);
    this.uploads.forEach((upload: any, id) => {
      console.log(this.uploads);
      firebase.database().ref(`/publicList/userGallery/${this.authUser.uid}`).push(upload.uploadObj).then(snap => {
        const uploadKey = snap.key;
        const uploadRef = snap.ref;
        // console.log(uploadKey, uploadRef);

        let storageRef = firebase.storage().ref(`/userAssets/${this.authUser.uid}/galleryItems/${uploadKey}/`).child(upload.fileName);
        let uploadTask = storageRef.put(upload.file, {contentType: upload.metaData.type, customMetadata: upload.metaData, cacheControl: 'public,max-age=3600'});
        // let uploadTask;
        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on('state_changed', (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          // console.log(this.uploads);
          // this.uploads[id].uploadStatus = 'uploading';
          this.setUploadStatus(id,  'uploading');
          this.setUploadPerc(id, (snapshot.bytesTransferred / snapshot.totalBytes) * 100)
          // this.uploads[id].uploadPerc = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log('Upload is ' + this.uploads[id].uploadPerc + '% done');
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              // console.log('Upload is paused');
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              // console.log('Upload is running');
              break;
          }
        }, (error) => {
          // Handle unsuccessful uploads
          console.log(error);
        }, () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            // Updating download url after upload complete
            // console.log('File available at', downloadURL);
            this.finalizeUploadObject(id, uploadKey, downloadURL);
          });
        });
      }).catch(err => console.log(err));
    });
  }


  checkAllUploadsStatus() {
    let uploadStatuses = [];
    this.uploads.forEach((upload: GalleryUploadObject) => uploadStatuses.push(upload.uploadStatus));
    if (uploadStatuses.every(e => e == 'completed')) {
      this.uploadStatus = 'completed';
      // console.log(this.uploads);
      setTimeout(() => {
        this.resetUploads();
      }, 1500);
    }
  }

  resetUploads() {
    this.uploads = [];
    this.uploadStatus = 'init';
  }

  setUploadStatus(id: number, status: any) {
    this.uploads[id].uploadStatus = status;
  }

  setUploadPerc(id: number, perc: number) {
    this.uploads[id].uploadPerc = perc;
  }

  finalizeUploadObject(id: number, uploadKey: string, downloadURL: string) {
    this.uploads[id].uploadObj.uid = uploadKey;
    this.uploads[id].uploadObj.filePath = downloadURL;
    const updateTask = firebase.database().ref(`/publicList/userGallery/${this.authUser.uid}/${uploadKey}`).set(this.uploads[id].uploadObj);
    updateTask.then(snap => {
      this.uploads[id].uploadStatus = 'completed';
      this.checkAllUploadsStatus();
    }).catch(err => {
      console.log(err);
      this.uploads[id].uploadStatus = 'failed';
      this.checkAllUploadsStatus();
    });
  }

  onSubmit() {

  }

}



// readURL(event: any): void {
//   if (event.target.files && event.target.files[0]) {
//     const file = event.target.files[0];
//     const reader = new FileReader();
//     reader.onload = e => this.x = reader.result;
//     reader.readAsDataURL(file);
//   }
// }

// Script to check image dimensions

// var _URL = window.URL || window.webkitURL;

// $("#file").change(function(e) {
//     var file, img;
//     if ((file = this.files[0])) {
//         img = new Image();
//         img.onload = function() {
//             alert(this.width + " " + this.height);
//         };
//         img.onerror = function() {
//             alert( "not a valid file: " + file.type);
//         };
//         img.src = _URL.createObjectURL(file);
//     }
// });













// const image = new Image();
// image.onload = (img: any) => {
//   upload.metaData = new FileMetaData(eachFile.type, eachFile.size, img.width, img.height);

//   console.log(this.uploads);
// };
// image.src = this._URL.createObjectURL(eachFile);