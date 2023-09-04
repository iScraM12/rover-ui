/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CoordinateCanvasConversionService } from './coordinate-canvas-conversion.service';

describe('Service: CoordinateCanvasConversion', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoordinateCanvasConversionService]
    });
  });

  it('should ...', inject([CoordinateCanvasConversionService], (service: CoordinateCanvasConversionService) => {
    expect(service).toBeTruthy();
  }));
});
