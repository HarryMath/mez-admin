import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class MenuService {
  isOpened = true;
  ipAddress = '';

  constructor() {}

  switch(): void {
    this.isOpened = !this.isOpened;
  }
}
