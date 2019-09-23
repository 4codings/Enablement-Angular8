import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Globals } from '../../../services/globals';

@Component({
  selector: 'app-change-image',
  templateUrl: './change-image.component.html',
  styleUrls: ['./change-image.component.scss']
})
export class ChangeImageComponent implements OnInit {
  
  public selectedFile:File;
  V_SRC_CD;
  V_USR_NM;
  domain_name=this.globals.domain;
  private apiUrlPost = "https://"+this.domain_name+"/FileAPIs/api/file/v1/upload";

  constructor(public dialogRef: MatDialogRef<ChangeImageComponent>,  @Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient, private globals:Globals) { }

  ngOnInit() {
    this.V_SRC_CD=JSON.parse(sessionStorage.getItem('u')).SRC_CD;
    this.V_USR_NM=JSON.parse(sessionStorage.getItem('u')).USR_NM;
  }
  
  onBtnCancelClick(): void {
    this.dialogRef.close();
  }

  uploadBtnClick() {
    if(this.data.name == 'profile-pic') {
      let fd = new FormData();
      let file: any = {};
      file['File_Path'] =  '/opt/tomcat/webapps/'+ this.V_SRC_CD + '/' + this.V_USR_NM;
      file['File_Name'] = 'user';
      fd.append('Source_File', this.selectedFile.name);
      fd.append('FileInfo', JSON.stringify(file));

      this.http.post(this.apiUrlPost, fd).subscribe(res => {
        this.dialogRef.close();
      })
    }

    if(this.data.name == 'logo') {
      let fd = new FormData();
      let file: any = {};
      file['File_Path'] =  '/opt/tomcat/webapps/'+ this.V_SRC_CD;
      file['File_Name'] = 'logo';
      fd.append('Source_File', this.selectedFile.name);
      fd.append('FileInfo', JSON.stringify(file));
      this.http.post(this.apiUrlPost, fd).subscribe(res => {
        this.dialogRef.close();
      })
    }
  }

  onFileSelectEvent(event) {
    this.selectedFile = event.target.files[0];
  }
}
