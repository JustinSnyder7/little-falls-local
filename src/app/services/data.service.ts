import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  private dataArraySubject = new BehaviorSubject<string[]>([]); // Initial empty array
  dataArray$ = this.dataArraySubject.asObservable();

  constructor() { }

  updateDataArray(newArray: string[]): void {
    this.dataArraySubject.next(newArray);
  }
}
