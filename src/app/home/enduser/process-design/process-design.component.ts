import { Component, ViewChild, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { Modeler, PropertiesPanelModule, OriginalPropertiesProvider, InjectionNames } from './bpmn-js';
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
import { StorageSessionService } from 'src/app/services/storage-session.service';
import { EnduserComponent } from '../enduser.component';
import { HomeComponent } from '../../home.component';
import { Router, NavigationEnd } from '@angular/router';
import { CommonUtils } from 'src/app/common/utils';
import * as Chart from 'chart.js';

import { CustomPropsProvider } from './props-provider/CustomPropsProvider';

export class ReportData {
  public RESULT: string;
  public V_EXE_CD: string[];
  constructor() {
  }
}
@Component({
  selector: 'app-process-design',
  templateUrl: './process-design.component.html',
  styleUrls: ['./process-design.component.scss']
})
export class ProcessDesignComponent implements OnInit, OnDestroy {

  public opened: boolean;
  public treeopened: boolean = true;
  public showRightIcon = false;
  private modeler: any;
  private url: string;
  private downloadUrl: string;
  private user: any;
  private bpmnTemplate: any;
  private flows = {};
  public showAllTabFlag = true;
  public showCondtionType = false;
  @ViewChild('file')
  private file: any;
  @ViewChild('processForm') processForm: any;
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
    { item: 'New Process', value: 'Add', havePermission: 0 },
    { item: 'Open BPMN File', value: 'Import', havePermission: 0 },
    { item: 'Delete Application', value: 'Delete', havePermission: 0 }];
  childrenMenuItems = [
    { item: 'Run', value: 'Run', havePermission: 0 },
    { item: 'Run At', value: 'RunAt', havePermission: 0 },
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
  selectedProcess: string = '';
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
  executedata = {};
  Execute_res_data: any;
  ts = {};
  k = 0;
  ctrl_variables: any;
  check_data = {};
  repeat: any = 0;
  public report: ReportData = new ReportData;
  ColorGantt = [];
  Colorpie = [];
  Colorpie_boder = [];
  ColorBar = [];
  ColorBar_border = [];
  V_OLD_PRCS_CD: string = '';
  isApp = false;
  isProcess = false;
  isService = false;

  sequenceConditionType = [];
  sequenceCondition = '';
  selectedConditionType = '';
  //For property panel

  propertyPanelAllTabsData: any;
  executableTypesData = [];
  selectedExecutableType: string;
  selectedExecutable: string;
  executableInput: any;
  executableOutput: string;
  executableDesc: string;
  executablesData = [];

  //property panel property tabs variables
  async_sync: string = "sync";
  restorability: string = "AUTO";
  instances: string = "unlimited";
  display_output: any = false;
  summary_output: any = false;
  isServiceActive: Boolean = true;
  isSynchronousActive: Boolean = true;
  priority: any = 3;
  async_sync_seconds: any = 300;
  restorability_seconds: any = 30;
  attemps: any = 3;
  instances_priority: any = 400;

  //property panel general tab variables
  generalId: string;
  processName: string = '';
  documentation: string = '';
  oldStateId: any;

  currentDate: any = new Date();
  todaysDate: any = new Date();
  afterFiveDays: any = new Date(this.todaysDate.setDate(this.currentDate.getDate() + 5));

  userEmail: string;
  sequenceFlowsourceId: any;
  sequenceFlowtargetId: any;
  iconType = '';
  navigationSubscription;
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
    private PFrame: EnduserComponent,
    private app: HomeComponent,
    private router: Router,
    private StorageSessionService: StorageSessionService,
  ) {
    this.applicationProcessObservable$ = this.optionalService.applicationProcessValue.subscribe(data => {
      if (data != null) {
        this.applicationProcessValuesObservable = data;
        if (this.applicationProcessValuesObservable.length) {
          this.appProcessList = [];
          this.appProcessList = data.sort((a, b) => {
            if (a.app < b.app) {
              return -1;
            } else if (a.app > b.app) {
              return 1;
            } else {
              return 0;
            }
          });
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
                this.childrenMenuItems[4].havePermission = 1;
                break;
              case 'Enablement Workflow Dashboard Role':
                this.childrenMenuItems[5].havePermission = 1;
                break;
              case 'Enablement Workflow MyTask Role':
                this.childrenMenuItems[6].havePermission = 1;
                break;
              case 'Enablement Workflow Exception Role':
                this.childrenMenuItems[7].havePermission = 1;
                break;
              case 'Enablement Workflow Process Role':
                this.parentMenuItems[0].havePermission = 1;
                this.parentMenuItems[1].havePermission = 1;
                this.childrenMenuItems[8].havePermission = 1;
                this.childrenMenuItems[9].havePermission = 1;
                break;
              default:
                break;
            }
          })
        }
      }
    });
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.router.navigated = false;
        window.scrollTo(0, 0);
        this.ngOnInit();
      }
    });
  }

  ngOnInit() {
    this.data.getJSON().subscribe(data => {
      this.Label = data.json();
    });
    this.httpClient.get('../../../../assets/control-variable.json').subscribe(res => {
      this.ctrl_variables = res;
    });
    this.url = this.apiService.endPoints.securedJSON;
    this.user = JSON.parse(sessionStorage.getItem('u'));
    this.downloadUrl = this.apiService.endPoints.downloadFile;
    this.getApplicationProcess();
    this.userEmail = this.user.USR_NM;
  }

  ngAfterViewInit() {
    this.modeler = new Modeler({
      container: '#canvas',
      width: '90%',
      height: '500px',
      additionalModules: [
        PropertiesPanelModule,
        OriginalPropertiesProvider,
        // { contextPad: ['value', null], contextPadProvider: ['value', null] },
        { [InjectionNames.bpmnPropertiesProvider]: ['type', OriginalPropertiesProvider.propertiesProvider[1]] },
        { [InjectionNames.propertiesProvider]: ['type', CustomPropsProvider] },
      ]
      // ,
      // propertiesPanel: {
      //   parent: '#properties'
      // }
    });
    // this.newBpmn();
    const eventBus = this.modeler.get('eventBus');
    if (eventBus) {
      eventBus.on('element.click', ($event) => {
        this.processName = '';
        this.documentation = '';
        console.log('element.click', $event)
        this.isApp = false;
        this.isProcess = false;
        this.isService = true;
        this.oldStateId = $event.element.id;
        this.generalId = $event.element.id;
        const businessObject = $event.element.businessObject;
        this.processName = businessObject.name ? businessObject.name : '';
        if (businessObject.documentation && businessObject.documentation.length) {
          this.documentation = businessObject.documentation[0].text ? businessObject.documentation[0].text : '';
        }
        if ($event && $event.element && ['bpmn:Task', 'bpmn:StartEvent', 'bpmn:EndEvent', 'bpmn:Event'].indexOf($event.element.type) > -1) {
          this.selectedService = this.generalId;
          this.showAllTabFlag = true;
          this.showCondtionType = false;
          this.getAllTabs(this.generalId);
        }
        if ($event && $event.element && ['bpmn:Process'].indexOf($event.element.type) > -1) {
          this.isApp = false;
          this.isProcess = true;
          this.isService = false;
          this.showAllTabFlag = false;
          this.showCondtionType = false;
          this.generalId = this.selectedProcess;
        }
        if ($event && $event.element && ['bpmn:SequenceFlow'].indexOf($event.element.type) > -1) {
          this.iconType = '';
          const businessObject = $event.element.businessObject;
          this.sequenceFlowsourceId = businessObject && businessObject.sourceRef ? businessObject.sourceRef.id : '';
          this.sequenceFlowtargetId = businessObject && businessObject.targetRef ? businessObject.targetRef.id : '';
          this.iconType = $event.element.type;
          this.showAllTabFlag = false;
          this.showCondtionType = true;
          this.getConditionType();
          this.getAllTabs(this.generalId);
        }
      }),
        eventBus.on('element.changed', ($event) => {
          console.log('element.changed', $event)
          const businessObject = $event.element.businessObject;
          this.processName = businessObject.name ? businessObject.name : '';
          if (businessObject.documentation && businessObject.documentation.length) {
            this.documentation = businessObject.documentation[0].text ? businessObject.documentation[0].text : '';
          }
          this.generalId = $event.element.id;
          console.log('this.this.bpmntemplate', this.bpmnTemplate);
          if ($event && $event.element && ['bpmn:Process'].indexOf($event.element.type) > -1) {
            this.isApp = false;
            this.isProcess = true;
            this.isService = false;
            this.showAllTabFlag = false;
          }
          if ($event && $event.element && ['bpmn:Process', 'label'].indexOf($event.element.type) === -1) {
            this.selectedService = this.generalId;
            this.isApp = false;
            this.isProcess = false;
            this.isService = true;
            console.log('fsd')
            const sourceId = businessObject && businessObject.sourceRef ? businessObject.sourceRef.id : '';
            const targetId = businessObject && businessObject.targetRef ? businessObject.targetRef.id : '';
            const objectId = businessObject ? businessObject.id : '';
            // const vAppCd = 'V_APP_CD';
            // const vPrcsCd = 'V_PRCS_CD';
            const vAppCd = this.selectedApp;
            const vPrcsCd = this.generalId;
            if ($event.element.type === 'bpmn:SequenceFlow') {
              // this.showAllTabFlag = false;
              const data: any = {
                REST_Service: 'SequenceFlow',
                V_APP_CD: vAppCd,
                V_PRDCR_APP_CD: vAppCd,
                V_PRCS_CD: vPrcsCd,
                V_PRDCR_PRCS_CD: vPrcsCd,
                V_SRC_CD: this.user.SRC_CD,
                V_PRDCR_SRC_CD: this.user.SRC_CD,
                V_PRDCR_SRVC_CD: sourceId,
                V_SRVC_CD: targetId,
                V_TRNSN_TYP: 'None',
                V_TRNSN_CND: "",
                V_CONT_ON_ERR_FLG: 'N',
                V_USR_NM: this.user.USR_NM,
                Verb: 'PUT'
              };

              // this.generalId = targetId;
              this.getAllTabs(targetId);

              if (!this.flows) {
                this.flows = {};
              }
              this.flows[targetId] = data;
            } else {
              this.showAllTabFlag = true;
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

              // this.generalId = objectId;
              this.getAllTabs(objectId);

              this.httpClient.post(this.url, data).subscribe(() => {
                if (objectId && this.flows[objectId]) {
                  this.uploadLocked = true;
                  this.httpClient.put(this.url, this.flows[objectId]).subscribe(() => {
                    delete this.flows[objectId];
                    this.upload(vAppCd, this.selectedProcess);
                    this.uploadLocked = false;
                  }, () => this.uploadLocked = false);
                }
              });
            }
            setTimeout(() => {
              this.upload(vAppCd, this.selectedProcess);
            }, this.ctrl_variables.delay_timeout);
          }
        }),
        eventBus.on('connection.remove', ($event) => {
          console.log('connection.remove', $event);
          if ($event && $event.element && ['bpmn:SequenceFlow'].indexOf($event.element.type) > -1) {
            let id = $event.element.id;
            this.deleteService(id);
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
  onInputChange() {
    this.generalId = this.generalId.replace(new RegExp(' ', 'g'), '_');
    if (this.documentation == '') {
      this.documentation = this.generalId.replace(new RegExp('_', 'g'), ' ');
    }
    if (this.processName == '') {
      this.processName = this.generalId.replace(new RegExp('_', 'g'), ' ');
    }
    const name = this.processName;
    if (!this.isApp && this.oldStateId) {
      let elementRegistry = this.modeler.get('elementRegistry');
      let element = elementRegistry.get(this.oldStateId);
      console.log('element', element)
      let modeling = this.modeler.get('modeling');
      const doc = [{ 'text': this.documentation }];
      modeling.updateProperties(element, {
        name: name,
        id: this.generalId,
      });
      this.oldStateId = this.generalId;
    }
    console.log('this.this.modeler', this.modeler);
    console.log('this.this.bpmntemplate', this.bpmnTemplate);
    if (this.isApp) {
      this.addApplicationOnBE();
    }
    if (this.isService) {
      this.updatesequenceFlow();
    }
    if (this.isProcess) {
      this.updateProcess();
    }
  }
  updatesequenceFlow() {
    const vAppCd = this.selectedApp;
    const vPrcsCd = this.selectedProcess;
    const data: any = {
      REST_Service: 'SequenceFlow',
      V_APP_CD: vAppCd,
      V_PRDCR_APP_CD: vAppCd,
      V_PRCS_CD: vPrcsCd,
      V_PRDCR_PRCS_CD: vPrcsCd,
      V_SRC_CD: this.user.SRC_CD,
      V_PRDCR_SRC_CD: this.user.SRC_CD,
      V_PRDCR_SRVC_CD: this.sequenceFlowsourceId,
      V_SRVC_CD: this.sequenceFlowtargetId,
      V_TRNSN_TYP: 'None',
      V_TRNSN_CND: "",
      V_CONT_ON_ERR_FLG: 'N',
      V_USR_NM: this.user.USR_NM,
      Verb: 'PUT'
    };
    this.http.post(this.apiService.endPoints.securedJSON, data, this.apiService.setHeaders())
      .subscribe(res => {
        if (res) {
          // this.getApplicationProcess();
        }
      });
  }
  updateService() {
    this.selectedService = this.generalId;
    if (this.instances === 'single') {
      this.instances_priority = 1;
    } else if (this.instances === 'unlimited') {
      this.instances_priority = -1;
    }
    const body = {
      'V_APP_CD': this.selectedApp,
      'V_PRCS_CD': this.selectedProcess,
      'V_SRVC_CD': this.selectedService,
      'V_EXE_TYP': this.selectedExecutableType,
      'V_EXE_CD': this.selectedExecutable,
      'V_PARAM_NM_IN': this.executableInput,
      'V_PARAM_NM_OUT': this.executableOutput,
      'V_NOTIF_GRP': this.userEmail,
      'V_RESTART_FLG': this.restorability === 'AUTO' || this.restorability === 'MANUAL' ? 'Y' : 'N',
      'V_RSTN_TYP': this.restorability,
      'V_MAX_ATTMPT': this.attemps,
      'V_ATTMPT_DRTN_SEC': this.restorability_seconds,
      'V_SLA_MTS': 60.00,
      'V_PRIORITY': this.priority,
      'V_SRVC_JOB_LMT': this.instances_priority,
      'V_EFF_STRT_DT_TM': this.currentDate,
      'V_EFF_END_DT_TM': this.afterFiveDays,
      'V_DSPLY_OUTPUT': this.display_output ? 'Y' : 'N',
      'V_SRVC_ACTIVE_FLG': this.isServiceActive ? 'Y' : 'N',
      'V_ADD_TO_SMMRY_RESULT': this.summary_output ? 'Y' : 'N',
      'V_ICN_TYP': this.iconType,
      'REST_Service': 'DefinedService',
      'V_SRC_CD': this.user.SRC_CD,
      'V_USR_NM': this.user.USR_NM,
      "Verb": "PUT"
    };
    this.http.post(this.apiService.endPoints.secure, body, this.apiService.setHeaders())
      .subscribe(res => {
        if (res) {
          // this.getApplicationProcess();
        }
      });
    // setTimeout(() => {
    //   this.upload(this.selectedApp, this.selectedProcess);
    // }, this.ctrl_variables.delay_timeout);
  }
  deleteService(id) {
    if (id !== '' || id !== null) {
      this.httpClient.delete(this.apiService.endPoints.securedJSON + 'V_APP_CD=' + this.selectedApp + '&V_PRCS_CD=' + this.selectedProcess + 'V_SRVC_CD=' + id + '&V_SRC_CD=' + this.user.SRC_CD + '&V_USR_NM=' + this.user.USR_NM + '&REST_Service=Service&Verb=DELETE')
        .subscribe(res => {
          this.selectedService = '';
          this.isApp = false;
          this.isProcess = false;
          this.isService = false;
          this.opened = false;
          this.showAllTabFlag = false;
          this.showRightIcon = false;
        })
    }
  }
  updateProcess() {
    this.showAllTabFlag = false;
    this.selectedProcess = this.generalId;
    const body = {
      'V_APP_CD': this.selectedApp,
      'V_OLD_PRCS_CD': this.V_OLD_PRCS_CD.replace(new RegExp('_', 'g'), ' '),
      'V_NEW_PRCS_CD': this.selectedProcess.replace(new RegExp('_', 'g'), ' '),
      'V_PRCS_DSC': this.documentation.replace(new RegExp('_', 'g'), ' '),
      'REST_Service': 'UpdateProcess',
      'V_SRC_CD': this.user.SRC_CD,
      'V_USR_NM': this.user.USR_NM,
      "Verb": "PUT"
    };
    this.http.post(this.apiService.endPoints.secure, body, this.apiService.setHeaders())
      .subscribe(res => {
        if (res) {
          this.getApplicationProcess();
        }
      });
    setTimeout(() => {
      this.upload(this.selectedApp, this.selectedProcess);
    }, this.ctrl_variables.delay_timeout);
  }
  getConditionType() {
    this.http.get(this.apiService.endPoints.securedJSON + "V_PRDCR_SRC_CD" + this.user.SRC_CD + "&V_PRDCR_APP_CD" + this.selectedApp + "&V_PRDCR_PRCS_CD" + this.selectedProcess + "&V_PRDCR_SRVC_CD" + this.selectedService + "&V_USR_NM" + this.user.USR_NM + "&V_SRC_CD=" + this.user.SRC_CD + "&V_APP_CD=" + this.selectedApp + "&V_PRCS_CD=" + this.selectedProcess + "&V_SRVC_CD=" + this.selectedService + "&REST_Service=SequenceFlow" + "&Verb=GET", this.apiService.setHeaders())
      .subscribe(res => {
        if (res) {
          console.log('data', res.json());
          this.sequenceConditionType = res.json();
        }
      });
  }
  addProcess() {
    const body = {
      'V_APP_CD': this.selectedApp,
      'V_PRCS_CD': this.selectedProcess,
      'REST_Service': 'NewProcess',
      'V_SRC_CD': this.user.SRC_CD,
      'V_USR_NM': this.user.USR_NM,
      "Verb": "POST"
    };
    this.http.post(this.apiService.endPoints.secure, body, this.apiService.setHeaders())
      .subscribe(res => {
        if (res) {
          this.getApplicationProcess();
          document.getElementById("processId").focus();
        }
      });
    // setTimeout(() => {
    //   this.upload(this.selectedApp, this.selectedProcess);
    // }, this.ctrl_variables.delay_timeout);
  }

  upload(vAppCd, vPrcsCd) {
    if (!this.uploadLocked) {
      vPrcsCd = vPrcsCd.replace(new RegExp(' ', 'g'), '_')
      this.modeler.saveXML((err: any, xml: any) => {
        console.log('xml', xml);
        if (xml !== this.currentXml) {
          const formData: FormData = new FormData();
          formData.append('FileInfo', JSON.stringify({
            File_Path: `/opt/tomcat/webapps/${this.useradminService.reduceFilePath(this.user.SRC_CD)}/${vAppCd}/`,
            File_Name: `${vPrcsCd}.bpmn`,
            V_SRC_CD: this.user.SRC_CD,
            USR_NM: this.user.USR_NM
          }));
          formData.append('Source_File', new File([xml], `${vPrcsCd}.bpmn`, { type: 'text/xml' }));
          this.http.post(`https://${this.globals.domain}/FileAPIs/api/file/v1/upload`, formData).subscribe();
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
    this.selectedProcess = 'newProcess';
    this.V_OLD_PRCS_CD = this.selectedProcess;
    this.documentation = '';
    this.processName = '';
    this.showAllTabFlag = false;
    this.addProcess();
    // if (this.bpmnTemplate) {
    //   this.modeler.importXML(this.bpmnTemplate, this.handleError.bind(this));
    // } else {
    this.httpClient.get('/assets/bpmn/newDiagram.bpmn', {
      headers: { observe: 'response' }, responseType: 'text'
    }).subscribe(
      (x: any) => {
        this.modeler.importXML(x, this.handleError.bind(this));
        this.bpmnTemplate = x;
      },
      this.handleError.bind(this)
    );
    // }
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
  addApplication() {
    this.isApp = true;
    this.isProcess = false;
    this.isService = false;
    this.showRightIcon = true;
    this.opened = true;
    this.showAllTabFlag = false;
    this.generalId = 'newApplication';
    document.getElementById('processId').focus();
  }
  addApplicationOnBE() {
    const body = {
      V_APP_CD: this.generalId,
      V_SRC_CD: this.user.SRC_CD,
      V_APP_DSC: this.documentation,
      V_USR_NM: this.user.USR_NM,
      REST_Service: 'Application',
      Verb: 'PUT'
    };
    this.httpClient.post(this.apiService.endPoints.securedJSON, body)
      .subscribe(res => {
        if (res) {
          this.getApplicationProcess();
          this.generalId = '';
          this.processName = '';
          this.documentation = '';
          this.opened = false;
          this.showAllTabFlag = true;
          this.showRightIcon = false;
        }
      })
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
        }
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
                      copyChildrenMenuItems[1].havePermission = authSubStr[1] === 'Y' ? 1 : 0;
                      break;
                    }
                    case 'UPDATE': {
                      copyChildrenMenuItems[2].havePermission = authSubStr[1] === 'Y' ? 1 : 0;
                      break;
                    }
                    case 'DELETE': {
                      if (authSubStr[1] === 'Y') {
                        deleteCount++;
                      }
                      copyChildrenMenuItems[3].havePermission = authSubStr[1] === 'Y' ? 1 : 0;
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
          if (ele.process[0] === 'NULL') {
            copyParentrenMenuItems[2].havePermission = 1;
            this.parentobj[ele.app] = copyParentrenMenuItems;
          } else {
            if (deleteCount == ele.auth.length) {
              copyParentrenMenuItems[2].havePermission = 1;
            } else {
              copyParentrenMenuItems[2].havePermission = 0;
            }
            this.parentobj[ele.app] = copyParentrenMenuItems;
          }
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
  updateTabs() {
    // if (this.isProcess) {
    //   this.updateProcess();
    // } else 
    if (this.isService) {
      this.updateService();
    }
  }
  onTitleClick(item) {
    this.isApp = false;
    this.isProcess = true;
    this.isService = false;
    this.showRightIcon = false;
    this.opened = false;
    this.V_OLD_PRCS_CD = item.text;
    if (!item.children) {
      this.selectedApp = item.value;
      this.selectedProcess = item.text;
      const formData: FormData = new FormData();
      formData.append('FileInfo', JSON.stringify({
        File_Path: '/opt/tomcat/webapps/' + this.user.SRC_CD + '/' + item.value + '/',
        File_Name: item.text.replace(new RegExp(' ', 'g'), '_') + '.bpmn'
      }));
      this.http.post(this.downloadUrl, formData)
        .subscribe(
          (res: any) => {
            if (res._body != "") {
              this.modeler.importXML(res._body, this.handleError.bind(this));
              this.bpmnTemplate = res._body;
            } else {
              // let x = '<?xml version="1.0" encoding="UTF-8"?><bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="2.0.3"></bpmn:definitions>';
              // this.modeler.importXML(x);
              // this.bpmnTemplate = x;
              this.httpClient.get('/assets/bpmn/newDiagram.bpmn', {
                headers: { observe: 'response' }, responseType: 'text'
              }).subscribe(
                (x: any) => {
                  this.modeler.importXML(x, this.handleError.bind(this));
                  this.bpmnTemplate = x;
                  setTimeout(() => {
                    let elementRegistry = this.modeler.get('elementRegistry');
                    let element = elementRegistry.get('newProcess');
                    console.log('element', element)
                    let modeling = this.modeler.get('modeling');
                    const doc = [{ 'text': this.documentation }];
                    modeling.updateProperties(element, {
                      name: this.selectedProcess,
                      id: this.selectedProcess.replace(new RegExp(' ', 'g'), '_'),
                    })
                    document.getElementById("processId").focus();
                  })
                },
                this.handleError.bind(this)
              );
            }
          },
          this.handleError.bind(this)
        );
      // this.httpClient.get('/assets/bpmn/diagram.bpmn', {
      //   headers: { observe: 'response' }, responseType: 'text'
      // }).subscribe(
      //   (x: any) => {
      //     this.modeler.importXML(x, this.handleError.bind(this));
      //     this.bpmnTemplate = x;
      //   },
      //   this.handleError.bind(this)
      // );
      this.Execute_AP_PR();
    }
  }
  onParentMenuItemClick(actionValue, parentValue) {
    this.selectedApp = parentValue;
    switch (actionValue) {
      case 'Add': {
        this.newBpmn();
        this.isApp = false;
        this.isProcess = true;
        this.isService = false;
        this.generalId = "newProcess";
        this.showRightIcon = true;
        this.opened = true;
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
    this.selectedProcess = childValue.text;
    switch (actionValue) {
      case 'Run': {
        this.add();
        this.Execute_Now();
        break;
      }
      case 'RunAt': {
        break;
      }
      case 'Edit': {
        this.showRightIcon = true;
        this.opened = true;
        this.showAllTabFlag = false;
        this.isApp = false;
        this.isProcess = true;
        this.isService = false;
        this.generalId = this.selectedProcess;
        break;
      }
      case 'Delete': {
        this.onDeleteProcess();
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
        this.downloadBpmn(this.selectedProcess);
        break;
      }
      case 'SVG': {
        this.downloadSvgBpmn(this.selectedProcess);
        break;
      }
      default: {
        break;
      }
    }
  }
  onDeleteProcess() {
    if (this.selectedProcess !== '' || this.selectedProcess !== null) {
      this.httpClient.delete(this.apiService.endPoints.securedJSON + 'V_APP_CD=' + this.selectedApp + '&V_PRCS_CD=' + this.selectedProcess + '&V_SRC_CD=' + this.user.SRC_CD + '&V_USR_NM=' + this.user.USR_NM + '&REST_Service=Process&Verb=DELETE')
        .subscribe(res => {
          this.selectedApp = '';
          this.selectedProcess = '';
          this.generalId = '';
          this.processName = '';
          this.documentation = '';
          this.isApp = false;
          this.isProcess = false;
          this.isService = false;
          this.showRightIcon = false;
          this.opened = false;
          this.modeler.importXML('<?xml version="1.0" encoding="UTF-8"?><bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="2.0.3"></bpmn:definitions>');
          this.getApplicationProcess();
        })
    }
  }
  add() {
    for (let i = 0; i <= this.k; i++) {
      if (this.resFormData[i].value != '' && this.resFormData[i].value != null) {
        this.ts[this.resFormData[i].name] = this.resFormData[i].value;
      }
    }
    this.StorageSessionService.setCookies('ts', this.ts);
  }
  Execute_Now() {
    if (this.processForm.valid) {
      const body = {
        'V_APP_CD': this.selectedApp,
        'V_PRCS_CD': this.selectedProcess,
        'V_SRVC_CD': 'START',
        'V_SRC_CD': this.user.SRC_CD,
        'V_USR_NM': this.user.USR_NM

      };
      Object.assign(body, this.ts);
      this.http.post(this.apiService.endPoints.secureProcessStart, body, this.apiService.setHeaders())
        .subscribe(res => {
          // console.log('start');
          this.executedata = { SL_APP_CD: this.selectedApp, SL_PRC_CD: this.selectedProcess };

          this.StorageSessionService.setCookies('executedata', this.executedata);
          this.Execute_res_data = res.json();
          this.StorageSessionService.setCookies('executeresdata', this.Execute_res_data);
          this.PFrame.display_page = true;
          this.GenerateReportTable();
        });
    }
  }
  // Added for property panel related tabs
  getAllTabs(selService: any) {
    this.opened = true;
    this.showRightIcon = true;
    this.endUserService.getAllTabs(this.selectedApp, this.selectedProcess, selService)
      .subscribe(res => {
        if (res) {
          this.propertyPanelAllTabsData = res.json();
          console.log('data', this.propertyPanelAllTabsData);
        }
      });

    this.getAllExecutableTypes();
  }

  // Added for property panel related tabs
  getAllExecutableTypes() {
    this.endUserService.getAllExecutableTypes()
      .subscribe(res => {
        if (res) {
          this.executableTypesData = []; //clearning off old data if any
          res.json().forEach(element => {
            this.executableTypesData.push(element.EXE_TYP);
          });
        }
      });
  }

  getExecutablesForSelctedExecutableType() {
    this.endUserService.getExecutablesForSelctedExecutableType(this.selectedExecutableType)
      .subscribe(res => {
        if (res) {
          this.executablesData = []; //clearning off old data if any
          res.json().forEach(element => {
            this.executablesData.push(element.EXE_CD);
          });
        }
      });
  }

  getInputOutputForSelctedExecutable() {
    this.endUserService.getInputOutputForSelctedExecutable(this.selectedExecutableType, this.selectedExecutable)
      .subscribe(res => {
        if (res) {
          let result = res.json();
          this.executableOutput = result[0]["EXE_OUT_PARAMS"];
          this.executableDesc = result[0]["EXE_DSC"];
          this.executableInput = result[0]["EXE_SIGN"];
        }
      });
  }

  //selected executable type from UI
  updateselectedExecutableType(value: any) {
    this.selectedExecutableType = value;
    this.getExecutablesForSelctedExecutableType();
  }

  //selected executable type from UI
  updateselectedExecutable(value: string) {
    this.selectedExecutable = value;
    this.getInputOutputForSelctedExecutable();
  }
  updatesequenceConditionType(value: any) {
    this.selectedConditionType = value;
    this.onInputChange();
  }
  serviceActiveSelected(value: Boolean) {
    this.isServiceActive = value;
  }

  GenerateReportTable() {
    if (!this.app.loadingCharts)
      this.app.loadingCharts = true;
    if (this.app.fromNonRepForm) {
      this.app.fromNonRepForm = false;
      this.Execute_res_data = this.StorageSessionService.getCookies('executeresdata');
    }
    const body = {
      V_SRC_ID: this.Execute_res_data['V_SRC_ID'],
      V_PRCS_TXN_ID: this.Execute_res_data['V_PRCS_TXN_ID'],
      V_USR_ID: JSON.parse(sessionStorage.getItem('u')).USR_ID,
      REST_Service: 'Report',
      Verb: 'POST'
    };
    this.http.post(this.apiService.endPoints.secureProcessReport, body, this.apiService.setHeaders())
      .subscribe(
        (res: any) => {
          if (res._body !== '{}') {
            this.globals.Report = JSON.parse(res._body)
            this.StorageSessionService.setCookies('report_table', res.json());
            this.check_data = res.json();
            this.app.loadingCharts = false;
            this.report = res.json();
            var timeout = res.json().RESULT.toString().substring(0, 7) == "TIMEOUT";
            if (timeout && this.ctrl_variables.call_repeat_on_TIMEOUT) {
              this.repeatCallTable(true);
            } else if (this.report.RESULT == 'TABLE') {

              this.router.navigateByUrl('/End_User/ReportTable', { skipLocationChange: true });
            } else if (this.report.RESULT[0] == 'INPUT_ARTFCT_TASK') {

              this.router.navigateByUrl('/End_User/InputArtForm', { skipLocationChange: true });

            } else if (CommonUtils.isValidValue(this.report.V_EXE_CD)) {

              if (this.report.RESULT[0] == 'NONREPEATABLE_MANUAL_TASK') {
                this.router.navigateByUrl('/End_User/NonRepeatForm', {
                  queryParams: { refresh: new Date().getTime() }, skipLocationChange: true
                });

              } else if (this.report.RESULT[0] == 'REPEATABLE_MANUAL_TASK') {
                this.router.navigateByUrl('/End_User/RepeatForm', { skipLocationChange: true });
              }

            } else {
              this.repeatCallTable(true);
            }
            this.StorageSessionService.setCookies('App_Prcs', { 'V_APP_CD': this.selectedApp, 'V_PRCS_CD': this.selectedProcess });
          } else {
            this.router.navigate(['End_User/Design'], { queryParams: { page: 1 }, skipLocationChange: true });
          }
        }
      );
    if (!this.app.fromNonRepForm) {
      if (this.app.loadingCharts && CommonUtils.isValidValue(this.ctrl_variables) && this.ctrl_variables.show_ALL) {
        this.chart_JSON_call();
      }
    }
  }
  chart_JSON_call() {
    this.apiService.requestSecureApi(this.apiService.endPoints.secure + 'V_SRC_ID=' + this.Execute_res_data['V_SRC_ID'] + '&V_APP_ID=' + this.Execute_res_data['V_APP_ID'] + '&V_PRCS_ID=' + this.Execute_res_data['V_PRCS_ID'] + '&V_PRCS_TXN_ID=' + this.Execute_res_data['V_PRCS_TXN_ID'] + '&REST_Service=ProcessStatus&Verb=GET', 'get').subscribe(res => {
      (res);
      const start_time = [], end_time = [], Process = [];

      for (let i = 0; i < res['INS_DT_TM'].length; i++) {
        start_time[i] = res['INS_DT_TM'][i].substring(11);
        end_time[i] = res['LST_UPD_DT_TM'][i].substring(11);
        Process[i] = res['PRDCR_SRVC_CD'][i];
      }
      if (this.ctrl_variables.show_Gantt) {
        this.show_gantt_chart(Process, start_time, end_time);
      }
      if (this.ctrl_variables.show_PIE) {
        this.show_pie(Process, start_time, end_time);
      }
      if (this.ctrl_variables.show_BAR) {
        this.show_bar_chart(Process, start_time, end_time);
      }

      const exec = this;
      if (this.app.loadingCharts) {
        setTimeout(function () { exec.chart_JSON_call(); }, 500);
      }
    });
  }
  repeatCallTable(data: any): void {
    if (data && this.repeat < this.ctrl_variables.repeat_count) {
      this.repeat++;
      this.GenerateReportTable();
    } else {
      this.repeat = 0;
      this.router.navigate(["/End_User/Execute"], { queryParams: { page: 1 }, skipLocationChange: true });
    }
  }
  deleteApplication() {
    if (this.selectedApp !== '' || this.selectedApp !== null) {
      this.httpClient.delete(this.url + 'V_APP_CD=' + this.selectedApp + '&V_SRC_CD=' + this.user.SRC_CD + '&V_USR_NM=' + this.user.USR_NM + '&REST_Service=Application&Verb=DELETE')
        .subscribe((res: any) => {
          this.selectedApp = '';
          this.selectedProcess = '';
          this.isApp = false;
          this.isProcess = false;
          this.isService = false;
          this.getApplicationProcess();
        },
          this.handleError.bind(this))
    }
  }
  Execute_AP_PR() {
    this.resFormData = [];
    let FormData: any[];
    // secure
    this.apiService.requestSecureApi(this.apiService.endPoints.secure + 'V_APP_CD=' + this.selectedApp + '&V_PRCS_CD=' + this.selectedProcess + '&V_SRC_CD=' + this.user.SRC_CD + '&ResetOptimised=' + this.ResetOptimised + '&Lazyload=false' + '&REST_Service=ProcessParameters&Verb=GET', 'get').subscribe(
      res => {
        FormData = res.json();
        const ref = { disp_dyn_param: false };
        const got_res = this.data.exec_schd_restCall(FormData, ref);
        this.form_result = got_res.Result;
        this.resFormData = got_res.Data;
        this.k = got_res.K;
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
    const secureUrl = this.apiService.endPoints.secure + 'V_SRC_CD=' + this.user.SRC_CD + '&V_APP_CD=' + this.selectedApp + '&V_PRCS_CD=' + this.selectedProcess + '&V_PARAM_NM=' + V_PARAM_NM + '&V_SRVC_CD=' + this.selectedService + '&REST_Service=ProcessParametersOptions&Verb=GET';
    const secure_encoded_url = encodeURI(secureUrl);
    this.http.get(secure_encoded_url, this.apiService.setHeaders()).subscribe(
      res => {
        const resData = res.json();
        this.options[display_label] = resData[V_PARAM_NM];
      });
  }

  Update_value(v: any, n: any) { //v=value and n=paramter name
    this.FilterAutoValue = v;
    this.apiService.requestSecureApi(this.url + 'V_APP_CD=' + this.selectedApp + '&V_PRCS_CD=' + this.selectedProcess + '&V_SRC_CD=' + this.user.SRC_CD + '&V_USR_NM=' + this.user.USR_NM + '&V_PARAM_NM=' + n + '&V_PARAM_VAL=' + v + '&REST_Service=ProcessParameters&Verb=PATCH', 'get').subscribe(
      res => {
      }
    );
  }
  show_gantt_chart(Process, start_time, end_time) {
    let count = 0, flag = false, val1;
    const mydataset = [];
    for (let i = 0; i < Process.length; i++) {
      const R = Math.floor(Math.random() * 200);
      const G = Math.floor(Math.random() * 200);
      const B = Math.floor(Math.random() * 200);
      if (this.ColorGantt.length < i + 1) {
        this.ColorGantt[i] = 'rgba(' + R + ',' + G + ',' + B + ')';
      }
      //((this.time_to_sec(start_time[i]) - this.time_to_sec(start_time[0])));
      //((this.time_to_sec(end_time[i]) - this.time_to_sec(start_time[0])));
      mydataset[Process.length - i - 1] = {
        backgroundColor: this.ColorGantt[i],
        borderColor: this.ColorGantt[i],
        fill: false,
        borderWidth: 20,
        pointRadius: 0,
        data: [
          {
            x: (this.time_to_sec(start_time[i]) - this.time_to_sec(start_time[0])),
            y: Process.length - i - 1
          }, {
            x: (this.time_to_sec(end_time[i]) - this.time_to_sec(start_time[0])),
            y: Process.length - i - 1
          }
        ]
      };
    }
    const element = (<HTMLCanvasElement>document.getElementById('myGanttchart'));
    if (element != null) {
      const ctx = element.getContext('2d');
      const scatterChart = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: mydataset
        },
        options: {
          animation: {
            duration: 0
          },
          legend: {
            display: false
          },
          scales: {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Processes',
                fontStyle: 'bold'
              },
              gridLines: {
                display: false,
              },
              ticks: {
                beginAtZero: true,
                callback: function (value, index, values) {
                  return Process[Process.length - value - 1];
                }
              }
            }],
            xAxes: [{
              type: 'linear',
              position: 'top',
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Time',
                fontStyle: 'bold'
              },
              ticks: {
                //beginAtZero :true,
                callback: function (value, index, values) {
                  if (value == Math.floor(value)) {
                    let beg_str = start_time[0].substring(0, 2);
                    let begstr = parseInt(beg_str);
                    let mid_str = (start_time[0][3] + start_time[0][4]);
                    let midstr = parseInt(mid_str);
                    let end_str = start_time[0].substring(6);
                    let endstr = parseInt(end_str);
                    endstr += value;
                    midstr += Math.floor(endstr / 60);
                    endstr = endstr - 60 * Math.floor(endstr / 60);
                    begstr += Math.floor(midstr / 60);
                    midstr = midstr - 60 * Math.floor(midstr / 60);
                    //(index);

                    if (midstr < 10) {
                      mid_str = '0' + midstr;
                    }
                    if (endstr < 10) {
                      end_str = '0' + endstr;
                    }
                    if (begstr < 10) {
                      beg_str = '0' + begstr;
                    }
                    //(count);
                    return beg_str + ':' + mid_str + ':' + end_str;
                  }
                  //return value/val1;
                  //return index;
                },
              }

            }],
          }
        }
      });
    }
  }
  show_pie(Process, start_time, end_time) {
    const mydata = [];
    const color = [], bcolor = [];
    const borderwidth_ = [];
    for (let i = 0; i < Process.length; i++) {
      const R = Math.floor(Math.random() * 200);
      const G = Math.floor(Math.random() * 200);
      const B = Math.floor(Math.random() * 200);
      if (this.Colorpie.length < i + 1) {
        this.Colorpie[i] = 'rgb(' + R + ',' + G + ',' + B + ',0.8)';
        this.Colorpie_boder[i] = 'rgb(' + Math.floor(R * 0.8) + ',' + Math.floor(G * 0.8) + ',' + Math.floor(B * 0.8) + ')';
      }
      const temp = (this.time_to_sec(end_time[i]) - this.time_to_sec(start_time[i]));
      mydata[i] = temp;
      color[i] = this.Colorpie[i];
      bcolor[i] = this.Colorpie_boder[i];
      borderwidth_[i] = 1;
    }
    const data2 = {
      labels: Process,
      datasets: [
        {
          data: mydata,
          backgroundColor: color,
          borderColor: bcolor,
          borderWidth: borderwidth_
        }
      ]
    };
    const element = (<HTMLCanvasElement>document.getElementById('myPie'));
    if (element != null) {
      const ctx = element.getContext('2d');
      const chart1 = new Chart(ctx, {
        type: 'pie',
        data: data2,
        options: {
          animation: {
            duration: 0
          },
          responsive: true,
          tooltips: {
            callbacks: {
              title: function (tooltipItem, data) {
                return data['labels'][tooltipItem[0]['index']];
              },
              label: function (tooltipItem, data) {
                //(tooltipItem);
                //(data['datasets'][0]['data'][tooltipItem['index']]);
                let ret = mydata[tooltipItem['index']];
                ret = Math.floor(ret * 100) / 100;
                return ret + ' sec';
              }
            },
            backgroundColor: '#FFF',
            titleFontSize: 16,
            titleFontColor: '#0066ff',
            bodyFontColor: '#000',
            bodyFontSize: 14,
            displayColors: false
          },
          title: {
            display: true,
            position: 'top',
            text: 'Current Processes',
            fontSize: 12,
            fontColor: '#111'
          },
          legend: {
            display: true,
            position: 'right',
            labels: {
              fontColor: '#333',
              fontSize: 10
            }
          }
        },
      });
    }
  }

  show_bar_chart(Process, start_time, end_time) {
    let val1, flag = false;
    const duration = [];
    const color = [];
    const bcolor = [];
    let temp_HH, temp_MM, temp_SS;
    for (let i = 0; i < Process.length; i++) {
      const len_temp = Process[i].length;
      Process[i] = Process[i].substring(0, 11);
      if (len_temp > Process[i].length) {
        Process[i] = Process[i] + '...';
      }
      const temp = this.time_to_sec(end_time[i]) - this.time_to_sec(start_time[i]);
      duration[i] = temp;
      //(duration);
      const R = Math.floor(Math.random() * 200);
      const G = Math.floor(Math.random() * 200);
      const B = Math.floor(Math.random() * 200);
      if (this.ColorBar.length < i + 1) {
        this.ColorBar[i] = 'rgba(' + R + ',' + G + ',' + B + ',0.6)';
        this.ColorBar_border[i] = 'rgb(' + Math.floor(R * 0.8) + ',' + Math.floor(G * 0.8) + ',' + Math.floor(B * 0.8) + ')';
      }
      color[i] = this.ColorBar[i];
      bcolor[i] = this.ColorBar_border[i];
    }
    const element = (<HTMLCanvasElement>document.getElementById('myBarchart'));
    if (element != null) {
      const ctx = element.getContext('2d');
      const myBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Process,
          datasets: [
            {
              data: duration,
              backgroundColor: color,
              borderColor: bcolor,
              borderWidth: 1
            }]
        },
        options: {
          animation: {
            duration: 0
          },
          responsive: true,
          legend: {
            display: false,
            position: 'bottom',
            labels: {
              fontColor: '#333',
              fontSize: 16
            }
          },
          tooltips: {
            callbacks: {
              title: function (tooltipItem, data) {
                return data['labels'][tooltipItem[0]['index']];
              },
              label: function (tooltipItem, data) {
                //(tooltipItem);
                //(data['datasets'][0]['data'][tooltipItem['index']]);
                let ret = duration[tooltipItem['index']];
                ret = Math.floor(ret * 100) / 100;
                return ret + ' sec';
              }
            },
            backgroundColor: '#FFF',
            titleFontSize: 16,
            titleFontColor: '#0066ff',
            bodyFontColor: '#000',
            bodyFontSize: 14,
            displayColors: false
          },
          scales: {
            yAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Duration',
                fontStyle: 'bold'
              },
              ticks: {
                min: 0,
                callback: function (value, index, values) {
                  if (value == Math.floor(value)) {
                    let begstr = 0;
                    let midstr = 0;

                    let endstr = value;
                    //(index*value);
                    midstr += Math.floor(endstr / 60);
                    endstr = endstr - 60 * Math.floor(endstr / 60);
                    begstr += Math.floor(midstr / 60);
                    midstr = midstr - 60 * Math.floor(midstr / 60);
                    //(index);
                    let beg_str = begstr.toString(), mid_str = midstr.toString(), end_str = endstr.toString();
                    if (midstr < 10) {
                      mid_str = '0' + midstr;
                    }
                    if (endstr < 10) {
                      end_str = '0' + endstr;
                    }
                    if (begstr < 10) {
                      beg_str = '0' + begstr;
                    }
                    //(min);
                    return beg_str + ':' + mid_str + ':' + end_str;
                  }
                  //return value;
                  //return index;
                },
              }
            }],
            xAxes: [{
              display: true,
              gridLines: {
                display: false,
              },
              scaleLabel: {
                display: true,
                labelString: 'Processes',
                fontStyle: 'bold'
              },
            }]
          }
        }
      });
    }
  }
  time_to_sec(time): any {
    return parseInt(time.substring(0, 2)) * 3600 + parseInt(time.substring(3, 5)) * 60 + (parseInt(time.substring(6)));
  }
}