import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { MetricItem } from "./items/MetricItem";
import { HephaestusService } from "../../../service/hephaestus/hephaestus.service";
import { toMetricItem } from "./items/ToMetricItem";
import { PrometheusService } from 'src/app/shared/service/prometheus/prometheus.service';
import {DataProvider} from "../../../service/data-provider";

@Component({
  selector: 'app-hephaestus-table',
  templateUrl: './hephaestus-table.component.html',
  styleUrls: ['./hephaestus-table.component.scss']
})
export class HephaestusTableComponent implements OnInit {

  private selectedLabelsSet: Set<string> = new Set<string>();
  public selectedMetrics: MetricItem[] = [];
  public filterMatchingMetrics: MetricItem[] = [];
  public availableMetrics: MetricItem[] = [];

  constructor(private hephaestusService: HephaestusService, private prometheusService: PrometheusService, private dataProvider: DataProvider) {}

  ngOnInit(): void {
    this.getMetrics();
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
    this.selectedMetrics.push(newMetric);
  }

  private getMetrics() {
    this.prometheusService.getDisplayableMetrics()
      .subscribe(metrics => {
        this.setAvailableList(toMetricItem(metrics));
      });
  }

}
