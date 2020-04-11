import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterKeys'
})
export class FilterKeysPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let a = value.replace(/\-/g, ' ');

    if (args === 'titlecase') {
      const b = a.replace(a[0], a[0].toUpperCase());
      return b;
    }
    return a;
  }

}
