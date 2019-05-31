export const userStatusConstants = {
  ACTIVE: 'active',
  TERMINATED: 'terminated',
  VACATION: 'vacation',
  LEAVE: 'leave',
  UNAVAILABLE: 'unavailable',
};

export const userStatusOptions: { key: string, label: string }[] = [
  {key: userStatusConstants.ACTIVE, label: 'Active'},
  {key: userStatusConstants.TERMINATED, label: 'Terminated'},
  {key: userStatusConstants.VACATION, label: 'Vacation'},
  {key: userStatusConstants.LEAVE, label: 'Leave'},
  {key: userStatusConstants.UNAVAILABLE, label: 'Unavailable'},
];

export const authorizationTypeConstants = {
  PROCESS: 'PROCESS',
  SERVICE: 'SERVICE',
  EXE: 'EXE',
  ARTIFACT: 'ARTIFACT',
  PLATFORM: 'PLATFORM',
  SERVER: 'SERVER',
  SLA: 'SLA'
};

export const authorizationTypeOptions: { key: string, label: string }[] = [
  {key: '', label: 'ALL'},
  {key: authorizationTypeConstants.PROCESS, label: 'PROCESS'},
  {key: authorizationTypeConstants.SERVICE, label: 'SERVICE'},
  {key: authorizationTypeConstants.EXE, label: 'EXE'},
  {key: authorizationTypeConstants.ARTIFACT, label: 'ARTIFACT'},
  {key: authorizationTypeConstants.PLATFORM, label: 'PLATFORM'},
  {key: authorizationTypeConstants.SERVER, label: 'SERVER'},
  {key: authorizationTypeConstants.SLA, label: 'SLA'},
];

export const groupTypeConstant = {
  SCREEN: 'SCREEN',
  PROFILE: 'PROFILE',
  CUSTOM: 'CUSTOM',
};

export const groupTypeOptions: {key: string, label: string}[] = [
  {key: '', label: 'ALL'},
  {key: groupTypeConstant.SCREEN, label: 'SCREEN'},
  {key: groupTypeConstant.PROFILE, label: 'PROFILE'},
  {key: groupTypeConstant.CUSTOM, label: 'CUSTOM'}
];


