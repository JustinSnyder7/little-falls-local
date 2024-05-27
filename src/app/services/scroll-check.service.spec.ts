import { TestBed } from '@angular/core/testing';

import { ScrollCheckService } from './scroll-check.service';

describe('ScrollCheckService', () => {
  let service: ScrollCheckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrollCheckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
