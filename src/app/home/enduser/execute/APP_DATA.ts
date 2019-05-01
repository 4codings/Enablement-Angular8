export interface APP_DATA {
    APP_CD: string;
}

export interface ReportGenerate{
   report:ReportData;
   /*
   Call this method when user click on execute now button
   */
   executeNow() : void ;
   /*
   Call this method when excute now method data and map in 
   ReportData object 
   */
   generateReportTable() : void ;
}
export class ReportData {
    public RESULT: string;
    public V_EXE_CD:string[];
    constructor() {
    }
}