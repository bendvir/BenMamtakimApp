import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TalkWithUsComponent } from './talk-with-us.component';

describe('TalkWithUsComponent', () => {
  let component: TalkWithUsComponent;
  let fixture: ComponentFixture<TalkWithUsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TalkWithUsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TalkWithUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
