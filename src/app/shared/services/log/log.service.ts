import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { IndexedDbService } from '../indexed-db.service';
import { Log } from '../../models/log-model';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  constructor(private indexedDbService: IndexedDbService) {}

  addLog(action: string, message: string, username: string): Observable<number> {
    const log: Log = {
      action,
      message,
      username,
      timestamp: new Date(),
    };
    return from(this.indexedDbService.activities.add(log));
  }

  getLogs(): Observable<Log[]> {
    return from(this.indexedDbService.activities.toArray());
  }

  getLogsByFilter(filterFn: (log: Log) => boolean): Observable<Log[]> {
    return from(this.indexedDbService.activities.filter(filterFn).toArray());
  }


  clearOldLogs(days: number):void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
      this.indexedDbService.activities
        .filter((log: Log) => log.timestamp < cutoffDate)
        .delete()
  }
}
