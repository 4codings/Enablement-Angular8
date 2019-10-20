import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Http } from '@angular/http';
import { ToastrService } from 'ngx-toastr';
import { OptionalValuesService } from 'src/app/services/optional-values.service';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ApiService } from 'src/app/service/api/api.service';
import { MatDialog } from '@angular/material';
import { Viewer } from 'src/app/home/enduser/execute/bpmn-viewer';
import { InputOutputElementComponent } from '../input-output-element/input-output-element.component';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-viewer-diagram',
  templateUrl: './viewer-diagram.component.html',
  styleUrls: ['./viewer-diagram.component.scss'],
  providers: [DatePipe]
})
export class ViewerDiagramComponent implements OnInit, OnDestroy {

  @Input() parentapp: string;
  @Input() parentpro: string;
  bpmnTemplate: any;
  @Input() file_path: any;
  V_APP_ID: any;
  V_PRCS_ID: any;
  V_PRCS_TXN_ID: any;
  V_SRC_ID: any;
  USR_NM: any;

  selectedInstanceElementsList: InstanceElementList[] = [];
  selectedElement = new InstanceElementList();
  selectedElementInput: any;
  selectedElementOutput: any;
  elementClick = false;
  apiJSONUrl: any;
  private viewer: any;
  private downloadUrl: string;
  V_SRC_CD: string = JSON.parse(sessionStorage.getItem('u')).SRC_CD;
  V_USR_NM: string = JSON.parse(sessionStorage.getItem('u')).USR_NM;
  processTxnSubscribe$: Subscription;

  constructor(public http: Http, public toastrService: ToastrService, public optionalService: OptionalValuesService,
    public httpClient: HttpClient, public datePipe: DatePipe,
    public apiService: ApiService, public dialog: MatDialog) {
    this.processTxnSubscribe$ = this.optionalService.selecetedProcessTxnValue.subscribe(res => {
      if (res != null) {
        this.V_APP_ID = res.V_APP_ID;
        this.V_PRCS_ID = res.V_PRCS_ID;
        this.V_PRCS_TXN_ID = res.V_PRCS_TXN_ID;
        this.V_SRC_ID = res.V_SRC_ID;
        this.USR_NM = res.USR_NM;
        this.apiJSONUrl = this.apiService.endPoints.securedJSON;
        this.getServicesInstances();
      }
    })
  }

  ngOnInit() {
    // this.http.get('../../../../assets/control-variable.json').subscribe((res: any) => {
    //   this.file_path = res.bpmn_file_path;
    // });
    this.downloadUrl = this.apiService.endPoints.downloadFile;

    setTimeout(res => {
      this.downloadBpmn();
    }, 2000);
    // this.getServicesInstances();
  }

  ngOnDestroy() {
    this.processTxnSubscribe$.unsubscribe();
  }
  ngAfterViewInit() {
    this.viewer = new Viewer({
      container: '#canvas',
      width: '90%',
      height: '400px'
    });
    const eventBus = this.viewer.get('eventBus');
    if (eventBus) {
      eventBus.on('element.click', ($event) => {
        this.elementClick = false;
        console.log('element.click', $event);
        let i = this.selectedInstanceElementsList.findIndex(v => v.PRDCR_SRVC_CD.replace(new RegExp(' ', 'g'), '_') == $event.element.id);
        if (i > -1) {
          console.log('ele', this.selectedInstanceElementsList[i]);
          this.selectedElement = this.selectedInstanceElementsList[i];
          this.selectedElementInput = this.selectedElement.SRVC_INPUT;
          this.selectedElementOutput = this.selectedElement.SRVC_OUTPUT;
          if (this.selectedElementInput != null) {
            this.elementClick = true;
            let inputs = this.selectedElementInput[0].split(',');
            let keys = [];
            if (inputs.length) {
              inputs.forEach(ele => {
                let split = ele.trim().split('=');
                let obj = { 'key': split[0], 'value': split[1] };
                keys.push(obj);
              })
              this.selectedElementInput = [];
              this.selectedElementInput = keys;
              console.log('eleinu', this.selectedElementInput);
            }
          }
          if (this.selectedElementOutput != null) {
            this.elementClick = true;
            let outputs = this.selectedElementOutput[0].split(',');
            let keys = [];
            if (outputs.length) {
              outputs.forEach(ele => {
                let split = ele.trim().split('=');
                let obj = { 'key': split[0], 'value': split[1] };
                keys.push(obj);
              })
              this.selectedElementOutput = [];
              this.selectedElementOutput = keys;
              console.log('selectedElementOutput', this.selectedElementOutput);
            }
          }
          let startx = $event.element.x;
          let currentx = $event.originalEvent.layerX;
          let endx = $event.element.x + $event.element.width;
          let starty = $event.element.y;
          let endy = $event.element.y + $event.element.height;
          let currenty = $event.originalEvent.layerY;
          let section = $event.element.width / 3;
          let isShowInput = false;
          let isShowOutput = false;
          let isShowInputOutput = false;
          if (currenty >= starty && currenty <= endy) {
            if (currentx >= startx && currentx <= startx + section) {
              isShowInput = true;
            } else if (currentx >= startx + section && currentx <= endx - section) {
              isShowInputOutput = true;
            } else if (currentx >= endx - section && currentx <= endx) {
              isShowOutput = true;
            }
          }

          if (isShowInput || isShowOutput || isShowInputOutput) {
            const dialogRef = this.dialog.open(InputOutputElementComponent,
              {
                panelClass: 'app-dialog',
                data: {
                  inputElement: this.selectedElementInput,
                  outputElement: this.selectedElementOutput,
                  showInput: isShowInput,
                  showOutput: isShowOutput,
                  showInputOutput: isShowInputOutput
                }
              });
            dialogRef.afterClosed().pipe(take(1)).subscribe((flag) => {
              if (flag) {
              }
            });
          }
          let canvas = this.viewer.get('canvas');
          canvas.addMarker($event.element.id, 'highlight');
        }
      });
    }
  }

  downloadBpmn() {
    const formData: FormData = new FormData();
    formData.append('FileInfo', JSON.stringify({
      File_Path: `${this.file_path}` + this.parentapp + '/',
      File_Name: this.parentpro.replace(new RegExp(' ', 'g'), '_') + '.bpmn'
    }));
    this.http.post(this.downloadUrl, formData)
      .subscribe(
        (res: any) => {
          if (res._body != "") {
            // this.viewer.importXML('');
            this.viewer.clear();
            this.viewer.importXML(res._body, this.handleError.bind(this));
            var canvas = this.viewer.get('canvas');
            canvas.zoom('fit-viewport');
            canvas.viewbox({ x: 1, y: 1, width: 500, height: 500 })
            this.bpmnTemplate = res._body;
            this.setInitialColor();
          } else {
            this.httpClient.get('/assets/bpmn/newDiagram.bpmn', {
              headers: { observe: 'response' }, responseType: 'text'
            }).subscribe(
              (x: any) => {
                // this.viewer.importXML('');
                this.viewer.clear();
                this.viewer.importXML(x, this.handleError.bind(this));
                var canvas = this.viewer.get('canvas');
                canvas.zoom('fit-viewport');
                canvas.viewbox({ x: 1, y: 1, width: 500, height: 500 })
                this.bpmnTemplate = x;
                this.setInitialColor();
              },
              this.handleError.bind(this)
            );
          }
        },
        this.handleError.bind(this)
      );
  }

  getServicesInstances() {
    this.httpClient.get(this.apiJSONUrl + 'V_SRC_ID=' + this.V_SRC_ID +
      '&V_APP_ID=' + this.V_APP_ID + '&V_PRCS_ID=' + this.V_PRCS_ID + '&V_USR_NM=' +
      this.USR_NM + '&V_PRCS_TXN_ID=' + this.V_PRCS_TXN_ID +
      '&REST_Service=Service_Instances&Verb=GET').subscribe((res: any) => {
        if (res.length) {
          console.log('res', res);
          this.selectedInstanceElementsList = res;
        }
      })
  }
  setInitialColor() {
    setTimeout(ele => {
      var canvas = this.viewer.get('canvas');
      console.log('this.viewer.get', this.viewer.get('elementRegistry'));
      canvas.addMarker('Start', 'success');
      if (this.selectedInstanceElementsList.length) {
        var canvas = this.viewer.get('canvas');
        let elements = this.viewer.get('elementRegistry');
        console.log('elements', elements);
        canvas.addMarker('Start', 'highlight');
        this.selectedInstanceElementsList.forEach((ele, index) => {
          let eleReg = ele.PRDCR_SRVC_CD.replace(new RegExp(' ', 'g'), '_')
          console.log('eleReg ', eleReg);
          if (elements.get(eleReg) != undefined) {
            if (ele.TXN_STS === "Reduced Job Instance") {
              canvas.addMarker(eleReg, 'success');
            } else if (ele.TXN_STS === "txn.status.waitingUserAuth") {
              canvas.addMarker(eleReg, 'intermediate');
            }
          }
        })
      }
    }, 2000);

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