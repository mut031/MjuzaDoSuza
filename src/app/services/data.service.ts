import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  public _isLogged = new BehaviorSubject<boolean>(false);

  setIsLogged(value: boolean) {
    this._isLogged.next(value) 
  }

  getIsLogged() {
    return this._isLogged.value;
  }

  public _username = new BehaviorSubject<string>("");

  setUsername(value: string) {
    this._username.next(value) 
  }

  getUsername() {
    return this._username.value;
  }
}
