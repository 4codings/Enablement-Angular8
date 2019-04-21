import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-useradmin',
  templateUrl: './useradmin.component.html',
  styleUrls: ['./useradmin.component.scss']
})
export class UseradminComponent implements OnInit {

  constructor(
    private matIconRegistry: MatIconRegistry, 
    private domSanitizer: DomSanitizer
    ) { 
      this.matIconRegistry.addSvgIcon(
        "settings",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/settings.svg")
      );
      this.matIconRegistry.addSvgIcon(
        "play",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/play.svg")
      );
      this.matIconRegistry.addSvgIcon(
        "schedule",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/schedule.svg")
      );
      this.matIconRegistry.addSvgIcon(
        "list",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/list.svg")
      );
      this.matIconRegistry.addSvgIcon(
        "task",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/task.svg")
      );
      this.matIconRegistry.addSvgIcon(
        "error",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/error.svg")
      );
      this.matIconRegistry.addSvgIcon(
        "dashboard",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/dashboard.svg")
      );
      this.matIconRegistry.addSvgIcon(
        "user",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/user.svg")
      );
      this.matIconRegistry.addSvgIcon(
        "home",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/home.svg")
      );
      this.matIconRegistry.addSvgIcon(
        "logout",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/logout.svg")
      );
      this.matIconRegistry.addSvgIcon(
        "switch",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/switch.svg")
      );
      //--------------------Users Profile---------------------
      this.matIconRegistry.addSvgIcon(
        "group",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/group.svg")
      );
      this.matIconRegistry.addSvgIcon(
        "membership",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/membership.svg")
      );
      this.matIconRegistry.addSvgIcon(
        "playlist_add_check",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/playlist_add_check.svg")
      );
      this.matIconRegistry.addSvgIcon(
        "gantt-chart",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/chart-gantt.svg")
      );
      this.matIconRegistry.addSvgIcon(
        "gantt-chart-red",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/chart-gantt-red.svg")
      );
      //--------------------Deployment Profile---------------------
      this.matIconRegistry.addSvgIcon(
        "search",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/search.svg")
      );
      this.matIconRegistry.addSvgIcon(
        "refresh",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/refresh.svg")
      );
      this.matIconRegistry.addSvgIcon(
        "swap_horiz",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/swap_horiz.svg")
      );
      this.matIconRegistry.addSvgIcon(
        "cloud_upload",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/cloud_upload.svg")
      );
      this.matIconRegistry.addSvgIcon(
        "insert_link",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/insert_link.svg")
      );
      this.matIconRegistry.addSvgIcon(
        "machines2",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/machines2.svg")
      );
      this.matIconRegistry.addSvgIcon(
        "build",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/build.svg")
      );
      this.matIconRegistry.addSvgIcon(
        "developer_mode",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/developer_mode.svg")
      );
      this.matIconRegistry.addSvgIcon(
        "developer_mode",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/developer_mode.svg")
      );
      this.matIconRegistry.addSvgIcon(
        "assignment_ret",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/assignment_ret.svg")
      );
      this.matIconRegistry.addSvgIcon(
        "lock_red",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/img/navbaricons/lock_red.svg")
      );
    }

  ngOnInit() {
  }

}
