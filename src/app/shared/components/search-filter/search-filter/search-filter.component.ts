import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith, Subject } from 'rxjs';
import { PrometheusService } from 'src/app/shared/service/prometheus/prometheus.service';
import { ENTER, TAB } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent implements OnInit {

  @ViewChild('filterInput') filterInput!: ElementRef; 

  formControl = new FormControl();
  placeholderText: string = "Choose label";
  separatorKeysCodes: number[] = [ENTER, TAB]; //keys which trigger selecting active option in autocomplete

  options: Subject<string[]> = new Subject(); // autocomplete options (before filtering) as an observable subject
  filteredOptions: Observable<string[]> | null = null;

  allLabels: string[] = []
  activeLabel: string | null = null; // label present inside search bar
  activeValues: string[] | null = null; // possible values for activeLabel

  filters: Map<string, string> = new Map();

  constructor(private prometheusService: PrometheusService) { }

  ngOnInit(): void {
    this.options.asObservable().subscribe((options) => {
      this.filteredOptions = this.formControl.valueChanges.pipe(
        startWith(''),
        map(value => this.filterOptions(options, value)),
      );
    });

    this.prometheusService.getLabels().subscribe((labels) => {
      this.allLabels = labels.data;
      if (!this.activeLabel){
        this.options.next(this.allLabels);
      }
    });
  }

  private filterOptions(options: string[], value: string): string[] {
    if (value) {
      const filterValue = value.toLowerCase();
      options = options.filter(option => option.toLowerCase().includes(filterValue));
      options.sort((a, b) => {
        // if index of somehow turns to bottleneck KMP can be used
        const idA: number = a.indexOf(filterValue);
        const idB: number = b.indexOf(filterValue);
        if (idA == idB) {
          if (a.length == b.length) {
            return a.localeCompare(b);
          } else {
            return a.length - b.length;
          }
        } else {
          return idA - idB;
        }
      })
    }
    
    return options;
  }

  onOptionSelected(choice: string){
    // clear text
    this.filterInput.nativeElement.value = '';
    this.formControl.setValue(null);

    if (!this.activeLabel) {
      // user is inputting a label
      this.activeLabel = choice;
      this.placeholderText = "Choose value";
      
      this.options.next([]);
      this.prometheusService.getLabelValues(choice).subscribe((values) => {
        if (this.activeLabel === choice){
          this.activeValues = values.data;
          this.options.next(this.activeValues); 
        }
      });
    } else {
      //user is inputting a value
      this.filters.set(this.activeLabel, choice);
      this.prometheusService.queryAndDisplay(this.prometheusService.filtersToQuery(this.filters));

      this.activeLabel = null;
      this.placeholderText = "Choose label";
      
      this.options.next(this.allLabels);
    }
  }
  
  onActiveLabelRemoved(label: string){
    this.activeLabel = null;
    this.placeholderText = "Choose label";
    this.options.next(this.allLabels);
  }

  onFilterRemoved(label: string){
    this.filters.delete(label);
    this.prometheusService.queryAndDisplay(this.prometheusService.filtersToQuery(this.filters));
  }

}
