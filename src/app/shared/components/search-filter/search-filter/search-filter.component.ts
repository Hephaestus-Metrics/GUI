import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  filteredOptions: Observable<string[]>|undefined;

  allLabels: string[] = []
  activeLabel: string|undefined; // label present inside search bar
  activeValues: string[]|undefined; // possible values for activeLabel

  filters: Map<string, string> = new Map()

  private _filter(options: string[], value: string): string[] {
    if (value){
      const filterValue = value.toLowerCase();

      // TODO improve this filter to sort by best match
      return options.filter(option => option.toLowerCase().includes(filterValue));
    } else {
      return options;
    }
  }

  constructor(private prometheusService: PrometheusService) { }

  ngOnInit(): void {
    this.options.asObservable().subscribe((options) => {
      this.filteredOptions = this.formControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(options, value)),
      );
    });

    this.prometheusService.getLabels().subscribe((labels) => {
      this.allLabels = labels.data;
      if (!this.activeLabel){
        this.options.next(this.allLabels);
      }
    });
  }

  onOptionSelected(choice: string){
    // clear text
    this.filterInput.nativeElement.value = ''
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

      this.activeLabel = undefined;
      this.placeholderText = "Choose label";
      
      this.options.next(this.allLabels);
    }
  }
  
  onActiveLabelRemoved(label: string){
    this.activeLabel = undefined;
    this.placeholderText = "Choose label";
    this.options.next(this.allLabels);
  }

  onFilterRemoved(label: string){
    this.filters.delete(label);
  }

}
