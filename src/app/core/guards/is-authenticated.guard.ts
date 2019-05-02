import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from '../user.service';


@Injectable({
    providedIn: 'root'
})
export class IsAuthenticatedGuard implements CanActivate {


    constructor(private user: UserService, private router: Router) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        return this.validate(next, state);
    }

    private validate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        console.log(this.user.isAnonymous)
        if (this.user.isAnonymous) {
            this.router.navigateByUrl(
                '/auth/login',
                {queryParams: {next: state.url}, skipLocationChange: true}
            );
            return false;
        }

        return true;
    }
}
