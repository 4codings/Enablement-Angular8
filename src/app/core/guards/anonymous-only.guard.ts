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
        console.log(this.user.isAnonymous);
        if (!this.user.isAnonymous) {
            this.router.navigate(['/user']);
            return false;
        }

        return true;
    }
}
