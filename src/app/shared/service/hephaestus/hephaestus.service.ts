import { Injectable } from '@angular/core';
import {ExampleMetricDataDto} from "../../../response-data-dto/ExampleMetricDataDto";
import {Observable} from "rxjs";
import {BaseService} from "../base-service";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class HephaestusService extends BaseService{

  private metricUrl: string = '/metrics';

  constructor(http: HttpClient) {
    super(http);
  }

  public getMetrics(): Observable<ExampleMetricDataDto> {
    return this.get(this.metricUrl);
  }
}
