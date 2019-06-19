import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {userGroup} from '../../../../store/user-admin/user-group/usergroup.model';
import {groupTypeOptions} from '../../useradmin.constants';
import {AddGroupComponent} from '../../user-admin-group/add-group/add-group.component';
import {take, takeUntil} from 'rxjs/operators';
import {MatDialog} from '@angular/material';
import {UseradminService} from '../../../../services/useradmin.service2';
import {OverviewService} from '../overview.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit, OnDestroy {

  groups: userGroup[];
  @Input() controlVariables: any;
  groupTypeOptions = groupTypeOptions;
  selectedGroupType;
  V_SRC_CD_DATA: any;
  unsubscribeAll: Subject<boolean> = new Subject<boolean>();

  constructor(private dialog: MatDialog,
              private userAdminService: UseradminService,
              public overviewService: OverviewService) {
    this.overviewService.groups$.pipe(takeUntil(this.unsubscribeAll)).subscribe(groups => this.groups = groups);
    this.overviewService.selectedGroupType$.pipe(takeUntil(this.unsubscribeAll)).subscribe(type => this.selectedGroupType = type);
  }

  ngOnInit() {
    this.controlVariables = this.userAdminService.controlVariables;
    this.V_SRC_CD_DATA = {
      V_SRC_CD: JSON.parse(sessionStorage.getItem('u')).SRC_CD,
    };
  }

  onAddGroupBtnClick(): void {
    this.overviewService.openAddGroupDialog();
  }

  changeGroupType(type): void {
    this.overviewService.selectGroupType(type);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }

}
