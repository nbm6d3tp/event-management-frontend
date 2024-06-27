import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddEventComponent } from './modal-add-event.component';

describe('ModalAddEventComponent', () => {
  let component: ModalAddEventComponent;
  let fixture: ComponentFixture<ModalAddEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalAddEventComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalAddEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
