import { Component, OnInit } from '@angular/core';
import { StorageSessionService } from '../../../../services/storage-session.service';
import { Router } from '@angular/router';
import { Globals } from '../../../../services/globals';
import { ApiService } from '../../../../service/api/api.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Viewer } from '../../execute/bpmn-viewer';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
  inputs: ['parentapp', 'parentpro']
})
export class ViewerComponent implements OnInit {

  parentapp: string;
  parentpro: string;
  bpmnTemplate: any;
  ctrl_variables: any;
  private viewer: any;
  private downloadUrl: string;

  constructor(private store: StorageSessionService,
    private route: Router, private toastrService: ToastrService,
    private http: HttpClient, private globals: Globals,
    private apiService: ApiService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.downloadUrl = this.apiService.endPoints.downloadFile;
    this.http.get('../../../../assets/control-variable.json').subscribe(res => {
      this.ctrl_variables = res;
    });
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
      File_Path: `${this.ctrl_variables.bpmn_file_path}` + this.parentapp + '/',
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
            this.http.get('/assets/bpmn/newDiagram.bpmn', {
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
  }
  handleError(err: any) {
    if (err) {
      this.toastrService.error(err);
      console.error(err);
    }
  }
}
