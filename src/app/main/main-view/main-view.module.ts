import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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
import {HephaestusService} from "../../shared/service/hephaestus/hephaestus.service";
import {MainViewComponent} from "./main-view.component";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    MainViewComponent
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
    HttpClientModule
  ],
  providers: [HephaestusService],
  exports: [
    MainViewComponent
  ],
  bootstrap: []
})
export class MainViewModule { }
