import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { NoAuthDataService } from 'src/app/services/no-auth-data.service';
import { Observable } from 'rxjs';

import * as userActions from '../../../store/user-admin/user/user.action';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { User } from '../../../store/user-admin/user/user.model';
import * as userSelectors from '../../../store/user-admin/user/user.selectors';
import * as userGroupSelectors from '../../../store/user-admin/user-group/usergroup.selectors';
import * as userGroupActions from '../../../store/user-admin/user-group/usergroup.action';
import { userGroup } from 'src/app/store/user-admin/user-group/usergroup.model';
import { HttpClient } from '@angular/common/http';
import {groupTypeOptions} from '../useradmin.constants';


@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.scss']
})
export class MembershipComponent implements OnInit, OnDestroy {

  Label: any[] = [];
  user: any[] = [];
  public users$: Observable<User[]>;
  public groups$: Observable<userGroup[]>;
  USR_DSC_R = "";
  USR_GRP_DSCR = "";

  addBtn = true;
  updateBtn = false;
  error$: Observable<string>;
  didLoading$: Observable<boolean>;
  didLoaded$: Observable<boolean>;
  selecteduser;
  selectedgroup;
  public sub;
  public subUser;
  public subGroup
  public groupData;
  public userData;
  public selectCurrentUser;
  public selectCurrentGroup;
  public start_date: any;
  public end_date: any;
  public ctrlVvariables;
  public V_SRC_CD_DATA;

  screenHeight=0;
  screenWidth=0;
  mobileView=false;
  desktopView=true;

  groupTypeOptions = groupTypeOptions;
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
    this.noAuthData.getJSON().subscribe(data => {
      //console.log(data);
      this.Label = data;
    });
    this.V_SRC_CD_DATA = {
      V_SRC_CD: JSON.parse(sessionStorage.getItem('u')).SRC_CD,
    };
    this.store.dispatch(new userGroupActions.RemoveGroupId());
    this.store.dispatch(new userActions.RemoveUserId());
    this.store.dispatch(new userGroupActions.getUserGroup(this.V_SRC_CD_DATA));
    this.users$ = this.store.pipe(select(userSelectors.selectAllUsers));
    this.groups$ = this.store.pipe(select(userGroupSelectors.selectAllUserGroups));
    this.error$ = this.store.pipe(select(userSelectors.getErrors));
    this.didLoading$ = this.store.pipe(select(userSelectors.getLoading));
    this.didLoaded$ = this.store.pipe(select(userSelectors.getLoaded));
    this.store.pipe(select(userSelectors.selectCurrentUser)).subscribe(currentUser => {
        this.selectCurrentUser = currentUser;
    });
    
    this.http.get('../../../../assets/control-variable.json').subscribe(res => {
      this.ctrlVvariables = res;
    });

    this.store.pipe(select(userGroupSelectors.selectCurrentUserGroup)).subscribe(currentGroup => {
      this.selectCurrentGroup = currentGroup;
    });

    this.sub = this.didLoaded$.subscribe(loaded => {
      if(!loaded) {
        this.store.dispatch(new userActions.getUser(this.V_SRC_CD_DATA));
      }
    });

    this.subGroup = this.groups$.subscribe(groups => {
        this.groupData = groups;
        this.enableSubmitButton();
    });
    
    this.subUser = this.users$.subscribe(users => {
      this.userData = users;
      this.enableSubmitButton();
    });

  }
  
  ngOnDestroy() {
    this.sub.unsubscribe();
    this.subUser.unsubscribe();
    this.store.dispatch(new userGroupActions.RemoveGroupId());
    this.store.dispatch(new userActions.RemoveUserId());
    this.store.dispatch(new userGroupActions.getUserGroup(this.V_SRC_CD_DATA));
    this.store.dispatch(new userActions.getUser(this.V_SRC_CD_DATA));
  }

  selectedUser(user, index) {
    if(this.selectCurrentGroup != undefined) {
      let removeUserelation = [];
      this.selectedgroup = null;
      this.store.dispatch(new userGroupActions.RemoveGroupId());

      this.userData.forEach(user => {
        if(user.is_selected_usr_grp == true || user.is_selected == true) {
          removeUserelation.push({id:user.id, is_selected_usr_grp:false, is_selected:false});
        }
      });
      this.store.dispatch(new userActions.RemoveSelectedUserGroupRelation(removeUserelation));

      this.store.dispatch(new userActions.selectUserId(user.id));
      let groupRelation = [];
      let removeGroupRelation = [];
      this.selecteduser = index;
      this.USR_DSC_R = user.V_USR_DSC; 
      this.USR_GRP_DSCR = ''; 

      this.groupData.forEach(group => {
          if(group.is_selected_user == true || group.is_selected == true) {
            removeGroupRelation.push({id:group.id, is_selected_user:false, is_selected:false});
          }
      });
      this.store.dispatch(new userGroupActions.RemoveSelectedUserGroupRelation(removeGroupRelation));
    
      if (user.V_USR_GRP_ID != null) {
        user.V_USR_GRP_ID.forEach(GRP_ID => {
          this.groupData.forEach(group => {
              if(GRP_ID == group.V_USR_GRP_ID) {
                groupRelation.push({id:group.id, is_selected_user:true, is_selected:true});
              }
          });
        });
        this.store.dispatch(new userGroupActions.SelectUserGroupRelation(groupRelation));
      }
    } else {
      this.store.dispatch(new userActions.selectUserId(user.id));
      let groupRelation = [];
      let removeGroupRelation = [];
      this.selecteduser = index;
      this.USR_DSC_R = user.V_USR_DSC; 
      this.USR_GRP_DSCR = ''; 

      this.groupData.forEach(group => {
          if(group.is_selected_user == true || group.is_selected == true) {
            removeGroupRelation.push({id:group.id, is_selected_user:false, is_selected:false});
          }
      });
      this.store.dispatch(new userGroupActions.RemoveSelectedUserGroupRelation(removeGroupRelation));
    
      if (user.V_USR_GRP_ID != null) {
        user.V_USR_GRP_ID.forEach(GRP_ID => {
          this.groupData.forEach(group => {
              if(GRP_ID == group.V_USR_GRP_ID) {
                groupRelation.push({id:group.id, is_selected_user:true, is_selected: true});
              }
          });
        });
        this.store.dispatch(new userGroupActions.SelectUserGroupRelation(groupRelation));
      }
    }
  }

  selectGroup(group, index) {
    if(this.selectCurrentUser != undefined) {
      let removeGroupRelation = [];
      this.selecteduser = null;
      this.store.dispatch(new userActions.RemoveUserId());

      this.groupData.forEach(group => {
        if(group.is_selected_user == true || group.is_selected == true) {
          removeGroupRelation.push({id:group.id, is_selected_user:false, is_selected:false});
        }
      });
      this.store.dispatch(new userGroupActions.RemoveSelectedUserGroupRelation(removeGroupRelation));

      this.store.dispatch(new userGroupActions.selectGroupId(group.id));
      let userRelation = [];
      let removeUserelation = [];
      this.selectedgroup = index;
      this.USR_GRP_DSCR = group.V_USR_GRP_DSC; 
      this.USR_DSC_R = ''; 

      this.userData.forEach(user => {
        if(user.is_selected_usr_grp == true || user.is_selected == true) {
          removeUserelation.push({id:user.id, is_selected_usr_grp:false, is_selected:false});
        }
      });
      this.store.dispatch(new userActions.RemoveSelectedUserGroupRelation(removeUserelation));
      
      if (group.V_USR_ID != null) {
        group.V_USR_ID.forEach(USR_ID => {
          this.userData.forEach(user => {
              if(USR_ID == user.V_USR_ID) {
                userRelation.push({id:user.id, is_selected_usr_grp:true, is_selected:true});
              }
          });
        });
        this.store.dispatch(new userActions.SelectUserGroupRelation(userRelation));
      }
    } else {
      this.store.dispatch(new userGroupActions.selectGroupId(group.id));
      let userRelation = [];
      let removeUserelation = [];
      this.selectedgroup = index;
      this.USR_GRP_DSCR = group.V_USR_GRP_DSC; 
      this.USR_DSC_R = ''; 

      this.userData.forEach(user => {
        if(user.is_selected_usr_grp == true || user.is_selected == true) {
          removeUserelation.push({id:user.id, is_selected_usr_grp:false, is_selected:false});
        }
      });
      this.store.dispatch(new userActions.RemoveSelectedUserGroupRelation(removeUserelation));
      
      if (group.V_USR_ID != null) {
        group.V_USR_ID.forEach(USR_ID => {
          this.userData.forEach(user => {
              if(USR_ID == user.V_USR_ID) {
                userRelation.push({id:user.id, is_selected_usr_grp:true, is_selected:true});
              }
          });
        });
        this.store.dispatch(new userActions.SelectUserGroupRelation(userRelation));
      }
    }  
  }

  checkboxGroupSelect(event, group) {
    //console.log(event, group);
    if(this.selectCurrentUser != undefined) {
      this.store.dispatch(new userGroupActions.CheckedUserGroup({id:group.id, is_selected:group.is_selected}));
    }
  }

  checkboxUserSelect(event, user) {
    //console.log(event, user);
    if(this.selectCurrentGroup != undefined) {
      this.store.dispatch(new userActions.CheckedUserGroup({id:user.id, is_selected:user.is_selected}));
    }
  }

  submitMemberShip() {
  
    if(this.selectCurrentUser != undefined) {
      let deletedIds = [];
      let addedIds = [];
    
      this.groupData.forEach(group => {
        if(group.is_selected == false && group.is_selected_user == true) {
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
        "SELECTED_ENTITY":['USER'],
        "SELECTED_ENTITY_ID":this.selectCurrentUser.id.split(' '),
        "V_EFF_STRT_DT_TM":[this.start_date],
        "V_EFF_END_DT_TM":[this.end_date],
        "REST_Service":["User_Group"],
        "Verb":["POST"]
      }
      
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
    
      this.userData.forEach(user => {
        if(user.is_selected == false && user.is_selected_usr_grp == true) {
          deletedIds.push(user.V_USR_ID)
        }
      });

      this.userData.forEach(user => {
        if(user.is_selected == true && user.is_selected_usr_grp == false) {
          addedIds.push(user.V_USR_ID)
        }
      });
      this.start_date = new Date(Date.now());
      this.end_date = new Date(Date.now() + this.ctrlVvariables.effectiveEndDate);

      let json = {
        "V_DELETED_ID_ARRAY":deletedIds.toString(),
        "V_ADDED_ID_ARRAY":addedIds.toString(),
        "SELECTED_ENTITY":['USR_GRP'],
        "SELECTED_ENTITY_ID":this.selectCurrentGroup.id.split(' '),
        "V_EFF_STRT_DT_TM":[this.start_date],
        "V_EFF_END_DT_TM":[this.end_date],
        "REST_Service":["User_Group"],
        "Verb":["POST"]
      }
      
      this.http.post('https://enablement.us/Enablement/rest/v1/securedJSON', json).subscribe(res => {
        this.updateUserStateAdded(res[0]);
        this.updateUserStateDeleted(deletedIds)
      }, err => {
        console.log(err);
      });
    }
    
  }

  enableSubmitButton():boolean {
   
      let is_selectedExist=[]; 

      if(this.selectCurrentUser != undefined) {
        this.groupData.forEach(data => {
          if(data.is_selected == true) {
            is_selectedExist.push(data.is_selected);
          }
        });
      } 
      if(this.selectCurrentGroup != undefined) {
        this.userData.forEach(data => {
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
  
  updateGroupStateAdded(user) {
    let groupRelation = [];
    this.store.dispatch(new userActions.UpdateUserGroupIds({id:this.selectCurrentUser.id, V_USR_GRP_ID:user.V_USR_GRP_ID}));
    user.V_USR_GRP_ID.forEach(GRP_ID => {
      this.groupData.forEach(group => {
          if(GRP_ID == group.V_USR_GRP_ID) {
            groupRelation.push({id:group.id, is_selected_user:true, is_selected:true});
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

  updateUserStateAdded(user) {
    let userRelation = [];
    this.store.dispatch(new userGroupActions.UpdateUserIds({id:this.selectCurrentGroup.id, V_USR_ID:user.V_USR_ID}));
    user.V_USR_ID.forEach(USR_ID => {
      this.userData.forEach(user => {
          if(USR_ID == user.V_USR_ID) {
            userRelation.push({id:user.id, is_selected_usr_grp:true, is_selected:false});
          }
      });
    });
    this.store.dispatch(new userActions.SelectUserGroupRelation(userRelation));
  }

  updateUserStateDeleted(deletedUser) {
    let removeUserRelation = [];
    
    deletedUser.forEach(deletedId => {
      this.userData.forEach(user => {
          if(user.V_USR_ID == deletedId) {
            removeUserRelation.push({id:user.id, is_selected_usr_grp:false, is_selected:false});
          }
      });
    });
    this.store.dispatch(new userActions.RemoveSelectedUserGroupRelation(removeUserRelation));
  }

}


