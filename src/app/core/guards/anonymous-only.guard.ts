import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from '../user.service';


@Injectable({
    providedIn: 'root'
})
export class AnonymousOnlyGuard implements CanActivate {

    constructor(private user: UserService, private router: Router) {

    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (!this.user.isAnonymous) {
            this.router.navigateByUrl('/user', { skipLocationChange: true });
            return false;
        }

        return true;
    }
}
