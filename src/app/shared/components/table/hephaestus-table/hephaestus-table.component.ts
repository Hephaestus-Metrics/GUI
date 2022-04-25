import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { MetricItem } from "./items/MetricItem";
import { HephaestusService } from "../../../service/hephaestus/hephaestus.service";
import { toMetricItem } from "./items/ToMetricItem";
import { PrometheusService } from 'src/app/shared/service/prometheus/prometheus.service';
import {DataProvider} from "../../../service/data-provider";
import {Observable} from "rxjs";

@Component({
  selector: 'app-hephaestus-table',
  templateUrl: './hephaestus-table.component.html',
  styleUrls: ['./hephaestus-table.component.scss']
})
export class HephaestusTableComponent implements OnInit {

  private selectedLabelsSet: Set<string> = new Set<string>();
  public selectedMetrics: MetricItem[] = [];
  public availableMetrics: MetricItem[] = [];

  private napis: string = "";

  private filters: Map<string, string> = new Map();


  constructor(private hephaestusService: HephaestusService, private prometheusService: PrometheusService, private dataProvider: DataProvider) {
    this.napis = this.dataProvider.getNapis();
    this.filters = this.dataProvider.getFilters();
  }

  ngOnInit(): void {
    this.getMetrics();
    console.log(this.filters);
  }

  drop(event: CdkDragDrop<MetricItem[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const newMetric: MetricItem = event.previousContainer.data[event.previousIndex];
      for (const metric of this.selectedMetrics) {
        metric.checkConflict(newMetric);
      }
      this.selectedLabelsSet.add(JSON.stringify(Array.from(newMetric.labels.entries())));
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
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
    // todo refresh available metrics
  }

  setAvailableList(newList: MetricItem[]) {
    const res: MetricItem[] = [];
    newList.forEach((metric) => {
      if (!this.selectedLabelsSet.has(JSON.stringify(Array.from(metric.labels.entries())))) {
        res.push(metric);
      }
    });
    this.availableMetrics = res;
  }

  clearSelected() {
    this.selectedMetrics = [];
    this.selectedLabelsSet = new Set<string>();
    // todo refresh available
  }

  addQuery() {
    //TODO
    console.log('Adding query from filters and looking for conflicts :)');
  }

  private getMetrics() {
    this.prometheusService.getDisplayableMetrics()
      .subscribe(metrics => {
        this.setAvailableList(toMetricItem(metrics));
      });
  }

}
