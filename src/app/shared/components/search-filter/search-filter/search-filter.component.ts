import { Component, OnInit } from '@angular/core';
import { PrometheusService } from 'src/app/shared/service/prometheus/prometheus.service';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent implements OnInit {

  constructor(private prometheusService: PrometheusService) { }

  ngOnInit(): void {
    this.prometheusService.getLabels().subscribe((labels) => {
      //TODO remove this, temporary log
      console.log("All labels: ");
      console.log(labels);
    });
    //TODO remove this, temporary log
    this.prometheusService.getLabelValues("__name__").subscribe((values) => {
      console.log("All names: ");
      console.log(values);
    });
  }

}
