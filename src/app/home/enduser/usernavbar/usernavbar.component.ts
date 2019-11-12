import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { OptionalValuesService } from 'src/app/services/optional-values.service';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../service/api/api.service';
import { RollserviceService } from '../../../services/rollservice.service';


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
  timeStamp;
  V_SRC_CD;
  V_USR_NM;
  options = [{ 'value': 'Show Only Charts', 'key': 'Charts', 'flag': true }, { 'value': 'Show Only Table', 'key': 'Table', 'flag': true }, { 'value': 'Show Charts and Tables', 'key': 'Both', 'flag': true }, { 'value': 'Configure Charts', 'key': 'Properties', 'flag': true }];
  ctrl_variables: any;
  showNewIcon: boolean = false;
  navigationSubscription;
  reportTableSubscription;
  reportTableClickObservable$;
  reportTableDefaultView$;
  constructor(
    private rollserviceService: RollserviceService,
    private apiService: ApiService,
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
        if (e.url !== '/End_User/ReportTable') {
          this.showNewIcon = false;
        }
      });
    this.reportTableClickObservable$ = this.optionalService.reportTableMenuClickValue.subscribe(res => {
      if (res != null) {
        if (res.flag) {

          let i = this.options.findIndex(v => v.key == 'Properties');
          this.options[i].flag = true;
        }
      }
    })
    this.reportTableDefaultView$ = this.optionalService.defaultreportTableValue.subscribe(res => {
      if (res != null) {
        this.options.forEach(ele => {
          if (ele.key == res) {
            ele.flag = false;
          } else {
            ele.flag = true;
          }
        })
      }
    })
  }

  ngOnInit() {
    this.V_SRC_CD = JSON.parse(sessionStorage.getItem('u')).SRC_CD;
    this.V_USR_NM = JSON.parse(sessionStorage.getItem('u')).USR_NM;
    this.apiService.imageLogoUrlSubject.subscribe(data => {
      if(data == '') {
        this.imageUrl = `https://${environment.apiURL}/${JSON.parse(sessionStorage.getItem('u')).SRC_CD}/logo`;
      } else {
        this.imageUrl = data;
        this.timeStamp = (new Date()).getTime();
      }
    });
  }
  optionSelecteds(value) {
    if (value.key == 'Properties') {
      let i = this.options.findIndex(v => v.key == value.key);
      this.options[i].flag = false;
    } else {
      this.options.forEach(ele => {
        if (ele.key == value.key) {
          ele.flag = false;
        } else {
          ele.flag = true;
        }
      })
    }
    this.optionalService.reportTableMenuClickValue.next({ 'value': value, 'flag': false });
  }

  public getLinkPicture() {
    if (this.timeStamp) {
      return this.imageUrl + '?' + this.timeStamp;
    }
    return this.imageUrl;
  }
}

