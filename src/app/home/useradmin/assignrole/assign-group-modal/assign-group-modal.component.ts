import { Component, Inject, OnInit } from '@angular/core';
import { userRole } from '../../../../store/user-admin/user-role/userrole.model';
import { userGroup } from '../../../../store/user-admin/user-group/usergroup.model';
import { Subject } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UseradminService } from '../../../../services/useradmin.service2';
import { groupTypeConstant } from '../../useradmin.constants';

@Component({
  selector: 'app-assign-group-modal',
  templateUrl: './assign-group-modal.component.html',
  styleUrls: ['./assign-group-modal.component.scss']
})
export class AssignGroupModalComponent implements OnInit {

  role: userRole;
  groups: userGroup[];
  unsubscribeAll: Subject<boolean> = new Subject<boolean>();
  selectedGroups: SelectionModel<any> = new SelectionModel(true, []);
  public controlVariables;
  groupTypes = groupTypeConstant;
  constructor(private dialogRef: MatDialogRef<AssignGroupModalComponent>,
    private userAdminService: UseradminService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.role = data.role;
    this.groups = data.groups;
    this.controlVariables = data.controlVariables;
    this.selectedGroups.select(...this.role.V_USR_GRP_ID);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }

  onBtnCancelClick(): void {
    this.dialogRef.close();
  }

  onListItemClick(group: userGroup): void {
    this.selectedGroups.toggle(+group.V_USR_GRP_ID);
  }

  onBtnSaveClick(): void {
    const deletedGroups = [];
    if (this.role.V_USR_GRP_ID.length) {
      this.role.V_USR_GRP_ID.forEach(id => {
        if (!this.selectedGroups.isSelected(id)) {
          deletedGroups.push(id);
        }
      });
    }
    let json = {
      'V_DELETED_ID_ARRAY': deletedGroups.toString(),
      'V_ADDED_ID_ARRAY': this.selectedGroups.selected.toString(),
      'SELECTED_ENTITY': ['ROLE'],
      'SELECTED_ENTITY_ID': [this.role.id.toString()],
      'V_EFF_STRT_DT_TM': [new Date(Date.now())],
      'V_EFF_END_DT_TM': [new Date(Date.now() + this.controlVariables.effectiveEndDate)],
      'REST_Service': ['Group_Role'],
      'Verb': ['POST']
    };

    this.userAdminService.postSecuredJSON(json).subscribe(result => {
      if (result) {
        this.dialogRef.close(true);
      }
    }, error => {
    });
  }

}
