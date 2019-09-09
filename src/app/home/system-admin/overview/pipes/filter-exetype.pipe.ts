import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterExetype'
})
export class FilterExetypePipe implements PipeTransform {

  transform(value: any, args?: any, type?:any): any {
    if(type == 'exe') {
      if(!value)return null;
      if(!args)return value;

      args = args.toLowerCase();
      if(args == 'all') {
        return value;
      } else {
        let exes = [];
        let arr = [];
        value.forEach(function(exe){
          exes = exe.EXES.filter((item) => {
            return item.V_EXE_TYP.toLowerCase() == args;
          });
          
          let json = {
            EXE_TYP: args.toUpperCase(),
            SERVER_TYP: exe.SERVER_TYP,
            EXES: exes
          }
          arr.push(json); 
        });
        return arr;
      }
    } if(type == 'cxn') {
      if(!value)return null;
      if(!args)return value;

      args = args.toLowerCase();
      if(args == 'all') {
        return value;
      } else {
        return value.filter(function(item){
          return item.V_PLATFORM_CD.toLowerCase() == args;
        });
      }
    }
  }

}
