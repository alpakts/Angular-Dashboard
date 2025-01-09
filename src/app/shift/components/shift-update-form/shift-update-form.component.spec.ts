import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftUpdateFormComponent } from './shift-update-form.component';

describe('ShiftUpdateFormComponent', () => {
  let component: ShiftUpdateFormComponent;
  let fixture: ComponentFixture<ShiftUpdateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftUpdateFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftUpdateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
