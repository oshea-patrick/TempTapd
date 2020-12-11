import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnedBreweriesComponent } from './owned-breweries.component';

describe('OwnedBreweriesComponent', () => {
  let component: OwnedBreweriesComponent;
  let fixture: ComponentFixture<OwnedBreweriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnedBreweriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnedBreweriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
