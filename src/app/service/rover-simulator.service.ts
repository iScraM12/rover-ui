import { Coordinate } from './../model/coordinate';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EndpointConfigurationService } from './endpoint-configuration.service';
import { flatMap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RoverSimulatorService {
  constructor(
    private http: HttpClient,
    private endpointConfigurationService: EndpointConfigurationService
  ) {}

  public simulateCommand(
    command: string,
    currentCoordinate: Coordinate
  ): Observable<Coordinate> {
    return this.endpointConfigurationService.getConfig().pipe(
      switchMap((config) => {
        return this.http.post<Coordinate>(
          config.roverServiceEndpoint + '/rover/' + command,
          currentCoordinate
        );
      })
    );
  }
}
