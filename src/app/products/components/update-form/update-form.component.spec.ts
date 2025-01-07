import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateProductFormComponent } from './update-form.component';


describe('UpdateFormComponent', () => {
  let component: UpdateProductFormComponent;
  let fixture: ComponentFixture<UpdateProductFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateProductFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
