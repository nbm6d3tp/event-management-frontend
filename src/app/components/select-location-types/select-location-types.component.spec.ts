import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectLocationTypesComponent } from './select-location-types.component';

describe('SelectLocationTypesComponent', () => {
  let component: SelectLocationTypesComponent;
  let fixture: ComponentFixture<SelectLocationTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectLocationTypesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectLocationTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
