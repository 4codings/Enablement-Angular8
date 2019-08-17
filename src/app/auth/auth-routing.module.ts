import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { AnonymousOnlyGuard } from '../core/guards/anonymous-only.guard';

const routes: Routes = [
    { path: '', component: AuthComponent, canActivate: [AnonymousOnlyGuard] }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    declarations: []
})
export class AuthRoutingModule {
}
