import { StorageSessionService } from '../../../../services/storage-session.service';
import { Globals2 } from 'src/app/service/globals';

export class ReportData{
    private agency:string;
    constructor(private storage:StorageSessionService){
        this.storage.getCookies('report_table')
        this.agency=this.storage.getSession("agency");
    }
    /*
        get agency name
    */
    public getAgency() : string {
        return  this.storage.getCookies('report_table')['SRC_CD'][0];
    }
    /*
        Get Process
    */
    public getApplication() : string{
        return this.storage.getCookies('report_table')['APP_CD'][0];
    }
    /*
        Get Application
    */
    public getProcess() : string  {
        return this.storage.getCookies('report_table')['PRCS_CD'][0];
    }
    /*
    Get service code
    */
    public getService() : string {
        return this.storage.getCookies('report_table')['SRVC_CD'][0];
    }
}

export class ScopeLimiting{
    V_SCOPE_LMTNG_LVL:string;
    V_SCOPE_LMTNG_CD:string;
    url:string;
    constructor(){

    }
    public setUrl(urls:string) : void {
        this.url=urls;
    }
    public getUrl() : string  {
        return "http://ec2-54-84-87-15.compute-1.amazonaws.com/home/ubuntu/apache-tomcat-9.0.0.M26/webapps/"+this.url.split(" ").join("_");
    }

}
