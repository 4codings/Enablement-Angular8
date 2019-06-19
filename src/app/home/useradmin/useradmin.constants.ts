export const userStatusConstants = {
  ACTIVE: 'ACTIVE',
  TERMINATED: 'TERMINATED',
  VACATION: 'VACATION',
  LEAVE: 'LEAVE',
  UNAVAILABLE: 'UNAVAILABLE',
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
  {key: authorizationTypeConstants.PROCESS, label: 'Process'},
  {key: authorizationTypeConstants.SERVICE, label: 'Service'},
  {key: authorizationTypeConstants.EXE, label: 'Exe'},
  {key: authorizationTypeConstants.ARTIFACT, label: 'Artifact'},
  {key: authorizationTypeConstants.PLATFORM, label: 'Platform'},
  {key: authorizationTypeConstants.SERVER, label: 'Server'},
  {key: authorizationTypeConstants.SLA, label: 'SLA'},
];

export const groupTypeConstant = {
  SCREEN: 'SCREEN',
  PROFILE: 'PROFILE',
  CUSTOM: 'CUSTOM',
};

export const groupTypeOptions: {key: string, label: string}[] = [
  {key: '', label: 'ALL'},
  {key: groupTypeConstant.SCREEN, label: 'Screen'},
  {key: groupTypeConstant.PROFILE, label: 'Profile'},
  {key: groupTypeConstant.CUSTOM, label: 'Custom'}
];


