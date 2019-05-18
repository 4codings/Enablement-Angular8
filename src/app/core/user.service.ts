import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import * as _ from 'lodash';
import { userInfo } from '../store/auth/userinfo.model';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import * as usreLoginActions from '../store/auth/userlogin.action';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    detail: BehaviorSubject<userInfo>;

    constructor(private store: Store<AppState>) {
        this.detail = new BehaviorSubject<any>(this.getDetailFromStorage());
    }


    get isAnonymous(): boolean {
        return _.isEmpty(this.detail.value);
    }


    setUser(user: userInfo, forSessionOnly = true) {
        if (this.getDetailFromStorage() !== null) {
            throw new Error('User is already set. Please call clear() and the set again.');
        }

        this._setUser(user, forSessionOnly);
    }
    
    update(value: any) {
        const newVal = _.merge(this.getDetailFromStorage(), value) as userInfo;
        //this._setUser(newVal, newVal.forSessionOnly);
    }

    clear() {
        sessionStorage.removeItem('u');
        localStorage.removeItem('u');
        this.store.dispatch(new usreLoginActions.clearUserInfo());
        this.detail.next(this.getDetailFromStorage());
    }

    public getDetailFromStorage(): userInfo {
        let u = sessionStorage.getItem('u');
        u = _.isEmpty(u) ? localStorage.getItem('u') : u;

        return _.isEmpty(u) ? null : JSON.parse(u) as userInfo;
    }

    private _setUser(user: userInfo, forSessionOnly) {
        const storage = forSessionOnly === true ? sessionStorage : localStorage;
        //user.forSessionOnly = forSessionOnly;
        storage.setItem('u', JSON.stringify(user));

        this.detail.next(user);
    }
}
