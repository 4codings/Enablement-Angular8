import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterExetype'
})
export class FilterExetypePipe implements PipeTransform {

  transform(value: any, args?: any): any {
      if(!value)return null;
      if(!args)return value;

      args = args.toLowerCase();
      if(args == 'all') {
        return value;
      } else {
        return value.filter(function(item){
          return item.EXE_TYP.toLowerCase() == args;
        });
      }
  }

}
