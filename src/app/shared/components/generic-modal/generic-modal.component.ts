import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ComponentRef } from '@angular/core';

@Component({
  selector: 'app-generic-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './generic-modal.component.html',
  styleUrls: ['./generic-modal.component.scss'],
})
export class GenericModalComponent implements OnInit {
  @Input() title: string = '';
  @ViewChild('contentContainer', { read: ViewContainerRef, static: true })
  contentContainer!: ViewContainerRef;

  private componentRef!: ComponentRef<any>;

  constructor(
    public dialogRef: MatDialogRef<GenericModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data.contentComponent) {
      const component = this.data.contentComponent as Type<any>;
      this.componentRef = this.contentContainer.createComponent(component, {
        injector: this.data.injector,
      });

      if (this.data.contentData) {
        Object.assign(this.componentRef.instance, this.data.contentData);
      }
    }

    this.title = this.data.title || this.title;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (
      this.componentRef &&
      typeof this.componentRef.instance['getUpdatedData'] === 'function' &&
      typeof this.componentRef.instance['isFormValid'] === 'function'
    ) {

      if (!this.componentRef.instance['isFormValid']()) {

        console.error('Form geçerli değil!');
        return;
      }


      const updatedData = this.componentRef.instance['getUpdatedData']();
      this.dialogRef.close(updatedData);
    } else {
      this.dialogRef.close(null);
    }
  }
}
