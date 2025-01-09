import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ShiftService } from './services/shift.service';
import { Shift } from './models/shift-model';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../auth/services/auth.service';
import { GenericModalComponent } from '../shared/components/generic-modal/generic-modal.component';
import { ShiftUpdateFormComponent } from './components/shift-update-form/shift-update-form.component';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-shift',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
  ],
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.scss'],
})
export class ShiftComponent implements OnInit {
  startDate: Date = new Date();
  endDate: Date = new Date(new Date().setDate(this.startDate.getDate() + 7));
  shifts: Shift[] = [];
  shiftTable: any[] = [];
  displayedColumns: string[] = ['username'];
  weekDates: string[] = [];

  constructor(private shiftService: ShiftService, private authService: AuthService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.updateWeekDates();
    this.loadShifts();
  }

  updateWeekDates(): void {
    this.weekDates = [];
    const currentDate = new Date(this.startDate);

    while (currentDate <= this.endDate) {
      const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNumber = currentDate.getDate();
      this.weekDates.push(`${dayName} ${dayNumber}`);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    this.loadShifts();
    this.displayedColumns = ['username', ...this.weekDates];
  }

  loadShifts(): void {
    this.shiftService.getShiftsByDateRange(this.startDate, this.endDate).subscribe((shifts) => {
      this.shifts = shifts;
      this.createShiftTable();
    });
  }

  createShiftTable(): void {
    this.authService.getUsers().subscribe((users) => {
      this.shiftTable = [];
      users.forEach((user) => {
        const userShifts = this.shifts.filter((shift) => shift.username === user.username);
        this.shiftTable.push({
          username: user.username,
          shifts: userShifts,
        });
      });
    });
  }

  getShiftForDay(userShift: any, day: string): Shift | undefined {
    const dayParts = day.split(' ');
    const targetDate = new Date(this.startDate);
    targetDate.setDate(parseInt(dayParts[1]));

    return userShift.shifts.find((shift: Shift) => new Date(shift.date).toDateString() === targetDate.toDateString());
  }

  openEditShiftModal(username: string, day: string): void {
    const dayParts = day.split(' ');
    const date = new Date(this.startDate);
    date.setDate(parseInt(dayParts[1]));

    const existingShift = this.shifts.find(
      (shift) => shift.username === username && new Date(shift.date).toDateString() === date.toDateString()
    );

    const dialogRef = this.dialog.open(GenericModalComponent, {
      width: '400px',
      data: {
        title: existingShift ? 'Edit Shift' : 'Add Shift',
        contentComponent: ShiftUpdateFormComponent,
        contentData: {
          shift: existingShift || { username, date: date.toISOString(), role: '', startTime: '', endTime: '' },
        },
      },
    });

    dialogRef.afterClosed().subscribe((result: Shift | null) => {
      if (result) {
        if (existingShift) {
          this.shiftService.updateShift(existingShift.id, result).subscribe(() => this.loadShifts());
        } else {
          this.shiftService.addShift(result).subscribe(() => this.loadShifts());
        }
        this.loadShifts();
      }
    });
  }
  exportTableToExcel(): void {
    debugger;
    const headers = [
        [
            'Shift ID',
            'User ID',
            'Username',
            'Role',
            'Start Time',
            'End Time',
            'Date',
            'Week Off'
        ],
    ];

    const rows = this.shifts.map((shift: any) => [
        shift.id || 'N/A',
        shift.userId || 'N/A',
        shift.username || 'N/A',
        shift.role || 'N/A',
        shift.startTime ? shift.startTime: 'N/A',
        shift.endTime ? shift.endTime : 'N/A',
        shift.date ? shift.date.toString() : 'N/A',
        shift.weekOff ? 'Yes' : 'No'
    ]);

    const data = [...headers, ...rows];

    const worksheet = XLSX.utils.aoa_to_sheet(data);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Shift Schedule');

    XLSX.writeFile(workbook, 'shift_schedule.xlsx');
}

}
