import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SystemAdminOverviewService {
  
  public selectedExe$: Subject<any> = new Subject();

  constructor() { }

  public selectExe(exe) {
    this.selectedExe$.next(exe);
  }
}
