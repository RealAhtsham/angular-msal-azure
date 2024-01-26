import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

constructor() { }


getProfile(): Observable<any> {

  return new Observable(observer => {
    
    observer.next({
      displayName:  "Ahtsham",
      givenName:  "Ahtsham",
      id:  1,
      mail:  "Ahtsham@gmail.com",
    });
  })
}
}
