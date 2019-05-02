import { AppComponent } from '../../../app.component';
import { HomeComponent } from '../../home.component';
import { Globals } from 'src/app/services/globals';

export class dboard_secondary{
  V_BASE_ID: string[] = null;
  V_TXN_STS: string="";
  Order_ID: string=null;
  PRCS_TXN_ID: string=null;
  PRCS_TXN_ID_Rep: string=null;
  SRVC_TXN_ID: string=null;
  SL_APP_CD = "Federal Contracts";
  SL_PRCS_CD="Contract Opportunities";
  SL_SRVC_CD="START";
  SRVC_DATA=[];
  SRVC_CD_Rep='';
  ID_DATA:any;
  APP_ID='';
  PRCS_ID='';
  SRC_ID='';
  SRVC_ID='';
  From: string='';
  To: string='';
  SL_PRC_CD = "";
  showElement= false;
  showNotFound= false;
  showLoading= false;
  showPayloads= true;
  showInput= false;
  showCanvas= false;
  showOutput= false;
  showSLA= false;
  Status_: string[] = [
      'ALL',
      'New',
      'Trigger Received',
      'Bypassed Dependencies Check',
      'Passed Dependencies',
      'Waiting for other branch',
      'Waiting for Approval',
      'Queued',
      'Executing',
      'Completed',
      'Failed',
      'Reduced Job Instance',
      'Added Execution Info for Dependency Check'
    ];
  selectedapp: string=this.app.selected_APPLICATION;
  selectedprcs: string=this.app.selected_PROCESS;
  selectedsrvc: string=this.app.selected_SERVICE;
  selectedusrgp: string='';
  selectedusr: string='';
  selectedstatus: string=null;
  domain_name=this.globals.domain_name; 
  apiUrlGet = "https://"+this.domain_name+"/rest/E_DB/SP?";
  apiUrlAdd = "https://"+this.domain_name+"/rest/E_DB/SP";
  apiFetch = "https://"+this.domain_name+"/rest/E_DB/SP";
  displayedColumns = ['#','Application', 'Process', 'Service', 'Order_ID', 'PTXN_ID', 'STXN_ID', 'TXN_STAT', 'Username', 'Last_updated'];
  displayedCol_Inp = ['Input_name','Input_value'];
  displayedCol_Oup = ['Output_name','Output_value'];
  displayedCol_title1=['Input_Payload'];
  displayedCol_title2=['Output_Payload'];    
  predapp_sl = '';
  succapp_sl: string;
  APP_CD = ['ALL'];
  PRCS_DATA = [];
  PRCS_CD = ['ALL'];
  SRVC_CD = ['ALL'];
  predsvc_sl = '';
  succpro_sl = '';
  predpro_sl = '';
  groups=[];
  constructor(public app:HomeComponent, public globals:Globals){}
  time_to_num(time):any{
      return parseInt(time.substring(0,2))*60+parseInt(time.substring(3,5))+(parseInt(time.substring(6))/60);
    }
  time_to_sec(time):any{
    return parseInt(time.substring(0,2))*3600+parseInt(time.substring(3,5))*60+(parseInt(time.substring(6)));
  }
}