import { Component, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IndexedDbService } from './shared/services/indexed-db.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'fuel-station-stock-manager';
  isDarkMode: WritableSignal<boolean> = signal(this.getInitialThemeMode());
  private htmlElement = document.documentElement;
  constructor(private indexedDbService: IndexedDbService) {}

  ngOnInit() {
    this.initializeTheme();
    this.indexedDbService.initializeDatabase();
  }

  private getInitialThemeMode(): boolean {
    return localStorage.getItem('darkMode') === 'true';
  }

  private initializeTheme(): void {
    this.htmlElement.classList.toggle('mat-dark-theme', this.isDarkMode());
    this.htmlElement.classList.toggle('mat-light-theme', !this.isDarkMode());
  }
}
