import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { StorageSessionService } from '../../../../services/storage-session.service';
import { Globals2 } from '../../../../service/globals';
import { ReportData, ScopeLimiting } from './Classes';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../service/api/api.service';
import { Http, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { Globals } from '../../../../services/globals';
import { EndUserService } from '../../../../services/EndUser-service';
import { CommonUtils } from '../../../../common/utils';
import { ToastrService } from 'ngx-toastr';
import { Viewer } from '../bpmn-viewer';
import { DeleteConfirmComponent } from '../../../../shared/components/delete-confirm/delete-confirm.component';
import { take } from 'rxjs/operators';
import { InputOutputElementComponent } from '../../../../shared/components/input-output-element/input-output-element.component';
import { InstanceElementList } from '../../process-design/monitor/monitor.component';
import { OptionalValuesService } from 'src/app/services/optional-values.service';
@Component({
  selector: 'app-input-art',
  templateUrl: './artifact-form.component.html',
  styleUrls: ['./artifact-form.component.scss'],
})

export class ArtifactFormComponent implements OnInit, OnDestroy {
  private reportData: ReportData;
  private scope: ScopeLimiting = new ScopeLimiting();
  private domain_name = this.globals.domain_name;;
  allFiles = [];
  sizes = [];
  size
  fileName: string
  selectedFiles: any[] = [];
  Execute_res_data
  agencyName: string;
  application: string;
  process: string;
  service: string;
  form: FormGroup;
  tempale
  modalRef: BsModalRef;
  closeResult: string;
  EXECUTE: any;
  DELETE: any;
  READ: any;
  CREATE: any;
  UPDATE: any;
  V_Hide_Submit: any;
  private dialogRef = null;
  APP_CD = '';
  PRCS_CD = '';
  private viewer: any;
  ctrl_variables: any;
  private downloadUrl: string;
  private user: any;
  private bpmnTemplate: any;
  public bpmnFilePath: any;
  selectedElementInput: any;
  selectedElementOutput: any;
  elementClick = false;
  selectedInstanceElementsList: InstanceElementList[] = [];
  selectedElement = new InstanceElementList();
  V_PRCS_TXN_ID: any;

  constructor(private storage: StorageSessionService,
    private http: HttpClient,
    public globals: Globals,
    private globalUser: Globals2,
    private https: Http,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    public router: Router,
    private dialog: MatDialog,
    private _location: Location,
    private StorageSessionService: StorageSessionService,
    private endUserService: EndUserService,
    private apiService: ApiService,
    private toastrService: ToastrService,
    private optionalService: OptionalValuesService) {
    this.reportData = new ReportData(this.storage);
    this.agencyName = this.reportData.getAgency();
    this.application = this.reportData.getProcess();
    this.process = this.reportData.getApplication();
    this.service = this.reportData.getService();
    this.form = this.formBuilder.group({
      description: ['', Validators.required],
    });
    this.Execute_res_data = this.StorageSessionService.getCookies('executeresdata');
    this.globals.Report.PVP = JSON.parse(this.globals.Report.PVP);
    this.EXECUTE = this.globals.Report.V_EXECUTE[0];
    this.CREATE = this.globals.Report.V_CREATE[0]
    this.READ = this.globals.Report.V_READ[0]
    this.DELETE = this.globals.Report.V_DELETE[0]
    this.UPDATE = this.globals.Report.V_UPDATE[0];
    this.APP_CD = this.globals.Report.APP_CD[0];
    this.PRCS_CD = this.globals.Report.PRCS_CD[0];
    this.V_Hide_Submit = this.globals.Report.V_Hide_Submit[0];
    this.oldfiles();
  }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('u'));
  }
  ngAfterViewInit() {
    this.downloadUrl = this.apiService.endPoints.downloadFile;
    this.http.get('../../../../../assets/control-variable.json').subscribe(res => {
      this.ctrl_variables = res;
      this.bpmnFilePath = this.ctrl_variables.bpmn_file_path;
    });
    let obj = {
      'V_APP_ID': this.Execute_res_data['V_APP_ID'],
      'V_PRCS_ID': this.Execute_res_data['V_PRCS_ID'],
      'V_PRCS_TXN_ID': this.Execute_res_data['V_PRCS_TXN_ID'],
      'V_SRC_ID': this.Execute_res_data['V_SRC_ID'],
      'USR_NM': this.globals.Report.USR_NM[0]
    }
    this.optionalService.selecetedProcessTxnValue.next(obj);
  }
  ngOnDestroy() {
    if (this.viewer) {
      this.viewer.destroy();
    }
  }

  /*
  Get all old files that are exist in system on server
  */
  oldfiles() {

    this.allFiles = []
    if (this.globals.Report.ARTFCT_NM[0]) {
      let ARTFCT_NM = this.globals.Report.ARTFCT_NM[0].split(',')
      let ART_DSC = this.globals.Report.ART_DSC[0].split(',')
      let ART_SIZE_MB = this.globals.Report.ART_SIZE_MB[0].split(',')
      let DELETE = this.globals.Report.DELETE[0].split(',')
      let LST_UPDT_DT_TM = this.globals.Report.LST_UPDT_DT_TM[0].split(',')
      let EXECUTE = this.globals.Report.EXECUTE[0].split(',')
      let ARTFCT_ID = this.globals.Report.ARTFCT_ID[0].split(',')
      for (let i = 0; i < ARTFCT_NM.length; i++) {
        let body = {}
        body = {
          ARTFCT_NM: !i ? ARTFCT_NM[i].substring(1, ARTFCT_NM[i].length - 1) : ARTFCT_NM[i].substring(2, ARTFCT_NM[i].length - 1),
          ART_DSC: !i ? ART_DSC[i].substring(1, ART_DSC[i].length - 1) : ART_DSC[i].substring(2, ART_DSC[i].length - 1),
          ART_SIZE_MB: !i ? ART_SIZE_MB[i].substring(1, ART_SIZE_MB[i].length - 1) : ART_SIZE_MB[i].substring(2, ART_SIZE_MB[i].length - 1),
          LST_UPDT_DT_TM: !i ? LST_UPDT_DT_TM[i].slice(1, 11) : LST_UPDT_DT_TM[i].slice(2, 12),
          DELETE: DELETE[i],
          EXECUTE: EXECUTE[i],
          ARTFCT_ID: !i ? ARTFCT_ID[i].substring(1, ARTFCT_ID[i].length - 1) : ARTFCT_ID[i].substring(2, ARTFCT_ID[i].length - 1),
        }
        this.allFiles.push(body)
      }
    }
  }

  fileChangeEvent(event: any, file: any) {

    //Get File Size
    let size: any = 0
    size = event.target.files[0].size / (1024 * 1024) * 100;
    size = Math.round(size) / 100;
    size = size.toFixed(2);
    this.size = size
    const fileList: FileList = event.target.files;
    const selectedFile = <File>event.target.files[0];
    const formData: FormData = new FormData();
    const files: any = { "File_Path": this.globals.Report.PVP.PHY_LCTN[0] };
    files['File_Name'] = selectedFile.name;
    this.fileName = selectedFile.name;
    while (this.fileName.includes(',')) {
      this.fileName = this.fileName.replace(',', '');
    }
    if (!(this.fileName.length - 5)) {
      alert("fileName Should has No coma!")
      return
    }
    formData.append('Source_File', selectedFile);
    formData.append('FileInfo', JSON.stringify(files));
    const obj = this.http.post('https://enablement.us/FileAPIs/api/file/v1/upload', formData).subscribe(
      res => {
        this.openModal(this.tempale)
      }
    );

  }

  add_file() {
    let body: any = {
      "V_ARTFCT_NM": [this.fileName],
      "V_ARTFCT_TYP": [this.globals.Report.ARTFCT_TYP],
      "V_ART_DSC": [this.form.value.description],
      "V_ART_SIZE_MB": [this.size],
      "V_SRC_CD": this.globals.Report.SRC_CD,
      "V_CXN_CD": null,
      "V_PHY_LCTN": this.globals.Report.PVP.PHY_LCTN,
      "V_USR_GRP_ID": this.globals.Report.USR_GRP_ID,
      "V_USR_NM": this.globals.Report.USR_NM,
      "V_APP_CD": this.globals.Report.APP_CD,
      "V_PRCS_CD": this.globals.Report.PRCS_CD,
      "V_SRVC_CD": this.globals.Report.SRVC_CD,
      "V_LCK": [""],
      "REST_Service": ["Artifacts"],
      "Verb": "POST",
      "LST_UPDT_DT_TM": new Date().toISOString().slice(0, 10)
    };
    // secure
    this.https.post(this.apiService.endPoints.secure, body, this.apiService.setHeaders()).subscribe(
      res => {
        res = res.json();
        body = {
          ...body, ...res,
          ARTFCT_NM: this.fileName,
          V_ARTFCT_TYP: this.globals.Report.ARTFCT_TYP,
          ART_DSC: this.form.value.description,
          ART_SIZE_MB: this.size,
          LST_UPDT_DT_TM: new Date().toISOString().slice(0, 10),
          DELETE: 'Y',
          EXECUTE: 'Y',
        }

        this.modalService.hide(1);
        this.allFiles.push(body)
      });
  }

  uploadBtnClick(template: TemplateRef<any>) {
    document.getElementById('Document_File').click();
    this.tempale = template

  }

  selectFiles(fileId) {
    if (!this.selectedFiles.includes(fileId))
      this.selectedFiles.push(fileId)
    else
      this.selectedFiles.splice(this.selectedFiles.indexOf(fileId), 1)
  }

  submitbtn_click() {
    let files = this.allFiles.filter(file => this.selectedFiles.includes(file.ARTFCT_ID))
    let fileNames = files.map(file => this.globals.Report.PVP.PHY_LCTN + file.ARTFCT_NM)
    let body = {
      "V_USR_NM": this.globals.Report.USR_NM[0],
      "V_EXE_CD": this.globals.Report.EXE_CD[0],
      "V_PRCS_TXN_ID": this.Execute_res_data['V_PRCS_TXN_ID'],
      "V_APP_ID": this.Execute_res_data['V_APP_ID'],
      "V_PRCS_ID": this.Execute_res_data['V_PRCS_ID'],
      "V_SRC_ID": this.Execute_res_data['V_SRC_ID'],
      "V_SRVC_ID": this.globals.Report.SRVC_ID[0],
      "V_PVP": JSON.stringify({
        "PHY_LCTN_FILE": [...fileNames]
      }),
      "V_RELEASE_RSN": "Submitted manual input",
      "V_OPERATION": "MANUALSUBMIT",
      "V_UNIQUE_ID": this.globals.Report.TEMP_UNIQUE_ID[0],
      "TimeZone": new Date().getTimezoneOffset(),
      "REST_Service": "Artifacts",
      "Verb": "POST",
    }
    // secure
    this.https.post(this.apiService.endPoints.secureFormSubmit, body, this.apiService.setHeaders()).subscribe(
      res => {
        this.invoke_router(res.json());
      }
    );
  }
  invoke_router(res) {
    let serviceCode = null;
    if (CommonUtils.isValidValue(res['SRVC_CD']) && res['SRVC_CD'][0] === "END") {
      this.router.navigate(["/End_User/Design"], { skipLocationChange: true });
    } else {
      var timeout = res['RESULT'][0].toString().substring(0, 7) == "TIMEOUT";
      if (timeout) {
        this.router.navigate(["/End_User/Design"], { skipLocationChange: true });
      } else if (res['RESULT'][0] === 'SUCCESS' || res['RESULT'][0] === 'COMPLETED') {
        this.router.navigateByUrl('End_User', { skipLocationChange: true });
      } else {
        this.StorageSessionService.setCookies('report_table', res);
        if (res['RESULT'] == 'INPUT_ARTFCT_TASK') {
          this.router.navigate(['/End_User/InputArtForm'], { skipLocationChange: true });
        } else if (res['RESULT'][0] == 'NONREPEATABLE_MANUAL_TASK') {
          this.router.navigate(['/End_User/NonRepeatForm'], { skipLocationChange: true });
        } else if (res['RESULT'][0] == 'REPEATABLE_MANUAL_TASK') {
          this.router.navigate(['/End_User/RepeatForm'], { skipLocationChange: true });
        } if (res['RESULT'] == 'TABLE') {
          this.router.navigate(['/End_User/ReportTable'], { skipLocationChange: true });
        }
      }
    }
  }

  Delete(file) {
    this.dialogRef = this.dialog.open(DeleteConfirmComponent, { data: { recordName: file.ARTFCT_NM }, disableClose: true, hasBackdrop: true });
    this.dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let str =
          `V_ARTFCT_ID=${file.ARTFCT_ID}&V_ARTFCT_NM=${file.ARTFCT_NM}&V_SRC_CD=${this.globals.Report.SRC_CD}&V_PHY_LCTN=${this.globals.Report.PVP.PHY_LCTN}&V_USR_NM=${this.globals.Report.USR_NM}&V_APP_CD=${this.globals.Report.APP_CD}&V_PRCS_CD=${this.globals.Report.PRCS_CD}&V_SRVC_CD=${this.globals.Report.SRVC_CD}&REST_Service=Artifacts&Verb=DELETE`
        // secure

        this.https.delete(this.apiService.endPoints.deleteArtifact + str, this.apiService.setHeaders())
          .subscribe(
            res => {
              for (let i = 0; i < this.allFiles.length; i++) {
                if (this.allFiles[i].ARTFCT_ID == file.ARTFCT_ID) {
                  this.allFiles.splice(i, 1);
                  break;
                }
              }
              this.selectedFiles.splice(this.selectedFiles.indexOf(file.ARTFCT_ID), 1)
            });
      }
    });

  }

  cancelbtn_click() {
    this.endUserService.processCancel(this.globals.Report.SRVC_ID[0], this.Execute_res_data['V_PRCS_TXN_ID'], this.globals.Report.TEMP_UNIQUE_ID[0]).subscribe(
      res => {
        this.router.navigateByUrl('End_User', { skipLocationChange: true });
      });
  }

  reset() {
    this.form.reset();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  closeModal() {
    this.modalService.hide(1);
  }
}
