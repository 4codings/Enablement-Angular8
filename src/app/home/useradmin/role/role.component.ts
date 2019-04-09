import { Component, OnInit } from '@angular/core';
import { NoAuthDataService } from 'src/app/services/no-auth-data.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
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
