import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { LogService } from './services/log.service';
import { Log } from '../shared/models/log-model';
import { HasPermissionDirective } from '../auth/directives/has-permission.directive';
import { DynamicTableComponent } from '../shared/components/table/dynamic-table/dynamic-table.component';

@Component({
  selector: 'app-log',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    HasPermissionDirective,
    DynamicTableComponent,
  ],
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
})
export class LogsComponent implements OnInit {
  logs: Log[] = [];
  totalLogs: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  filterQuery: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly columns = [
    { key: 'timestamp', label: 'Timestamp' },
    { key: 'username', label: 'Username' },
    { key: 'action', label: 'Action' },
    { key: 'details', label: 'Details' },
  ];

  constructor(private readonly logService: LogService) {}

  ngOnInit(): void {
    this.fetchLogs();
  }

  fetchLogs(): void {
    this.logService.getLogs(this.currentPage, this.pageSize, this.filterQuery).subscribe({
      next: ({ logs, total }) => {
        this.logs = logs;
        this.totalLogs = total;
      },
      error: (error) => console.error('Error fetching logs:', error),
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.fetchLogs();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.fetchLogs();
  }

  clearOldLogs(): void {
    const daysToKeep = 15;
    this.logService.clearOldLogs(daysToKeep).subscribe({
      next: () => this.fetchLogs(),
      error: (error) => console.error('Error clearing logs:', error),
    });
  }
}
