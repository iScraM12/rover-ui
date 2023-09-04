/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EndpointConfigurationService } from './endpoint-configuration.service';

describe('Service: EndpointConfiguration', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EndpointConfigurationService]
    });
  });

  it('should ...', inject([EndpointConfigurationService], (service: EndpointConfigurationService) => {
    expect(service).toBeTruthy();
  }));
});
