import { CanvasRoverService } from 'src/app/service/canvas-rover.service';
import { CoordinateCanvasConversionService } from './coordinate-canvas-conversion.service';
import { EndpointConfigurationService } from './endpoint-configuration.service';
import { RoverSimulatorService } from './rover-simulator.service';

export const SERVICES = [
  CanvasRoverService,
  CoordinateCanvasConversionService,
  EndpointConfigurationService,
  RoverSimulatorService,
];
