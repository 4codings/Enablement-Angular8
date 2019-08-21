import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { ToastrModule } from 'ngx-toastr';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './root.reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { HttpInterceptorsService } from './services/http-interceptors.service';
import { LocalStorageService, SessionStorageService, CookiesStorageService, SharedStorageService } from 'ngx-store';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { UserIdleModule } from 'angular-user-idle';
import { ChartsModule } from 'ng2-charts-x';
import { KeepAliveDialog } from './core/keep-alive-dialog';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [AppComponent, KeepAliveDialog],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpModule,
    MatDialogModule,
    UserIdleModule.forRoot({ idle: environment.idle, timeout: environment.timeout, ping: 120 }),
    ToastrModule.forRoot(),
    ChartsModule,
    DeviceDetectorModule.forRoot(),
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    }),
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorsService,
      multi: true
    },
    LocalStorageService,
    SessionStorageService,
    CookiesStorageService,
    SharedStorageService
  ],
  bootstrap: [AppComponent],
  entryComponents: [KeepAliveDialog]
})
export class AppModule { }
