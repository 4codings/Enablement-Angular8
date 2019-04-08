import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { SystemAdminComponent } from './system-admin.component';
import { PlatformComponent } from './platform/platform.component';



const routes: Routes = [
    {path: '', component: SystemAdminComponent},
    {path: 'platform', component: PlatformComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SystemAdminRoutingModule {
}
