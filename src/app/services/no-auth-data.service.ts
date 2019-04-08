import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Options } from 'selenium-webdriver/edge';

export interface data {
  ROLE_CD: string[];
}

@Injectable({
  providedIn: 'root'
})
export class NoAuthDataService {

  constructor(public http: HttpClient) { }         
  
}

