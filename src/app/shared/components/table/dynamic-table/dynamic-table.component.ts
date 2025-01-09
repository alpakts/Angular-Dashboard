import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NgIf, NgFor, CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-dynamic-table',
  imports: [MatTableModule, MatSortModule, MatButtonModule, MatIconModule, MatMenuModule,CommonModule],
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss'],
})
export class DynamicTableComponent {
  @Input() dataSource: any[] = [];
  @Input() columns: { key: string; label: string }[] = [];
  @Input() actions: { label: string; icon: string; callback: (row: any) => void }[] = [];
  @Output() actionClicked = new EventEmitter<{ action: string; row: any }>();

  get displayedColumns(): string[] {
    return  this.actions.length === 0 ? this.columns.map((col) => col.key):[...this.columns.map((col) => col.key), 'actions'];
  }

  onActionClick(action: { label: string; callback: (row: any) => void }, row: any) {
    action.callback(row);
    this.actionClicked.emit({ action: action.label, row });
  }
}
