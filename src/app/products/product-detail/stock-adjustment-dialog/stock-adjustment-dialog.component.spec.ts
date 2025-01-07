import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockAdjustmentDialogComponent } from './stock-adjustment-dialog.component';

describe('StockAdjustmentDialogComponent', () => {
  let component: StockAdjustmentDialogComponent;
  let fixture: ComponentFixture<StockAdjustmentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockAdjustmentDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockAdjustmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
