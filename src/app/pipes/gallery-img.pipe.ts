import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'galleryImg'
})
export class GalleryImgPipe implements PipeTransform {

  transform(value: string): string {
    if (value) return value;
    else return '';
  }

}
