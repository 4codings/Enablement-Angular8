import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-machine-tile-list',
  templateUrl: './machine-tile-list.component.html',
  styleUrls: ['./machine-tile-list.component.scss']
})
export class MachineTileListComponent implements OnInit {
  @Input() connectionList;
  constructor() { }

  ngOnInit() {
    //console.log(this.connectionList)
  }

  onAddConnTileClick() {

  }

}
