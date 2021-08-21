import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class MenuService {
  isOpened = true;

  constructor() {
    if (localStorage.getItem('menu') !== null) {
      this.isOpened = JSON.parse(localStorage.getItem('menu') as string);
    }
  }

  switch(): void {
    this.isOpened = !this.isOpened;
    localStorage.setItem('menu', String(this.isOpened));
  }
}
