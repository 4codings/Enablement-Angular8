import { TestBed } from '@angular/core/testing';

import { SystemAdminOverviewService } from './system-admin-overview.service';

describe('SystemAdminOverviewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SystemAdminOverviewService = TestBed.get(SystemAdminOverviewService);
    expect(service).toBeTruthy();
  });
});
