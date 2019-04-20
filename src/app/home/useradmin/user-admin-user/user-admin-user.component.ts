import { Component, OnInit } from '@angular/core';
import { NoAuthDataService } from 'src/app/services/no-auth-data.service';

import * as usreActions from '../../../store/user-admin/user/user.action';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { User } from '../../../store/user-admin/user/user.model';
import * as userSelectors from '../../../store/user-admin/user/user.selectors';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { filter } from 'rxjs/operators';
import {AddUser, UpdateUser} from '../../../store/user-admin/user/user.action';

@Component({
  selector: 'app-user-admin-user',
  templateUrl: './user-admin-user.component.html',
  styleUrls: ['./user-admin-user.component.scss']
})
export class UserAdminUserComponent implements OnInit {
  Label: any[] = [];
  user = {
    V_USR_NM: '',
    V_USR_DSC: '',
    V_STS: ''
  };

  public users$: Observable<User[]>;
  form: FormGroup;
  addBtn = true;
  updateBtn = false;
  // public userGroups$:Observable<userGroup[]>;
  error$: Observable<string>;
  didLoading$: Observable<boolean>;
  didLoaded$: Observable<boolean>;
  selecteduser: any;

  public nameChanged = false;
  private clonedName = '';

  public descChanged = false;
  private clonedDesc = '';

  public statusChanged = false;
  private clonedStatus = '';
  public duplicated = false;

  private usersList = [];

  private emailIds: string[] = ['@gmail.', '@yahoo.', '@outlook.',
    '@hotmail.', '@live.', '@aol.', '@aim.', '@yandex.', '@protonmail.', '@zoho.', '@gmx.', '@tutanota.'];
  public domainError = false;

  constructor(
    public noAuthData: NoAuthDataService,
    private store: Store<AppState>
  ) {
    // Label get service
    this.noAuthData.getJSON().subscribe(data => {
      console.log(data);
      this.Label = data;
    });
  }

  ngOnInit() {
    this.store.dispatch(new usreActions.getUser());
    // this.store.dispatch(new userGroupActions.getUserGroup());
    this.users$ = this.store.pipe(select(userSelectors.selectAllUsers));
    // this.userGroups$ = this.store.pipe(select(userGroupSelectors.selectAllUserGroups));
    this.error$ = this.store.pipe(select(userSelectors.getErrors));
    this.didLoading$ = this.store.pipe(select(userSelectors.getLoading));
    this.didLoaded$ = this.store.pipe(select(userSelectors.getLoaded));

    this.users$
      .subscribe((val) => {
        this.usersList = val;
      });

    this.setButtonLabel();
    this.user.V_STS = 'ACTIVE';
  }

  getUserDetails(user) {
    this.user.V_USR_NM = user.V_USR_NM;
    this.user.V_USR_DSC = user.V_USR_DSC;
    this.user.V_STS = user.V_STS;
    // this.addBtn = true;
  }
  availableGroupValueChange(usr) {
    // debugger
    this.users$.subscribe(data => {
      if (data.length) {
        const newArray = data.filter(item => item.USR_NM == usr);
        console.log(newArray);
        this.addBtn = newArray.length == 0 ? false : true;
      }
    });
  }

  selected(index) {
    this.selecteduser = index;
    this.clonedName = this.user.V_USR_NM;
    this.clonedDesc = this.user.V_USR_NM;
    this.clonedStatus = this.user.V_STS;
    this.updateBtn = true;
    this.statusChanged = false;
    this.nameChanged = false;
    this.descChanged = false;
    this.setButtonLabel();
  }

  downloadFile() {
    alert('Download Clicked !!!!');
  }
  uploadData() {
    alert('Upload Clicked !!!!');
  }

  addUser() {
    const data = {
      V_USR_NM: this.user.V_USR_NM,
      V_SRC_CD: JSON.parse(sessionStorage.getItem('u')).SRC_CD,
      V_USR_DSC: this.user.V_USR_DSC,
      V_STS: this.user.V_STS
    };
    this.store.dispatch(new AddUser(data));
  }

  public updateUser() {
    const data = {
      V_USR_NM: this.user.V_USR_NM,
      V_SRC_CD: JSON.parse(sessionStorage.getItem('u')).SRC_CD,
      V_USR_DSC: this.user.V_USR_DSC,
      V_STS: this.user.V_STS,
      REST_Service: 'User',
      Verb: 'PATCH'
    };
    this.store.dispatch(new UpdateUser(data));
  }

  statusChange() {
    if (this.selecteduser) {
      this.updateBtn = true;
    }
    if (this.clonedStatus !== this.user.V_STS) {
      this.statusChanged = true;
      this.updateBtn = true;
    } else {
      this.statusChanged = false;
    }
  }

  private setButtonLabel() {
    if (this.selecteduser === 0) {
      this.updateBtn = true;
    } else {
      this.updateBtn = !!this.selecteduser;
    }
  }

  public nameModelChanged() {
    if (this.clonedName !== this.user.V_USR_NM) {
      this.nameChanged = true;
      this.updateBtn = false;
    } else {
      this.nameChanged = false;
      this.updateBtn = true;
    }
    this.checkUserDomain();
    this.checkDuplications();
  }

  public descModelChanged() {
    if (this.clonedDesc !== this.user.V_USR_DSC) {
      this.descChanged = true;
    } else {
      this.descChanged = false;
    }
  }

  public checkDuplications() {
    for (let i = 0; i < this.usersList.length; i++) {
      if (this.usersList[i].V_USR_NM === this.user.V_USR_NM) {
        this.duplicated = true;
        return;
      } else {
        this.duplicated = false;
      }
    }
  }

  private checkUserDomain() {
    for (let i = 0; i < this.emailIds.length; i++) {
      if (this.user.V_USR_NM.indexOf(this.emailIds[i]) > -1) {
        this.domainError = true;
        return;
      } else {
        this.domainError = false;
      }
    }
  }

}
