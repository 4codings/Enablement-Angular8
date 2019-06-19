import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {userGroup} from '../../../../store/user-admin/user-group/usergroup.model';
import {User} from '../../../../store/user-admin/user/user.model';

@Component({
  selector: 'app-group-form',
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.scss']
})
export class GroupFormComponent implements OnInit, OnChanges {

  @Input() group: userGroup;
  @Input() groups: userGroup[];
  @Input() controlVariables: any;
  form: FormGroup;

  constructor() {
    this.form = new FormGroup({
      V_USR_GRP_CD: new FormControl('', Validators.required),
      V_USR_GRP_DSC: new FormControl(''),
      V_EFF_STRT_DT_TM: new FormControl(new Date(), Validators.required),
      V_EFF_END_DT_TM: new FormControl(new Date(), Validators.required),
    });
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('group')) {
      this.setFormValue(this.group);
    }
    if (changes.hasOwnProperty('controlVariables') && !this.group) {
      this.form.get('V_EFF_END_DT_TM').setValue(new Date(Date.now() + this.controlVariables.effectiveEndDate));
    }
    if (changes.hasOwnProperty('groups')) {
      this.form.get('V_USR_GRP_CD').setValidators([Validators.required, groupNameValidator(this.groups)]);
    }
  }

  setFormValue(group: userGroup): void {
    this.form.setValue({
      V_USR_GRP_CD: group.V_USR_GRP_CD,
      V_USR_GRP_DSC: group.V_USR_GRP_DSC,
      V_EFF_STRT_DT_TM: new Date(group.V_EFF_STRT_DT_TM),
      V_EFF_END_DT_TM: new Date(group.V_EFF_END_DT_TM),
    });
    this.form.get('V_USR_GRP_CD').disable({onlySelf: true, emitEvent: false});
  }

  isValid(): boolean {
    return this.form.valid;
  }

  hasGroup(groupName: string): boolean {
    return !!this.groups.filter(grp => grp.V_USR_GRP_CD.toLowerCase() === groupName.toLowerCase()).length;
  }

  getValue(): any {
    const formValue = this.form.value;
    return {
      V_USR_GRP_CD: formValue.V_USR_GRP_CD,
      V_USR_GRP_DSC: formValue.V_USR_GRP_DSC,
      V_EFF_STRT_DT_TM: formValue.V_EFF_STRT_DT_TM,
      V_EFF_END_DT_TM: formValue.V_EFF_END_DT_TM,
    };
  }

}

export function groupNameValidator(allGroups: userGroup[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (allGroups && control.value && (!!allGroups.filter(user => user.V_USR_GRP_CD.toLowerCase() === control.value.toLowerCase()).length)) {
      return {
        groupError: {
          groupName: true
        }
      };
    }
    return null;
  };
}
