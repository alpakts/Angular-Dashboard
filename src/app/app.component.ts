import { Component } from '@angular/core';
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
  constructor(private indexedDbService: IndexedDbService) {}

  ngOnInit() {
    this.indexedDbService.initializeDatabase();
  }
}
