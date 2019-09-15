import { Component, OnInit, OnDestroy } from '@angular/core';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { Subscription } from 'rxjs';
import { ApplicationProcessObservable, OptionalValuesService } from 'src/app/services/optional-values.service';
import { EndUserService } from 'src/app/services/EndUser-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-viewer-tree',
  templateUrl: './viewer-tree.component.html',
  styleUrls: ['./viewer-tree.component.scss']
})
export class ViewerTreeComponent implements OnInit, OnDestroy {

  chilItem: TreeviewItem[] = [];
  config = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 400,
  });
  item: TreeviewItem[] = [];
  appProcessList = [];
  applicationProcessObservable$: Subscription;
  applicationProcessValuesObservable: ApplicationProcessObservable[] = [];
  selectedAppProcess$: Subscription;
  parentapp: any;
  parentpro: any;
  file_path: any;
  constructor(private optionalService: OptionalValuesService, private endUserService: EndUserService, private router: Router) {
    this.applicationProcessObservable$ = this.optionalService.applicationProcessValue.subscribe(data => {
      if (data != null) {
        this.applicationProcessValuesObservable = data;
        if (this.applicationProcessValuesObservable.length) {
          this.appProcessList = [];
          this.appProcessList = data.sort((a, b) => {
            if (a.app < b.app) {
              return -1;
            } else if (a.app > b.app) {
              return 1;
            } else {
              return 0;
            }
          });
          this.generateTreeItem();
        }
      }
    });
    this.selectedAppProcess$ = this.optionalService.selectedAppPrcoessValue.subscribe(res => {
      if (res) {
        this.parentapp = res.app;
        this.parentpro = res.process;
        this.file_path = res.file_path;
      }
    })
  }

  ngOnInit() {
    this.getApplicationProcess();
  }
  ngOnDestroy() {
    this.applicationProcessObservable$.unsubscribe();
    this.selectedAppProcess$.unsubscribe();
  }
  getApplicationProcess() {
    this.endUserService.getApplicationAndProcess().subscribe(res => {
      if (res) {
        let data = res.json();
        if (data.length) {
          this.optionalService.getApplicationProcessOptionalValue(data);
        }
      }
    })
  }
  generateTreeItem() {
    this.item = [];
    if (this.appProcessList.length) {
      this.appProcessList.forEach(ele => {
        if (ele.process.length) {
          this.chilItem = [];
          ele.process.forEach(eleProcess => {
            let childTreeObj = new TreeviewItem({ text: eleProcess.replace(/'/g, ""), value: ele.app });
            this.chilItem.push(childTreeObj)
          })
        }
        let treeObj = new TreeviewItem({
          text: ele.app, value: ele.app, collapsed: true, children: this.chilItem
        });
        this.item.push(treeObj);
      })
    }
  }
  onTitleClick(item, flag) {
    if (!flag) {
      this.parentapp = item.value;
      this.parentpro = item.text;
    } else {
      this.parentpro = '';
    }
    let obj = { 'app': this.parentapp, 'process': this.parentpro, 'file_path': '' }
    this.optionalService.selectedAppPrcoessValue.next(obj);
    this.router.navigateByUrl('End_User/Design', { skipLocationChange: true });
  }
}
