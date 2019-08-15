import { Component, OnInit } from '@angular/core';
import { StorageSessionService } from '../../../../services/storage-session.service';
import { Router } from '@angular/router';
import { Globals } from '../../../../services/globals';
import { ApiService } from '../../../../service/api/api.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Viewer } from '../../execute/bpmn-viewer';
import { Http } from '@angular/http';
import { DatePipe } from '@angular/common';
export interface Food {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
  inputs: ['parentapp', 'parentpro', 'file_path'],
  providers: [DatePipe]
})
export class ViewerComponent implements OnInit {

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
  numbersOfTransactions = 3;
  V_SRC_CD: string = JSON.parse(sessionStorage.getItem('u')).SRC_CD;
  V_USR_NM: string = JSON.parse(sessionStorage.getItem('u')).USR_NM;
  PRCS_TXN_ID: any = [];
  StartDateTime: any = [];
  USR_NM: any = [];
  V_APP_ID: any = [];
  V_PRCS_ID: any = [];
  V_SRC_ID: any = [];
  selectedInstance: any = '';
  selectedUserName: any = '';
  PRDCR_SRVC_CD: any = [];
  constructor(private store: StorageSessionService, private http: Http,
    private route: Router, private toastrService: ToastrService,
    private httpClient: HttpClient, private globals: Globals, private datePipe: DatePipe,
    private apiService: ApiService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.apiUrl = this.apiService.endPoints.secure;
    this.downloadUrl = this.apiService.endPoints.downloadFile;
    this.viewer = new Viewer({
      container: '#viewer',
      width: '90%',
      height: '400px'
    });
    const eventBus = this.viewer.get('eventBus');
    if (eventBus) {
      eventBus.on('element.click', ($event) => {
        console.log('element.click', $event)
        var canvas = this.viewer.get('viewer');
        canvas.addMarker('My_Program', 'highlight');
      });
    }
    const formData: FormData = new FormData();
    formData.append('FileInfo', JSON.stringify({
      File_Path: `${this.file_path}` + this.parentapp + '/',
      File_Name: this.parentpro.replace(new RegExp(' ', 'g'), '_') + '.bpmn'
    }));
    this.http.post(this.downloadUrl, formData)
      .subscribe(
        (res: any) => {
          if (res._body != "") {
            this.viewer.importXML('');
            this.viewer.importXML(res._body, this.handleError.bind(this));
            this.bpmnTemplate = res._body;
          } else {
            this.httpClient.get('/assets/bpmn/newDiagram.bpmn', {
              headers: { observe: 'response' }, responseType: 'text'
            }).subscribe(
              (x: any) => {
                this.viewer.importXML('');
                this.viewer.importXML(x, this.handleError.bind(this));
                this.bpmnTemplate = x;
              },
              this.handleError.bind(this)
            );
          }
        },
        this.handleError.bind(this)
      );
    this.getProcessStatus();
  }

  getProcessStatus() {
    console.log(this.datePipe.transform(this.fromDate, 'yyyy-MM-dd HH:mm:ss'));
    console.log(this.datePipe.transform(this.toDate, 'yyyy-MM-dd HH:mm:ss'))
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
            this.selectedInstance = this.PRCS_TXN_ID[0];
            this.selectedUserName = this.USR_NM[0];
            this.getServicesInstances(0);
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
    this.httpClient.get(this.apiUrl + 'V_SRC_ID=' + this.V_SRC_ID[index] +
      '&V_APP_ID=' + this.V_APP_ID[index] + '&V_PRCS_ID=' + this.V_PRCS_ID[index] + '&V_USR_NM=' +
      this.USR_NM[index] + '&V_PRCS_TXN_ID=' + this.PRCS_TXN_ID[index] +
      '&REST_Service=Service_Instances&Verb=GET').subscribe(res => {
        if (Object.keys(res).length) {
          console.log('res', res);
          this.PRDCR_SRVC_CD = res['PRDCR_SRVC_CD'];
          console.log('PRDCR_SRVC_CD', this.PRDCR_SRVC_CD);
          if (this.PRDCR_SRVC_CD.length) {
            let idlist = ['My_Program', 'Select_Program', 'Program_Report_Detail', 'Program_Report_Form1'];
            this.PRDCR_SRVC_CD.forEach((ele, index) => {
              var canvas = this.viewer.get('viewer');
              console.log('id', idlist[index]);
              canvas.addMarker(idlist[index], 'highlight');
            })
          }
        }
      })
  }
  handleError(err: any) {
    if (err) {
      this.toastrService.error(err);
      console.error(err);
    }
  }
}
