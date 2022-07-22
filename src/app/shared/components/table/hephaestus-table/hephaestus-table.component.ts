import { Component, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { MetricItem } from "./items/MetricItem";
import { HephaestusService } from "../../../service/hephaestus/hephaestus.service";
import { toMetricItem } from "./items/ToMetricItem";
import { PrometheusService } from 'src/app/shared/service/prometheus/prometheus.service';
import { DataProvider } from "../../../service/data-provider";
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MetricsAdapterService } from "../../../service/metrics-adapter/metrics-adapter.service";
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-hephaestus-table',
  templateUrl: './hephaestus-table.component.html',
  styleUrls: ['./hephaestus-table.component.scss']
})
export class HephaestusTableComponent implements OnInit {

  private selectedLabelsSet: Set<string> = new Set<string>();
  public selectedMetrics: MetricItem[] = [];
  private filterMatchingMetrics: MetricItem[] = [];
  public availableMetrics: MetricItem[] = [];
  @ViewChild('selectedTableScrollbar', {read: CdkScrollable}) 
  private selectedScrollBar: CdkScrollable =  {} as CdkScrollable;
  @ViewChild('availableTableScrollbar', {read: CdkScrollable}) 
  private availableScrollBar: CdkScrollable =  {} as CdkScrollable;
  public availableMetricsPageIndex: number = 0;
  public availableMetricsPageSize: number = 10;
  public selectedMetricsPageIndex: number = 0;
  public selectedMetricsPageSize: number = 10;

  constructor(
      private hephaestusService: HephaestusService,
      private prometheusService: PrometheusService,
      private dataProvider: DataProvider,
      private metricsAdapterService: MetricsAdapterService) {}

  ngOnInit(): void {
    this.getMetrics();
  }

  itemsInRange(min: number, max: number, source: any[]){
    let res: any[] = [];
    for (let i = min; i < Math.min(max, source.length); i++){
      res.push(source[i]);
    }
    return res;
  }

  changeAvailableMetricsPage(event: PageEvent){
    if (this.availableMetricsPageIndex !== event.pageIndex){
      this.availableMetricsPageIndex = event.pageIndex;
      this.availableScrollBar.scrollTo({top: 0});
    }
    if (this.availableMetricsPageSize !== event.pageSize){
      this.availableMetricsPageSize  = event.pageSize;
      // current strategy for size change - go to the beginning of the list
      this.availableMetricsPageIndex = 0;
    }
 }

 changeSelectedMetricsPage(event: PageEvent){
  if (this.selectedMetricsPageIndex !== event.pageIndex){
    this.selectedMetricsPageIndex = event.pageIndex;
    this.selectedScrollBar.scrollTo({top: 0});
  }
  if (this.selectedMetricsPageSize !== event.pageSize){
    this.selectedMetricsPageSize  = event.pageSize;
    // current strategy for size change - go to the beginning of the list
    this.selectedMetricsPageIndex = 0;
  }
}

  drop(event: CdkDragDrop<MetricItem[]>, sourceTableOffset: number, destinationTableOffset: number) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex + destinationTableOffset, event.currentIndex + destinationTableOffset);
    } else {
      const newMetric: MetricItem = event.previousContainer.data[event.previousIndex];
      for (const metric of this.selectedMetrics) {
        metric.checkConflict(newMetric);
      }
      this.selectedLabelsSet.add(JSON.stringify(Array.from(newMetric.labels.entries())));
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex + sourceTableOffset,
        event.currentIndex + destinationTableOffset,
      );
    }
  }

  unselectMetric(item: MetricItem) {
    let index: number = this.selectedMetrics.indexOf(item);
    while (index !== -1) {
      this.selectedMetrics.splice(index, 1);
      index = this.selectedMetrics.indexOf(item);
    }
    this.selectedLabelsSet.delete(JSON.stringify(Array.from(item.labels.entries())));
    item.delete();
    // update list to show unselected metric if it matches filter,
    // can be optimized with binary insertion instead of refreshing
    if (!item.isQuery) {
      this.setAvailableList(this.filterMatchingMetrics);
    }
  }

  setAvailableList(newList: MetricItem[]) {
    const res: MetricItem[] = [];
    newList.forEach((metric) => {
      if (!this.selectedLabelsSet.has(JSON.stringify(Array.from(metric.labels.entries())))) {
        res.push(metric);
      }
    });
    this.filterMatchingMetrics = newList;
    this.availableMetrics = res;
  }

  clearSelected() {
    this.selectedMetrics = [];
    this.selectedLabelsSet = new Set<string>();
    this.availableMetrics = this.filterMatchingMetrics.slice();
  }

  addQuery() {
    const map = new Map(this.dataProvider.getFilters());
    if (map.size === 0){
      return;
    }
    const newMetric = new MetricItem(map, true);
    for (const metric of this.selectedMetrics) {
      metric.checkConflict(newMetric);
    }
    this.selectedLabelsSet.add(JSON.stringify(Array.from(newMetric.labels.entries())));
    this.selectedMetrics.unshift(newMetric);
    this.selectedMetricsPageIndex = 0;
    this.selectedScrollBar.scrollTo({top: 0});
  }

  private getMetrics() {
    this.prometheusService.getDisplayableMetrics()
      .subscribe(metrics => {
        this.setAvailableList(toMetricItem(metrics));
      });
  }

  saveMetrics() {
    //todo
    let metricsArray: string[][] = [];
    console.log(this.selectedMetrics);
    this.selectedMetrics.forEach(metric => {
      let arr = Array.from((metric.labels.entries())).map(pair => pair[0] + ': ' + pair[1]);
      metricsArray.push(arr);
    });
    this.hephaestusService.saveMetrics(metricsArray);
    this.metricsAdapterService.runRules(metricsArray);
  }

}
