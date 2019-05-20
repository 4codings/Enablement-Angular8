import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import {MatIconModule} from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [HeaderComponent, UserProfileComponent],
  imports: [
    CommonModule,
    MatIconModule,
    FlexLayoutModule,
    MatTooltipModule,
    MatMenuModule,
    MatButtonModule,
    SharedModule
  ],
  exports:[HeaderComponent]
})
export class HeaderModule { }
