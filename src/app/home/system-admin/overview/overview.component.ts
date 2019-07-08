import {Component, OnDestroy} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnDestroy {

  unsubscribeAll: Subject<boolean> = new Subject<boolean>();
  selectedPlatFormType: string = 'All';

  constructor() {}

  onFileUploadBtnClick(inputId: string): void {
    document.getElementById(inputId).click();
  }

  downloadFile(fileName: any) {
    //this.overviewService.downloadFile(fileName);
  }

  onFileSelectEvent(event, filename, moduleName): void {
    //this.overviewService.uploadFile(event, filename, moduleName);
  }
  
  selectedPlatform(type) {
    this.selectedPlatFormType = type;
  }

  ngOnDestroy(): void {
    //this.unsubscribeAll.next(true);
    //this.unsubscribeAll.complete();
  }

}
