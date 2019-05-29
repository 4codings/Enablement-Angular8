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

