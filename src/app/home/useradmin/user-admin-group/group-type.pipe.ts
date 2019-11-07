import { Pipe, PipeTransform } from '@angular/core';
import { userGroup } from '../../../store/user-admin/user-group/usergroup.model';
import { groupTypeConstant } from '../useradmin.constants';

@Pipe({
  name: 'groupType',
})
export class GroupTypePipe implements PipeTransform {

  transform(values: userGroup[], type?: string): any {
    if (values && values.length && type) {
      // console.log('values', values);
      // console.log('type', type);
      return values.filter(currVal => currVal.V_GRP_TYP == type);
    }
    return values;
  }
}
@Pipe({
  name: 'groupTypeProfile',
})
export class GroupTypeProfilePipe implements PipeTransform {

  transform(values: userGroup[], type?: string): any {
    if (values && values.length && type) {
      // console.log('values', values);
      // console.log('type', type);
      if (type == groupTypeConstant.CUSTOM) {
        return values.filter(currVal => currVal.V_GRP_TYP == type);
      } else if (type == groupTypeConstant.WORKFLOW) {
        return values.filter(currVal => currVal.V_USR_GRP_DSC.includes('Workflow'));
      } else if (type == groupTypeConstant.ADMINISTRATOR) {
        return values.filter(currVal => currVal.V_USR_GRP_DSC.includes('User Admin'));
      } else if (type == groupTypeConstant.SYSTEM) {
        return values.filter(currVal => currVal.V_USR_GRP_DSC.includes('System Admin'));
      }
    }
    return values;
  }
}
