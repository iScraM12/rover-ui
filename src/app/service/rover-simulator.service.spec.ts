/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RoverSimulatorService } from './rover-simulator.service';

describe('Service: RoverSimulator', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoverSimulatorService]
    });
  });

  it('should ...', inject([RoverSimulatorService], (service: RoverSimulatorService) => {
    expect(service).toBeTruthy();
  }));
});
