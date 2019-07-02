import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { Modeler, PropertiesPanelModule, InjectionNames, OriginalPropertiesProvider, OriginalPaletteProvider } from './bpmn-js';
import { CustomPropsProvider } from './props-provider/custom-props-provider';
import { CustomPaletteProvider } from './props-provider/custom-palette-provider';
import { Globals } from 'src/app/services/globals';
import { EndUserService } from 'src/app/services/EndUser-service';
import { OptionalValuesService, ApplicationProcessObservable } from 'src/app/services/optional-values.service';
import { Subscription } from 'rxjs';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { RollserviceService } from 'src/app/services/rollservice.service';

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
  private user: any;
  private bpmnTemplate: any;
  @ViewChild('file')
  private file: any;
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
    { item: 'Create Process', value: 'Add', havePermission: 0 },
    { item: 'Open Process', value: 'Import', havePermission: 0 },
    { item: 'Save BPNM', value: 'BPNM', havePermission: 0 },
    { item: 'Save SVG', value: 'SVG', havePermission: 0 },
    { item: 'Delete Application', value: 'Delete', havePermission: 0 }];
  childrenMenuItems = [
    { item: 'Run', value: 'Run', havePermission: 0 },
    { item: 'Edit', value: 'Edit', havePermission: 0 },
    { item: 'Delete', value: 'Delete', havePermission: 0 },
    { item: 'Schedule', value: 'Schedule', havePermission: 0 },
    { item: 'Monitor', value: 'Monitor', havePermission: 0 },
    { item: 'Approve', value: 'Approve', havePermission: 0 },
    { item: 'Resolve', value: 'Resolve', havePermission: 0 }];
  roleObservable$: Subscription;
  roleValues;
  childobj = {};
  parentobj = {};
  constructor(
    private httpClient: HttpClient,
    private toastrService: ToastrService,
    private globals: Globals,
    private endUserService: EndUserService,
    private optionalService: OptionalValuesService,
    private roleService: RollserviceService
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
                this.parentMenuItems[2].havePermission = 1;
                this.parentMenuItems[3].havePermission = 1;
                break;
              default:
                break;
            }
          })
        }
      }
    });
  }

  onFilterChange(value: string) {
    // console.log('filter:', value);
  }

  onSelectedChange(value) {
    // console.log('onSelectedChange:', value);
  }

  ngOnInit() {
    this.url = `https://${this.globals.domain_name + this.globals.Path + this.globals.version}/securedJSON`;
    this.user = JSON.parse(sessionStorage.getItem('u'));
    this.modeler = new Modeler({
      container: '#canvas',
      width: '100%',
      height: '400px',
      additionalModules: [
        PropertiesPanelModule,
        { [InjectionNames.bpmnPropertiesProvider]: ['type', OriginalPropertiesProvider.propertiesProvider[1]] },
        { [InjectionNames.propertiesProvider]: ['type', CustomPropsProvider] },
        { [InjectionNames.originalPaletteProvider]: ['type', OriginalPaletteProvider] },
        { [InjectionNames.paletteProvider]: ['type', CustomPaletteProvider] },
      ],
      propertiesPanel: {
        parent: '#properties'
      },
      moddleExtension: {
        custom: {
          name: 'customModdle',
          prefix: 'custom',
          xml: {
            tagAlias: 'lowerCase'
          },
          associations: [],
          types: [
            {
              'name': 'ExtUserTask',
              'extends': [
                'bpmn:UserTask'
              ],
              'properties': [
                {
                  'name': 'worklist',
                  'isAttr': true,
                  'type': 'String'
                }
              ]
            },
          ]
        }
      }
    });
    this.newBpmn();
    const eventBus = this.modeler.get('eventBus');
    if (eventBus) {
      eventBus.on('element.changed', ($event) => {
        if ($event && $event.element && ['bpmn:Process', 'label'].indexOf($event.element.type) === -1) {
          if ($event.element.type === 'bpmn:SequenceFlow') {
            const data: any = {
              REST_Service: 'Orchetration',
              RESULT: '@RESULT',
              V_APP_CD: 'Marketing',
              V_CONT_ON_ERR_FLG: 'N',
              V_PRCS_CD: '',
              V_PRDCR_APP_CD: 'Marketing',
              V_PRDCR_PRCS_CD: 'Email DHS POC',
              V_PRDCR_SRC_CD: this.user.SRC_CD,
              V_PRDCR_SRVC_CD: $event.element.businessObject.sourceRef.id,
              V_SRC_CD: this.user.SRC_CD,
              V_SRVC_CD: $event.element.businessObject.targetRef.id,
              V_USR_NM: this.user.USR_NM,
              Verb: 'PUT'
            };
            this.httpClient.put(this.url, data).subscribe();
          } else {
            const data: any = {
              REST_Service: 'Service',
              V_APP_CD: 'Marketing',
              V_CREATE: 'Y',
              V_DELETE: 'Y',
              V_EXECUTE: 'Y',
              V_PRCS_CD: 'Email DHS POC',
              V_READ: 'Y',
              V_ROLE_CD: 'Program Assessment Role',
              V_SRC_CD: this.user.SRC_CD,
              V_SRVC_CD: $event.element.businessObject.name,
              V_SRVC_DSC: '',
              V_UPDATE: 'Y',
              V_USR_NM: this.user.USR_NM,
              Verb: 'PUT'
            };
            this.httpClient.post(this.url, data).subscribe();
          }
        }
      });
    }
    this.getApplicationProcess();
  }

  ngOnDestroy() {
    this.applicationProcessObservable$.unsubscribe();
    this.roleObservable$.unsubscribe();
    if (this.modeler) {
      this.modeler.destroy();
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

  downloadBpmn() {
    this.modeler.saveXML((err: any, xml: any) => {
      saveAs(new Blob([xml], { type: 'text/xml' }), 'diagram.bpmn');
    });
  }

  downloadSvgBpmn() {
    this.modeler.saveSVG((err: any, svg: any) => {
      saveAs(new Blob([svg], { type: 'image/svg+xml' }), 'diagram.svg');
    });
  }

  handleError(err: any) {
    if (err) {
      this.toastrService.error(err);
      console.error(err);
    }
  }

  generateTreeItem() {
    this.item = [];
    if (this.appProcessList.length) {
      this.appProcessList.forEach(ele => {

        if (ele.process.length) {
          this.chilItem = [];
          ele.process.forEach(eleProcess => {
            let childTreeObj = new TreeviewItem({ text: eleProcess.replace(/'/g, ""), value: eleProcess.replace(/'/g, "") });
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
            copyParentrenMenuItems[4].havePermission = 1;
          } else {
            copyParentrenMenuItems[4].havePermission = 0;
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

  onTitleClick(value) {

  }
  onParentMenuItemClick(actionValue, parentValue) {
    switch (actionValue) {
      case 'Add': {
        break;
      }
      case 'Import': {
        break;
      }
      case 'Delete': {
        break;
      }
      default: {
        break;
      }
    }
  }
  onChildMenuItemClick(actionValue, childValue) {
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
      default: {
        break;
      }
    }
  }
}
