import { Injectable } from '@angular/core';
import {BaseService} from "../base-service";
import {HttpClient} from "@angular/common/http";
import { Observable, mergeMap, map, Subject } from 'rxjs';
import { ListResponse } from '../../models/reponse/ListResponse.model';
import { Metric } from '../../models/metrics/Metric';
import { QueryResponse } from '../../models/reponse/QueryResponse.model';

@Injectable({
  providedIn: 'root'
})
export class PrometheusService extends BaseService {

  private readonly addressUrl: string = "/prometheus/address";
  private readonly prometheusUrl: Observable<string>;

  private readonly displayedQueryResult: Subject<Array<Metric>> = new Subject();

  constructor(http: HttpClient) {
    super(http);
    this.prometheusUrl = this.get(this.addressUrl);
  }

  public getDisplayableMetrics(): Observable<Array<Metric>> {
    return this.displayedQueryResult.asObservable();
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

  public filtersToQuery(filters: Map<string, string>): string|null {
    if (filters.size == 0) {
      // no filters, query can't be constructed
      return null;
    } else {
      let query = "{";
      for (let entry of filters.entries()){
        query += entry[0] + "=\"" + entry[1] + "\",";
      }
      query += "}";
      return query;
    }
  }

  public query(query: string): Observable<Array<Metric>> {
    return this.prometheusUrl.pipe(
      mergeMap((url) => this.http.get<QueryResponse>(url + "/api/v1/query?query=" + query)),
      map((response) => {
        const result = []
        for (let metric of response.data.result) {
          const name: string = metric.metric["__name__"];
          const labels: Map<string, string> = new Map();
          for (let label in metric.metric) {
            labels.set(label, metric.metric[label]);
          }
          const resultMetric: Metric = { name, labels };
          result.push(resultMetric);
          console.log(resultMetric);
        }
        return result;
      })
    )
  }

  public queryAndDisplay(query: string|null) {
    if (!query){
      // null query, display no result
      this.displayedQueryResult.next([]);
    } else {
      this.query(query).subscribe((metrics) => {
        this.displayedQueryResult.next(metrics);
      });
    }
  }

}
