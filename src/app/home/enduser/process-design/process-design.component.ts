import { Component, ViewChild, OnInit, OnDestroy, ViewEncapsulation, ElementRef, Directive, Output, EventEmitter, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { Modeler, PropertiesPanelModule, OriginalPropertiesProvider, InjectionNames } from './bpmn-js';
import { Globals } from '../../../services/globals';
import { EndUserService } from '../../../services/EndUser-service';
import { UseradminService } from '../../../services/useradmin.service2';
import { OptionalValuesService, ApplicationProcessObservable } from '../../../services/optional-values.service';
import { Subscription, Subject } from 'rxjs';
import { TreeviewItem, TreeviewConfig, TreeviewI18nDefault, TreeviewI18n } from 'ngx-treeview';
import { RollserviceService } from '../../../services/rollservice.service';
import { ApiService } from '../../../service/api/api.service';
import { Http } from '@angular/http';
import { IFormFieldConfig, ConfigServiceService } from '../../../services/config-service.service';
import { StorageSessionService } from '../../../services/storage-session.service';
import { EnduserComponent } from '../enduser.component';
import { HomeComponent } from '../../home.component';
import { Router, NavigationEnd } from '@angular/router';
import { CommonUtils } from '../../../common/utils';
import * as Chart from 'chart.js';

import { schedule } from './schd_data';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogScheduleComponent } from '../../../shared/components/dialog-schedule/dialog-schedule.component';
import { DatePipe } from '@angular/common';
import { DeviceDetectorService } from 'ngx-device-detector';

export class ReportData {
  public RESULT: string;
  public V_EXE_CD: string[];
  constructor() {
  }
}
@Directive({
  selector: '[isOutside]'
})
export class IsOutsideDirective {
  constructor(private elementRef: ElementRef) { }

  @Output()
  public isOutside = new EventEmitter();

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {
    if (this.elementRef) {
      const clickedInside = this.elementRef.nativeElement.contains(targetElement) || targetElement.classList.contains('open-button');
      if (!clickedInside) {
        this.isOutside.emit(true);
      }
    }
  }
}

@Component({
  selector: 'app-process-design',
  templateUrl: './process-design.component.html',
  styleUrls: ['./process-design.component.scss'],
  providers: [
    {
      provide: TreeviewI18n, useValue: Object.assign(new TreeviewI18nDefault(), {
        getFilterPlaceholder(): string {
          return 'Find a Process';
        }
      })
    },
    DatePipe
  ]
})
export class ProcessDesignComponent implements OnInit, OnDestroy {
  innerTableDT: any[] = [];
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
  public isConditionalFlow = false;
  public isDefaultFlow = false;
  public isNoneFlow = false;
  @ViewChild('file', { static: false } as any)
  private file: any;
  @ViewChild('processForm', { static: false } as any) processForm: any;
  @ViewChild('treesidenav', { static: true } as any) treesidenav: any;
  changingValue: Subject<boolean> = new Subject();
  private currentXml: any;
  private uploadLocked: boolean;
  public expandPanel: boolean = true;
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
    maxHeight: 400,
  });
  parentMenuItems = [
    { item: 'New Process', value: 'Add', havePermission: 0, icon: 'create', iconType: 'mat' },
    { item: 'Open BPMN File', value: 'Import', havePermission: 0, icon: 'attach_file', iconType: 'mat' },
    { item: 'Edit Application', value: 'Edit', havePermission: 0, icon: 'entry bpmn-icon-screw-wrench mr-10', iconType: 'bpmn' },
    { item: 'Delete Application', value: 'Delete', havePermission: 0, icon: 'entry bpmn-icon-trash', iconType: 'bpmn' }];
  childrenMenuItems = [
    { item: 'Run', value: 'Run', havePermission: 0, icon: 'fas fa-play-circle fa-lg', iconType: 'fa' },
    { item: 'Run At', value: 'RunAt', havePermission: 0, icon: 'fas fa-clock fa-lg', iconType: 'fa' },
    { item: 'Approve', value: 'Approve', havePermission: 0, icon: 'fas fa-thumbs-up fa-lg', iconType: 'fa' },
    { item: 'Monitor', value: 'Monitor', havePermission: 0, icon: 'fas fa-desktop fa-lg', iconType: 'fa' },
    { item: 'Resolve', value: 'Resolve', havePermission: 0, icon: 'fa fa-address-card fa-lg ml-1', iconType: 'fa' },
    { item: 'Schedule', value: 'Schedule', havePermission: 0, icon: 'fa fa-calendar fa-lg ml-2', iconType: 'fa' },
    { item: 'Pause Schedule', value: 'SchedulePause', havePermission: 0, icon: 'far fa-pause-circle fa-lg', iconType: 'fa' },
    { item: 'Kill Schedule', value: 'ScheduleKill', havePermission: 0, icon: 'not_interested', iconType: 'mat' }, { item: 'Resume Schedule', value: 'ScheduleResume', havePermission: 0, icon: 'undo', iconType: 'mat' },
    { item: 'Download BPNM', value: 'BPNM', havePermission: 0, icon: 'fa fa-file-download fa-lg ml-2', iconType: 'fa' },
    { item: 'Download SVG', value: 'SVG', havePermission: 0, icon: 'insert_photo', iconType: 'mat' },
    { item: 'Edit', value: 'Edit', havePermission: 0, icon: 'entry bpmn-icon-screw-wrench mr-2', iconType: 'bpmn' },
    { item: 'Delete', value: 'Delete', havePermission: 0, icon: 'entry bpmn-icon-trash', iconType: 'bpmn' }];
  roleObservable$: Subscription;
  roleValues;
  childobj = {};
  parentobj = {};
  selectedApp = '';
  selectedProcess: string = '';
  selectedService = '';
  selectedItem: any;
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
  isMobile: any;
  isTablet: any;
  isApp = false;
  isProcess = false;
  isService = false;
  isSequenceFlow = false;
  isMonitor = false;
  isTaskCreatedFlag = false;
  isSequenceCreatedChangedFlag = false;
  isEditApplicationFlag = false;
  editProcessFlag = false;
  addUpdateSequenceFlag = false;
  deleteUpdateSequenceFlag = false; // used to call update sequence api once only not with the service call again while delete sequence
  addUpdateServiceFlag = false; // to call update  api for service (i.e defined service) and not put api 
  serviceTypeChangeFlag = false;
  oldAppId = '';
  oldTaskId = '';
  oldIconType = '';
  oldSequenceId = '';
  taskList = ['bpmn:EndEvent',
    'bpmn:Event',
    'bpmn:StartEvent',
    'bpmn:IntermediateThrowEvent',
    'bpmn:MessageEndEvent',
    'bpmn:EscalationEndEvent',
    'bpmn:ErrorEndEvent',
    'bpmn:CompensationEndEvent',
    'bpmn:SignalEndEvent',
    'bpmn:TerminateEndEvent',
    'bpmn:Task',
    'bpmn:SendTask',
    'bpmn:ReceiveTask',
    'bpmn:UserTask',
    'bpmn:ManualTask',
    'bpmn:BusinessRuleTask',
    'bpmn:ServiceTask',
    'bpmn:ScriptTask',
    'bpmn:CallActivity',
    'bpmn:SubProcess(collapsed)',
    'bpmn:SubProcess(expanded)',
    'bpmn:ExclusiveGateway',
    'bpmn:ParallelGateway',
    'bpmn:InclusiveGateway',
    'bpmn:ComplexGateway',
    'bpmn:EventbasedGateway'];
  sequenceConditionType = ['Simple Expression', 'Java Script', 'Java or Python', 'SQL Statement'];
  sequenceCondition = '';
  selectedConditionType = 'Simple Expression';
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
  priority: any; //3
  async_sync_seconds: any; //300
  restorability_seconds: any; //30
  attemps: any; //3
  job_instance: any; //400
  onTitleClickNoDelete = true;

  //property panel general tab variables
  generalId: string;
  processName: string = '';
  documentation: string = '';
  oldStateId: any = '';
  old_srvc_cd: any = '';
  todaysDate: any = new Date();
  currentDate: any = new Date();
  afterFiveDays: any = new Date(this.currentDate.setYear(this.currentDate.getYear() + 5));

  userEmail: string = '';

  sequenceFlowsourceId: any;
  sequenceFlowtargetId: any;
  sequenceFlowobjectId: any;
  iconType = '';
  navigationSubscription;

  SL_APP_CD = '';
  SL_PRC_CD = '';
  form_dl_data: any[] = [];
  selectedEmoji: string;

  //Schedule Properties
  domain_name = this.globals.domain_name;
  private apiUrlGet = 'https://' + this.domain_name + '/rest/v1/secured?';
  V_SRC_CD: string = JSON.parse(sessionStorage.getItem('u')).SRC_CD;
  V_USR_NM: string = JSON.parse(sessionStorage.getItem('u')).USR_NM;

  newScheduleView: boolean = false;
  Pause_btn: boolean = false;
  Resume_btn: boolean = false;
  Kill_btn: boolean = false;

  dataSource = new MatTableDataSource();
  display_process_table: boolean = false;
  show_filter_input: boolean = false;
  checkbox_color_value = '';

  displayedColumns = ['#', 'status', 'lastrun', 'nextrun', 'details'];
  Process_key: any = [];
  selection = new SelectionModel<schedule>(true, []);

  ApplicationCD = '';
  ProcessCD = '';
  @ViewChild('processId', { static: false } as any) processID: ElementRef;
  gantt = false;
  bar = false;
  pie = false;
  file_path: any;
  elementExistError = false;
  closePanelOnSchedule: boolean = true;
  selectedAppProcess$: Subscription;

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
    private dialog: MatDialog,
    private StorageSessionService: StorageSessionService,
    private datePipe: DatePipe,
    public deviceService: DeviceDetectorService
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
                this.childrenMenuItems[5].havePermission = 1;
                break;
              case 'Enablement Workflow Dashboard Role':
                this.childrenMenuItems[3].havePermission = 1;
                break;
              case 'Enablement Workflow MyTask Role':
                this.childrenMenuItems[2].havePermission = 1;
                break;
              case 'Enablement Workflow Exception Role':
                this.childrenMenuItems[4].havePermission = 1;
                break;
              case 'Enablement Workflow Process Role':
                this.parentMenuItems[0].havePermission = 1;
                this.parentMenuItems[1].havePermission = 1;
                this.childrenMenuItems[9].havePermission = 1;
                this.childrenMenuItems[10].havePermission = 1;
                break;
              default:
                break;
            }
          })
        }
      }
    });
    this.selectedAppProcess$ = this.optionalService.selectedAppPrcoessValue.subscribe(res => {
      if (res) {
        console.log('res', res);
        this.selectedApp = res.app;
        this.selectedProcess = res.process;
      }
    })
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.router.navigated = false;
        window.scrollTo(0, 0);
        this.ngOnInit();
      }
    });
  }

  ngOnInit() {
    this.expandPanel = this.deviceService.isDesktop();
    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();
    this.user = JSON.parse(sessionStorage.getItem('u'));
    if (this.user) {
      this.userEmail = this.user.USR_NM;
    }
  }

  ngAfterViewInit() {
    this.data.getJSON().subscribe(data => {
      this.Label = data.json();
    });
    this.httpClient.get('../../../../assets/control-variable.json').subscribe(res => {
      this.ctrl_variables = res;
      this.file_path = this.ctrl_variables.bpmn_file_path;
    });
    this.url = this.apiService.endPoints.securedJSON;

    this.downloadUrl = this.apiService.endPoints.downloadFile;
    this.getApplicationProcess();
    this.modeler = new Modeler({
      container: '#canvas',
      width: '90%',
      height: '400px',
      additionalModules: [
        PropertiesPanelModule,
        OriginalPropertiesProvider,
        { [InjectionNames.bpmnPropertiesProvider]: ['type', OriginalPropertiesProvider.propertiesProvider[1]] },
        // { [InjectionNames.propertiesProvider]: ['type', CustomPropsProvider] },
      ]
    });
    const eventBus = this.modeler.get('eventBus');
    if (eventBus) {
      eventBus.on('element.click', ($event) => {
        this.onTitleClickNoDelete = false;
        this.processName = '';
        this.documentation = '';
        this.iconType = '';
        this.isApp = false;
        this.isProcess = false;
        this.isService = false;
        this.isSequenceFlow = false;
        this.oldStateId = $event.element.id;
        this.generalId = $event.element.id.replace(new RegExp('_', 'g'), ' ');
        const businessObject = $event.element.businessObject;
        this.iconType = $event.element.type;
        this.oldIconType = this.iconType;
        this.processName = businessObject.name ? businessObject.name : '';
        if (businessObject.documentation && businessObject.documentation.length) {
          this.documentation = businessObject.documentation[0].text ? businessObject.documentation[0].text : '';
        }
        if ($event && $event.element && this.taskList.indexOf($event.element.type) > -1) {
          this.isService = true;
          this.selectedService = $event.element.id.replace(new RegExp('_', 'g'), ' ');
          this.showAllTabFlag = true;
          this.showCondtionType = false;
          this.old_srvc_cd = this.generalId; // added latest
          this.getAllTabs(this.generalId);
        }
        if ($event && $event.element && ['bpmn:Process'].indexOf($event.element.type) > -1) {
          this.isApp = false;
          this.isProcess = true;
          this.isService = false;
          this.showAllTabFlag = false;
          this.showCondtionType = false;
          this.generalId = this.selectedProcess;
          this.getDocumentation('PRCS', this.generalId);
          // this.selectedProcess = $event.element.id.replace(new RegExp('_', 'g'), ' ')
          // this.generalId = $event.element.id.replace(new RegExp('_', 'g'), ' ');
        }
        if ($event && $event.element && ['bpmn:SequenceFlow'].indexOf($event.element.type) > -1) {
          this.isSequenceFlow = true;
          const businessObject = $event.element.businessObject;
          this.sequenceFlowobjectId = $event.element.id.replace(new RegExp('_', 'g'), ' ');
          this.sequenceFlowsourceId = (businessObject && businessObject.sourceRef ? businessObject.sourceRef.id : '').replace(new RegExp('_', 'g'), ' ');
          this.sequenceFlowtargetId = (businessObject && businessObject.targetRef ? businessObject.targetRef.id : '').replace(new RegExp('_', 'g'), ' ');
          this.showAllTabFlag = false;
          const isConditional = !!businessObject.conditionExpression;
          this.getDocumentation('ORCH', this.generalId);
          if (isConditional) {
            this.showCondtionType = true;
            this.getConditionType();
          } else {
            this.showCondtionType = false;
          }

          // this.getAllTabs(this.generalId);
        }
        this.closeSchedulePanel();
      }),
        eventBus.on('element.changed', ($event) => {
          this.iconType = $event.element.type;
          this.showCondtionType = false;
          const businessObject = $event.element.businessObject;
          if ($event && $event.element && ['bpmn:Process'].indexOf($event.element.type) > -1) {
            if (this.editProcessFlag) {
              this.opened = true;
              this.showRightIcon = true;
            }
            this.processName = businessObject.name ? businessObject.name : '';
            if (businessObject.documentation && businessObject.documentation.length) {
              this.documentation = businessObject.documentation[0].text ? businessObject.documentation[0].text : '';
            }
            this.generalId = $event.element.id.replace(new RegExp('_', 'g'), ' ')
            this.isApp = false;
            this.isProcess = true;
            this.isService = false;
            this.isSequenceFlow = false;
            this.showAllTabFlag = false;
          }
          else if ($event && $event.element && ['bpmn:Process', 'label'].indexOf($event.element.type) === -1) {
            this.opened = true;
            this.showRightIcon = true;
            this.processName = businessObject.name ? businessObject.name : '';
            if (businessObject.documentation && businessObject.documentation.length) {
              this.documentation = businessObject.documentation[0].text ? businessObject.documentation[0].text : '';
            }
            this.generalId = $event.element.id.replace(new RegExp('_', 'g'), ' ')
            const sourceId = (businessObject && businessObject.sourceRef ? businessObject.sourceRef.id : '').replace(new RegExp('_', 'g'), ' ');
            const targetId = (businessObject && businessObject.targetRef ? businessObject.targetRef.id : '').replace(new RegExp('_', 'g'), ' ');
            const objectId = (businessObject ? businessObject.id : '').replace(new RegExp('_', 'g'), ' ');
            if ($event.element.type !== 'bpmn:SequenceFlow') {
              this.isService = true;
              this.isTaskCreatedFlag = true;
              if (this.generalId.includes('Task')) {
                this.documentation = '';
              }
              this.oldIconType = $event.element.type;
              this.oldTaskId = $event.element.id.replace(new RegExp('_', 'g'), ' ');
            } else {
              // source Id and target id are referenced for sequence flow while for task,events and gateway input/output property is used 
              if (sourceId === "" && targetId === "") {
                this.deleteUpdateSequenceFlag = true;
                this.deleteSequence(this.generalId);
              } else {
                this.isSequenceCreatedChangedFlag = true;
                this.oldSequenceId = $event.element.id.replace(new RegExp('_', 'g'), ' ');
                this.isSequenceFlow = true;
                const isConditional = !!businessObject.conditionExpression;
                const source = $event.element.source;
                const sourceBusinessObject = source != null ? source.businessObject : '';

                const isDefault = sourceBusinessObject.default &&
                  sourceBusinessObject.default === businessObject;
                if (isConditional) {
                  this.isConditionalFlow = true;
                  this.isDefaultFlow = false;
                  this.isNoneFlow = false;
                  this.showCondtionType = true;
                }
                else if (isDefault) {
                  this.isConditionalFlow = false;
                  this.isDefaultFlow = true;
                  this.isNoneFlow = false;

                } else {
                  this.isConditionalFlow = false;
                  this.isDefaultFlow = false;
                  this.isNoneFlow = true;
                }
                if (!this.addUpdateSequenceFlag) {
                  this.updatesequenceFlow();
                }
              }
            }
            this.selectedService = this.generalId;
            this.isApp = false;
            this.isProcess = false;
            this.executableInput = '';
            this.executableDesc = '';
            this.executableOutput = '';
            this.executablesData = [];
            this.executableTypesData = [];
            // const vAppCd = 'V_APP_CD';
            // const vPrcsCd = 'V_PRCS_CD';
            const vAppCd = this.selectedApp.replace(new RegExp('_', 'g'), ' ');
            const vPrcsCd = this.selectedProcess.replace(new RegExp('_', 'g'), ' ');
            if (!this.deleteUpdateSequenceFlag && !this.addUpdateServiceFlag) {
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
                  V_ORCH_CD: objectId,
                  V_ORCH_DSC: this.documentation,
                  V_TRNSN_TYP: 'None',
                  V_TRNSN_CND: "",
                  V_CONT_ON_ERR_FLG: 'N',
                  V_USR_NM: this.user.USR_NM,
                  Verb: 'PUT'
                };

                // this.generalId = targetId;
                // this.getAllTabs(targetId);

                if (!this.flows) {
                  this.flows = {};
                }
                this.flows[targetId] = data;
              } else {
                this.addUpdateSequenceFlag = true;
                this.sequenceFlowtargetId = objectId;
                this.showAllTabFlag = true;
                const data: any = {
                  REST_Service: 'Service',
                  V_APP_CD: vAppCd,
                  V_PRCS_CD: vPrcsCd,
                  V_SRC_CD: this.user.SRC_CD,
                  V_SRVC_CD: objectId,
                  V_SRVC_DSC: this.documentation,
                  V_USR_NM: this.user.USR_NM,
                  Verb: 'PUT'
                };

                // this.generalId = objectId;
                this.getAllTabs(objectId);

                this.httpClient.post(this.url, data).subscribe((res: any) => {
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
            }
            setTimeout(() => {
              this.upload(vAppCd, this.selectedProcess);
            }, this.ctrl_variables.delay_timeout);
          }
          this.closeSchedulePanel();
        }),
        eventBus.on("shape.remove", (event) => {
          console.log('shape.remove', event)
          if (event && event.element && this.taskList.indexOf(event.element.type) >= 0) {
            if (!this.onTitleClickNoDelete && this.isService) {
              this.deleteService(event.element.id.replace(new RegExp('_', 'g'), ' '));
            }
          }
          // if (event && event.element && event.element.type === 'bpmn:SequenceFlow') {
          //   if (!this.onTitleClickNoDelete) {
          //     this.deleteSequence(event.element.id.replace(new RegExp('_', 'g'), ' '));
          //   }
          // }
          this.closeSchedulePanel();
        }),
        eventBus.on(['commandStack.element.updateProperties.execute'], (event) => {
          // The newly created element, which has a temporary ID
          var element = event.context.element;

          // properties.id is the old ID which will be copied to the new element
          var properties = event.context.properties;
          if (properties.id) {
            // every time the id is changing
            // do your stuff
          }
        });
    }
  }
  idAssigned(id, businessObject) {
    console.log('businessObject.$model.ids.assigned(id)', businessObject.$model.ids.assigned(id));
    // every business object has a reference to the model which has a reference to the ids
    return businessObject.$model.ids.assigned(id);
  }

  getDocumentation(v_type, v_cd) {
    this.endUserService.getDocumentation(v_type, v_cd).subscribe(res => {
      if (res) {
        let result = res.json();
        this.documentation = result["DSC"][0];
      }
    })
  }

  ngOnDestroy() {
    if (this.applicationProcessObservable$) {
      this.applicationProcessObservable$.unsubscribe();
    }
    this.roleObservable$.unsubscribe();
    if (this.modeler) {
      this.modeler.destroy();
    }
  }
  onInputNameChange() {
    this.elementExistError = false;
    const name = this.processName;
    if (!this.isApp && this.oldStateId) {
      let elementRegistry = this.modeler.get('elementRegistry');
      let element = elementRegistry.get(this.oldStateId);
      let modeling = this.modeler.get('modeling');
      modeling.updateProperties(element, {
          name: name,
        }, error => this.handleError(error));
    }
    this.commonInputChangeFunction();
  }
  onInputChange() {
    this.elementExistError = false;
    // replace(new RegExp(' ', 'g'), '_')
    this.generalId = this.generalId;
    if (this.documentation == undefined || this.documentation === '') {
      // .replace(new RegExp('_', 'g'), ' ')
      this.documentation = this.generalId;
    }
    if (this.processName === '' && !this.isSequenceFlow) {
      this.processName = this.generalId.replace(new RegExp('_', 'g'), ' ');
    }
    const name = this.processName;
    if (this.isService) {
      this.addUpdateServiceFlag = true;
    } else if (this.isSequenceFlow) {
      this.addUpdateSequenceFlag = true;
    }
    if (!this.isApp && this.oldStateId) {
      this.old_srvc_cd = this.oldStateId;
      let elementRegistry = this.modeler.get('elementRegistry');
      let element = elementRegistry.get(this.oldStateId);
      let modeling = this.modeler.get('modeling');
      let id = this.generalId;
      if (!this.idAssigned(id.replace(new RegExp(' ', 'g'), '_'), element.businessObject)) {
        modeling.updateProperties(element, {
          name: name,
          id: id.replace(new RegExp(' ', 'g'), '_'),
        }, error => this.handleError(error));
        this.oldStateId = id.replace(new RegExp(' ', 'g'), '_');
      } else {
        this.elementExistError = true;
        this.generalId = this.oldStateId.replace(new RegExp('_', 'g'), ' ');
        this.toastrService.error('Element Id already exists!');
      }
    }
    this.commonInputChangeFunction();
  }

  commonInputChangeFunction(){
    if (this.isApp) {
      if (this.appProcessList.length) {
        let i = this.appProcessList.findIndex(v => v.app === this.generalId);
        if (i > -1) {
          this.toastrService.info("Application Name Already exists");
          this.generalId = this.oldAppId;
        } else {
          this.addApplicationOnBE();
        }
      }
    }
    // on service id update , we do not have to send sequence flow update call to the backend. 
    if (this.isService && !this.isSequenceFlow && !this.elementExistError) {
      this.updateService();
    }
    if (this.isSequenceFlow) {
      this.updatesequenceFlow();
    }
    if (this.isProcess) {
      let processList = this.chilItem.filter(v => v.value == this.selectedApp);
      if (processList.length) {
        let i = processList.findIndex(v => v.text === this.generalId);
        if (i > -1) {
          this.toastrService.info("Process Name Already exists");
          this.generalId = this.selectedProcess;
        } else {
          this.updateProcess();
        }
      } else {
        this.updateProcess();
      }
    }
  }
  updatesequenceFlow() {
    const vAppCd = this.selectedApp;
    const vPrcsCd = this.selectedProcess;
    let v_trns_typ;
    if (this.isConditionalFlow) {
      v_trns_typ = this.selectedConditionType;
    } else if (this.isDefaultFlow) {
      v_trns_typ = 'Default';
      this.sequenceCondition = '';
    } else if (this.isNoneFlow) {
      v_trns_typ = 'None';
      this.sequenceCondition = '';
    }
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
      V_ORCH_CD: this.sequenceFlowobjectId,
      V_ORCH_DSC: this.documentation,
      V_TRNSN_TYP: v_trns_typ,
      V_TRNSN_CND: this.sequenceCondition,
      V_CONT_ON_ERR_FLG: 'N',
      V_USR_NM: this.user.USR_NM,
      Verb: 'PUT'
    };
    this.http.post(this.apiService.endPoints.securedJSON, data, this.apiService.setHeaders())
      .subscribe(res => {
        if (res) {
          if (this.isConditionalFlow) {
            this.showCondtionType = true;
          }
        }
      });
  }
  updateService() {
    this.selectedService = this.generalId;
    if (this.instances === 'single') {
      this.job_instance = 1;
    } else if (this.instances === 'unlimited') {
      this.job_instance = -1;
    }
    // let old_srvc_cd = this.oldStateId;
    const body = {
      'V_APP_CD': this.selectedApp,
      'V_PRCS_CD': this.selectedProcess,
      'V_SRVC_CD': this.selectedService,
      'V_SRVC_DSC': this.documentation,
      'V_OLD_SRVC_CD': this.old_srvc_cd.replace(new RegExp('_', 'g'), ' '),
      'V_EXE_TYP': this.selectedExecutableType,
      'V_EXE_CD': this.selectedExecutable,
      'V_EXE_SIGN': this.executableInput,
      'V_EXE_OUT_PARAMS': this.executableOutput,
      'V_NOTIF_GRP': this.userEmail,
      'V_RESTART_FLG': this.restorability === 'AUTO' || this.restorability === 'MANUAL' ? 'Y' : 'N',
      'V_RSTN_TYP': this.restorability,
      'V_MAX_ATTMPT': this.attemps,
      'V_ATTMPT_DRTN_SEC': this.restorability_seconds,
      'V_SLA_MTS': 60.00,
      'V_PRIORITY': this.priority,
      "V_SYNC_FLG": this.async_sync === 'sync' ? 'Y' : 'N',
      'V_SRVC_JOB_LMT': this.job_instance,
      'V_EFF_STRT_DT_TM': this.datePipe.transform(this.currentDate, 'yyyy-MM-dd HH:mm:ss.SSS'),
      'V_EFF_END_DT_TM': this.datePipe.transform(this.afterFiveDays, 'yyyy-MM-dd HH:mm:ss.SSS'),
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
      this.httpClient.delete(this.apiService.endPoints.securedJSON + 'V_APP_CD=' + this.selectedApp + '&V_PRCS_CD=' + this.selectedProcess + '&V_SRVC_CD=' + id + '&V_SRC_CD=' + this.user.SRC_CD + '&V_USR_NM=' + this.user.USR_NM + '&REST_Service=Service&Verb=DELETE')
        .subscribe(res => {
          this.generalId = this.selectedProcess;
          this.isApp = false;
          this.isProcess = true;
          this.isService = false;
          this.opened = true;
          this.showAllTabFlag = false;
          this.showCondtionType = false;
          this.showRightIcon = true;
          this.selectedService = '';
        })
    }
  }
  deleteSequence(id) {
    if (id !== '' || id !== null) {
      this.httpClient.get(this.apiService.endPoints.secure + "V_ORCH_CD=" + id + '&V_SRC_CD=' + this.user.SRC_CD + '&V_USR_NM=' + this.user.USR_NM + "&REST_Service=Orchetration&Verb=DELETE").subscribe(
        res => {
          this.generalId = this.selectedProcess;
          this.isApp = false;
          this.isProcess = true;
          this.isService = false;
          this.opened = true;
          this.showAllTabFlag = false;
          this.showCondtionType = false;
          this.showRightIcon = true;
        }
      );
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
    this.http.get(this.apiService.endPoints.securedJSON + "V_PRDCR_SRC_CD=" + this.user.SRC_CD + "&V_PRDCR_APP_CD=" + this.selectedApp + "&V_PRDCR_PRCS_CD=" + this.selectedProcess + "&V_PRDCR_SRVC_CD=" + this.sequenceFlowsourceId + "&V_USR_NM=" + this.user.USR_NM + "&V_SRC_CD=" + this.user.SRC_CD + "&V_APP_CD=" + this.selectedApp + "&V_PRCS_CD=" + this.selectedProcess + "&V_SRVC_CD=" + this.sequenceFlowtargetId + "&REST_Service=SequenceFlow" + "&Verb=GET", this.apiService.setHeaders())
      .subscribe(res => {
        if (res) {
          let result = res.json();
          this.selectedConditionType = result[0]["V_TRNSN_TYP"] != null ? result[0]["V_TRNSN_TYP"] : "Simple Expression";
          this.sequenceCondition = result[0]["V_TRNSN_CND"];
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
          this.oldStateId = this.selectedProcess.replace(new RegExp(' ', 'g'), '_');
          document.getElementById("processId").focus();
        }
      });
    setTimeout(() => {
      this.upload(this.selectedApp, this.selectedProcess);
    }, this.ctrl_variables.delay_timeout);
  }

  upload(vAppCd, vPrcsCd) {
    // if (!this.uploadLocked) {
    vPrcsCd = vPrcsCd.replace(new RegExp(' ', 'g'), '_')
    this.modeler.saveXML((err: any, xml: any) => {
      if (xml !== this.currentXml) {
        const formData: FormData = new FormData();
        formData.append('FileInfo', JSON.stringify({
          // File_Path: `${this.ctrl_variables.bpmn_file_path}${this.useradminService.reduceFilePath(this.user.SRC_CD)}/${vAppCd}/`,
          File_Path: `${this.ctrl_variables.bpmn_file_path}${vAppCd}/`,
          File_Name: `${vPrcsCd}.bpmn`,
          V_SRC_CD: this.user.SRC_CD,
          USR_NM: this.user.USR_NM
        }));
        formData.append('Source_File', new File([xml], `${vPrcsCd}.bpmn`, { type: 'text/xml' }));
        this.http.post(`https://${this.globals.domain}/FileAPIs/api/file/v1/upload`, formData).subscribe(
          res => {
            if (this.isTaskCreatedFlag) {
              this.showCondtionType = false;
              this.iconType = this.oldIconType;
              this.oldIconType = '';
              this.generalId = this.oldTaskId;
              this.getAllTabs(this.generalId);
              this.isTaskCreatedFlag = false;
              this.deleteUpdateSequenceFlag = false;
              this.addUpdateServiceFlag = false;
              this.addUpdateSequenceFlag = false;
              if (this.isSequenceFlow) {
                this.showAllTabFlag = true;
                this.oldStateId = this.generalId.replace(new RegExp(' ', 'g'), '_');
                this.isService = true;
                this.selectedService = this.generalId
                this.showCondtionType = false;
              }
              document.getElementById('processId').focus();
            }
          }
        );
      }
      this.currentXml = xml;
    });
    // }
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
    this.selectedProcess = this.autoGenerate();
    // this.selectedProcess = 'newProcess';
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
        setTimeout(() => {
          let elementRegistry = this.modeler.get('elementRegistry');
          let element = elementRegistry.get('newProcess');
          let modeling = this.modeler.get('modeling');
          const doc = [{ 'text': this.documentation }];
          let id = this.selectedProcess;
          modeling.updateProperties(element, {
            name: id,
            id: id.replace(new RegExp(' ', 'g'), '_'),
          })
        })
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
      // console.error(err);
    }
  }
  addApplication() {
    this.showRightIcon = true;
    this.opened = true;
    this.showAllTabFlag = false;
    this.showCondtionType = false;
    this.selectedProcess = '';
    this.selectedService = '';
    this.selectedApp = '';
    this.documentation = '';
    this.processName = '';
    this.isApp = true;
    this.isProcess = false;
    this.isService = false;
    this.generalId = this.autoGenerate();
    this.oldAppId = this.generalId;
    let x = '<?xml version="1.0" encoding="UTF-8"?><bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="2.0.3"></bpmn:definitions>';
    this.modeler.importXML(x);
    // setTimeout(() => {
    //   this.processID.nativeElement.focus();
    // }, 0);
    document.getElementById('processId').focus();
  }
  addApplicationOnBE() {
    let body;
    if (this.isEditApplicationFlag) {
      body = {
        V_OLD_APP_CD: this.oldAppId,
        V_NEW_APP_CD: this.generalId,
        V_SRC_CD: this.user.SRC_CD,
        V_APP_DSC: this.documentation,
        V_USR_NM: this.user.USR_NM,
        REST_Service: 'UpdateApplication',
        Verb: 'PUT'
      };
    } else {
      body = {
        V_APP_CD: this.generalId,
        V_SRC_CD: this.user.SRC_CD,
        V_APP_DSC: this.documentation,
        V_USR_NM: this.user.USR_NM,
        REST_Service: 'Application',
        Verb: 'PUT'
      };
    }

    this.endUserService.addUpdateApplication(body)
      .subscribe(res => {
        if (res) {
          this.selectedApp = this.generalId;
          this.getApplicationProcess();
          this.generalId = '';
          this.processName = '';
          this.documentation = '';
          this.opened = false;
          this.editProcessFlag = false;
          this.showAllTabFlag = false;
          this.showRightIcon = false;
          this.oldAppId = '';
        }
      })
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
          this.treesidenav.opened = true;
          this.getApplicationProcess();
        },
          this.handleError.bind(this));
    }
  }
  editApplication(appName) {
    this.generalId = this.selectedApp;
    this.isApp = true;
    this.isProcess = false;
    this.isService = false;
    this.showRightIcon = true;
    this.opened = true;
    this.showAllTabFlag = false;
    this.showCondtionType = false;
    this.selectedProcess = '';
    this.selectedService = '';
    this.selectedApp = appName;
    this.isConditionalFlow = false;
    this.isSequenceFlow = false;
    this.isSequenceCreatedChangedFlag = false;
    this.isNoneFlow = false;
    this.getDocumentation('APP', this.selectedApp);
    // this.documentation = '';
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
          let editCount = 0;
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
                      if (authSubStr[1] === 'Y') {
                        editCount++;
                      }
                      copyChildrenMenuItems[11].havePermission = authSubStr[1] === 'Y' ? 1 : 0;
                      break;
                    }
                    case 'DELETE': {
                      if (authSubStr[1] === 'Y') {
                        deleteCount++;
                      }
                      copyChildrenMenuItems[12].havePermission = authSubStr[1] === 'Y' ? 1 : 0;
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
            copyParentrenMenuItems[3].havePermission = 1;
            copyParentrenMenuItems[2].havePermission = 1;
            this.parentobj[ele.app] = copyParentrenMenuItems;
          } else {
            if (editCount == ele.auth.length) {
              copyParentrenMenuItems[2].havePermission = 1;
            } else {
              copyParentrenMenuItems[2].havePermission = 0;
            }
            if (deleteCount == ele.auth.length) {
              copyParentrenMenuItems[3].havePermission = 1;
            } else {
              copyParentrenMenuItems[3].havePermission = 0;
            }
            this.parentobj[ele.app] = copyParentrenMenuItems;
          }
        };
        let treeObj = new TreeviewItem({
          text: ele.app, value: ele.app, collapsed: true, children: this.chilItem
        });
        this.item.push(treeObj);
      })
      setTimeout(() => {
        if (this.selectedApp != '' || this.selectedProcess != '') {
          if (this.selectedProcess != '') {
            let index = this.item.findIndex(v => v.text == this.selectedApp);
            if (index > -1) {
              if (this.item[index].children && this.item[index].children.length) {
                let childIndex = this.item[index].children.findIndex(v => v.text == this.selectedProcess);
                if (childIndex > -1) {
                  this.onTitleClick(this.item[index].children[childIndex]);
                }
              } else {
                this.onTitleClick(this.item[index]);
              }
            }
          } else {
            let index = this.item.findIndex(v => v.text == this.selectedApp);
            if (index > -1) {
              this.onTitleClick(this.item[index]);
            }
          }
        }
      }, 1000);
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

    if (this.isService && !this.isSequenceFlow) {
      this.updateService();
    }
  }

  onTitleClick(item, parentTitleClick?) {
    this.closeSchedulePanel();
    this.onTitleClickNoDelete = true;
    this.isApp = false;
    this.isProcess = true;
    this.isService = false;
    this.showRightIcon = false;
    if(parentTitleClick)
      this.opened = false;
    this.editProcessFlag = false;
    this.V_OLD_PRCS_CD = item.text;
    if (!item.children) {
      this.selectedApp = item.value;
      this.selectedProcess = item.text;
      const formData: FormData = new FormData();
      formData.append('FileInfo', JSON.stringify({
        File_Path: `${this.ctrl_variables.bpmn_file_path}` + item.value + '/',
        File_Name: item.text.replace(new RegExp(' ', 'g'), '_') + '.bpmn'
      }));
      this.http.post(this.downloadUrl, formData)
        .subscribe(
          (res: any) => {
            if (res._body != "") {
              this.modeler.importXML('');
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
                  this.modeler.importXML('');
                  this.modeler.importXML(x, this.handleError.bind(this));
                  this.bpmnTemplate = x;
                  setTimeout(() => {
                    let elementRegistry = this.modeler.get('elementRegistry');
                    let element = elementRegistry.get('newProcess');
                    let modeling = this.modeler.get('modeling');
                    const doc = [{ 'text': this.documentation }];
                    let id = this.selectedProcess;
                    modeling.updateProperties(element, {
                      name: id,
                      id: id.replace(new RegExp(' ', 'g'), '_'),
                    })
                    document.getElementById("processId").focus();
                    this.upload(this.selectedApp, this.selectedProcess);
                  })
                },
                this.handleError.bind(this)
              );
            }
          },
          this.handleError.bind(this)
        );
      this.Execute_AP_PR();
    } else {
      this.selectedApp = item.value;
      this.selectedProcess = '';
      let x = '<?xml version="1.0" encoding="UTF-8"?><bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="2.0.3"></bpmn:definitions>';
      this.modeler.importXML(x);
    }
    // if (!parentTitleClick) {
    //   this.treesidenav.opened = false;
    // }
    this.selectedItem = item;
    if (this.isMobile || this.isTablet) {
      this.opened = false;
    }
  }
  onParentMenuItemClick(actionValue, parentValue, selectedItem?) {
    this.selectedApp = parentValue;
    switch (actionValue) {
      case 'Add': {
        this.isEditApplicationFlag = false;
        this.onTitleClickNoDelete = true;
        let x = '<?xml version="1.0" encoding="UTF-8"?><bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="2.0.3"></bpmn:definitions>';
        this.modeler.importXML(x);
        this.selectedProcess = '';
        this.selectedService = '';
        this.newBpmn();
        this.isApp = false;
        this.isProcess = true;
        this.isService = false;
        // this.generalId = "newProcess";
        this.generalId = this.selectedProcess;
        this.showRightIcon = true;
        this.opened = true;
        this.showCondtionType = false;
        break;
      }
      case 'Import': {
        let ele = document.getElementById('file');
        ele.click();
        break;
      }
      case 'Edit': {
        this.isEditApplicationFlag = true;
        this.oldAppId = this.selectedApp;
        this.editApplication(this.selectedApp);
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
    this.treesidenav.opened = false;
  }

  autoGenerate() {
    return Math.random().toString(36).split('').filter(function (value, index, self) {
      return self.indexOf(value) === index;
    }).join('').substr(2, 8);
  }
  closeSchedulePanel() {
    this.newScheduleView = false;
    this.Pause_btn = false;
    this.Resume_btn = false;
    this.Kill_btn = false;

    this.display_process_table = false;
    this.show_filter_input = false;
    this.closePanelOnSchedule = true;
  }

  onChildMenuItemClick(actionValue, childValue) {

    this.selectedApp = childValue ? childValue.value : this.selectedApp;
    this.selectedProcess = childValue ? childValue.text : this.selectedProcess;
    this.selectedItem = childValue ? childValue : this.selectedItem;
    this.closeSchedulePanel();
    console.log(actionValue, childValue);
    switch (actionValue) {
      case 'Run': {
        this.add();
        this.Execute_Now();
        break;
      }
      case 'RunAt': {
        this.add();
        this.repeatURL();
        this.openEmojiDialog();
        break;
      }
      case 'Edit': {
        console.log('selected', this.selectedItem);
        this.isMonitor = false;
        this.editProcessFlag = true;
        this.showRightIcon = true;
        this.opened = true;
        this.showAllTabFlag = false;
        this.isApp = false;
        this.isProcess = true;
        this.isService = false;
        this.generalId = this.selectedProcess;
        this.getDocumentation('PRCS', this.generalId);
        break;
      }
      case 'Delete': {
        this.onDeleteProcess();
        break;
      }
      case 'Schedule': {
        this.newScheduleView = true;
        this.closePanelOnSchedule = false;
        break;
      }
      case 'SchedulePause': {
        this.closePanelOnSchedule = false;
        this.Pause_btn = true;
        this.display_process_table = true;
        this.checkbox_color_value = 'checkbox_blue';
        this.applyFilter('SCHEDULED');
        break;
      }
      case 'ScheduleResume': {
        this.closePanelOnSchedule = false;
        this.Resume_btn = true;
        this.display_process_table = true;
        this.checkbox_color_value = 'checkbox_green';
        this.applyFilter('PAUSED');
        break;
      }
      case 'ScheduleKill': {
        this.closePanelOnSchedule = false;
        this.Kill_btn = true;
        this.display_process_table = true;
        this.show_filter_input = true;
        this.checkbox_color_value = 'checkbox_red';
        this.applyFilter('');
        break;
      }
      case 'Monitor': {
        this.isMonitor = true;
        this.newScheduleView = false;
        this.editProcessFlag = false;
        this.showRightIcon = false;
        this.opened = false;
        this.showAllTabFlag = false;
        this.isApp = false;
        this.isProcess = false;
        this.isService = false;
        this.onTitleClickNoDelete = true;
        let obj = { 'app': this.ApplicationCD, 'process': this.ProcessCD, 'file_path': this.file_path }
        this.optionalService.selectedAppPrcoessValue.next(obj);
        this.router.navigateByUrl('End_User/Design/monitor', { skipLocationChange: true });
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
    this.treesidenav.opened = false;
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
          this.editProcessFlag = false;
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
      console.log('execute now');
      this.http.post(this.apiService.endPoints.secureProcessStart, body, this.apiService.setHeaders())
        .subscribe(res => {
          console.log(res.json());
          this.executedata = { SL_APP_CD: this.selectedApp, SL_PRC_CD: this.selectedProcess };

          this.StorageSessionService.setCookies('executedata', this.executedata);
          this.Execute_res_data = res.json();
          this.StorageSessionService.setCookies('executeresdata', this.Execute_res_data);
          this.PFrame.display_page = true;
          if (this.Execute_res_data['V_PRCS_TXN_ID'] !== null) {
            this.GenerateReportTable();
          } else {
            this.toastrService.error(this.ctrl_variables.process_deployment_error);
          }
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
          if (this.propertyPanelAllTabsData && this.propertyPanelAllTabsData.length) {
            this.documentation = this.propertyPanelAllTabsData[0]["V_SRVC_DSC"];
            this.executableDesc = this.propertyPanelAllTabsData[0]['V_EXE_DSC'];
            this.executableInput = this.propertyPanelAllTabsData[0]['V_EXE_SIGN'];
            this.executableOutput = this.propertyPanelAllTabsData[0]['V_EXE_OUT_PARAMS'];
            this.selectedExecutable = this.propertyPanelAllTabsData[0]['V_EXE_CD'];
            this.selectedExecutableType = this.propertyPanelAllTabsData[0]['V_EXE_TYP'];
            this.attemps = this.propertyPanelAllTabsData[0]['V_MAX_ATTMPT'];
            this.restorability = this.propertyPanelAllTabsData[0]['V_RSTN_TYP'];
            this.userEmail = this.propertyPanelAllTabsData[0]["V_NOTIF_GRP"];
            this.restorability_seconds = this.propertyPanelAllTabsData[0]["V_ATTMPT_DRTN_SEC"];
            this.priority = this.propertyPanelAllTabsData[0]["V_PRIORITY"];
            this.job_instance = this.propertyPanelAllTabsData[0]["V_SRVC_JOB_LMT"];
            if (this.job_instance == -1) {
              this.instances = 'unlimited';
            } else if (this.job_instance == 1) {
              this.instances = 'single'
            } else {
              this.instances = 'limited';
            }
            if (this.propertyPanelAllTabsData[0]["V_EFF_STRT_DT_TM"] != null) {
              this.currentDate = new Date(this.propertyPanelAllTabsData[0]["V_EFF_STRT_DT_TM"]);
            } else {
              this.currentDate = new Date();
            }
            if (this.propertyPanelAllTabsData[0]["V_EFF_END_DT_TM"] != null) {
              this.afterFiveDays = new Date(this.propertyPanelAllTabsData[0]["V_EFF_END_DT_TM"]);
            } else {
              this.afterFiveDays = new Date();
            }
            this.display_output = this.propertyPanelAllTabsData[0]["V_DSPLY_OUTPUT"] === 'Y' ? true : false;
            this.isServiceActive = this.propertyPanelAllTabsData[0]["V_SRVC_ACTIVE_FLG"] === 'Y' ? true : false;
            this.summary_output = this.propertyPanelAllTabsData[0]["V_ADD_TO_SMMRY_RESULT"] === 'Y' ? true : false;
            if (this.selectedExecutableType != null || this.selectedExecutableType != '') {
              this.getExecutablesForSelctedExecutableType();
            }
          }
        }
      });

    // this.getAllExecutableTypes();
  }

  // Added for property panel related tabs
  getAllExecutableTypes() {
    if (this.oldIconType != '') {
      this.iconType = this.oldIconType;
    }
    let iconType = this.iconType.split(':')[1];
    iconType = iconType.split(/(?=[A-Z])/).join(' ');
    this.endUserService.getAllExecutableTypes(iconType)
      .subscribe(res => {
        if (res) {
          this.executableTypesData = []; //clearning off old data if any
          if (res.json().EXE_TYP) {
            this.executableTypesData = res.json().EXE_TYP;
            this.executableTypesData.sort();
            if (this.executableTypesData) {
              this.selectedExecutableType = this.executableTypesData[0];
            }
          }
        }
      });
  }

  getExecutablesForSelctedExecutableType() {
    if (this.selectedExecutableType != null) {
      this.endUserService.getExecutablesForSelctedExecutableType(this.selectedExecutableType)
        .subscribe(res => {
          if (res) {
            this.executablesData = []; //clearning off old data if any
            if (res.json().EXE_CD) {
              this.executablesData = res.json().EXE_CD;
              this.executablesData.sort();
            }
          }
        });
    }
  }

  getInputOutputForSelctedExecutable() {
    this.endUserService.getInputOutputForSelctedExecutable(this.selectedExecutableType, this.selectedExecutable)
      .subscribe(res => {
        if (res) {
          const result = res.json();
          if (result && Object.keys(result).length) {
            this.executableOutput = result["EXE_OUT_PARAMS"] != undefined ? result["EXE_OUT_PARAMS"][0] : '';
            this.executableDesc = result["EXE_DSC"] != undefined ? result["EXE_DSC"][0] : '';
            this.executableInput = result["EXE_SIGN"] != undefined ? result["EXE_SIGN"][0] : '';
            this.async_sync = result['SYNC_FLG'][0] === 'Y' ? 'sync' : 'async';
            this.async_sync_seconds = result['TIME_OUT_SEC'] != undefined ? result["TIME_OUT_SEC"][0] : '';
          } else {
            this.toastrService.error(this.ctrl_variables.process_deployment_error)
          }
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
    console.log('rpt table');
    console.log(body);
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
            console.log(this.report.RESULT);
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
      res = res.json();
      const start_time = [], end_time = [], Process = [];
      if (res['INS_DT_TM'].length) {
        for (let i = 0; i < res['INS_DT_TM'].length; i++) {
          start_time[i] = res['INS_DT_TM'][i].substring(11);
          end_time[i] = res['LST_UPD_DT_TM'][i].substring(11);
          Process[i] = res['PRDCR_SRVC_CD'][i];
        }
        if (this.ctrl_variables.show_Gantt) {
          this.gantt = true;
          this.show_gantt_chart(Process, start_time, end_time);
        }
        if (this.ctrl_variables.show_PIE) {
          this.pie = true;
          this.show_pie(Process, start_time, end_time);
        }
        if (this.ctrl_variables.show_BAR) {
          this.bar = true;
          this.show_bar_chart(Process, start_time, end_time);
        }
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
      setTimeout(() => {
        this.GenerateReportTable();
      }, this.ctrl_variables.report_table_timeout);

    } else {
      this.repeat = 0;
      this.router.navigate(["/End_User/Design"], { queryParams: { page: 1 }, skipLocationChange: true });
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

  onSelectLimtedPriority() {
    this.job_instance = 100;
  }

  repeatURL(APP_CD = this.selectedApp, PRC_CD = this.selectedProcess, ) {
    this.form_dl_data[0] = {
      APP_CD: this.selectedApp,
      PRC_CD: this.selectedProcess
    };

    this.StorageSessionService.setSession('Exe_data', this.form_dl_data[0]);
  }

  openEmojiDialog() {
    const dialog = this.dialog.open(DialogScheduleComponent, {
      height: '200px',
      width: '300px',
      panelClass: 'app-dialog'
    });

    dialog.afterClosed()
      .subscribe(selection => {
        if (selection) {
          this.selectedEmoji = selection;
        } else {
          // User clicked 'Cancel' or clicked outside the dialog
        }
      });
  }

  onChildMenuClick(item) {

    this.ApplicationCD = item ? item.value : this.selectedApp;
    this.ProcessCD = item ? item.text : this.selectedProcess;
    this.repeatURL(this.ApplicationCD, this.ProcessCD);
    this.find_process(this.ApplicationCD, this.ProcessCD, "All");
  }

  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }


  Action;
  F1;
  find_process(ApplicationCD, ProcessCD, StatusCD) {

    if (this.childrenMenuItems[4].havePermission == 0) {
      console.warn("User does not have the permission to load Schedules...");
      return;
    }


    this.childrenMenuItems[6].havePermission = 0;
    this.childrenMenuItems[7].havePermission = 0;
    this.childrenMenuItems[8].havePermission = 0;

    /**internalChecked: true
​
internalCollapsed: false
​
internalDisabled: false
​
text: "new Process"
​
value: "Business Development"

this.find_process(this.ApplicationCD, this.ProcessCD, 'Scheduled');
this.find_process(this.ApplicationCD, this.ProcessCD, 'Paused');
*/
    this.Action = [];
    // this.innerTableDT = [];
    // this.Data = [];
    this.httpClient.get<schedule>(this.apiUrlGet + 'V_SRC_CD=' + this.V_SRC_CD +
      '&V_APP_CD=' + ApplicationCD + '&V_PRCS_CD=' + ProcessCD + '&V_USR_NM=' +
      this.V_USR_NM + '&V_TRIGGER_STATE=' + StatusCD +
      '&REST_Service=ScheduledJobs&Verb=GET').subscribe(dataResult => {
        let rm_f: boolean;
        let ps_r: boolean;
        if (this.isEmpty(dataResult)) {
        } else {

          this.F1 = dataResult.SRVC_CD;
          this.selection = new SelectionModel<schedule>(true, []);

          for (let i = 0; i < this.F1.length; i++) {
            this.innerTableDT[i] = {
              // name: dataResult.SRVC_CD[i],
              status: dataResult.TRIGGER_STATE[i],
              lastrun: dataResult.PREV_FIRE_TIME[i],
              nextrun: dataResult.NEXT_FIRE_TIME[i],
              details: dataResult.DESCRIPTION[i],
              job_name: dataResult.JOB_NAME[i]

            };

            // _______check trigger status
            if (dataResult.TRIGGER_STATE[i] === 'SCHEDULED') {
              ps_r = true;
            } if (dataResult.TRIGGER_STATE[i] === 'PAUSED') {
              rm_f = true;
            }
          }
          // push dependent flag
          // this.Action.push('Setup a New Schedule');
          if (rm_f) {
            this.childrenMenuItems[8].havePermission = 1;
            this.childrenMenuItems[7].havePermission = 1;
          } if (ps_r) {
            this.childrenMenuItems[6].havePermission = 1;
            this.childrenMenuItems[7].havePermission = 1;

          }
          //    push kill flag if process are not empty
          // if (dataResult.TRIGGER_STATE.length > 0) {
          //   this.childrenMenuItems[7].havePermission = 1;
          // }
          this.dataSource.data = this.innerTableDT;
        }
      });
  }

  onPause() {
    this.innerTableDT = [];
    // Pause
    for (let i = 0; i < this.selection.selected.length; i++) {
      let obj: any = this.selection.selected[i];
      this.Process_operation(obj.job_name, 'Pause');
    }
    setTimeout(() => {
      this.find_process(this.ApplicationCD, this.ProcessCD, 'All');
    }, 5000);

  }


  onResume() {
    this.innerTableDT = [];
    for (let i = 0; i < this.selection.selected.length; i++) {
      let obj: any = this.selection.selected[i];
      this.Process_operation(obj.job_name, 'Resume');
    }
    setTimeout(() => {
      this.find_process(this.ApplicationCD, this.ProcessCD, 'All');
    }, 5000);
  }

  onKill() {
    this.innerTableDT = [];
    for (let i = 0; i < this.selection.selected.length; i++) {
      let obj: any = this.selection.selected[i];
      this.Process_operation(obj.job_name, 'Kill');
    }
    setTimeout(() => {
      this.find_process(this.ApplicationCD, this.ProcessCD, 'All');
    }, 5000);
  }

  // onPause() {

  //   this.innerTableDT = [];
  //   // // Pause
  //   for (let i = 0; i < this.Process_key.length; i++) {
  //     this.Process_operation(this.Process_key[i], 'Pause');
  //   }
  //   setTimeout(() => {
  //     this.find_process(this.ApplicationCD, this.ProcessCD, 'All');
  //   }, 5000);

  // }


  // onResume() {
  //   this.innerTableDT = [];
  //   // // Resume
  //   for (let i = 0; i < this.Process_key.length; i++) {
  //     this.Process_operation(this.Process_key[i], 'Resume');
  //   }
  //   // await delay(2000);
  //   setTimeout(() => {
  //     this.find_process(this.ApplicationCD, this.ProcessCD, 'All');
  //   }, 5000);
  //   // // this.find_process(this.ApplicationCD,this.ProcessCD,"All");
  // }

  // onKill() {
  //   this.innerTableDT = [];
  //   for (let i = 0; i < this.Process_key.length; i++) {
  //     this.Process_operation(this.Process_key[i], 'Kill');
  //     ('Process id' + this.Process_key[i]);
  //   }
  //   setTimeout(() => {
  //     this.find_process(this.ApplicationCD, this.ProcessCD, 'All');
  //   }, 5000);
  // }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;

  }

  // -------------get process id / JOB_NAME
  Check_process_id(key: any) {
    this.Process_key.push(key);
  }

  onRowClick(row) {

  }

  Process_operation(P_ID: any, P_OP: any) {

    const body = {
      'TriggerKey': [P_ID],
      'JobKey': [P_ID],
      'Operation': [P_OP]
    };
    (body);
    this.http.post('https://' + this.domain_name + '/rest/Hold/ScheduleAction', body).subscribe(
      res => {
        (res.json());
      }
    );
    // this.find_process(this.ApplicationCD,this.ProcessCD,"All");
  }


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.filteredData.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.filteredData.forEach((row: any) => this.selection.select(row));
  }

  changeTrigger(data) {
    this.changingValue.next(data);
  }
}
