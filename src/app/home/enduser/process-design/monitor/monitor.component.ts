import { Component, OnInit, OnDestroy } from '@angular/core';
import { StorageSessionService } from '../../../../services/storage-session.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Globals } from '../../../../services/globals';
import { ApiService } from '../../../../service/api/api.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Viewer } from '../../execute/bpmn-viewer';
import { Http } from '@angular/http';
import { DatePipe } from '@angular/common';
import { OptionalValuesService } from 'src/app/services/optional-values.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { InputOutputElementComponent } from 'src/app/shared/components/input-output-element/input-output-element.component';
export interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss'],
  // inputs: ['parentapp', 'parentpro', 'file_path'],
  providers: [DatePipe]
})
export class MonitorComponent implements OnInit, OnDestroy {

  parentapp: string;
  parentpro: string;
  bpmnTemplate: any;
  file_path: any;
  ctrl_variables: any;
  private viewer: any;
  private downloadUrl: string;
  // dateTimeList: Food[] = [
  //   { value: 'steak-0', viewValue: 'Steak' },
  //   { value: 'pizza-1', viewValue: 'Pizza' },
  //   { value: 'tacos-2', viewValue: 'Tacos' }
  // ];
  is_more = false;
  currentDate: any = new Date();
  fromDate = new Date(this.currentDate.setDate(this.currentDate.getDate() - 1));
  toDate = new Date();
  apiUrl: any;
  apiJSONUrl: any;
  numbersOfTransactions = 100;
  V_SRC_CD: string = JSON.parse(sessionStorage.getItem('u')).SRC_CD;
  V_USR_NM: string = JSON.parse(sessionStorage.getItem('u')).USR_NM;
  PRCS_TXN_ID: any = [];
  StartDateTime: any = [];
  USR_NM: any = [];
  V_APP_ID: any = [];
  V_PRCS_ID: any = [];
  V_SRC_ID: any = [];
  selected_V_APP_ID: any = '';
  selected_V_PRCS_ID: any = '';
  selected_V_SRC_ID: any = '';
  selected_USR_NM: any = '';
  selectedInstance: any = '';
  selectedUserName: any = '';
  selectedAppProcess$: Subscription;
  selectedInstanceElementsList: InstanceElementList[] = [];
  selectedElement = new InstanceElementList();
  selectedElementInput: any;
  selectedElementOutput: any;
  elementClick = false;
  constructor(public http: Http, public toastrService: ToastrService, public optionalService: OptionalValuesService,
    public httpClient: HttpClient, public datePipe: DatePipe,
    public apiService: ApiService, public dialog: MatDialog) {
    this.selectedAppProcess$ = this.optionalService.selectedAppPrcoessValue.subscribe(res => {
      if (res) {
        this.parentapp = res.app;
        this.parentpro = res.process;
        this.file_path = res.file_path;
      }
    })
  }

  ngOnInit() {
    this.optionalService.selecetedProcessTxnValue.next(null);
    this.apiUrl = this.apiService.endPoints.secure;
    this.apiJSONUrl = this.apiService.endPoints.securedJSON;
    this.downloadUrl = this.apiService.endPoints.downloadFile;
    this.getProcessStatus();
    // this.downloadBpmn();
  }
  ngOnDestroy() {
    this.selectedAppProcess$.unsubscribe();
  }

  // ngAfterViewInit() {
  //   this.viewer = new Viewer({
  //     container: '#ref',
  //     width: '90%',
  //     height: '400px'
  //   });
  //   const eventBus = this.viewer.get('eventBus');
  //   if (eventBus) {
  //     eventBus.on('element.click', ($event) => {
  //       this.elementClick = false;
  //       console.log('element.click', $event);
  //       let i = this.selectedInstanceElementsList.findIndex(v => v.PRDCR_SRVC_CD.replace(new RegExp(' ', 'g'), '_') == $event.element.id);
  //       if (i > -1) {
  //         console.log('ele', this.selectedInstanceElementsList[i]);
  //         this.selectedElement = this.selectedInstanceElementsList[i];
  //         this.selectedElementInput = this.selectedElement.SRVC_INPUT;
  //         this.selectedElementOutput = this.selectedElement.SRVC_OUTPUT;
  //         if (this.selectedElementInput != null) {
  //           this.elementClick = true;
  //           let inputs = this.selectedElementInput[0].split(',');
  //           let keys = [];
  //           if (inputs.length) {
  //             inputs.forEach(ele => {
  //               let split = ele.trim().split('=');
  //               let obj = { 'key': split[0], 'value': split[1] };
  //               keys.push(obj);
  //             })
  //             this.selectedElementInput = [];
  //             this.selectedElementInput = keys;
  //             console.log('eleinu', this.selectedElementInput);
  //           }
  //         }
  //         if (this.selectedElementOutput != null) {
  //           this.elementClick = true;
  //           let outputs = this.selectedElementOutput[0].split(',');
  //           let keys = [];
  //           if (outputs.length) {
  //             outputs.forEach(ele => {
  //               let split = ele.trim().split('=');
  //               let obj = { 'key': split[0], 'value': split[1] };
  //               keys.push(obj);
  //             })
  //             this.selectedElementOutput = [];
  //             this.selectedElementOutput = keys;
  //             console.log('selectedElementOutput', this.selectedElementOutput);
  //           }
  //         }
  //         let startx = $event.element.x;
  //         let currentx = $event.originalEvent.layerX;
  //         let endx = $event.element.x + $event.element.width;
  //         let starty = $event.element.y;
  //         let endy = $event.element.y + $event.element.height;
  //         let currenty = $event.originalEvent.layerY;
  //         let section = $event.element.width / 3;
  //         let isShowInput = false;
  //         let isShowOutput = false;
  //         let isShowInputOutput = false;
  //         if (currenty >= starty && currenty <= endy) {
  //           if (currentx >= startx && currentx <= startx + section) {
  //             isShowInput = true;
  //           } else if (currentx >= startx + section && currentx <= endx - section) {
  //             isShowInputOutput = true;
  //           } else if (currentx >= endx - section && currentx <= endx) {
  //             isShowOutput = true;
  //           }
  //         }

  //         if (isShowInput || isShowOutput || isShowInputOutput) {
  //           const dialogRef = this.dialog.open(InputOutputElementComponent,
  //             {
  //               panelClass: 'app-dialog',
  //               // width: '600px',
  //               // height: '500px',
  //               data: {
  //                 inputElement: this.selectedElementInput,
  //                 outputElement: this.selectedElementOutput,
  //                 showInput: isShowInput,
  //                 showOutput: isShowOutput,
  //                 showInputOutput: isShowInputOutput
  //               }
  //             });
  //           dialogRef.afterClosed().pipe(take(1)).subscribe((flag) => {
  //             if (flag) {
  //             }
  //           });
  //         }
  //         let canvas = this.viewer.get('canvas');
  //         canvas.addMarker($event.element.id, 'highlight');
  //       }
  //     });
  //   }
  // }
  // downloadBpmn() {
  //   const formData: FormData = new FormData();
  //   formData.append('FileInfo', JSON.stringify({
  //     File_Path: `${this.file_path}` + this.parentapp + '/',
  //     File_Name: this.parentpro.replace(new RegExp(' ', 'g'), '_') + '.bpmn'
  //   }));
  //   this.http.post(this.downloadUrl, formData)
  //     .subscribe(
  //       (res: any) => {
  //         if (res._body != "") {
  //           this.viewer.importXML('');
  //           this.viewer.importXML(res._body, this.handleError.bind(this));
  //           this.bpmnTemplate = res._body;
  //           setTimeout(ele => {
  //             var canvas = this.viewer.get('canvas');
  //             console.log('this.viewer.get', this.viewer.get('elementRegistry'));
  //             canvas.addMarker('Start', 'highlight');
  //           }, 2000);
  //         } else {
  //           this.httpClient.get('/assets/bpmn/newDiagram.bpmn', {
  //             headers: { observe: 'response' }, responseType: 'text'
  //           }).subscribe(
  //             (x: any) => {
  //               this.viewer.importXML('');
  //               this.viewer.importXML(x, this.handleError.bind(this));
  //               this.bpmnTemplate = x;
  //               setTimeout(ele => {
  //                 var canvas = this.viewer.get('canvas');
  //                 console.log('this.viewer.get', this.viewer.get('elementRegistry'));
  //                 canvas.addMarker('Start', 'highlight');
  //               }, 2000);
  //             },
  //             this.handleError.bind(this)
  //           );
  //         }
  //       },
  //       this.handleError.bind(this)
  //     );
  //   this.getProcessStatus();
  // }
  onDateChange() {
    this.getProcessStatus();
  }
  getProcessStatus() {
    this.httpClient.get(this.apiUrl + 'V_SRC_CD=' + this.V_SRC_CD +
      '&V_APP_CD=' + this.parentapp + '&V_PRCS_CD=' + this.parentpro + '&V_USR_NM=' +
      this.V_USR_NM + '&StartDatetime=' + this.datePipe.transform(this.fromDate, 'yyyy-MM-dd HH:mm:ss') + '&EndDatetime=' + this.datePipe.transform(this.toDate, 'yyyy-MM-dd HH:mm:ss') + '&NumbersOfTransactions=' + this.numbersOfTransactions +
      '&REST_Service=Process_Instances&Verb=GET').subscribe(res => {
        if (Object.keys(res).length) {
          console.log('res', res);
          this.PRCS_TXN_ID = res['PRCS_TXN_ID'];
          this.StartDateTime = res['StartDateTime'];
          this.USR_NM = res['USR_NM'];
          this.V_APP_ID = res['V_APP_ID'];
          this.V_PRCS_ID = res['V_PRCS_ID'];
          this.V_SRC_ID = res['V_SRC_ID'];
          if (this.PRCS_TXN_ID.length) {
            this.selected_V_APP_ID = this.V_APP_ID[0];
            this.selected_V_PRCS_ID = this.V_PRCS_ID[0];
            this.selected_USR_NM = this.USR_NM[0];
            this.selected_V_SRC_ID = this.V_SRC_ID[0];
            this.selectedInstance = this.PRCS_TXN_ID[0];
            this.selectedUserName = this.USR_NM[0];
            this.getServicesInstances(0);
            let obj = {
              'V_APP_ID': this.selected_V_APP_ID,
              'V_PRCS_ID': this.selected_V_PRCS_ID,
              'V_PRCS_TXN_ID': this.selectedInstance,
              'V_SRC_ID': this.selected_V_SRC_ID,
              'USR_NM': this.selected_USR_NM
            }
            this.optionalService.selecetedProcessTxnValue.next(obj);
          }
        }
      });
  }

  onInstanceChange(instance) {
    if (this.PRCS_TXN_ID.length) {
      this.PRCS_TXN_ID.forEach((element, index) => {
        if (element === instance) {
          this.selectedUserName = this.USR_NM[index];
          this.getServicesInstances(index);
        }
      });
    }
  }

  getServicesInstances(index) {
    this.selectedInstance = this.PRCS_TXN_ID[index];
    let obj = {
      'V_APP_ID': this.selected_V_APP_ID,
      'V_PRCS_ID': this.selected_V_PRCS_ID,
      'V_PRCS_TXN_ID': this.selectedInstance,
      'V_SRC_ID': this.selected_V_SRC_ID,
      'USR_NM': this.selected_USR_NM
    }
    this.optionalService.selecetedProcessTxnValue.next(obj);
    // this.httpClient.get(this.apiJSONUrl + 'V_SRC_ID=' + this.V_SRC_ID[index] +
    //   '&V_APP_ID=' + this.V_APP_ID[index] + '&V_PRCS_ID=' + this.V_PRCS_ID[index] + '&V_USR_NM=' +
    //   this.USR_NM[index] + '&V_PRCS_TXN_ID=' + this.PRCS_TXN_ID[index] +
    //   '&REST_Service=Service_Instances&Verb=GET').subscribe((res: any) => {
    //     if (res.length) {
    //       console.log('res', res);
    //       this.selectedInstanceElementsList = res;
    //       console.log('res', this.selectedInstanceElementsList);
    //       // this.PRDCR_SRVC_CD = res['PRDCR_SRVC_CD'];
    //       // console.log('PRDCR_SRVC_CD', this.PRDCR_SRVC_CD);
    //       setTimeout(ele => {
    //         // if (this.PRDCR_SRVC_CD.length) {
    //         //   var canvas = this.viewer.get('canvas');
    //         //   let elements = this.viewer.get('elementRegistry');
    //         //   console.log('elements', elements);
    //         //   canvas.addMarker('Start', 'highlight');
    //         //   // this.PRDCR_SRVC_CD.forEach((ele, index) => {
    //         //   //   let eleReg = ele.replace(new RegExp(' ', 'g'), '_')
    //         //   //   console.log('eleReg ', eleReg);
    //         //   //   if (elements.get(eleReg)) {
    //         //   //     canvas.addMarker(eleReg, 'highlight');
    //         //   //   }
    //         //   // })
    //         // }
    //       }, 2000);

    //     }
    //   })
  }
  handleError(err: any) {
    if (err) {
      this.toastrService.error(err);
      console.error(err);
    }
  }
}
export class InstanceElementList {
  EXCPN_MSG: any;
  INS_DT_TM: any;
  LEVEL: any;
  LST_UPD_DT_TM: any;
  PRCS_CD: any;
  PRDCR_SRVC_CD: any;
  SRVC_INPUT: any;
  SRVC_OUTPUT: any;
  TXN_ID: any;
  TXN_STS: any;
}