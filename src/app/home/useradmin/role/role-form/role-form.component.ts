import {Component, EventEmitter, Input, Output, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {userRole} from '../../../../store/user-admin/user-role/userrole.model';
import {User} from '../../../../store/user-admin/user/user.model';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss']
})
export class RoleFormComponent implements OnInit, OnChanges {

  form: FormGroup;
  @Input() role: userRole;
  @Input() roles: userRole[];
  @Output() roleFormValidation: EventEmitter<any> = new EventEmitter<any>();
  constructor() {
    this.form = new FormGroup({
      V_ROLE_CD: new FormControl('', Validators.required),
      V_ROLE_DSC: new FormControl(''),
    });
  }

  ngOnInit() {
    this.onChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('role')) {
      this.setFormValue(this.role);
    }
    if (changes.hasOwnProperty('roles')) {
      this.form.get('V_ROLE_CD').setValidators([Validators.required, roleNameValidator(this.roles)]);
    }
  }

  onChanges(): void {
    this.form.valueChanges.subscribe(val => {
      this.roleFormValidation.emit(this.form.valid);
    });
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

export function roleNameValidator(allRoles: userRole[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (allRoles && control.value && (!!allRoles.filter(role => role.V_ROLE_CD.toLowerCase() === control.value.toLowerCase()).length)) {
      return {
        roleError: {
          roleName: true
        }
      };
    }
    return null;
  };
}
