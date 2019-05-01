import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splitForms'
})
export class SplitFormsPipe implements PipeTransform {

  transform(val: string) {
      return val.split('_').join(' ');
  }
}
