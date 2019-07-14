import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { CdkDragDrop, copyArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { SystemAdminOverviewService } from '../system-admin-overview.service';
import { MatDialog } from '@angular/material';
import { AddExeDialogComponent } from '../dialogs/add-exe-dialog/add-exe-dialog.component';

@Component({
  selector: 'app-exe-tile-list',
  templateUrl: './exe-tile-list.component.html',
  styleUrls: ['./exe-tile-list.component.scss']
})
export class ExeTileListComponent implements OnInit {
  contextMenuData: any;
  contextMenuStyle: any;
  contextMenuActive: boolean = false;
  public selectedTile;
  @Input() exes;
  @Output() selectedExeTile = new EventEmitter();
  public selectedMachine;
  @ViewChild('contextMenu') set contextMenu(value: ElementRef) {
    if (value) {
      let menu: HTMLDivElement = value.nativeElement;
      menu.addEventListener('mousedown', ev => ev.stopImmediatePropagation());
    }
  }
  constructor(private systemOverview:SystemAdminOverviewService, public dialog: MatDialog) { }

  ngOnInit() {
    //console.log(this.exes);
  }

  onAddExeTileClick(exeType) {
    const dialogRef = this.dialog.open(AddExeDialogComponent, {
      panelClass: 'app-dialog',
      width: '600px',
      data: {EXE_TYP:exeType}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  exeDropped(event: CdkDragDrop<any[]>) {
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

  onExeTileClick(exe) {
    if(this.selectedTile === exe) {
      this.selectedTile = null;
      this.selectedExeTile.emit({});
    } else {
      this.selectedTile = exe;
      this.selectedExeTile.emit(this.selectedTile);
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

  onContextMenuEditExeBtnClick(): void {
    this.contextMenuActive = false;
    //this.overviewService.openEditAuthDialog(this.contextMenuData);
    this.contextMenuData = null;
  }

  onContextMenuDeleteExeBtnClick(): void {
    this.contextMenuActive = false;
    //this.deleteAuthEvent.emit(this.contextMenuData);
    this.contextMenuData = null;
  }

}
