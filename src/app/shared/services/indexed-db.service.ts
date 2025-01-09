import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import INITIAL_PRODUCTS from './initial-product-data.json';
import { Product } from '../../products/models/product-model';
import { User } from '../../auth/models/user-model';
import INITIAL_USERS from './initial-user-data.json';
import { Log } from '../models/log-model';
import { Shift } from '../../shift/models/shift-model';
@Injectable({
  providedIn: 'root',
})
export class IndexedDbService extends Dexie {
  products!: Table<Product, number>;
  users!: Dexie.Table<User, number>;
  activities!: Dexie.Table<Log, number>;
  shifts!: Dexie.Table<Shift, number>;

  constructor() {
    super('MyAppDatabase');
    this.version(1).stores({
      products:
        '++id, name, category, price, stock, reorderPoint,expiryDate,stockAdjustments',
      activities: '++id, username, action, timestamp, details',
      users: '++id,username,password,role',
      shifts: '++id, username, role, date, startTime, endTime',
    });
  }

  async initializeDatabase() {
    const existingProducts = await this.products.count();
    const userCount = await this.users.count();
    if (userCount === 0) {
      const initialUsers: User[] = INITIAL_USERS;
      await this.users.clear();
      await this.users.bulkAdd(initialUsers);
      console.log('Initial users added to IndexedDB');
    }
    if (existingProducts === 0) {
      const initialProducts: Product[] = INITIAL_PRODUCTS;
      await this.products.clear();
      await this.products.bulkAdd(initialProducts);
      console.log('Initial products added');
    } else {
      console.log('Products already exist');
    }
  }
}
