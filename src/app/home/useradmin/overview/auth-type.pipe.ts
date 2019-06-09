import { Pipe, PipeTransform } from '@angular/core';
import {AuthorizationData} from '../../../store/user-admin/user-authorization/authorization.model';

@Pipe({
  name: 'authType'
})
export class AuthTypePipe implements PipeTransform {

  transform(values: AuthorizationData[], type?: string): any {
    if(values && values.length && type){
      return values.filter(currVal => currVal.V_AUTH_TYP == type);
    }
    return values;
  }

}
