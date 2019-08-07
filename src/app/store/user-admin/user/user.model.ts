export interface User {
  V_REVALIDED: string;
  V_STS: string;
  V_USR_DSC: string;
  V_USR_GRP_ID: Array<any>;
  V_USR_ID: string;
  V_USR_NM: string;
  V_IS_PRIMARY: ('Y' | 'N')[];
  id: string;
  is_selected: boolean;
  is_selected_usr_grp: boolean;
}
