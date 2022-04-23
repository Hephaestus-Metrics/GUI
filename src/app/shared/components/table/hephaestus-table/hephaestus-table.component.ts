import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { MetricItem } from "./items/MetricItem";
import { HephaestusService } from "../../../service/hephaestus/hephaestus.service";
import { toMetricItem } from "./items/ToMetricItem";
import { PrometheusService } from 'src/app/shared/service/prometheus/prometheus.service';

@Component({
  selector: 'app-hephaestus-table',
  templateUrl: './hephaestus-table.component.html',
  styleUrls: ['./hephaestus-table.component.scss']
})
export class HephaestusTableComponent implements OnInit {

  private selectedLabelsSet: Set<Map<string, string>> = new Set <Map<string, string>>();
  public selectedMetrics: MetricItem[] = [];
  public availableMetrics: MetricItem[] = [];

  constructor(private hephaestusService: HephaestusService, private prometheusService: PrometheusService) { }

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
      this.selectedLabelsSet.add(newMetric.labels);
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
    this.selectedLabelsSet.delete(item.labels);
    item.delete();
    // todo refresh available metrics
  }

  setAvailableList(newList: MetricItem[]) {
    newList.filter((metric) => {!this.selectedLabelsSet.has(metric.labels)});
    this.availableMetrics = newList;
  }

  clearSelected() {
    this.selectedMetrics = [];
    this.selectedLabelsSet =new Set <Map<string, string>>(); 
    // todo refresh available
  }

  addQuery() {
    //TODO
    console.log('Adding query from filters and looking for conflicts :)');
  }

  private getMetrics() {
    this.prometheusService.getDisplayableMetrics()
      .subscribe(metrics => {
        console.log(toMetricItem(metrics))
        this.setAvailableList(toMetricItem(metrics));
      });
  }

}
