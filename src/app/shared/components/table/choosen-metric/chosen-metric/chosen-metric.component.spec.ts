import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChosenMetricComponent } from './chosen-metric.component';

describe('ChosenMetricComponent', () => {
  let component: ChosenMetricComponent;
  let fixture: ComponentFixture<ChosenMetricComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChosenMetricComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChosenMetricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
