import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBreweryFormComponent } from './create-brewery-form.component';

describe('CreateBreweryFormComponent', () => {
  let component: CreateBreweryFormComponent;
  let fixture: ComponentFixture<CreateBreweryFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBreweryFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBreweryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
