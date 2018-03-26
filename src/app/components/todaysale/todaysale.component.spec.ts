import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodaysaleComponent } from './todaysale.component';

describe('TodaysaleComponent', () => {
  let component: TodaysaleComponent;
  let fixture: ComponentFixture<TodaysaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodaysaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodaysaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
