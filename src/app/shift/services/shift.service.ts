import { Injectable } from '@angular/core';
import { Observable, catchError, from, map, throwError } from 'rxjs';
import { Shift } from '../models/shift-model';
import { IndexedDbService } from '../../shared/services/indexed-db.service';

@Injectable({
  providedIn: 'root',
})
export class ShiftService {
  constructor(private indexedDbService: IndexedDbService) {}

  getShiftsByDateRange(startDate: Date, endDate: Date): Observable<Shift[]> {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    return from(
      this.indexedDbService.shifts
        .filter((shift: Shift) => {
          const shiftDate = new Date(shift.date).getTime();
          return shiftDate >= start && shiftDate <= end;
        })
        .toArray()
    );
  }

  addShift(shift: Shift): Observable<number> {
    return from(this.indexedDbService.shifts.add(shift));
  }
  updateShift(shiftId: number, shift: Shift): Observable<number> {
    return from(this.indexedDbService.shifts.update(shiftId, shift)).pipe(
      map((updatedCount) => {
        if (updatedCount === 0) {
          throw new Error(`No shift found with ID: ${shiftId}`);
        }
        return updatedCount;
      }),
      catchError((error) => {
        console.error('Error updating shift:', error);
        return throwError(() => new Error('Failed to update shift'));
      })
    );
  }

  deleteShift(shiftId: number): Observable<void> {
    return from(this.indexedDbService.shifts.delete(shiftId));
  }
}
