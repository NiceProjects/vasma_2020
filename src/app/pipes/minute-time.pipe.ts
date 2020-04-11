import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minuteTime'
})
export class MinuteTimePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
