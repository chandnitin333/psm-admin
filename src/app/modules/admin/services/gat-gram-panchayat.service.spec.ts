import { TestBed } from '@angular/core/testing';

import { GatGramPanchayatService } from './gat-gram-panchayat.service';

describe('GatGramPanchayatService', () => {
  let service: GatGramPanchayatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GatGramPanchayatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
