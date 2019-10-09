import { Component, OnInit } from '@angular/core';

import { RollserviceService } from '../../../services/rollservice.service';
import { UseradminService } from 'src/app/services/useradmin.service2';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { filter, take } from 'rxjs/operators';
import { OptionalValuesService } from 'src/app/services/optional-values.service';

@Component({
  selector: 'app-usernavbar',
  templateUrl: './usernavbar.component.html',
  styleUrls: ['./usernavbar.component.scss']
})
export class UsernavbarComponent implements OnInit {

  roll_execute: boolean = false;
  roll_schedule: boolean = false;
  roll_orchestrate: boolean = false;
  roll_myTask: boolean = false;
  roll_design: boolean = false;
  roll_exeption: boolean = false;
  roll_dashboard: boolean = false;
  roll_process: boolean = false;
  imageUrl;
  V_SRC_CD;
  V_USR_NM;
  options = [{ 'value': 'Show Both', 'key': 'Both' }, { 'value': 'Show Table', 'key': 'Table' }, { 'value': 'Show Charts', 'key': 'Charts' }, { 'value': 'Show Properties Table', 'key': 'Properties' }];
  ctrl_variables: any;
  showNewIcon: boolean = false;
  navigationSubscription;
  reportTableSubscription;
  constructor(
    private rollserviceService: RollserviceService,
    private httpClient: HttpClient, private router: Router, private optionalService: OptionalValuesService
  ) {
    this.reportTableSubscription = this.optionalService.reportTableMenuViewValue.subscribe(res => {
      if (res != null) {
        if (res) {
          this.showNewIcon = true;
        } else {
          this.showNewIcon = false;
        }
      }
    })
    this.navigationSubscription = router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        console.log(e.url)
        if (e.url !== '/End_User/ReportTable') {
          this.showNewIcon = false;
        }
      });
  }

  ngOnInit() {
    this.V_SRC_CD = JSON.parse(sessionStorage.getItem('u')).SRC_CD;
    this.V_USR_NM = JSON.parse(sessionStorage.getItem('u')).USR_NM;
    this.imageUrl = " https://enablement.us/FileAPIs/api/file/v1/download/FileInfo?V_SRC_CD=" + this.V_SRC_CD + "&Type=Logo";
    this.rollserviceService.getRollCd().then((res) => {
      this.httpClient.get('../../../../assets/control-variable.json').subscribe(cvres => {
        this.ctrl_variables = cvres;
        res.map((role) => {
          switch (role) {
            case 'Enablement Workflow Execute Role':
              if (this.ctrl_variables.show_EXE) {
                this.roll_execute = true;
              }
              this.roll_design = true;
              break;
            case 'Enablement Workflow Schedule Role':
              if (this.ctrl_variables.show_SCHE) {
                this.roll_schedule = true;
              }
              break;
            case 'Enablement Workflow Orchestrate Role':
              if (this.ctrl_variables.show_ORCH) {
                this.roll_orchestrate = true;
              }
              break;
            case 'Enablement Workflow MyTask Role':
              this.roll_myTask = true;
              break;
            case 'Enablement Workflow Exception Role':
              this.roll_exeption = true;
              break;
            case 'Enablement Workflow Dashboard Role':
              this.roll_dashboard = true;
              break;
            case 'Enablement Workflow Process Role':
              if (this.ctrl_variables.show_PROC) {
                this.roll_process = true;
              }
              break;
            default:
              break;
          }
        });
      });
    });
  }
  optionSelecteds(value) {
    this.optionalService.reportTableMenuClickValue.next(value);
  }
}

