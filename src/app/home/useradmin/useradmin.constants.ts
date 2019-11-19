export const userStatusConstants = {
  ACTIVE: 'ACTIVE',
  TERMINATED: 'TERMINATED',
  VACATION: 'VACATION',
  LEAVE: 'LEAVE',
  UNAVAILABLE: 'UNAVAILABLE',
};

export const userStatusOptions: { key: string, label: string }[] = [
  { key: userStatusConstants.ACTIVE, label: 'Active' },
  { key: userStatusConstants.TERMINATED, label: 'Terminated' },
  { key: userStatusConstants.VACATION, label: 'Vacation' },
  { key: userStatusConstants.LEAVE, label: 'Leave' },
  { key: userStatusConstants.UNAVAILABLE, label: 'Unavailable' },
];

export const authorizationTypeConstants = {
  PROCESS: 'PROCESS',
  SERVICE: 'SERVICE',
  EXE: 'EXE',
  ARTIFACT: 'ARTIFACT',
  PLATFORM: 'PLATFORM',
  SERVER: 'SERVER',
  // SLA: 'SLA'
};

export const authorizationTypeOptions: { key: string, label: string }[] = [
  // { key: '', label: 'ALL' },
  { key: authorizationTypeConstants.PROCESS, label: 'Process' },
  { key: authorizationTypeConstants.SERVICE, label: 'Service' },
  { key: authorizationTypeConstants.EXE, label: 'Exe' },
  { key: authorizationTypeConstants.ARTIFACT, label: 'Artifact' },
  { key: authorizationTypeConstants.PLATFORM, label: 'Platform' },
  { key: authorizationTypeConstants.SERVER, label: 'Server' },
  // { key: authorizationTypeConstants.SLA, label: 'SLA' },
];

export const groupTypeConstant = {
  // SCREEN: 'SCREEN',
  // PROFILE: 'PROFILE',
  CUSTOM: 'CUSTOM',
  WORKFLOW: 'WORKFLOW',
  ADMINISTRATOR: 'ADMINISTRATOR',
  SYSTEM: 'SYSTEM'
};

export const groupTypeOptions: { key: string, label: string }[] = [
  // { key: '', label: 'All Groups' },
  // {key: groupTypeConstant.SCREEN, label: 'Feature'},
  // {key: groupTypeConstant.PROFILE, label: 'Profile'},
  { key: groupTypeConstant.CUSTOM, label: 'Customer Specific Administration' },
  // { key: groupTypeConstant.WORKFLOW, label: 'Workflow Administration' },
  // { key: groupTypeConstant.ADMINISTRATOR, label: 'User Administration' },
  // { key: groupTypeConstant.SYSTEM, label: 'IT Infrastructure Administration' }
];
export const groupList: { key: string, label: string }[] = [
  { key: groupTypeConstant.WORKFLOW, label: 'Workflow Administration' },
  { key: groupTypeConstant.ADMINISTRATOR, label: 'User Administration' },
  { key: groupTypeConstant.SYSTEM, label: 'IT Infrastructure Administration' }
];

export const groupNameList: { group: string, key: string, label: string, groupId: any, icon: any }[] = [
  { group: groupTypeConstant.SYSTEM, key: 'Connection', label: 'Enablement System Admin Connection Group', groupId: '', icon: '' },
  { group: groupTypeConstant.SYSTEM, key: 'Deployment', label: 'Enablement System Admin Deployment Group', groupId: '', icon: '' },
  { group: groupTypeConstant.SYSTEM, key: 'Install', label: 'Enablement System Admin Install Group', groupId: '', icon: '' },
  { group: groupTypeConstant.SYSTEM, key: 'Machine Connection', label: 'Enablement System Admin Machine Connection Group', groupId: '', icon: '' },
  { group: groupTypeConstant.SYSTEM, key: 'Machine', label: 'Enablement System Admin Machine Group', groupId: '', icon: '' },
  { group: groupTypeConstant.SYSTEM, key: 'Platform', label: 'Enablement System Admin Platform Group', groupId: '', icon: '' },
  { group: groupTypeConstant.SYSTEM, key: 'Status', label: 'Enablement System Admin Status Group', groupId: '', icon: '' },
  { group: groupTypeConstant.ADMINISTRATOR, key: 'Assign Roles', label: 'Enablement User Admin Assign Roles Group', groupId: '', icon: '' },
  { group: groupTypeConstant.ADMINISTRATOR, key: 'Auth', label: 'Enablement User Admin Auth Group', groupId: '', icon: '' },
  { group: groupTypeConstant.ADMINISTRATOR, key: 'Authorize Roles', label: 'Enablement User Admin Authorize Roles Group', groupId: '', icon: '' },
  { group: groupTypeConstant.ADMINISTRATOR, key: 'Group', label: 'Enablement User Admin Group Group', groupId: '', icon: '' },
  { group: groupTypeConstant.ADMINISTRATOR, key: 'Membership', label: 'Enablement User Admin Membership Group', groupId: '', icon: '' },
  { group: groupTypeConstant.ADMINISTRATOR, key: 'Organization', label: 'Enablement User Admin Organization Group', groupId: '', icon: '' },
  { group: groupTypeConstant.ADMINISTRATOR, key: 'Role', label: 'Enablement User Admin Role Group', groupId: '', icon: '' },
  { group: groupTypeConstant.ADMINISTRATOR, key: 'User', label: 'Enablement User Admin User Group', groupId: '', icon: '' },
  { group: groupTypeConstant.WORKFLOW, key: 'Dashboard', label: 'Enablement Workflow Dashboard Group', groupId: '', icon: 'dashboard' },
  { group: groupTypeConstant.WORKFLOW, key: 'Download', label: 'Enablement Workflow Download Group', groupId: '', icon: 'insert_photo' },
  { group: groupTypeConstant.WORKFLOW, key: 'Exception', label: 'Enablement Workflow Exception Group', groupId: '', icon: 'bug_report' },
  { group: groupTypeConstant.WORKFLOW, key: 'Execute', label: 'Enablement Workflow Execute Group', groupId: '', icon: 'launch' },
  { group: groupTypeConstant.WORKFLOW, key: 'MyTask', label: 'Enablement Workflow MyTask Group', groupId: '', icon: 'check_circle' },
  { group: groupTypeConstant.WORKFLOW, key: 'Process', label: 'Enablement Workflow Process Group', groupId: '', icon: 'build' },
  { group: groupTypeConstant.WORKFLOW, key: 'Schedule', label: 'Enablement Workflow Schedule Group', groupId: '', icon: 'schedule' },
];

