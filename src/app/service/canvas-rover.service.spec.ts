/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CanvasRoverService } from './canvas-rover.service';

describe('Service: CanvasRover', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanvasRoverService]
    });
  });

  it('should ...', inject([CanvasRoverService], (service: CanvasRoverService) => {
    expect(service).toBeTruthy();
  }));
});
