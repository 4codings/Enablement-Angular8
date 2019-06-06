import { Component, OnInit } from '@angular/core';

import { RollserviceService } from 'src/app/services/rollservice.service';

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
  roll_exeption: boolean = false;
  roll_dashboard: boolean = false;
  roll_process: boolean = false;

  constructor(
    private rollserviceService: RollserviceService
  ) { }

  ngOnInit() {
    this.rollserviceService.getRollCd().then((res) => {
      res.map((role) => {
        switch (role) {
          case 'Enablement Workflow Execute Role':
            this.roll_execute = true;
            break;
          case 'Enablement Workflow Schedule Role':
            this.roll_schedule = true;
            break;
          case 'Enablement Workflow Orchestrate Role':
            this.roll_orchestrate = true;
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
            this.roll_process = true;
            break;
          default:
            break;
        }
      });
    });
  }

}

