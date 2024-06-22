import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectEventTypesComponent } from './select-event-types.component';

describe('SelectEventTypesComponent', () => {
  let component: SelectEventTypesComponent;
  let fixture: ComponentFixture<SelectEventTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectEventTypesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectEventTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
