export interface data{
    APP_CD:string;
    PRCS_CD:string;
    ser_cd_data:string[];
   
    // ======================find process
    CREATE:string[];
    CRON_EXPRESSION:string[];
    DELETE:string[];
    DESCRIPTION:string[];
    EXECUTE:string[];
    JOB_NAME:string[];
    NEXT_FIRE_TIME:string[];
    PREV_FIRE_TIME:string[];
    READ:string[];
    SRVC_CD:string[];
    TRIGGER_STATE:string[];
    UPDATE:string[];

    // ==================================
}