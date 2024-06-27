import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetailEventComponent } from './modal-detail-event.component';

describe('ModalDetailEventComponent', () => {
  let component: ModalDetailEventComponent;
  let fixture: ComponentFixture<ModalDetailEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalDetailEventComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalDetailEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
