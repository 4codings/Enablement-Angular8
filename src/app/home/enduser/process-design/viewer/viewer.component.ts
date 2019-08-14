import { Component, OnInit } from '@angular/core';
import { StorageSessionService } from '../../../../services/storage-session.service';
import { Router } from '@angular/router';
import { Globals } from '../../../../services/globals';
import { ApiService } from '../../../../service/api/api.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Viewer } from '../../execute/bpmn-viewer';
import { Http } from '@angular/http';
export interface Food {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
  inputs: ['parentapp', 'parentpro', 'file_path']
})
export class ViewerComponent implements OnInit {

  parentapp: string;
  parentpro: string;
  bpmnTemplate: any;
  file_path: any;
  ctrl_variables: any;
  private viewer: any;
  private downloadUrl: string;
  dateTimeList: Food[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' }
  ];
  is_more = false;
  currentDate: any = new Date();
  fromDate = new Date(this.currentDate.setDate(this.currentDate.getDate() - 1));
  toDate = new Date();
  apiUrl: any;
  numbersOfTransactions = 3;
  V_SRC_CD: string = JSON.parse(sessionStorage.getItem('u')).SRC_CD;
  V_USR_NM: string = JSON.parse(sessionStorage.getItem('u')).USR_NM;

  constructor(private store: StorageSessionService, private http: Http,
    private route: Router, private toastrService: ToastrService,
    private httpClient: HttpClient, private globals: Globals,
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
    this.httpClient.get(this.apiUrl + 'V_SRC_CD=' + this.V_SRC_CD +
      '&V_APP_CD=' + this.parentapp + '&V_PRCS_CD=' + this.parentpro + '&V_USR_NM=' +
      this.V_USR_NM + '&StartDatetime=' + this.fromDate + '&EndDatetime=' + this.toDate + '&NumbersOfTransactions=' + this.numbersOfTransactions +
      '&REST_Service=ProcessStatus&Verb=GET').subscribe(res => {
        if (res) {
          console.log('res', res);
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
