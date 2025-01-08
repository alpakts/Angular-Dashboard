import { Injectable } from '@angular/core';
import { Observable, from, of, throwError } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { IndexedDbService } from '../../shared/services/indexed-db.service';
import { User } from '../models/user-model';
import { Role } from '../enums/role-enum';
import { Permissions, RolePermissions } from './permissions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser: User | null = null

  constructor(private indexedDbService: IndexedDbService) {}

  login(username: string, password: string): Observable<User> {
    return from(this.indexedDbService.users.where('username').equals(username).first()).pipe(
      catchError(() => throwError(() => new Error('Invalid username or password'))),
      switchMap((user) => {
        if (!user) {
          return throwError(() => new Error('Invalid credentials'));
        }

        if (user.password !== password) {
          return throwError(() => new Error('Invalid credentials'));
        }

        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        return of(user);
      })
    );
  }


  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    if (!this.currentUser) {
      const storedUser = localStorage.getItem('currentUser');
      this.currentUser = storedUser ? JSON.parse(storedUser) : null;
    }
    return this.currentUser;
  }

  register(newUser: User): Observable<number> {
    return from(this.indexedDbService.users.add(newUser)).pipe(
      tap(() => console.log('User registered successfully')),
      catchError((error) => throwError(() => new Error(`Registration failed: ${error}`)))
    );
  }
  updateUser(updatedUser: User): Observable<number> {
    return from(
      this.indexedDbService.users.update(updatedUser.id!, updatedUser)
    ).pipe(
      tap(() => console.log('User updated successfully')),
      catchError((error) =>
        throwError(() => new Error(`User update failed: ${error}`))
      )
    );
  }

  hasRole(requiredRole: Role): boolean {
    const currentUser = this.getCurrentUser();
    return !!(currentUser && Role[currentUser.role as keyof typeof Role] >= requiredRole);
  }


  getUsers(): Observable<User[]> {
    return from(this.indexedDbService.users.toArray()).pipe(
      catchError((error) => throwError(() => new Error(`Failed to fetch users: ${error}`)))
    );
  }

  deleteUser(userId: number): Observable<void> {
    return from(this.indexedDbService.users.delete(userId)).pipe(
      tap(() => console.log(`User with ID ${userId} deleted successfully`)),
      catchError((error) => throwError(() => new Error(`Failed to delete user: ${error}`)))
    );
  }
  hasPermission(permission:string): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.role) return false;
    return RolePermissions[user.role]?.includes(permission) || false;
  }
}
