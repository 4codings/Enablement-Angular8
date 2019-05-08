import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserComponent} from './user.component';
import { ProfileComponent } from './profile/profile.component';
// import {AddComponent} from "./add/add.component";
// import {EditComponent} from "./edit/edit.component";


const routes: Routes = [
    {path: 'profile', component: UserComponent},
    {path: '', component: ProfileComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule {
}
