import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {userGroup} from '../../../../store/user-admin/user-group/usergroup.model';

@Component({
  selector: 'app-group-form',
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.scss']
})
export class GroupFormComponent implements OnInit {

  @Input() group: userGroup;

  form: FormGroup;

  constructor() {
    this.form = new FormGroup({
      V_USR_GRP_CD: new FormControl('', Validators.required),
      V_USR_GRP_DSC: new FormControl('', Validators.required),
      V_EFF_STRT_DT_TM: new FormControl('', Validators.required),
      V_EFF_END_DT_TM: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('user')) {
      this.setFormValue(this.group);
    }
  }

  setFormValue(group: userGroup): void {
    this.form.setValue({
      V_USR_GRP_CD: group.V_USR_GRP_CD,
      V_USR_GRP_DSC: group.V_USR_GRP_CD,
      V_EFF_STRT_DT_TM: group.V_EFF_STRT_DT_TM,
      V_EFF_END_DT_TM: group.V_EFF_END_DT_TM,
    });
  }

  isValid(): boolean {
    return this.form.valid;
  }

  getValue(): any {
    const formValue = this.form.value;
    return {
      V_USR_GRP_CD: formValue.V_USR_GRP_CD,
      V_USR_GRP_DSC: formValue.V_USR_GRP_DSC,
      V_SRC_CD: JSON.parse(sessionStorage.getItem('u')).SRC_CD,
      V_GRP_TYP: 'Group',
      V_EFF_STRT_DT_TM: formValue.V_EFF_STRT_DT_TM,
      V_EFF_END_DT_TM: formValue.V_EFF_END_DT_TM,
      V_USR_NM: JSON.parse(sessionStorage.getItem('u')).USR_NM,
      REST_Service: 'Group',
      Verb: 'POST'
    };
  }

}
