import { Injectable } from '@angular/core';
import { CookiesStorageService, LocalStorageService, SessionStorageService, SharedStorageService } from 'ngx-store';
import { LocalStorage, SessionStorage, CookieStorage } from 'ngx-store';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class StorageSessionService {

  // it will be stored under ${prefix}viewCounts name
  @LocalStorage() viewCounts = 0;
  // this under name: ${prefix}differentLocalStorageKey
  @LocalStorage('differentLocalStorageKey') userName = '';
  // it will be stored under ${prefix}itWillBeRemovedAfterBrowserClose in session storage
  @SessionStorage({key: 'itWillBeRemovedAfterBrowserClose'}) previousUserNames: Array<string> = [];
  // it will be read from cookie 'user_id' (can be shared with backend) and saved to localStorage and cookies after change
  @LocalStorage() @CookieStorage({prefix: '', key: 'user_id'}) userId = '';
  // it will be stored in a cookie named ${prefix}user_workspaces for 24 hours
  @CookieStorage({key: 'user_workspaces', expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)}) userWorkspaces = [];
  constructor(
    private  router: Router,
    private  localStorageService: LocalStorageService,
    private  sessionStorageService: SessionStorageService,
    private  cookiesStorageService: CookiesStorageService,
    private   sharedStorageService: SharedStorageService,
  ) {

  // cookiesStorageService.utility.forEach((value, key) => console.log());

      this.viewCounts++;
      this.userName = 'some name stored in localstorage';
      this.previousUserNames.push(this.userName);
      for (const userName of this.previousUserNames) {

      }
      this.previousUserNames.map(userName => userName.split('').reverse().join(''));

    }

    // store the local storage
    setLocatS(data, val) {
        this.localStorageService.set(data, val);
    }
    // get local store
    getLocalS(key): string {
    return this.localStorageService.get(key);
    }
    // session stoarage
      setSession(key, data) {
        this.sessionStorageService.set(key, data);
      }
      // get session
      getSession(key): string {
        return this.sessionStorageService.get(key);
      }
      // check session is null
      CheckSessionNull(key) {
          if (this.sessionStorageService.get(key) == null) {
              return true;
          } else {
            return false;
          }
      }
      ClearSession(key) {
        this.localStorageService.set(key, null);
      }
      // cookies storage
      setCookies(key, data) {
        this.cookiesStorageService.set(key, data);
      }
      // get cookies
      getCookies(key): string {
        return this.cookiesStorageService.get(key);

      }

      public clearSomeData() {
        this.localStorageService.clear('decorators'); // removes only variables created by decorating functions
        this.localStorageService.clear('prefix'); // removes variables starting with set prefix (including decorators)
        this.sessionStorageService.clear('all'); // removes all session storage data
      }
      // __________________________________________
      session_check() {
        if (this.CheckSessionNull('agency') && this.CheckSessionNull('email')) {
      this.router.navigateByUrl('login');

      } else {
        // this.getSession('V_USR_NM');
        // this.getSession('V_SRC_CD');
      }
    }
}
