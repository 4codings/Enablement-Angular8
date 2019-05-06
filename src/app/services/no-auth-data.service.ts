import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Options } from 'selenium-webdriver/edge';
import { Observable } from 'rxjs';

export interface data {
  ROLE_CD: string[];
}

@Injectable({
  providedIn: 'root'
})
export class NoAuthDataService {


  constructor(private http: HttpClient) {}

public getJSON(): Observable<any> {
    return this.http.get('./assets/label/label.json');
}

}

