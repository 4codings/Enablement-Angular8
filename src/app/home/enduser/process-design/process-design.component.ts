import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { Modeler, PropertiesPanelModule, OriginalPropertiesProvider } from './bpmn-js';
import { Globals } from 'src/app/services/globals';
import { EndUserService } from 'src/app/services/EndUser-service';
import { UseradminService } from 'src/app/services/useradmin.service2';
import { OptionalValuesService, ApplicationProcessObservable } from 'src/app/services/optional-values.service';
import { Subscription } from 'rxjs';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { RollserviceService } from 'src/app/services/rollservice.service';
import { ApiService } from 'src/app/service/api/api.service';
import { Http } from '@angular/http';
import { IFormFieldConfig, ConfigServiceService } from 'src/app/services/config-service.service';

@Component({
  selector: 'app-process-design',
  templateUrl: './process-design.component.html',
  styleUrls: ['./process-design.component.scss']
})
export class ProcessDesignComponent implements OnInit, OnDestroy {

  public opened: boolean;
  public treeopened: boolean = true;
  private modeler: any;
  private url: string;
  private downloadUrl: string;
  private user: any;
  private bpmnTemplate: any;
  private flows = {};
  @ViewChild('file')
  private file: any;
  private currentXml: any;
  private uploadLocked: boolean;
  applicationProcessObservable$: Subscription;
  applicationProcessValuesObservable: ApplicationProcessObservable[] = [];
  appProcessList = [];
  item: TreeviewItem[] = [];
  chilItem: TreeviewItem[] = [];
  config = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 400
  });
  parentMenuItems = [
    { item: 'Add Process', value: 'Add', havePermission: 0 },
    { item: 'Open a Process', value: 'Import', havePermission: 0 },
    { item: 'Delete Application', value: 'Delete', havePermission: 0 }];
  childrenMenuItems = [
    { item: 'Run', value: 'Run', havePermission: 0 },
    { item: 'Edit', value: 'Edit', havePermission: 0 },
    { item: 'Delete', value: 'Delete', havePermission: 0 },
    { item: 'Schedule', value: 'Schedule', havePermission: 0 },
    { item: 'Monitor', value: 'Monitor', havePermission: 0 },
    { item: 'Approve', value: 'Approve', havePermission: 0 },
    { item: 'Resolve', value: 'Resolve', havePermission: 0 },
    { item: 'Download BPNM', value: 'BPNM', havePermission: 0 },
    { item: 'Download SVG', value: 'SVG', havePermission: 0 }];
  roleObservable$: Subscription;
  roleValues;
  childobj = {};
  parentobj = {};
  selectedApp = '';
  selectedPrcoess = '';
  selectedService = '';
  Label: any[] = [];
  resFormData: any;
  form_Data_Keys = [];
  form_Data_Values = [];
  form_Data_labels = [];
  form_result = {};
  fieldConfig: { [key: string]: IFormFieldConfig } = {};
  options: any = {};
  ResetOptimised = false;
  FilterAutoValue: any;

  constructor(
    private httpClient: HttpClient,
    private http: Http,
    private toastrService: ToastrService,
    private globals: Globals,
    private endUserService: EndUserService,
    private useradminService: UseradminService,
    private optionalService: OptionalValuesService,
    private roleService: RollserviceService,
    private apiService: ApiService,
    private data: ConfigServiceService,
  ) {
    this.applicationProcessObservable$ = this.optionalService.applicationProcessValue.subscribe(data => {
      if (data != null) {
        this.applicationProcessValuesObservable = data;
        if (this.applicationProcessValuesObservable.length) {
          this.appProcessList = [];
          this.appProcessList = data;
          this.generateTreeItem();
        }
      }
    });
    this.roleObservable$ = this.roleService.roleValue.subscribe(data => {
      if (data != null) {
        this.roleValues = data;
        if (this.roleValues.length) {
          this.roleValues.forEach(ele => {
            switch (ele) {
              case 'Enablement Workflow Schedule Role':
                this.childrenMenuItems[3].havePermission = 1;
                break;
              case 'Enablement Workflow Dashboard Role':
                this.childrenMenuItems[4].havePermission = 1;
                break;
              case 'Enablement Workflow MyTask Role':
                this.childrenMenuItems[5].havePermission = 1;
                break;
              case 'Enablement Workflow Exception Role':
                this.childrenMenuItems[6].havePermission = 1;
                break;
              case 'Enablement Workflow Process Role':
                this.parentMenuItems[0].havePermission = 1;
                this.parentMenuItems[1].havePermission = 1;
                this.childrenMenuItems[7].havePermission = 1;
                this.childrenMenuItems[8].havePermission = 1;
                break;
              default:
                break;
            }
          })
        }
      }
    });
  }

  ngOnInit() {
    this.data.getJSON().subscribe(data => {
      this.Label = data.json();
    });
    this.url = this.apiService.endPoints.securedJSON;
    this.user = JSON.parse(sessionStorage.getItem('u'));
    this.downloadUrl = this.apiService.endPoints.downloadFile;
    this.getApplicationProcess();
  }

  ngAfterViewInit() {
    this.modeler = new Modeler({
      container: '#canvas',
      width: '90%',
      height: '500px',
      additionalModules: [
        PropertiesPanelModule,
        OriginalPropertiesProvider
      ],
      propertiesPanel: {
        parent: '#properties'
      }
    });
    // this.newBpmn();
    const eventBus = this.modeler.get('eventBus');
    if (eventBus) {
      eventBus.on('element.changed', ($event) => {
        if (['bpmn:Process'].indexOf($event.element.type) > -1) {
          this.selectedPrcoess = $event.element.id;
        } else {
          this.selectedPrcoess = 'newProcess';
        }
        if ($event && $event.element && ['bpmn:Process', 'label'].indexOf($event.element.type) === -1) {
          const businessObject = $event.element.businessObject;
          const sourceId = businessObject && businessObject.sourceRef ? businessObject.sourceRef.id : '';
          const targetId = businessObject && businessObject.targetRef ? businessObject.targetRef.id : '';
          const objectId = businessObject ? businessObject.id : '';
          // const vAppCd = 'V_APP_CD';
          // const vPrcsCd = 'V_PRCS_CD';
          const vAppCd = this.selectedApp;
          const vPrcsCd = this.selectedPrcoess;
          if ($event.element.type === 'bpmn:SequenceFlow') {
            const data: any = {
              REST_Service: 'Orchetration',
              RESULT: '@RESULT',
              V_APP_CD: vAppCd,
              V_CONT_ON_ERR_FLG: 'N',
              V_PRCS_CD: vPrcsCd,
              V_PRDCR_APP_CD: vAppCd,
              V_PRDCR_PRCS_CD: vPrcsCd,
              V_PRDCR_SRC_CD: this.user.SRC_CD,
              V_PRDCR_SRVC_CD: sourceId,
              V_SRC_CD: this.user.SRC_CD,
              V_SRVC_CD: targetId,
              V_USR_NM: this.user.USR_NM,
              Verb: 'PUT'
            };
            if (!this.flows) {
              this.flows = {};
            }
            this.flows[targetId] = data;
          } else {
            const data: any = {
              REST_Service: 'Service',
              V_APP_CD: vAppCd,
              V_CREATE: 'Y',
              V_DELETE: 'Y',
              V_EXECUTE: 'Y',
              V_PRCS_CD: vPrcsCd,
              V_READ: 'Y',
              V_ROLE_CD: 'Program Assessment Role',
              V_SRC_CD: this.user.SRC_CD,
              V_SRVC_CD: objectId,
              V_SRVC_DSC: '',
              V_UPDATE: 'Y',
              V_USR_NM: this.user.USR_NM,
              Verb: 'PUT'
            };
            this.httpClient.post(this.url, data).subscribe(() => {
              if (objectId && this.flows[objectId]) {
                this.uploadLocked = true;
                this.httpClient.put(this.url, this.flows[objectId]).subscribe(() => {
                  delete this.flows[objectId];
                  this.upload(vAppCd, vPrcsCd);
                  this.uploadLocked = false;
                }, () => this.uploadLocked = false);
              }
            });
          }
          setTimeout(() => {
            this.upload(vAppCd, vPrcsCd);
          }, 2000);
        }
      });
    }
  }

  ngOnDestroy() {
    this.applicationProcessObservable$.unsubscribe();
    this.roleObservable$.unsubscribe();
    if (this.modeler) {
      this.modeler.destroy();
    }
  }

  upload(vAppCd, vPrcsCd) {
    if (!this.uploadLocked) {
      this.modeler.saveXML((err: any, xml: any) => {
        if (xml !== this.currentXml) {
          const formData: FormData = new FormData();
          formData.append('FileInfo', JSON.stringify({
            File_Path: `/opt/tomcat/webapps/${this.useradminService.reduceFilePath(this.user.SRC_CD)}/${vAppCd}/`,
            File_Name: `${vPrcsCd}.bpmn`,
            V_SRC_CD: this.user.SRC_CD,
            USR_NM: this.user.USR_NM
          }));
          formData.append('Source_File', new File([xml], `${vPrcsCd}.bpmn`, { type: 'text/xml' }));
          this.httpClient.post(`https://${this.globals.domain}/FileAPIs/api/file/v1/upload`, formData).subscribe();
        }
        this.currentXml = xml;
      });
    }
  }

  openBpmn($event) {
    if ($event && $event.target && $event.target.files) {
      const fr: FileReader = new FileReader();
      fr.onloadend = () => {
        this.modeler.importXML(fr.result, this.handleError.bind(this));
        if (this.file && this.file.nativeElement) {
          this.file.nativeElement.value = '';
        }
      }
      fr.readAsText($event.target.files[0]);
    }
  }

  newBpmn() {
    this.opened = true;
    if (this.bpmnTemplate) {
      this.modeler.importXML(this.bpmnTemplate, this.handleError.bind(this));
    } else {
      this.httpClient.get('/assets/bpmn/newDiagram.bpmn', {
        headers: { observe: 'response' }, responseType: 'text'
      }).subscribe(
        (x: any) => {
          this.modeler.importXML(x, this.handleError.bind(this));
          this.bpmnTemplate = x;
        },
        this.handleError.bind(this)
      );
    }
  }

  downloadBpmn(processName) {
    this.modeler.saveXML((err: any, xml: any) => {
      saveAs(new Blob([xml], { type: 'text/xml' }), processName + '.bpmn');
    });
  }

  downloadSvgBpmn(processName) {
    this.modeler.saveSVG((err: any, svg: any) => {
      saveAs(new Blob([svg], { type: 'image/svg+xml' }), processName + '.svg');
    });
  }

  handleError(err: any) {
    if (err) {
      this.toastrService.error(err);
      console.error(err);
    }
  }

  // storing text as process name and value as application name for child tree view item 
  // to get application and process name both when clicked on child item
  generateTreeItem() {
    this.item = [];
    if (this.appProcessList.length) {
      this.appProcessList.forEach(ele => {

        if (ele.process.length) {
          this.chilItem = [];
          ele.process.forEach(eleProcess => {
            let childTreeObj = new TreeviewItem({ text: eleProcess.replace(/'/g, ""), value: ele.app });
            this.chilItem.push(childTreeObj)
          })
        };
        if (ele.auth.length) {
          let deleteCount = 0;
          ele.auth.forEach((eleauth, index) => {
            eleauth = eleauth.replace(/'/g, "");
            let process = ele.process[index];
            if (eleauth.indexOf(process.replace(/'/g, "")) > -1) {
              let copyChildrenMenuItems = [];
              copyChildrenMenuItems = [...this.childrenMenuItems];
              let i = eleauth.indexOf(process.replace(/'/g, "")) + process.replace(/'/g, "").length;
              let subString = eleauth.substring(i).split(';');
              if (subString.length) {
                subString.forEach(ele => {
                  let authSubStr = ele.split('-');
                  switch (authSubStr[0]) {
                    case 'EXECUTE': {
                      copyChildrenMenuItems[0].havePermission = authSubStr[1] === 'Y' ? 1 : 0;
                      break;
                    }
                    case 'UPDATE': {
                      copyChildrenMenuItems[1].havePermission = authSubStr[1] === 'Y' ? 1 : 0;
                      break;
                    }
                    case 'DELETE': {
                      if (authSubStr[1] === 'Y') {
                        deleteCount++;
                      }
                      copyChildrenMenuItems[2].havePermission = authSubStr[1] === 'Y' ? 1 : 0;
                      break;
                    }
                    default: break;
                  }
                })
              }
              process = process.replace(/'/g, "");
              this.childobj[process] = copyChildrenMenuItems;
            }
          })
          let copyParentrenMenuItems = [];
          copyParentrenMenuItems = [...this.parentMenuItems];
          if (deleteCount == ele.auth.length) {
            copyParentrenMenuItems[2].havePermission = 1;
          } else {
            copyParentrenMenuItems[2].havePermission = 0;
          }
          this.parentobj[ele.app] = copyParentrenMenuItems;
        };
        let treeObj = new TreeviewItem({
          text: ele.app, value: ele.app, collapsed: true, children: this.chilItem
        });
        this.item.push(treeObj);
      })
    }
  }
  getApplicationProcess() {
    this.endUserService.getApplicationAndProcess().subscribe(res => {
      if (res) {
        let data = res.json();
        if (data.length) {
          this.optionalService.getApplicationProcessOptionalValue(data);
        }
      }
    })
  }

  onTitleClick(item) {
    if (!item.children) {
      this.selectedApp = item.value;
      this.selectedPrcoess = item.text;
      const formData: FormData = new FormData();
      formData.append('FileInfo', JSON.stringify({
        File_Path: '/opt/tomcat/webapps/' + this.user.SRC_CD + '/' + item.value + '/',
        File_Name: item.text + '.bpnm'
      }));
      this.http.post(this.downloadUrl, formData, this.apiService.setHeaders())
        .subscribe(
          (res: any) => {
            console.log(res);
            this.modeler.importXML(res, this.handleError.bind(this));
            this.bpmnTemplate = res;
          },
          this.handleError.bind(this)
        );
      this.Execute_AP_PR();
    }
  }
  onParentMenuItemClick(actionValue, parentValue) {
    this.selectedApp = parentValue;
    switch (actionValue) {
      case 'Add': {
        this.newBpmn();
        break;
      }
      case 'Import': {
        let ele = document.getElementById('file');
        ele.click();
        break;
      }
      case 'Delete': {
        this.deleteApplication();
        break;
      }
      default: {
        break;
      }
    }
  }
  onChildMenuItemClick(actionValue, childValue) {
    this.selectedApp = childValue.value;
    this.selectedPrcoess = childValue.text;
    switch (actionValue) {
      case 'Run': {
        break;
      }
      case 'Edit': {
        break;
      }
      case 'Delete': {
        break;
      }
      case 'Schedule': {
        break;
      }
      case 'Monitor': {
        break;
      }
      case 'Approve': {
        break;
      }
      case 'Resolve': {
        break;
      }
      case 'BPNM': {
        this.downloadBpmn(this.selectedPrcoess);
        break;
      }
      case 'SVG': {
        this.downloadSvgBpmn(this.selectedPrcoess);
        break;
      }
      default: {
        break;
      }
    }
  }
  deleteApplication() {
    if (this.selectedApp !== '' || this.selectedApp !== null) {
      this.http.delete(this.url + 'V_APP_CD=' + this.selectedApp + '&V_SRC_CD=' + this.user.SRC_CD + '&V_USR_NM=' + this.user.USR_NM + '&REST_Service=Application&Verb=DELETE')
        .subscribe((res: any) => {
          let index = this.optionalService.applicationProcessArray.indexOf(this.selectedApp);
          this.optionalService.applicationProcessArray.splice(index, 1);
          this.optionalService.applicationProcessValue.next(this.optionalService.applicationProcessArray);
          this.selectedApp = '';
          this.selectedPrcoess = '';
        },
          this.handleError.bind(this))
    }
  }
  Execute_AP_PR() {
    this.resFormData = [];
    let FormData: any[];
    // secure
    this.apiService.requestSecureApi(this.apiService.endPoints.secure + 'V_APP_CD=' + this.selectedApp + '&V_PRCS_CD=' + this.selectedPrcoess + '&V_SRC_CD=' + this.user.SRC_CD + '&ResetOptimised=' + this.ResetOptimised + '&Lazyload=false' + '&REST_Service=ProcessParameters&Verb=GET', 'get').subscribe(
      res => {
        FormData = res.json();
        const ref = { disp_dyn_param: false };
        const got_res = this.data.exec_schd_restCall(FormData, ref);
        this.form_result = got_res.Result;
        this.resFormData = got_res.Data;
        // this.k = got_res.K;
        this.fieldConfig = this.data.prepareAndGetFieldConfigurations(FormData);
        this.form_Data_Keys = [];
        this.form_Data_Values = [];
        this.form_Data_labels = [];
        this.labels_toShow();
        for (let i = 0; i < this.form_Data_Keys.length; i++) {
          if (this.resFormData[i].name === this.form_Data_labels[i] && this.resFormData[i].hasOptions && this.resFormData[i].hasOptions === 'Y') {
            this.getOptional_values(this.form_Data_Keys[i], this.form_Data_labels[i]);
          }
        }
      });
  }
  labels_toShow(): any {
    this.form_Data_Keys = Object.keys(this.form_result);
    for (let i = 0; i < this.form_Data_Keys.length; i++) {
      this.form_Data_Values.push(this.form_result[this.form_Data_Keys[i]]);
      this.form_Data_labels.push(this.form_Data_Keys[i]);
    }
  }

  getOptional_values(V_PARAM_NM, display_label) {
    const secureUrl = this.apiService.endPoints.secure + 'V_SRC_CD=' + this.user.SRC_CD + '&V_APP_CD=' + this.selectedApp + '&V_PRCS_CD=' + this.selectedPrcoess + '&V_PARAM_NM=' + V_PARAM_NM + '&V_SRVC_CD=' + this.selectedService + '&REST_Service=ProcessParametersOptions&Verb=GET';
    const secure_encoded_url = encodeURI(secureUrl);
    this.http.get(secure_encoded_url, this.apiService.setHeaders()).subscribe(
      res => {
        const resData = res.json();
        this.options[display_label] = resData[V_PARAM_NM];
      });
  }

  Update_value(v: any, n: any) { //v=value and n=paramter name
    this.FilterAutoValue = v;
    this.apiService.requestSecureApi(this.url + 'V_APP_CD=' + this.selectedApp + '&V_PRCS_CD=' + this.selectedPrcoess + '&V_SRC_CD=' + this.user.SRC_CD + '&V_USR_NM=' + this.user.USR_NM + '&V_PARAM_NM=' + n + '&V_PARAM_VAL=' + v + '&REST_Service=ProcessParameters&Verb=PATCH', 'get').subscribe(
      res => {
      }
    );
  }
}
