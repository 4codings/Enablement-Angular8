import { TestBed } from '@angular/core/testing';

import { StorageSessionService } from './storage-session.service';

describe('StorageSessionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StorageSessionService = TestBed.get(StorageSessionService);
    expect(service).toBeTruthy();
  });
});
