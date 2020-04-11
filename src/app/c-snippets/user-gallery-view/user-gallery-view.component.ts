import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { GalleryItem, GalleryUploadObject, Album } from 'src/app/models/gallery-upload.model';
import { FireService } from 'src/app/services/fire.service';
import { CusService } from 'src/app/services/cus.service';
import { PublicUser } from 'src/app/models/user.model';
import { FancyGalleryItem, FancyGalleryItemOptions } from 'src/app/models/fancybox-gallery.model';
declare var $ :any;
import * as _ from 'lodash';

@Component({
  selector: 'app-user-gallery-view',
  templateUrl: './user-gallery-view.component.html',
  styleUrls: ['./user-gallery-view.component.scss']
})
export class UserGalleryViewComponent implements OnInit, OnChanges {
  @Input('data-user-uid') userId: string;
  @Input('data-gallery-role') viewRole?: 'presentation' | 'manage' = 'presentation';
  // @Input('data-hold-updates')
  isLoading = true;
  galleryItems: GalleryItem[];
  filteredGalleryItems: GalleryItem[] = [];
  authUser: PublicUser;
  selectedGalleryList: GalleryItem[];
  selectedGalleryItem: number;
  albums: Album[] = [];
  constructor(
    private _fs: FireService,
    private _cus: CusService
  ) { }

  ngOnInit() {
    this.runOnInit();
  }

  ngOnChanges() {
    this.runOnInit();
  }

  runOnInit() {
    this.authUser = this._cus.getAuthUser();
    this._cus.onAuthUserUpdate.subscribe(user => this.authUser = user);
    // this._fs.getUserGalleryObject(this.userId).once
    if (this.authUser && this.authUser.uid == this.userId && this.viewRole == 'manage') {
      this._fs.getUserGalleryObject(this.userId).on('value', snap => {
        const response = snap.val();
        this.onResponse(response);
      });
    } else {
      this._fs.getUserGalleryObject(this.userId).once('value').then(snap => {
        const response = snap.val();
        this.onResponse(response);
      })
    }
  }

  onResponse(response) {
    if (response) {
      const _tmpArr = Object.values(response);
      // this.galleryItems = _tmpArr.sort((a: GalleryItem, b:GalleryItem) => b.upTime - a.upTime);
      const _tmpGalleryItems: GalleryItem[] = _tmpArr.sort((a: GalleryItem, b:GalleryItem) => b.upTime - a.upTime);
      this.galleryItems = [];
      for (let e of _tmpGalleryItems) {
        if (e.filePath) this.galleryItems.push(e);
      }
      this.isLoading = false;
      this.sortAlbums();
    } else {
      this.galleryItems = null;
      this.albums = [];
      this.isLoading = false;
    }
  }

  getBackgroundUrl(url: string) {
    if (url) return url;
    else return
  }

  setGallery(galleryList, id?: number) {
    // this.selectedGalleryList = galleryList;
    // this.selectedGalleryItem = id || 0;
    let fancyItems = [];
    galleryList.forEach((e: GalleryItem) => {
      const imgPath = this.getImagePath(e);
      const thumbPath = this.getImgThumb(e);
      const fancyItem = new FancyGalleryItem(imgPath, new FancyGalleryItemOptions(thumbPath));
      fancyItems.push(fancyItem);
    });
    $.fancybox.open(fancyItems, {
      buttons: [
        'slideShow',
        'fullScreen',
        'thumbs',
        'zoom',
        'close'
      ],
      spinnerTpl: '<div class="fancybox-loading"></div>',
      loop: true
    }, id);
  }


  getImagePath(gi: GalleryItem) {
    if (gi._xlPath) return gi._xlPath;
    return gi.filePath;
  }

  getImgThumb(gi: GalleryItem) {
    if (gi._smPath) return gi._smPath;
    if (gi._mdPath) return gi._mdPath;
    if (gi._lgPath) return gi._lgPath;
    if (gi._xlPath) return gi._xlPath;
    return gi.filePath;
  }

  onGalleryClose() {
    this.selectedGalleryList = null;
    this.selectedGalleryItem = null;
  }

  sortAlbums(def?: any) {
    // console.log('This function is calling');
    this.albums = [];
    if (this.galleryItems.length < 1 || !this.galleryItems) return this.albums = [];
    // const _tmpArr = _.sortBy(this.galleryItems, [(i: GalleryItem) => i.album]);
    let _tmpArr = {};
    for (let e of this.galleryItems) {
      if (!e.filePath) return;
      if (_tmpArr[e.album]) _tmpArr[e.album].push(e);
      else _tmpArr[e.album] = [e];
    }
    const albumTitles = Object.keys(_tmpArr);
    for (let key of albumTitles) {
      const timeSortedAlbumsItems = _tmpArr[key].sort((a: GalleryItem, b: GalleryItem) => b.upTime - a.upTime);
      this.albums.push(new Album(key.toLowerCase(), timeSortedAlbumsItems[0].upTime, timeSortedAlbumsItems));
    }
    console.log(_tmpArr);
    // console.log(_tmpArr, 'Albums: ', JSON.stringify(this.albums));
  }

}
