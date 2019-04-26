import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { NoAuthDataService } from 'src/app/services/no-auth-data.service';
import { userMemberShip } from 'src/app/store/user-admin/user-membership/usermembership.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import * as userGroupSelectors from '../../../store/user-admin/user-group/usergroup.selectors';
import * as userGroupActions from '../../../store/user-admin/user-group/usergroup.action';
import { userGroup } from 'src/app/store/user-admin/user-group/usergroup.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { userRole } from 'src/app/store/user-admin/user-role/userrole.model';
import * as userRoleSelectors from '../../../store/user-admin/user-role/userrole.selectors';
import * as userRoleActions from '../../../store/user-admin/user-role/userrole.action';


@Component({
  selector: 'app-assignrole',
  templateUrl: './assignrole.component.html',
  styleUrls: ['./assignrole.component.scss']
})
export class AssignroleComponent implements OnInit, OnDestroy {
  Label: any[] = [];
  user: any[] = [];
  roledesc;
  public groups$: Observable<userGroup[]>;
  public roles$: Observable<userRole[]>;
  selectedOptions;
  RollR;

  public addBtn = true;
  public updateBtn = false;
  public error$: Observable<string>;
  public didLoading$: Observable<boolean>;
  public didLoaded$: Observable<boolean>;
  public subGroup;
  public subRole;
  public selectedgroup;
  public selectedrole;
  public ctrlVvariables;
  public selectCurrentGroup:userGroup;
  public selectCurrentRole:userRole;
  public groupData;
  public roleData;
  public USR_GRP_DSCR;
  public USR_ROLE_DSR;
  public start_date: any;
  public end_date: any;
  public V_SRC_CD_DATA;

  screenHeight=0;
  screenWidth=0;
  mobileView=false;
  desktopView=true;
  @HostListener('window:resize', ['$event'])
    onResize(event?) {
      this.screenHeight = window.innerHeight;
      this.screenWidth = window.innerWidth;
      if(this.screenWidth<=767)
      {
        this.mobileView=true;
        this.desktopView=false;
      }else{
        this.mobileView=false;
        this.desktopView=true;
      }
  }

  constructor(
    public noAuthData: NoAuthDataService,
    private store: Store<AppState>,
    private http:HttpClient
  ) { }

  ngOnInit() {
    this.V_SRC_CD_DATA = {
      V_SRC_CD: JSON.parse(sessionStorage.getItem('u')).SRC_CD,
    };

    this.noAuthData.getJSON().subscribe(data => {
      console.log(data);
      this.Label = data;
    });
    this.store.dispatch(new userGroupActions.RemoveGroupId());
    this.store.dispatch(new userRoleActions.RemoveRoleId());
    this.store.dispatch(new userGroupActions.getUserGroup(this.V_SRC_CD_DATA));
    this.store.dispatch(new userRoleActions.getUserRole(this.V_SRC_CD_DATA));
    this.groups$ = this.store.pipe(select(userGroupSelectors.selectAllUserGroups));
    this.roles$ = this.store.pipe(select(userRoleSelectors.selectAllUserRoles));

    this.error$ = this.store.pipe(select(userRoleSelectors.getErrors));
    this.didLoading$ = this.store.pipe(select(userRoleSelectors.getLoading));
    this.didLoaded$ = this.store.pipe(select(userRoleSelectors.getLoaded));

    this.http.get('../../../../assets/control-variable.json').subscribe(res => {
      this.ctrlVvariables = res;
    });

    this.store.pipe(select(userGroupSelectors.selectCurrentUserGroup)).subscribe(currentGroup => {
      this.selectCurrentGroup = currentGroup;
    });

    this.store.pipe(select(userRoleSelectors.selectCurrentUserRole)).subscribe(currentRole => {
      this.selectCurrentRole = currentRole;
    });

    this.subGroup = this.groups$.subscribe(groups => {
      this.groupData = groups;
      this.enableSubmitButton();
    });
  
    this.subRole = this.roles$.subscribe(role => {
      this.roleData = role;
      this.enableSubmitButton();
    });

  }
  
  ngOnDestroy() {
  }

  selectedRole(role, index) {
    
    if(this.selectCurrentGroup == undefined) { 
      if(this.selectedrole == index) {
        let removeGroupRelation = [];
        this.selectedrole = null;
        this.store.dispatch(new userRoleActions.RemoveRoleId());

        this.groupData.forEach(group => {
          if(group.is_selected_user == true || group.is_selected == true) {
            removeGroupRelation.push({id:group.id, is_selected_user:false, is_selected:false});
          }
        });
        this.store.dispatch(new userGroupActions.RemoveSelectedUserGroupRelation(removeGroupRelation));
      } else {
        this.store.dispatch(new userRoleActions.selectRoleId(role.id));
        let groupRelation = [];
        let removeGroupRelation = [];
        this.selectedrole = index;
        this.USR_ROLE_DSR = role.V_ROLE_DSC; 

        this.groupData.forEach(group => {
          if(group.is_selected_user == true || group.is_selected == true) {
            removeGroupRelation.push({id:group.id, is_selected_user:false, is_selected:false});
          }
        });
        this.store.dispatch(new userGroupActions.RemoveSelectedUserGroupRelation(removeGroupRelation));
      
        if (role.V_ROLE_ID != null) {
          role.V_USR_GRP_ID.forEach(GRP_ID => {
            this.groupData.forEach(group => {
                if(GRP_ID == group.V_USR_GRP_ID) {
                  groupRelation.push({id:group.id, is_selected_user:true});
                }
            });
          });
          this.store.dispatch(new userGroupActions.SelectUserGroupRelation(groupRelation));
        }
      }
    }

  }

  selectGroup(group, index) {
    
    if(this.selectCurrentRole == undefined) { 
      if(this.selectedgroup == index) {
        let removeRolerelation = [];
        this.selectedgroup = null;
        this.store.dispatch(new userGroupActions.RemoveGroupId());

        this.roleData.forEach(role => {
          if(role.is_selected_usr_grp == true || role.is_selected == true) {
            removeRolerelation.push({id:role.id, is_selected_usr_grp:false, is_selected:false});
          }
        });
        this.store.dispatch(new userRoleActions.RemoveSelectedRoleGroupRelation(removeRolerelation));
      } else {
        this.store.dispatch(new userGroupActions.selectGroupId(group.id));
        let roleRelation = [];
        let removeRolerelation = [];
        this.selectedgroup = index;
        this.USR_GRP_DSCR = group.V_USR_GRP_DSC; 

        this.roleData.forEach(role => {
          if(role.is_selected_usr_grp == true || role.is_selected == true) {
            removeRolerelation.push({id:role.id, is_selected_usr_grp:false, is_selected:false});
          }
        });
        this.store.dispatch(new userRoleActions.RemoveSelectedRoleGroupRelation(removeRolerelation));
        
        if (group.V_ROLE_ID != null) {
          group.V_ROLE_ID.forEach(ROLE_ID => {
            this.roleData.forEach(role => {
                if(ROLE_ID == role.V_ROLE_ID) {
                  roleRelation.push({id:role.id, is_selected_usr_grp:true});
                }
            });
          });
          this.store.dispatch(new userRoleActions.SelectRoleGroupRelation(roleRelation));
        }
      }  
    }
    
  }

  checkboxGroupSelect(event, group) {
    //console.log(event, group);
    if(this.selectCurrentRole != undefined) {
      this.store.dispatch(new userGroupActions.CheckedUserGroup({id:group.id, is_selected:group.is_selected}));
    }
  }

  checkboxRoleSelect(event, role) {
    //console.log(event, user);
    if(this.selectCurrentGroup != undefined) {
      this.store.dispatch(new userRoleActions.CheckedRoleGroup({id:role.id, is_selected:role.is_selected}));
    }
  }

  enableSubmitButton() {
    
    let is_selectedExist=[]; 

    if(this.selectCurrentRole != undefined) {
      this.groupData.forEach(data => {
        if(data.is_selected == true) {
          is_selectedExist.push(data.is_selected);
        }
      });
    } 
    if(this.selectCurrentGroup != undefined) {
      this.roleData.forEach(data => {
        if(data.is_selected == true) {
          is_selectedExist.push(data.is_selected);
        }
      });
    }

    if(is_selectedExist.length) {
      return false;
    } else {
      return true;
    }
    
  }

  submitAssignRole() {
    
    if(this.selectCurrentRole != undefined) {
      let deletedIds = [];
      let addedIds = [];
    
      this.groupData.forEach(group => {
        if(group.is_selected == true && group.is_selected_user == true) {
          deletedIds.push(group.V_USR_GRP_ID)
        }
      });

      this.groupData.forEach(group => {
        if(group.is_selected == true && group.is_selected_user == false) {
          addedIds.push(group.V_USR_GRP_ID)
        }
      });
      this.start_date = new Date(Date.now());
      this.end_date = new Date(Date.now() + this.ctrlVvariables.effectiveEndDate);

      let json = {
        "V_DELETED_ID_ARRAY":deletedIds.toString(),
        "V_ADDED_ID_ARRAY":addedIds.toString(),
        "SELECTED_ENTITY":['ROLE'],
        "SELECTED_ENTITY_ID":[this.selectCurrentRole.id],
        "V_EFF_STRT_DT_TM":[this.start_date],
        "V_EFF_END_DT_TM":[this.end_date],
        "REST_Service":["Group_Role"],
        "Verb":["POST"]
      }
      console.log(json);
      this.http.post('https://enablement.us/Enablement/rest/v1/securedJSON', json).subscribe(res => {
        this.updateGroupStateAdded(res[0]);
        this.updateGroupStateDeleted(deletedIds)
      }, err => {
        console.log(err);
      });
    }

    if(this.selectCurrentGroup != undefined) {
      let deletedIds = [];
      let addedIds = [];
    
      this.roleData.forEach(role => {
        if(role.is_selected == true && role.is_selected_usr_grp == true) {
          deletedIds.push(role.V_ROLE_ID)
        }
      });

      this.roleData.forEach(role => {
        if(role.is_selected == true && role.is_selected_usr_grp == false) {
          addedIds.push(role.V_ROLE_ID)
        }
      });
      this.start_date = new Date(Date.now());
      this.end_date = new Date(Date.now() + this.ctrlVvariables.effectiveEndDate);

      let json = {
        "V_DELETED_ID_ARRAY":deletedIds.toString(),
        "V_ADDED_ID_ARRAY":addedIds.toString(),
        "SELECTED_ENTITY":['USR_GRP'],
        "SELECTED_ENTITY_ID":[this.selectCurrentGroup.id.toString()],
        "V_EFF_STRT_DT_TM":[this.start_date],
        "V_EFF_END_DT_TM":[this.end_date],
        "REST_Service":["Group_Role"],
        "Verb":["POST"]
      }
      
      this.http.post('https://enablement.us/Enablement/rest/v1/securedJSON', json).subscribe(res => {
        this.updateRoleStateAdded(res[0]);
        this.updateRoleStateDeleted(deletedIds)
      }, err => {
        console.log(err);
      });
    }
    
  }

  updateGroupStateAdded(user) {
    let groupRelation = [];
    this.store.dispatch(new userRoleActions.UpdateGroupIds({id:this.selectCurrentRole.id, V_USR_GRP_ID:user.V_USR_GRP_ID}));
    user.V_USR_GRP_ID.forEach(GRP_ID => {
      this.groupData.forEach(group => {
          if(GRP_ID == group.V_USR_GRP_ID) {
            groupRelation.push({id:group.id, is_selected_user:true, is_selected:false});
          }
      });
    });
    this.store.dispatch(new userGroupActions.SelectUserGroupRelation(groupRelation));
  }

  updateGroupStateDeleted(deletedGroup) {
    let removeGroupRelation = [];
    
    deletedGroup.forEach(deletedId => {
      this.groupData.forEach(group => {
          if(group.V_USR_GRP_ID == deletedId) {
            removeGroupRelation.push({id:group.id, is_selected_user:false, is_selected:false});
          }
      });
    });
    this.store.dispatch(new userGroupActions.RemoveSelectedUserGroupRelation(removeGroupRelation));
  }

  updateRoleStateAdded(role) {
    let roleRelation = [];
    this.store.dispatch(new userGroupActions.UpdateUserIds({id:this.selectCurrentGroup.id, V_ROLE_ID:role.V_ROLE_ID}));
    role.V_ROLE_ID.forEach(ROLE_ID => {
      this.roleData.forEach(role => {
          if(ROLE_ID == role.V_ROLE_ID) {
            roleRelation.push({id:role.id, is_selected_usr_grp:true, is_selected:false});
          }
      });
    });
    this.store.dispatch(new userRoleActions.SelectRoleGroupRelation(roleRelation));
  }

  updateRoleStateDeleted(deletedRole) {
    let removeRoleRelation = [];
    
    deletedRole.forEach(deletedId => {
      this.roleData.forEach(role => {
          if(role.V_ROLE_ID == deletedId) {
            removeRoleRelation.push({id:role.id, is_selected_usr_grp:false, is_selected:false});
          }
      });
    });
    this.store.dispatch(new userRoleActions.RemoveSelectedRoleGroupRelation(removeRoleRelation));
  }
}
