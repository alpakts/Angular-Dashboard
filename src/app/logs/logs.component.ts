import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { LogService } from './services/log.service';
import { Log } from '../shared/models/log-model';
import { HasPermissionDirective } from '../auth/directives/has-permission.directive';

@Component({
  selector: 'app-log',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule, MatTableModule, MatInputModule, MatButtonModule, FormsModule, HasPermissionDirective],
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
})
export class LogsComponent implements OnInit {
  logs: Log[] = [];
  displayedColumns: string[] = ['timestamp', 'username', 'action', 'details'];
  totalLogs: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  filterQuery: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private logService: LogService) {}

  ngOnInit(): void {
    this.fetchLogs();
  }

  fetchLogs(): void {
    this.logService.getLogs(this.currentPage, this.pageSize, this.filterQuery).subscribe({
      next: ({ logs, total }) => {
        this.logs = logs;
        this.totalLogs = total;
      },
      error: (error) => {
        console.error('Error fetching logs:', error);
      },
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

  async clearOldLogs(): Promise<void> {
    const daysToKeep = 15;
    this.logService.clearOldLogs(daysToKeep).subscribe({
      next: () => {
        this.fetchLogs();
      },
      error: (error) => {
        console.error('Error clearing logs:', error);
      },
    });
  }
}
