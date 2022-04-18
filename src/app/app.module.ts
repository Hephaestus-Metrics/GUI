import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MatSliderModule} from "@angular/material/slider";
import {MatSelectModule} from "@angular/material/select";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatRadioModule} from "@angular/material/radio";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatButtonModule} from "@angular/material/button";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { HephaestusTableComponent } from './shared/components/table/hephaestus-table/hephaestus-table.component';
import { MainViewComponent } from './main/main-view/main-view.component';
import { AdvancedViewComponent } from './advanced/advanced-view/advanced-view.component';
import { FooterComponent } from './shared/components/footer/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header/header.component';
import { SearchFilterComponent } from './shared/components/search-filter/search-filter/search-filter.component';
import { ChosenMetricComponent } from './shared/components/table/choosen-metric/chosen-metric/chosen-metric.component';
import { MetricComponent } from './shared/components/table/metric/metric/metric.component';

@NgModule({
  declarations: [
    AppComponent,
    HephaestusTableComponent,
    MainViewComponent,
    AdvancedViewComponent,
    FooterComponent,
    HeaderComponent,
    SearchFilterComponent,
    ChosenMetricComponent,
    MetricComponent
  ],
  imports: [
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
