import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Slots {
  id: string;
  date: string;
  slot: string;
  selected: boolean;
  name: string;
  email: string;
  color: string;
}
@Injectable({
  providedIn: 'root'
})
export class SlotsService {
  private url = 'YOUR_SERVER_NAME/api/app.php';
  constructor(private http: HttpClient) { }

  getAllSlots(id: string) {
    return this.http.get<[Slots]>(this.url + id);
  }

  createSlot(slot: string) {
    return this.http.post(this.url, slot);
  }

  updateSlot(slot: string) {
    return this.http.post(this.url, slot);
  }

  removeSlot(slot: string) {
    return this.http.post(this.url, slot);
  }

  getSlotsforDate(date: string): Observable<Array<Slots>> {
    return this.http.get<[Slots]>(this.url + '?date=' + date);
  }
}