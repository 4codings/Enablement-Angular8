import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../../../../store/user-admin/user/user.model';
import {userStatusConstants, userStatusOptions} from '../../useradmin.constants';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit, OnChanges {

  @Input() user: User;
  @Input() users: User[];

  userForm: FormGroup;
  userStatusOptions = userStatusOptions;

  constructor() {
    this.userForm = new FormGroup({
      V_USR_NM: new FormControl('', Validators.required),
      V_SRC_CD: new FormControl(JSON.parse(sessionStorage.getItem('u')).SRC_CD, Validators.required),
      V_USR_DSC: new FormControl('', Validators.required),
      V_STS: new FormControl(userStatusConstants.ACTIVE, Validators.required),
    });
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('user')) {
      this.setFormValue(this.user);
    }
  }

  setFormValue(user: User): void {
    this.userForm.setValue({
      V_USR_NM: user.V_USR_NM,
      V_SRC_CD: JSON.parse(sessionStorage.getItem('u')).SRC_CD,
      V_USR_DSC: user.V_USR_DSC,
      V_STS: user.V_STS != '' ? user.V_STS : userStatusConstants.ACTIVE,
    });
    this.userForm.get('V_USR_NM').disable({onlySelf: true, emitEvent: false});
  }

  isValid(): boolean {
    return this.userForm.valid;
  }

  getValue(): any {
    const formValue = this.userForm.value;
    return {
      V_USR_NM: formValue.V_USR_NM,
      V_SRC_CD: JSON.parse(sessionStorage.getItem('u')).SRC_CD,
      V_USR_DSC: formValue.V_USR_DSC,
      V_STS: formValue.V_STS != '' ? formValue.V_STS : userStatusConstants.ACTIVE,
    };
  }

  hasUser(userName: string): boolean {
    return !!this.users.filter(user => user.V_USR_NM.toLowerCase() === userName.toLowerCase()).length;
  }

}
