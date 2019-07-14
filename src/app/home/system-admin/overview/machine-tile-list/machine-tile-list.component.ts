import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop, moveItemInArray, copyArrayItem } from '@angular/cdk/drag-drop';
import { SystemAdminOverviewService } from '../system-admin-overview.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-machine-tile-list',
  templateUrl: './machine-tile-list.component.html',
  styleUrls: ['./machine-tile-list.component.scss']
})
export class MachineTileListComponent implements OnInit {
  contextMenuData: any;
  contextMenuStyle: any;
  contextMenuActive: boolean = false;
  public selectedMachine;
  public selectedExe = {};
  subscription: Subscription;
  @Output() selectedMachineTile = new EventEmitter();
  @Input() connectionList;
  @ViewChild('contextMenu') set contextMenu(value: ElementRef) {
    if (value) {
      let menu: HTMLDivElement = value.nativeElement;
      menu.addEventListener('mousedown', ev => ev.stopImmediatePropagation());
    }
  }

  constructor(private systemOverview:SystemAdminOverviewService) { }

  ngOnInit() {
    //console.log(this.connectionList);
    this.subscription = this.systemOverview.selectedExe$.subscribe(data => {
      console.log(data);
      if(data) {
        this.selectedExe = data;
      }
    })
  }

  onAddConnTileClick() {

  }

  connectionDropped(event: CdkDragDrop<any[]>) {
    console.log(event.item.data);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      copyArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      //this.addAuthEvent.emit(event.item.data);
    }
  }

  onConnectionTileClick(connection) {
      if(this.selectedMachine === connection) {
        this.selectedMachine = null;
        this.selectedMachineTile.emit(this.selectedMachine);
      } else {
        this.selectedMachine = connection;
        this.selectedMachineTile.emit(this.selectedMachine);
    }
  
  }

  onTileMouseDownEventHandler(ev: MouseEvent): void {
    document.dispatchEvent(new MouseEvent('mousedown', ev));
  }

  openContextmenu(event: MouseEvent, data?: any) {
    event.preventDefault();
    if (data) {
      this.contextMenuData = data;
    }
    this.contextMenuStyle = {
      top: `${event.clientY}px`,
      left: `${event.clientX}px`,
    };
    this.contextMenuActive = true;
  }

  onContextMenuEditConnBtnClick(): void {
    this.contextMenuActive = false;
    //this.overviewService.openEditAuthDialog(this.contextMenuData);
    this.contextMenuData = null;
  }

  onContextMenuDeleteConnBtnClick(): void {
    this.contextMenuActive = false;
    //this.deleteAuthEvent.emit(this.contextMenuData);
    this.contextMenuData = null;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
