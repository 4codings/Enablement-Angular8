import { TestBed, inject } from '@angular/core/testing';

import { RollserviceService } from './rollservice.service';

describe('RollserviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RollserviceService]
    });
  });

  it('should be created', inject([RollserviceService], (service: RollserviceService) => {
    expect(service).toBeTruthy();
  }));
});
