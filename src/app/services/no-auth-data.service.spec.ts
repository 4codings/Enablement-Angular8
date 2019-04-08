import { TestBed } from '@angular/core/testing';

import { NoAuthDataService } from './no-auth-data.service';

describe('NoAuthDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NoAuthDataService = TestBed.get(NoAuthDataService);
    expect(service).toBeTruthy();
  });
});
