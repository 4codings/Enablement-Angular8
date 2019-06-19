import {Component, OnDestroy} from '@angular/core';
import {OverviewService} from './overview.service';
import * as usreActions from '../../../store/user-admin/user/user.action';
import {UseradminService} from '../../../services/useradmin.service2';
import {Store} from '@ngrx/store';
import {AppState} from '../../../app.state';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {groupTypeConstant} from '../useradmin.constants';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  providers: [OverviewService],
})
export class OverviewComponent implements OnDestroy {

  unsubscribeAll: Subject<boolean> = new Subject<boolean>();
  groupTypes = groupTypeConstant;
  selectedGroupType: string;

  constructor(protected overviewService: OverviewService) {
    this.overviewService.selectedGroupType$.pipe(takeUntil(this.unsubscribeAll)).subscribe(type => this.selectedGroupType = type.key);
  }

  onFileUploadBtnClick(inputId: string): void {
    document.getElementById(inputId).click();
  }

  downloadFile(fileName: any) {
    this.overviewService.downloadFile(fileName);
  }

  onFileSelectEvent(event, filename, moduleName): void {
    this.overviewService.uploadFile(event, filename, moduleName);
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(true);
    this.unsubscribeAll.complete();
  }

}



