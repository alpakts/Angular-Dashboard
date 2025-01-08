import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { IndexedDbService } from '../../shared/services/indexed-db.service';
import { Log } from '../../shared/models/log-model';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  constructor(private indexedDbService: IndexedDbService,private authService:AuthService) {}

  addLog(action: string, details: string, username: string,message:string,): Observable<number> {
    const log: Log = {
      action,
      details,
      message,
      username,
      timestamp: new Date(),
    };
    return from(this.indexedDbService.activities.add(log));
  }

  getLogs(
    page: number,
    pageSize: number,
    query: string = ''
  ): Observable<{ logs: Log[]; total: number }> {
    return new Observable((observer) => {
      this.indexedDbService.activities
        .toArray()
        .then((allLogs) => {
          const filteredLogs = allLogs.filter((log) => {
            const searchTerm = query.toLowerCase();
            return (
              log.username?.toLowerCase().includes(searchTerm) ||
              log.action?.toLowerCase().includes(searchTerm) ||
              log.details?.toLowerCase().includes(searchTerm)
            );
          });

          const startIndex = (page - 1) * pageSize;
          const paginatedLogs = filteredLogs.slice(startIndex, startIndex + pageSize);

          observer.next({
            logs: paginatedLogs,
            total: filteredLogs.length,
          });
          observer.complete();
        })
        .catch((error) => observer.error(error));
    });
  }

  clearOldLogs(days: number): Observable<void> {
    return new Observable((observer) => {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      this.indexedDbService.activities
        .toArray()
        .then((logs) => {
          const logsToDelete = logs.filter(
            (log) => new Date(log.timestamp) < cutoffDate
          );

          const deletePromises = logsToDelete.map((log) =>
            this.indexedDbService.activities.delete(log.id!)
          );

          return Promise.all(deletePromises);
        })
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error) => observer.error(error));
    });
  }
  logActivity(action: string, message: string): void {
    const currentUser = this.authService.getCurrentUser();
    const username = currentUser ? currentUser.username : 'Unknown User';
    this.addLog(action, message, username,'').subscribe();
  }
}
