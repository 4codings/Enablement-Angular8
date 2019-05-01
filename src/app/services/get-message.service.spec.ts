import { TestBed, inject } from '@angular/core/testing';

import { GetMessageService } from './get-message.service';

describe('GetMessageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetMessageService]
    });
  });

  it('should be created', inject([GetMessageService], (service: GetMessageService) => {
    expect(service).toBeTruthy();
  }));
});
