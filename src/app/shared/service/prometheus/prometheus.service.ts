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

  private readonly displayedQueryResult: Subject<Array<Metric>> = new Subject();

  constructor(http: HttpClient) {
    super(http);
  }

  public getDisplayableMetrics(): Observable<Array<Metric>> {
    return this.displayedQueryResult.asObservable();
  }

  public getLabels(): Observable<ListResponse> {
    return this.get<ListResponse>("/prometheus/labels");
  }

  public getLabelValues(label: string): Observable<ListResponse> {
    return this.get<ListResponse>("/prometheus/values?label=" + encodeURIComponent(label));
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

  private queryResponseToMetrics(response: QueryResponse): Array<Metric> {
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
  }

  public query(query: string): Observable<Array<Metric>> {
    return this.post<QueryResponse>("/prometheus/query", query).pipe(
      map(this.queryResponseToMetrics)
    );
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
