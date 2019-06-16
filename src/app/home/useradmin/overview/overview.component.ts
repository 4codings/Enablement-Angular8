import {Component} from '@angular/core';
import {OverviewService} from './overview.service';
import * as usreActions from '../../../store/user-admin/user/user.action';
import {UseradminService} from '../../../services/useradmin.service2';
import {Store} from '@ngrx/store';
import {AppState} from '../../../app.state';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  providers: [OverviewService],
})
export class OverviewComponent {

  constructor(protected overviewService: OverviewService) {
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

}



