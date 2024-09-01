import { TestBed } from '@angular/core/testing';

import { TalukaService } from './taluka.service';

describe('TalukaService', () => {
  let service: TalukaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TalukaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
