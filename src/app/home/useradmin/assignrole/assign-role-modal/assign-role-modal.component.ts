import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { userRole } from '../../../../store/user-admin/user-role/userrole.model';
import { Subject } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { userGroup } from '../../../../store/user-admin/user-group/usergroup.model';
import { UseradminService } from '../../../../services/useradmin.service2';

@Component({
  selector: 'app-assign-role-modal',
  templateUrl: './assign-role-modal.component.html',
  styleUrls: ['./assign-role-modal.component.scss']
})
export class AssignRoleModalComponent implements OnInit, OnDestroy {

  roles: userRole[] = [];
  group: userGroup;
  unsubscribeAll: Subject<boolean> = new Subject<boolean>();
  selectedRoles: SelectionModel<any> = new SelectionModel(true, []);
  public controlVariables;

  constructor(private dialogRef: MatDialogRef<AssignRoleModalComponent>,
    private userAdminService: UseradminService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.group = data.group;
    this.roles = data.roles;
    this.controlVariables = data.controlVariables;
    this.selectedRoles.select(...this.group.V_ROLE_ID);
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

  onListItemClick(role: userRole): void {
    this.selectedRoles.toggle(+role.V_ROLE_ID);
  }

  onBtnSaveClick(): void {
    const deletedRoles = [];
    if (this.group.V_ROLE_ID != null && this.group.V_ROLE_ID.length) {
      this.group.V_ROLE_ID.forEach(id => {
        if (!this.selectedRoles.isSelected(id)) {
          deletedRoles.push(id);
        }
      });
    }
    let json = {
      'V_DELETED_ID_ARRAY': deletedRoles.toString(),
      'V_ADDED_ID_ARRAY': this.selectedRoles.selected.toString(),
      'SELECTED_ENTITY': ['USR_GRP'],
      'SELECTED_ENTITY_ID': [this.group.id.toString()],
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
