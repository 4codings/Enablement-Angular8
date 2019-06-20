import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { HomeModule } from './home/home.module';
import { ToastrModule } from 'ngx-toastr';
import { LaddaModule } from 'angular2-ladda';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './root.reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpInterceptorsService } from './services/http-interceptors.service';
import { LocalStorageService, SessionStorageService, CookiesStorageService, SharedStorageService } from 'ngx-store';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { UserIdleModule } from 'angular-user-idle';
import { ChartsModule } from 'ng2-charts-x';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    UserIdleModule.forRoot({ idle: environment.idle, timeout: environment.timeout, ping: 300 }),
    ToastrModule.forRoot(),
    LaddaModule.forRoot({
      style: 'zoom-in',
      spinnerColor: 'white',
      spinnerLines: 12
    }),
    AppRoutingModule,
    AuthModule,
    HomeModule,
    HttpClientModule,
    ChartsModule,
    DeviceDetectorModule.forRoot(),
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    })
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
  bootstrap: [AppComponent]
})
export class AppModule {}
