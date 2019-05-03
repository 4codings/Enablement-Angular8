import { TestBed, inject } from '@angular/core/testing';

import { UseradminService } from './useradmin.service';

describe('UseradminService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UseradminService]
    });
  });

  it('should be created', inject([UseradminService], (service: UseradminService) => {
    expect(service).toBeTruthy();
  }));
});
