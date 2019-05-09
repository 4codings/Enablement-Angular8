import { Component, OnInit } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
@Component({
  selector: 'app-deploymentsnavbar',
  templateUrl: './deploymentsnavbar.component.html',
  styleUrls: ['./deploymentsnavbar.component.scss']
})
export class DeploymentsnavbarComponent implements OnInit {


  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) { 
  
    iconRegistry.addSvgIcon(
      'machines',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/navbaricons/machines.svg'));
  }

  ngOnInit() {
  }

}
