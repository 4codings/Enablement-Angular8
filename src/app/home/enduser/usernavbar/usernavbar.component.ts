import { Component, OnInit } from '@angular/core';

import { RollserviceService } from 'src/app/services/rollservice.service';
import { UseradminService } from 'src/app/services/useradmin.service2';
import { HttpClient } from '@angular/common/http';

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

  ctrl_variables: any;

  constructor(
    private rollserviceService: RollserviceService,
    private httpClient: HttpClient,
  ) { }

  ngOnInit() {
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

}

