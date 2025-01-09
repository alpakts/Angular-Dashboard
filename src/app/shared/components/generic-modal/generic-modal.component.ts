import { CommonModule } from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef,
  ComponentRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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
    @Inject(MAT_DIALOG_DATA) public data: {
      title?: string;
      contentComponent: Type<any>;
      contentData?: any;
      injector: any;
    }
  ) {}

  ngOnInit(): void {
    this.title = this.data.title || this.title;
    this.loadContentComponent();
  }

  private loadContentComponent(): void {
    if (!this.data.contentComponent) {
      console.warn('No content component provided');
      return;
    }

    const component = this.data.contentComponent;
    this.componentRef = this.contentContainer.createComponent(component, {
      injector: this.data.injector,
    });

    if (this.data.contentData) {
      Object.assign(this.componentRef.instance, this.data.contentData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (!this.componentRef) {
      this.dialogRef.close(null);
      return;
    }

    const instance = this.componentRef.instance;

    if (this.isComponentFormValid(instance)) {
      const updatedData = this.getComponentUpdatedData(instance);
      this.dialogRef.close(updatedData);
    } else {
      console.error('Form is invalid!');
    }
  }

  private isComponentFormValid(instance: any): boolean {
    return typeof instance['isFormValid'] === 'function' && instance['isFormValid']();
  }

  private getComponentUpdatedData(instance: any): any {
    return typeof instance['getUpdatedData'] === 'function'
      ? instance['getUpdatedData']()
      : null;
  }
}
