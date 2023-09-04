import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Configuration } from '../model/configuration';
import { Observable, ReplaySubject } from 'rxjs';
import { retry, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EndpointConfigurationService {
  configUrl = 'assets/json/config.json';

  cache = new ReplaySubject<Configuration>(1);

  constructor(private http: HttpClient) {
    this.loadConfiguration();
  }

  public getConfig(): Observable<Configuration> {
    return this.cache.asObservable();
  }

  public updateCache(): void {
    this.loadConfiguration();
  }

  private loadConfiguration() {
    this.http
      .get<Configuration>(this.configUrl)
      .pipe(retry(3), take(1))
      .subscribe((configuration) => this.cache.next(configuration));
  }
}
