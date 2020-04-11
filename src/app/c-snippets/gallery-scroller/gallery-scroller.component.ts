import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { GalleryItem } from 'src/app/models/gallery-upload.model';

@Component({
  selector: 'app-gallery-scroller',
  templateUrl: './gallery-scroller.component.html',
  styleUrls: ['./gallery-scroller.component.scss']
})
export class GalleryScrollerComponent implements OnInit, OnChanges {
  @Input('data-gallery-items') galleryItems: GalleryItem[];
  @Input('data-show-item') showItem?: number;
  @Output('onClose') onGalleryClose = new EventEmitter<any>();
  finalGalleryItems: GalleryItem[] = [];
  showLargeImage = false;
  oiw;                                                // Original image width
  oih;                                                // Original image height
  SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight' };
  constructor() { }

  ngOnInit() {
    this.setInitialData();
  }

  ngOnChanges() {
    this.setInitialData();
  }

  setInitialData() {
    if (!this.showItem) this.showItem = 0;
    if (this.galleryItems && !Array.isArray(this.galleryItems)) this.finalGalleryItems = [this.galleryItems];
    else this.finalGalleryItems.push(...this.galleryItems);
    this.onNewImageSelected();
  }

  closeGallery() {
    this.finalGalleryItems = [];
    this.showItem = 0;
    this.onGalleryClose.emit();
  }

  onPrev() {
    const maxCount = this.finalGalleryItems.length - 1;
    if (this.showItem == 0) this.showItem = maxCount;
    else this.showItem -= 1;
    this.showLargeImage = false;
    this.onNewImageSelected();
  }

  onNext() {
    const maxCount = this.finalGalleryItems.length - 1;
    if (this.showItem == maxCount) this.showItem = 0;
    else this.showItem += 1;
    this.showLargeImage = false;
    this.onNewImageSelected();
  }

  onNewImageSelected() {
    this.oih = null;
    this.oiw = null;
    console.log('Fetching image dimensions');
    if(this.finalGalleryItems.length < 1) return console.log('No finalized gallery');
    const imgUrl = this.finalGalleryItems[this.showItem].filePath;
    const choppedUrl = imgUrl.split('_ids_');
    if (choppedUrl.length > 2) return console.log('Exit: Chopped url length is greater than 2', choppedUrl);
    else {
      const _sizes = choppedUrl[1].split('.')[0];
      const _tmpSizes = _sizes.split('x');
      if (_tmpSizes.length > 2) return null
      else {
        this.oiw = _tmpSizes[0];
        this.oih = _tmpSizes[1];
        console.log('Original image dimensions found from url', this.oiw, this.oih);
      }
    }
  }

  onLargeImageLoaded() {
    this.showLargeImage = true;
    // setTimeout(() => this.showLargeImage = true, 20000);
  }

  loadLargeImage() {
    this.showLargeImage = true;
  };

  // action triggered when user swipes
  swipe(action = this.SWIPE_ACTION.RIGHT, event) {
    // out of range
    console.log(event, action);

    if (this.finalGalleryItems.length <=1) return;

    // swipe right, next avatar
    if (action === this.SWIPE_ACTION.RIGHT) {
      return this.onNext();
    }

    // swipe left, previous avatar
    if (action === this.SWIPE_ACTION.LEFT) {
      return this.onPrev();
    }
  }
}
