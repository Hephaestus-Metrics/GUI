import {Component, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {MetricItem} from "./MetricItem";
import {HephaestusService} from "../../../service/hephaestus/hephaestus.service";
import {toMetricItem} from "./ToMetricItem";

@Component({
  selector: 'app-hephaestus-table',
  templateUrl: './hephaestus-table.component.html',
  styleUrls: ['./hephaestus-table.component.scss']
})
export class HephaestusTableComponent implements OnInit {

  metrics: any;
  selectedMetrics: MetricItem[] = [];
  availableMetrics: MetricItem[] = [];

  constructor(private hephaestusService: HephaestusService) { }

  ngOnInit(): void {
    this.getMetrics();
  }

  drop(event: CdkDragDrop<MetricItem[]>) {
    console.log(event.container.data);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      //conflict checking alpha ---------------------------------------------
      const newMetric: MetricItem =  event.previousContainer.data[event.previousIndex];
      for (const metric of this.selectedMetrics){
        metric.checkConflict(newMetric);
      }
      // --------------------------------------------------------------------
      transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
      );
    }
  }

  // TODO NOT ANY
  unselectMetric(item: any) {
    let index: number = this.selectedMetrics.indexOf(item);
    while (index !== -1) {
      this.selectedMetrics.splice(index, 1);
      index = this.selectedMetrics.indexOf(item);
    }

    // TODO refresh available metrics
  }

  //todo refresh
  setAvailableList(newList: MetricItem[]) {
    // assumption: S - set of selected metrics
    // === works as .equals
    // for x in newLsit:
    //  if x in S:
    //      remove x from newLsit
  }

  clearSelected(){
    this.selectedMetrics = [];
    //TODO refresh available
  }

  addQuery(){
    //TODO
    console.log('Adding query from filters and looking for conflicts :)');
  }

  private getMetrics() {
    this.metrics = this.hephaestusService.getMetrics()
        .pipe()
        .subscribe(x => {
          this.metrics = x.Data;
          console.log(x.Data);
          // this.labels = x.Data.Labels;
          console.log(this.metrics);
          this.availableMetrics = toMetricItem(this.metrics);
        });
  }

}
