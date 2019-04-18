import { Component, OnInit } from '@angular/core';
import { NoAuthDataService } from 'src/app/services/no-auth-data.service';

import * as usreActions from '../../../store/user-admin/user/user.action';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { User } from '../../../store/user-admin/user/user.model';
import * as userSelectors from '../../../store/user-admin/user/user.selectors';
import * as userGroupSelectors from '../../../store/user-admin/user-group/usergroup.selectors';
import * as userGroupActions from '../../../store/user-admin/user-group/usergroup.action';
import { Observable } from 'rxjs';
import { userGroup } from 'src/app/store/user-admin/user-group/usergroup.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-user-admin-user',
  templateUrl: './user-admin-user.component.html',
  styleUrls: ['./user-admin-user.component.scss']
})
export class UserAdminUserComponent implements OnInit {
  Label: any[] = [];
  user = 
    {
      'USR_NM_R':'',
      'USR_DSC_R':'',
      'STS_R':''
    }
  
  public users$: Observable<User[]>;
  form: FormGroup;
  addBtn = true;
  updateBtn = false;
  // public userGroups$:Observable<userGroup[]>;
  error$: Observable<string>;
  didLoading$: Observable<boolean>;
  didLoaded$: Observable<boolean>;
  selecteduser: string;

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

  }

  getUserDetails(user) {
    this.user.USR_NM_R = user.USR_NM;
    this.user.USR_DSC_R = user.USR_DSC;
    this.user.STS_R = user.STS;
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
  }

  downloadFile() {
    alert('Download Clicked !!!!');
  }
  uploadData() {
    alert('Upload Clicked !!!!');
  }

  addUser() {
    alert('adduser Clicked !!!!');
  }

  updateUser() {
    alert('update Clicked !!!!');
  }

  statusChange() {
    this.updateBtn = true;
  }

}
