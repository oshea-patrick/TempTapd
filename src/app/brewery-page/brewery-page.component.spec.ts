import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreweryPageComponent } from './brewery-page.component';

describe('BreweryPageComponent', () => {
  let component: BreweryPageComponent;
  let fixture: ComponentFixture<BreweryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BreweryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreweryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
