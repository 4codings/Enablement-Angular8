import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-single-machine',
  templateUrl: './single-machine.component.html',
  styleUrls: ['./single-machine.component.scss']
})
export class SingleMachineComponent implements OnInit {

  @Input() machineData;
  @Input() machines;
  V_SRC_CD:string=JSON.parse(sessionStorage.getItem('u')).SRC_CD;
  V_USR_NM:string=JSON.parse(sessionStorage.getItem('u')).USR_NM;

  constructor() { }

  ngOnInit() {
  }

  onBtnDeleteMachineClick(exe) {
    
  }

  onBtnEditMachineClick(exe) {
    
  }

  onBtnAssignRoleClick(exeType) {

  }

  selectedMachineTile(connection) {
    console.log("connection", connection);
  }

}
