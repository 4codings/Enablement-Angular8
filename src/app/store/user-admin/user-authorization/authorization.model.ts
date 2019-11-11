export interface AuthorizationData {
    'V_AUTH_CD': string;
    'V_AUTH_TYP': string;
    'V_SRC_CD': string;
    'V_APP_CD': string;
    'V_PRCS_CD': string;
    'V_EXE_TYP': string;
    'V_USR_GRP_CD': string;
    'V_READ': string;
    'V_UPDATE': string;
    'V_DELETE': string;
    'V_CREATE': string;
    'V_EXECUTE': string;
    'V_USR_NM': string;
    'V_COMMNT': string;
    'V_AUTH_ID': string;
    'V_ROLE_ID': Array<any>;
    'V_SRVC_CD': string | null;
    'V_SLA_CD': string | null;
    'AUTH_ID': number;
    'APP_ID': number;
    'ROLE_ID': string;
    'V_AUTH_DSC': string;
    'V_ARTFCT_TYP': string | null;
    'V_ARTFCT_NM': string | null;
    'V_PLATFORM_CD': string | null;
    'V_SERVER_CD': string | null;
    'V_EXE_CD': string | null;
    'id': number;
    'V_AUTH_FLD': number;
    'is_selected': boolean;
    'is_selected_role': boolean;
}

// export interface AuthorizationData {
//     'AUTH_ID': number;
//     'READ': string;
//     'APP_ID': number;
//     'EXECUTE': string;
//     'DELETE': string;
//     'CREATE': string;
//     'ROLE_ID': string;
//     'AUTH_CD': string;
//     'AUTH_DSC': string;
//     'UPDATE': string;
//     'id': number;
//     'AUTH_FLD': number;
//     'is_selected': boolean;
//     'is_selected_role': boolean;
// }
