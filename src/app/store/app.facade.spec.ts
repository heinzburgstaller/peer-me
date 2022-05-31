import { TestBed } from '@angular/core/testing';
import { AppFacade } from './app.facade';

describe(AppFacade.name, () => {
  let service: AppFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppFacade);
  });

  it('should be created', () => {
    expect(service)
      .toBeTruthy();
  });
});
