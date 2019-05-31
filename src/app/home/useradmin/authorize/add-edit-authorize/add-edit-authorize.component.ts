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

@Component({
  selector: 'app-add-edit-authorize',
  templateUrl: './add-edit-authorize.component.html',
  styleUrls: ['./add-edit-authorize.component.scss']
})
export class AddEditAuthorizeComponent extends AuthorizeComponent implements OnInit {

  constructor(public noAuthData: NoAuthDataService,
              protected store: Store<AppState>,
              protected optionalService: OptionalValuesService,
              protected http: HttpClient, protected apiServcie: ApiService,
              protected actions$: Actions,
              private dialogRef: MatDialogRef<AddEditAuthorizeComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(noAuthData, store, optionalService, http, apiServcie);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  onAddSubmit() {
    const data = this.authValueObj;
    let body = {
      "V_AUTH_DSC": data.V_AUTH_DSC,
      "V_AUTH_TYP": this.radioSelected,
      "V_SRC_CD": this.V_SRC_CD_DATA.V_SRC_CD,
      "V_APP_CD": data.V_APP_CD,
      "V_PRCS_CD": data.V_PRCS_CD,
      "V_EXE_TYP": data.V_EXE_TYP,
      "V_READ": data.V_READ,
      "V_UPDATE": data.V_UPDATE,
      "V_DELETE": data.V_DELETE,
      "V_CREATE": data.V_CREATE,
      "V_EXECUTE": data.V_EXECUTE,
      "V_USR_NM": this.optionalService.V_USR_NM,
      "V_COMMNT": '',
      "REST_Service": "Auth",
      "Verb": "POST"
    };
    this.http.post('https://enablement.us/Enablement/rest/v1/securedJSON', body).subscribe(() => {
        this.addFlag = false;
        this.store.dispatch(new authActions.getAuth(this.V_SRC_CD_DATA));
        this.dialogRef.close();
      },
      err => {
        console.log("Error in form record post request:\n" + err);
      });
  }

  onBtnCancelClick(){
    this.dialogRef.close();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

}
