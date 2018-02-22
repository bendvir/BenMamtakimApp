import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducsComponent } from './producs.component';

describe('ProducsComponent', () => {
  let component: ProducsComponent;
  let fixture: ComponentFixture<ProducsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProducsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProducsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
