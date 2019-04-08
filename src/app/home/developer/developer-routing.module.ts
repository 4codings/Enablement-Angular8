import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { DeveloperComponent } from './developer.component';
import { ParametersComponent } from './parameters/parameters.component';

const routes: Routes = [
    {path: '', component: DeveloperComponent},
    {path: 'parameters', component: ParametersComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DeveloperRoutingModule {
}
