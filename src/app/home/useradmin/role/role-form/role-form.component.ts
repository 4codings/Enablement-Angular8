import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {userRole} from '../../../../store/user-admin/user-role/userrole.model';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss']
})
export class RoleFormComponent implements OnInit, OnChanges {

  form: FormGroup;
  @Input() role: userRole;
  @Input() roles: userRole[];

  constructor() {
    this.form = new FormGroup({
      V_ROLE_CD: new FormControl('', Validators.required),
      V_ROLE_DSC: new FormControl(''),
    });
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('role')) {
      this.setFormValue(this.role);
    }
  }

  setFormValue(role: userRole): void {
    this.form.setValue({
      V_ROLE_CD: role.V_ROLE_CD,
      V_ROLE_DSC: role.V_ROLE_DSC,
    });
    this.form.get('V_ROLE_CD').disable({onlySelf: true, emitEvent: false});
  }

  isValid(): boolean {
    return this.form.valid;
  }

  hasRole(roleName: string): boolean {
    return !!this.roles.filter(r => r.V_ROLE_CD.toLowerCase() === roleName.toLowerCase()).length;
  }

  getValue(): any {
    const formValue = this.form.value;
    return {
      V_ROLE_CD: this.role ? this.role.V_ROLE_CD : formValue.V_ROLE_CD,
      V_ROLE_DSC: formValue.V_ROLE_DSC,
    };
  }
}
