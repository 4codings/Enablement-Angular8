import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserComponent} from "./user.component";
// import {AddComponent} from "./add/add.component";
// import {EditComponent} from "./edit/edit.component";


const routes: Routes = [
    {path: '', component: UserComponent},
    // {path: 'add', component: AddComponent},
    // {path: ':id/edit', component: EditComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule {
}
