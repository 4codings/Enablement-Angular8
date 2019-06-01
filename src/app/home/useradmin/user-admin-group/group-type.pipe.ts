import { Pipe, PipeTransform } from '@angular/core';
import {userGroup} from '../../../store/user-admin/user-group/usergroup.model';

@Pipe({
  name: 'groupType',
})
export class GroupTypePipe implements PipeTransform {

  transform(values: userGroup[], type?: string): any {
    if(values && values.length && type){
      return values.filter(currVal => currVal.V_GRP_TYP == type);
    }
    return values;
  }
}
