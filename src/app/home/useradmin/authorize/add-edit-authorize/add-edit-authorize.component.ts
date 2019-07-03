import {Component, Inject, OnInit} from '@angular/core';
import {AuthorizeComponent} from '../authorize.component';
import {NoAuthDataService} from '../../../../services/no-auth-data.service';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../app.state';
import {OptionalValuesService} from '../../../../services/optional-values.service';
import {HttpClient} from '@angular/common/http';
import {ApiService} from '../../../../service/api/api.service';
import {Actions, ofType} from '@ngrx/effects';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import * as userActions from '../../../../store/user-admin/user/user.action';
import {take} from 'rxjs/operators';
import {Observable} from 'rxjs';
import * as authActions from '../../../../store/user-admin/user-authorization/authorization.actions';
import {UseradminService} from '../../../../services/useradmin.service2';
import {AuthorizationData} from '../../../../store/user-admin/user-authorization/authorization.model';

@Component({
  selector: 'app-add-edit-authorize',
  templateUrl: './add-edit-authorize.component.html',
  styleUrls: ['./add-edit-authorize.component.scss']
})
export class AddEditAuthorizeComponent extends AuthorizeComponent implements OnInit {
  isEditMode = false;
  selectedView: 'selectAuth' | 'addNewAuth' = 'selectAuth';
  selectedAuth: AuthorizationData;

  constructor(public noAuthData: NoAuthDataService,
              private userAdminService: UseradminService,
              protected store: Store<AppState>,
              protected optionalService: OptionalValuesService,
              protected http: HttpClient, protected apiServcie: ApiService,
              protected actions$: Actions,
              private dialogRef: MatDialogRef<AddEditAuthorizeComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    super(noAuthData, store, optionalService, http, apiServcie);
    if (data.auth) {
      this.isEditMode = true;
      this.selectedView = 'addNewAuth';
      this.authValueObj = data.auth;
      this.radioSelected = this.authValueObj.V_AUTH_TYP;
    }
  }

  ngOnInit() {
    super.ngOnInit();
    this.radioSelected = this.data.authType;
    this.getFilterData(this.radioSelected);
    this.userAdminService.getControlVariables();
  }

  onAddSubmit() {
    if (this.selectedView == 'addNewAuth') {
      const data = this.authValueObj;
      let body = {
        'V_AUTH_DSC': data.V_AUTH_DSC,
        'V_AUTH_CD': data.V_AUTH_CD,
        'V_AUTH_TYP': this.radioSelected,
        'V_SRC_CD': this.V_SRC_CD_DATA.V_SRC_CD,
        'V_APP_CD': data.V_APP_CD,
        'V_PRCS_CD': data.V_PRCS_CD,
        'V_EXE_TYP': data.V_EXE_TYP,
        'V_READ': data.V_READ,
        'V_UPDATE': data.V_UPDATE,
        'V_DELETE': data.V_DELETE,
        'V_CREATE': data.V_CREATE,
        'V_EXECUTE': data.V_EXECUTE,
        'V_USR_NM': this.optionalService.V_USR_NM,
        'V_COMMNT': '',
        'REST_Service': 'Auth',
        'Verb': 'POST'
      };
      this.http.post('https://enablement.us/Enablement/rest/v1/securedJSON', body).subscribe(res => {
          this.addFlag = false;
          this.assignAuthToRole(this.data.roleId, res[0] ? res[0].id + '' : '');
        },
        err => {
          console.log('Error in form record post request:\n' + err);
        });
    } else if (this.selectedView == 'selectAuth') {
      if (this.selectedAuth) {
        this.assignAuthToRole(this.data.roleId, this.selectedAuth.V_AUTH_ID);
      }
    }
  }

  onBtnCancelClick() {
    this.dialogRef.close();
  }

  assignAuthToRole(roleId: string, authId: string): void {
    if (!authId) {
      return;
    }
    let json = {
      'V_DELETED_ID_ARRAY': '',
      'V_ADDED_ID_ARRAY': authId,
      'SELECTED_ENTITY': ['ROLE'],
      'SELECTED_ENTITY_ID': [roleId],
      'V_EFF_STRT_DT_TM': [new Date(Date.now())],
      'V_EFF_END_DT_TM': [new Date(Date.now() + this.userAdminService.controlVariables.effectiveEndDate)],
      'REST_Service': ['Role_Auth'],
      'Verb': ['POST']
    };
    this.http.post('https://enablement.us/Enablement/rest/v1/securedJSON', json).subscribe(res => {
      this.dialogRef.close(true);
    }, err => {
      console.log(err);
    });
  }

  onUpdateBtnSubmit(): void {
    const data = this.authValueObj;
    let body = {
      'V_AUTH_DSC': data.V_AUTH_DSC,
      'V_AUTH_CD': data.V_AUTH_CD,
      'V_AUTH_TYP': this.radioSelected,
      'V_SRC_CD': this.V_SRC_CD_DATA.V_SRC_CD,
      'V_APP_CD': data.V_APP_CD,
      'V_PRCS_CD': data.V_PRCS_CD,
      'V_EXE_TYP': data.V_EXE_TYP,
      'V_READ': data.V_READ,
      'V_UPDATE': data.V_UPDATE,
      'V_DELETE': data.V_DELETE,
      'V_CREATE': data.V_CREATE,
      'V_EXECUTE': data.V_EXECUTE,
      'V_USR_NM': this.optionalService.V_USR_NM,
      'V_COMMNT': '',
      'REST_Service': 'Auth',
      'Verb': 'PATCH'
    };
    this.http.post('https://enablement.us/Enablement/rest/v1/securedJSON', body).subscribe(res => {
        this.dialogRef.close(true);
      },
      err => {
        console.log('Error in form record post request:\n' + err);
      });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  onAuthSelect(auth: AuthorizationData): void {
    this.selectedAuth = auth;
  }

}
