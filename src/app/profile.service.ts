import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ProfileService {

  constructor(private _httpService: HttpClient) { }

  getProfile(): Observable<any> {

    return this._httpService.get<any>('https://graph.microsoft.com/v1.0/me');
  }
}
