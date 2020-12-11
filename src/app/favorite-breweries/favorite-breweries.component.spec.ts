import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteBreweriesComponent } from './favorite-breweries.component';

describe('FavoriteBreweriesComponent', () => {
  let component: FavoriteBreweriesComponent;
  let fixture: ComponentFixture<FavoriteBreweriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoriteBreweriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteBreweriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
