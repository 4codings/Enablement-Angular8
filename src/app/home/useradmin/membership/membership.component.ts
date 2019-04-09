import { Component, OnInit } from '@angular/core';
import { NoAuthDataService } from 'src/app/services/no-auth-data.service';

@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.scss']
})
export class MembershipComponent implements OnInit {

  Label: any[] = [];

  constructor(
    public noAuthData: NoAuthDataService,

  ) { }

  ngOnInit() {
    this.noAuthData.getJSON().subscribe(data => {
      console.log(data);
      this.Label = data;
    });
  }

}
