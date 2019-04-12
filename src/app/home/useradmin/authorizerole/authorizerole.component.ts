import { Component, OnInit } from '@angular/core';
import { NoAuthDataService } from 'src/app/services/no-auth-data.service';

@Component({
  selector: 'app-authorizerole',
  templateUrl: './authorizerole.component.html',
  styleUrls: ['./authorizerole.component.scss']
})
export class AuthorizeroleComponent implements OnInit {
  Label:any[] = [];
  constructor(public noAuthData: NoAuthDataService) { }

  ngOnInit() {
    this.noAuthData.getJSON().subscribe(data => {
      console.log(data);
      this.Label = data;
    });
  }

}
