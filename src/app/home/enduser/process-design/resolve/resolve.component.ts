import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ToastrService } from 'ngx-toastr';
import { OptionalValuesService } from 'src/app/services/optional-values.service';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ApiService } from 'src/app/service/api/api.service';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-resolve',
  templateUrl: './resolve.component.html',
  styleUrls: ['./resolve.component.scss']
})
export class ResolveComponent  implements OnInit {

  constructor(public http: Http, public toastrService: ToastrService, public optionalService: OptionalValuesService,
    public httpClient: HttpClient, public datePipe: DatePipe,
    public apiService: ApiService, public dialog: MatDialog) {
    // this.selectedAppProcess$ = this.optionalService.selectedAppPrcoessValue.subscribe(res => {
    //   if (res) {
    //     this.parentapp = res.app;
    //     this.parentpro = res.process;
    //     this.file_path = res.file_path;
    //   }
    // })
  }

  ngOnInit() {
  }

}
