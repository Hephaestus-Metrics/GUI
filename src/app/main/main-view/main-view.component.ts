import { Component, OnInit } from '@angular/core';
import {HephaestusService} from "../../shared/service/hephaestus/hephaestus.service";

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss']
})
export class MainViewComponent implements OnInit {

  metrics: any;
  labels: Map<string, string> | undefined;
  visible: boolean = false;

  constructor(private hephaestusService: HephaestusService) { }

  ngOnInit(): void {
  }

  getMetrics() {
    this.metrics = this.hephaestusService.getMetrics()
        .pipe()
        .subscribe(x => {
          this.metrics = x.Data;
          this.labels = x.Data[0].Labels;
        });
  }

}
