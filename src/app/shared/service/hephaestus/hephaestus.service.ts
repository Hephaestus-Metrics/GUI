import { Injectable } from '@angular/core';
import {BaseService} from "../base-service";
import {HttpClient} from "@angular/common/http";
import { Filters } from '../../models/metrics/filters.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HephaestusService extends BaseService {

  private saveMetricUrl: string = '/hephaestus/metrics/save';

  //todo change to actual link from config
  private savedMetricUrl: string = 'http://localhost:8080/hephaestus/metrics/saved/';

  constructor(http: HttpClient) {
    super(http);
  }

  public saveMetrics(metrics: {}) { // todo add type
    //todo REFACTOR !!! KS
    return this.put(this.saveMetricUrl, metrics);
  }

  public getSavedMetrics(): Observable<any[]>{
    return this.http.get<any[]>(this.savedMetricUrl);
  }

}
