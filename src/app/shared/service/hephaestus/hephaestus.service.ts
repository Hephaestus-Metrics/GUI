import { Injectable } from '@angular/core';
import {BaseService} from "../base-service";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class HephaestusService extends BaseService {

  private saveMetricUrl: string = '/hephaestus/metrics/save';

  constructor(http: HttpClient) {
    super(http);
  }

  public saveMetrics(metrics: {}) { // todo add type
    //todo REFACTOR !!! KS
    return this.put(this.saveMetricUrl, metrics);
  }

}
