import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {OverviewService} from './overview.service';
import * as usreActions from '../../../store/user-admin/user/user.action';
import {UseradminService} from '../../../services/useradmin.service2';
import {Store} from '@ngrx/store';
import {AppState} from '../../../app.state';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {groupTypeConstant} from '../useradmin.constants';
import { RollserviceService } from '../../../services/rollservice.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  providers: [OverviewService],
})
export class OverviewComponent implements OnDestroy, OnInit {

  unsubscribeAll: Subject<boolean> = new Subject<boolean>();
  groupTypes = groupTypeConstant;
  selectedGroupType: string;

  roll_overview: boolean = false;
  roll_user: boolean = false;
  roll_group: boolean = false;
  roll_membership: boolean = false;
  roll_role: boolean = false;
  roll_assignRole: boolean = false;
  roll_auth: boolean = false;
  roll_authorization: boolean = false;

  ctrl_variables: any;

  constructor(
    protected overviewService: OverviewService,
    private httpClient: HttpClient,
    private rollserviceService: RollserviceService,
  ) {
    this.overviewService.selectedGroupType$.pipe(takeUntil(this.unsubscribeAll)).subscribe(type => this.selectedGroupType = type.key);
  }

  ngOnInit(): void {
    this.rollserviceService.getRollCd().then((res) => {
      this.httpClient.get('../../../../assets/control-variable.json').subscribe(cvres => {
        this.ctrl_variables = cvres;
        res.map((role) => {
          switch (role) {
            case 'Enablement User Admin Overview Role':
              if (this.ctrl_variables.show_UserAdminOverviewTab) {
                this.roll_overview = true;
              }
              break;
            case 'Enablement User Admin User Role':
              if (this.ctrl_variables.show_UserAdminUserTab) {
                this.roll_user = true;
              }
              break;
            case 'Enablement User Admin Group Role':
              if (this.ctrl_variables.show_UserAdminGroupTab) {
                this.roll_group = true;
              }
              break;
            case 'Enablement User Admin Membership Role':
              if (this.ctrl_variables.show_UserAdminMembershipTab) {
                this.roll_membership = true;
              }
              break;
            case 'Enablement User Admin Role Role':
              if (this.ctrl_variables.show_UserAdminRoleTab) {
                this.roll_role = true;
              }
              break;
            case 'Enablement User Admin Auth Role':
              if (this.ctrl_variables.show_UserAdminAuthTab) {
                this.roll_auth = true;
              }
              break;
            case 'Enablement User Admin Authorize Roles Role':
              if (this.ctrl_variables.show_UserAdminAuthorizationTab) {
                this.roll_authorization = true;
              }
              break;
            case 'Enablement User Admin Assign Roles Role':
              if (this.ctrl_variables.show_UserAdminAssignRoleTab) {
                this.roll_assignRole = true;
              }
              break;
            default:
              break;
          }
        });
      });
    });
  }

  onFileUploadBtnClick(inputId: string): void {
    document.getElementById(inputId).click();
  }

  downloadFile(fileName: any) {
    this.overviewService.downloadFile(fileName);
  }

  onFileSelectEvent(event, filename, moduleName): void {
    this.overviewService.uploadFile(event, filename, moduleName);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }

}



