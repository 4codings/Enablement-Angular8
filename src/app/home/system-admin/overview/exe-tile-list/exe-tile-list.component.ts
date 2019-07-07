import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-exe-tile-list',
  templateUrl: './exe-tile-list.component.html',
  styleUrls: ['./exe-tile-list.component.scss']
})
export class ExeTileListComponent implements OnInit {
  contextMenuActive = true;
  @Input() exes;

  constructor() { }

  ngOnInit() {
    //console.log(this.exes);
  }

  onAddExeTileClick() {
    
  }

}
