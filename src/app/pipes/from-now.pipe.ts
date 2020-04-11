import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'fromNow'
})
export class FromNowPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const now = new Date().getTime();
    const diff = Math.abs(now - value);
    return moment(value).fromNow();
  }

}
