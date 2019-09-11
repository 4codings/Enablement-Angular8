import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterExetype'
})
export class FilterExetypePipe implements PipeTransform {

  transform(value: any, args?: any, type?:any, selectedPlatOrMcn?:any): any {
    if(type == 'exe') {
      if(!value)return null;
      if(!args)return value;
      if(!selectedPlatOrMcn)return value;
      args = args.toLowerCase();
      selectedPlatOrMcn = selectedPlatOrMcn.toLowerCase();
      if(args == 'all') {
        return value;
      } else {
        let exes = [];
        let arr = [];
        let sortedAllExes = [];
 
        if(selectedPlatOrMcn == 'all') {
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
          sortedAllExes = arr.sort((a,b) => (a.EXES.length > b.EXES.length) ? -1 : ((b.EXES.length > a.EXES.length) ? 1 : 0));
          return sortedAllExes;
        } else {
          value = value.filter(val => {
            return val.SERVER_TYP.SERVER_CD.toLowerCase() == selectedPlatOrMcn.toLowerCase()
          });
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
          sortedAllExes = arr.sort((a,b) => (a.EXES.length > b.EXES.length) ? -1 : ((b.EXES.length > a.EXES.length) ? 1 : 0));
          return sortedAllExes;

        }
      }
    } if(type == 'cxn') {
      if(!value)return null;
      if(!args)return value;

      args = args.toLowerCase();
      selectedPlatOrMcn = selectedPlatOrMcn.toLowerCase();
      if(args == 'all') {
        return value;
      } else {
        let cxns = [];
        let arr = [];
        let sortedAllConnections = [];
        if(selectedPlatOrMcn == 'all') {
          value.forEach(function(cxn){
            cxns = cxn.V_CXN.filter((item) => {
              return item.V_CXN_TYP.toLowerCase() == args;
            });
            
            let json = {
              V_PLATFORM_CD: args.toUpperCase(),
              PLATFORM_TYP: cxn.PLATFORM_TYP,
              V_CXN: cxns
            }
            arr.push(json); 
          });
          sortedAllConnections = arr.sort((a,b) => (a.V_CXN.length > b.V_CXN.length) ? -1 : ((b.V_CXN.length > a.V_CXN.length) ? 1 : 0));
          return sortedAllConnections;
        } else {
          
          value = value.filter(val => {
            return val.PLATFORM_TYP.PLATFORM_CD.toLowerCase() == selectedPlatOrMcn.toLowerCase()
          });

          value.forEach(function(cxn){
            cxns = cxn.V_CXN.filter((item) => {
              return item.V_CXN_TYP.toLowerCase() == args;
            });
            
            let json = {
              V_PLATFORM_CD: args.toUpperCase(),
              PLATFORM_TYP: cxn.PLATFORM_TYP,
              V_CXN: cxns
            }
            arr.push(json); 
          });
          sortedAllConnections = arr.sort((a,b) => (a.V_CXN.length > b.V_CXN.length) ? -1 : ((b.V_CXN.length > a.V_CXN.length) ? 1 : 0));
          return sortedAllConnections;
        }
        // return value.filter(function(item){
        //   return item.V_PLATFORM_CD.toLowerCase() == args;
        // });
      }
    }
  }

}
