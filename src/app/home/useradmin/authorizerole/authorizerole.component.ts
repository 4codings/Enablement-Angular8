import { Component, OnInit } from '@angular/core';
import { NoAuthDataService } from 'src/app/services/no-auth-data.service';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { AuthorizationData } from 'src/app/store/user-admin/user-authorization/authorization.model';
import { Observable } from 'rxjs';
import * as userAuthorizationSelectors from '../../../store/user-admin/user-authorization/authorization.selectors';
import * as userAuthorizationActions from '../../../store/user-admin/user-authorization/authorization.actions';
import { userRole } from 'src/app/store/user-admin/user-role/userrole.model';
import * as userRoleSelectors from '../../../store/user-admin/user-role/userrole.selectors';
import * as userRoleActions from '../../../store/user-admin/user-role/userrole.action';
import { HttpClient } from '@angular/common/http';
import {authorizationTypeOptions} from '../useradmin.constants';

@Component({
  selector: 'app-authorizerole',
  templateUrl: './authorizerole.component.html',
  styleUrls: ['./authorizerole.component.scss']
})
export class AuthorizeroleComponent implements OnInit {
  Label: any[] = [];
  authData$: Observable<AuthorizationData[]>;
  error$: Observable<string>;
  didLoading$: Observable<boolean>;
  didLoaded$: Observable<boolean>;
  public roles$: Observable<userRole[]>;
  selecteduser: string;
  rol = []
  roledesc;
  authoriztion=[];
  authdesc;
  V_SRC_CD_DATA;
  public selectedauth;
  public selectedrole;
  public ctrlVvariables;
  public selectCurrentAuth:AuthorizationData;
  public selectCurrentRole:userRole;
  public authData;
  public roleData;
  public USR_AUTH_DSCR;
  public USR_ROLE_DSR;
  public start_date: any;
  public end_date: any;
  public subRole;
  public subAuth;
  authorizationTypeOptions = authorizationTypeOptions;
  constructor(public noAuthData: NoAuthDataService, private store: Store<AppState>, private http:HttpClient) { }

  ngOnInit() {
    this.V_SRC_CD_DATA = {
      V_SRC_CD: JSON.parse(sessionStorage.getItem('u')).SRC_CD,
    };
    this.noAuthData.getJSON().subscribe(data => {
      //console.log(data);
      this.Label = data;
    });
    
    this.store.dispatch(new userAuthorizationActions.RemoveAuthId());
    this.store.dispatch(new userRoleActions.RemoveRoleId());
    this.store.dispatch(new userAuthorizationActions.getAuth(this.V_SRC_CD_DATA));
    this.store.dispatch(new userRoleActions.getUserRole(this.V_SRC_CD_DATA));
    this.authData$ = this.store.pipe(select(userAuthorizationSelectors.selectAllAutorizationvalues));
    this.roles$ = this.store.pipe(select(userRoleSelectors.selectAllUserRoles));
    this.error$ = this.store.pipe(select(userAuthorizationSelectors.getErrors));
    this.didLoading$ = this.store.pipe(select(userAuthorizationSelectors.getLoading));
    this.didLoaded$ = this.store.pipe(select(userAuthorizationSelectors.getLoaded));

    this.http.get('../../../../assets/control-variable.json').subscribe(res => {
      this.ctrlVvariables = res;
    });

    this.store.pipe(select(userAuthorizationSelectors.selectCurrentAuth)).subscribe(currentAuth => {
      this.selectCurrentAuth = currentAuth;
    });

    this.store.pipe(select(userRoleSelectors.selectCurrentUserRole)).subscribe(currentRole => {
      this.selectCurrentRole = currentRole;
    });

    this.subAuth = this.authData$.subscribe(auth => {
      this.authData = auth;
      this.enableSubmitButton();
    });
  
    this.subRole = this.roles$.subscribe(role => {
      this.roleData = role;
      this.enableSubmitButton();
    });
  }

  ngOnDestroy() {
    this.store.dispatch(new userAuthorizationActions.RemoveAuthId());
    this.store.dispatch(new userRoleActions.RemoveRoleId());
    this.store.dispatch(new userAuthorizationActions.getAuth(this.V_SRC_CD_DATA));
    this.store.dispatch(new userRoleActions.getUserRole(this.V_SRC_CD_DATA));
  }
  
  selectedRole(role, index) {
    if(this.selectCurrentAuth != undefined) {
      let removeRolerelation = [];
      this.selectedauth = null;
      this.store.dispatch(new userAuthorizationActions.RemoveAuthId());

      this.roleData.forEach(role => {
        if(role.is_selected_auth == true || role.is_selected == true) {
          removeRolerelation.push({id:role.id, is_selected_auth:false, is_selected:false});
        }
      });
      this.store.dispatch(new userRoleActions.RemoveSelectedRoleGroupRelation(removeRolerelation));

      this.store.dispatch(new userRoleActions.selectRoleId(role.id));
      let authRelation = [];
      let removeAuthRelation = [];
      this.selectedrole = index;
      this.USR_ROLE_DSR = role.V_ROLE_DSC; 
      this. USR_AUTH_DSCR = ''; 

      this.authData.forEach(auth => {
        if(auth.is_selected_role == true || auth.is_selected == true) {
          removeAuthRelation.push({id:auth.id, is_selected_role:false, is_selected:false});
        }
      });
      this.store.dispatch(new userAuthorizationActions.RemoveSelectedRoleAuthRelation(removeAuthRelation));
    
      if (role.V_ROLE_ID != null) {
        role.V_AUTH_ID.forEach(AUTH_ID => {
          this.authData.forEach(auth => {
              if(AUTH_ID == auth.V_AUTH_ID) {
                authRelation.push({id:auth.id, is_selected_role:true, is_selected:true});
              }
          });
        });
        this.store.dispatch(new userAuthorizationActions.SelectRoleAuthRelation(authRelation));
      }
    } else {
      this.store.dispatch(new userRoleActions.selectRoleId(role.id));
      let authRelation = [];
      let removeAuthRelation = [];
      this.selectedrole = index;
      this.USR_ROLE_DSR = role.V_ROLE_DSC; 

      this.authData.forEach(auth => {
        if(auth.is_selected_role == true || auth.is_selected == true) {
          removeAuthRelation.push({id:auth.id, is_selected_role:false, is_selected:false});
        }
      });
      this.store.dispatch(new userAuthorizationActions.RemoveSelectedRoleAuthRelation(removeAuthRelation));
    
      if (role.V_ROLE_ID != null) {
        role.V_AUTH_ID.forEach(AUTH_ID => {
          this.authData.forEach(auth => {
              if(AUTH_ID == auth.V_AUTH_ID) {
                authRelation.push({id:auth.id, is_selected_role:true, is_selected:true});
              }
          });
        });
        this.store.dispatch(new userAuthorizationActions.SelectRoleAuthRelation(authRelation));
      }
    }
  }
  

 selectedAuth(auth, index) {
    if(this.selectCurrentRole != undefined) {
      let removeauthRelation = [];
      this.selectedrole = null;
      this.store.dispatch(new userRoleActions.RemoveRoleId());

      this.authData.forEach(auth => {
        if(auth.is_selected_role == true || auth.is_selected == true) {
          removeauthRelation.push({id:auth.id, is_selected_role:false, is_selected:false});
        }
      });
      this.store.dispatch(new userAuthorizationActions.RemoveSelectedRoleAuthRelation(removeauthRelation));

      this.store.dispatch(new userAuthorizationActions.selectAuthId(auth.id));
      let roleRelation = [];
      let removeRolerelation = [];
      this.selectedauth = index;
      this.USR_AUTH_DSCR = auth.V_AUTH_DSC; 
      this.USR_ROLE_DSR = ''; 

      this.roleData.forEach(role => {
        if(role.is_selected_auth == true || role.is_selected == true) {
          removeRolerelation.push({id:role.id, is_selected_auth:false, is_selected:false});
        }
      });
      this.store.dispatch(new userRoleActions.RemoveSelectedRoleGroupRelation(removeRolerelation));
      
      if (auth.V_ROLE_ID != null) {
        auth.V_ROLE_ID.forEach(ROLE_ID => {
          this.roleData.forEach(role => {
              if(ROLE_ID == role.V_ROLE_ID) {
                roleRelation.push({id:role.id, is_selected_auth:true, is_selected:true});
              }
          });
        });
        this.store.dispatch(new userRoleActions.SelectRoleGroupRelation(roleRelation));
      }
    } else {
      this.store.dispatch(new userAuthorizationActions.selectAuthId(auth.id));
      let roleRelation = [];
      let removeRolerelation = [];
      this.selectedauth = index;
      this.USR_AUTH_DSCR = auth.V_AUTH_DSC;

      this.roleData.forEach(role => {
        if(role.is_selected_auth == true || role.is_selected == true) {
          removeRolerelation.push({id:role.id, is_selected_auth:false, is_selected:false});
        }
      });
      this.store.dispatch(new userRoleActions.RemoveSelectedRoleGroupRelation(removeRolerelation));
      
      if (auth.V_ROLE_ID != null) {
        auth.V_ROLE_ID.forEach(ROLE_ID => {
          this.roleData.forEach(role => {
              if(ROLE_ID == role.V_ROLE_ID) {
                roleRelation.push({id:role.id, is_selected_auth:true, is_selected:true});
              }
          });
        });
        this.store.dispatch(new userRoleActions.SelectRoleGroupRelation(roleRelation));
      }
    }  
  }

  checkboxRoleSelect(event, role) {
    //console.log(event, user);
    if(this.selectCurrentAuth != undefined) {
      this.store.dispatch(new userRoleActions.CheckedRoleGroup({id:role.id, is_selected:role.is_selected}));
    }
  }

  checkboxAuthSelect(event, auth) {
    //console.log(event, group);
    if(this.selectCurrentRole != undefined) {
      this.store.dispatch(new userAuthorizationActions.CheckedRoleAuth({id:auth.id, is_selected:auth.is_selected}));
    }
  }

  enableSubmitButton() {
    
    let is_selectedExist=[]; 

    if(this.selectCurrentRole != undefined) {
      this.authData.forEach(data => {
        if(data.is_selected == true) {
          is_selectedExist.push(data.is_selected);
        }
      });
    } 
    if(this.selectCurrentAuth != undefined) {
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
    
      this.authData.forEach(auth => {
        if(auth.is_selected == false && auth.is_selected_role == true) {
          deletedIds.push(auth.V_ROLE_ID)
        }
      });

      this.authData.forEach(auth => {
        if(auth.is_selected == true && auth.is_selected_role == false) {
          addedIds.push(auth.V_ROLE_ID)
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
        "REST_Service":["Role_Auth"],
        "Verb":["POST"]
      }
      //console.log(json);
      this.http.post('https://enablement.us/Enablement/rest/v1/securedJSON', json).subscribe(res => {
        this.updateAuthStateAdded(res[0]);
        this.updateAuthStateDeleted(deletedIds)
      }, err => {
        console.log(err);
      });
    }

    if(this.selectCurrentAuth != undefined) {
      let deletedIds = [];
      let addedIds = [];
    
      this.roleData.forEach(role => {
        if(role.is_selected == false && role.is_selected_auth == true) {
          deletedIds.push(role.V_ROLE_ID)
        }
      });

      this.roleData.forEach(role => {
        if(role.is_selected == true && role.is_selected_auth == false) {
          addedIds.push(role.V_ROLE_ID)
        }
      });
      this.start_date = new Date(Date.now());
      this.end_date = new Date(Date.now() + this.ctrlVvariables.effectiveEndDate);

      let json = {
        "V_DELETED_ID_ARRAY":deletedIds.toString(),
        "V_ADDED_ID_ARRAY":addedIds.toString(),
        "SELECTED_ENTITY":['USR_AUTH'],
        "SELECTED_ENTITY_ID":[this.selectCurrentAuth.id.toString()],
        "V_EFF_STRT_DT_TM":[this.start_date],
        "V_EFF_END_DT_TM":[this.end_date],
        "REST_Service":["Role_Auth"],
        "Verb":["POST"]
      }
      //console.log(json);
      
      this.http.post('https://enablement.us/Enablement/rest/v1/securedJSON', json).subscribe(res => {
        this.updateRoleStateAdded(res[0]);
        this.updateRoleStateDeleted(deletedIds)
      }, err => {
        console.log(err);
      });
      
    }
    
  }

  updateRoleStateAdded(role) {
    let roleRelation = [];
    this.store.dispatch(new userAuthorizationActions.UpdateAuthIds({id:this.selectCurrentAuth.id, V_ROLE_ID:role.V_ROLE_ID}));
    role.V_ROLE_ID.forEach(ROLE_ID => {
      this.roleData.forEach(role => {
          if(ROLE_ID == role.V_ROLE_ID) {
            roleRelation.push({id:role.id, is_selected_auth:true, is_selected:false});
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
            removeRoleRelation.push({id:role.id, is_selected_auth:false, is_selected:false});
          }
      });
    });
    this.store.dispatch(new userRoleActions.RemoveSelectedRoleGroupRelation(removeRoleRelation));
  }

  updateAuthStateAdded(auth) {
    let authRelation = [];
    this.store.dispatch(new userRoleActions.UpdateGroupIds({id:this.selectCurrentRole.id, V_AUTH_ID:auth.V_AUTH_ID}));
    auth.V_AUTH_ID.forEach(AUTH_ID => {
      this.authData.forEach(auth => {
          if(AUTH_ID == auth.V_AUTH_ID) {
            authRelation.push({id:auth.id, is_selected_role:true, is_selected:true});
          }
      });
    });
    this.store.dispatch(new userAuthorizationActions.SelectRoleAuthRelation(authRelation));
  }

  updateAuthStateDeleted(deletedAuth) {
    let removeAuthpRelation = [];
    
    deletedAuth.forEach(deletedId => {
      this.authData.forEach(auth => {
          if(auth.V_AUTH_ID == deletedId) {
            removeAuthpRelation.push({id:auth.id, is_selected_role:false, is_selected:false});
          }
      });
    });
    this.store.dispatch(new userAuthorizationActions.RemoveSelectedRoleAuthRelation(removeAuthpRelation));
  }

}
