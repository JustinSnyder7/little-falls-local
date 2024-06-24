import { TestBed } from '@angular/core/testing';

import { OsDetectionService } from './os-detection.service';

describe('OsDetectionService', () => {
  let service: OsDetectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OsDetectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
