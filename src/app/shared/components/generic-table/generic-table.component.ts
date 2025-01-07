import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";

@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
  ],
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss'],
})
export class GenericTableComponent {
  @Input() data: any[] = [];
  @Input() columns: { field: string; header: string }[] = [];
  @Input() actions = false; // Enable/Disable action column
  @Output() actionClick = new EventEmitter<{ action: string; row: any }>();

  get columnFields(): string[] {
    return this.columns.map((col) => col.field);
  }

  onAction(action: string, row: any): void {
    this.actionClick.emit({ action, row });
  }
}
