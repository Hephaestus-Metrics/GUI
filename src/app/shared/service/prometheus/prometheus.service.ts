import { Injectable } from '@angular/core';
import {BaseService} from "../base-service";
import {HttpClient} from "@angular/common/http";
import { Observable, mergeMap } from 'rxjs';
import { ListResponse } from '../../models/reponse/ListResponse.model';

@Injectable({
  providedIn: 'root'
})
export class PrometheusService extends BaseService {

  private readonly addressUrl: string = "/prometheus/address";
  private readonly prometheusUrl: Observable<string>;

  constructor(http: HttpClient) {
    super(http);
    this.prometheusUrl = this.get(this.addressUrl);
  }

  public getLabels(): Observable<ListResponse> {
    return this.prometheusUrl.pipe(mergeMap( 
      (url) => this.http.get<ListResponse>(url + "/api/v1/labels")
    ));
  }

  public getLabelValues(label: string): Observable<ListResponse> {
    return this.prometheusUrl.pipe(mergeMap( 
      (url) => this.http.get<ListResponse>(url + "/api/v1/label/" + label + "/values")
    ));
  }

}
