import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthorizationData } from 'src/app/store/user-admin/user-authorization/authorization.model';
import { NoAuthDataService } from 'src/app/services/no-auth-data.service';
import { AppState } from 'src/app/app.state';
import { Store, select } from '@ngrx/store';
import * as authActions from "../../../store/user-admin/user-authorization/authorization.actions";
import * as authSelectors from "../../../store/user-admin//user-authorization/authorization.selectors";

@Component({
  selector: 'app-authorize',
  templateUrl: './authorize.component.html',
  styleUrls: ['./authorize.component.scss']
})
export class AuthorizeComponent implements OnInit {

  Label: any[] = [];
  user: any[] = [];
  public authValues$: Observable<AuthorizationData[]>;
  addBtn: boolean = true;
  updateBtn: boolean = false;
  public authData$:Observable<AuthorizationData[]>;
  error$: Observable<string>;
  didLoading$: Observable<boolean>;
  didLoaded$: Observable<boolean>;
  selecteduser:string;
  authD = new data;
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
    this.store.dispatch(new authActions.getAuth());
    this.authValues$ = this.store.pipe(select(authSelectors.selectAllAutorizationvalues));
    this.error$ = this.store.pipe(select(authSelectors.getErrors));
    this.didLoading$ = this.store.pipe(select(authSelectors.getLoading));
    this.didLoaded$ = this.store.pipe(select(authSelectors.getLoaded));
    this.authValues$.subscribe(data=>{
      console.log('Auth',data)
    })
  }
  selected(index) {
    this.selecteduser = index;
  }
  showAuthData(authData){
   this.authD.AUTH_DSC =  authData.AUTH_DSC;
   this.authD.create_select = authData.CREATE == 'Y' ? true : false ; 
   this.authD.read_select = authData.READ == 'Y' ? true : false ; 
   this.authD.update_select = authData.UPDATE == 'Y' ? true : false ; 
   this.authD.delete_select = authData.DELETE == 'Y' ? true : false ; 
   this.authD.execute_select = authData.EXECUTE == 'Y' ? true : false ; 

  }
  authData(auth){
  this.authValues$.subscribe(data=>{
  this.updateBtn = data.filter(s => s['AUTH_CD'] == auth).length > 0 ? true : false;
  console.log(this.updateBtn)
    // }
  })
  }
  checkUncheck(str){
    console.log(str)
    switch(str) { 
      case 'Read': { 
        this.authD.read_select = !this.authD.read_select;
        this.authD.READ = this.authD.read_select ? 'Y' : 'N'
        break; 
      } 
      case 'Delete': { 
        this.authD.delete_select = !this.authD.delete_select;
        this.authD.DELETE = this.authD.delete_select ? 'Y' : 'N' 
         break; 
      } 
      case 'Create': { 
        this.authD.create_select = !this.authD.create_select;
        this.authD.CREATE = this.authD.create_select ? 'Y' : 'N' 
        break; 
     } 
     case 'Update': { 
        this.authD.update_select = !this.authD.update_select;
        this.authD.UPDATE = this.authD.update_select ? 'Y' : 'N' 
        break; 
     } 
      default: { 
         //statements; 
         break; 
      } 
   }
  }
}

export class data {
  APP_ID: number
AUTH_CD: string
AUTH_DSC: string
AUTH_FLD: number
ROLE_ID: any;
AUTH_ID: number
CREATE: string
create_select: boolean;

DELETE: string
delete_select: boolean

EXECUTE: string
execute_select:boolean

READ: string
read_select: boolean

UPDATE: string
update_select: boolean

id:number
is_selected: boolean
is_selected_role: boolean
}