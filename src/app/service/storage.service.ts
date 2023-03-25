import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) {
   // storage.create();
   }

  getItem<T>(name: string): Promise<T> {
    return this.storage.get(name);
  }

  removeItem(name: string): Promise<void> {
    return this.storage.remove(name);
  }

  clear(): Promise<void> {
    return this.storage.clear();
  }

  setItem<T>(name: string, value: T): Promise<void> {
    return this.storage.set(name, value);
  }
  
}
