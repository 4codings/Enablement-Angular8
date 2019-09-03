import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterPlfExes'
})
export class FilterPlfExesPipe implements PipeTransform {

  transform(value: any, args?: any, type?: any): any {
    if(type == 'plf') {
      if(!value)return null;
        if(!args)return value;

        args = args.toLowerCase();
        return value.filter(function(item){
          return item.V_SERVER_CD.toString().toLowerCase() == args;
        });
    }

    if(type == 'mcn') {
      if(!value)return null;
        if(!args)return value;

        args = args.toLowerCase();
        return value.filter(function(item){
          return item.V_PLATFORM_CD.toString().toLowerCase() == args;
        });
    }

  }

}
