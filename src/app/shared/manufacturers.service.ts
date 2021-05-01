import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {apiAddress} from './response.codes';

export interface Manufacturer {
  name: string;
}

@Injectable({providedIn: 'root'})
export class ManufacturersService {
  manufacturers: Manufacturer[] = [];

  constructor(private http: HttpClient) {
  }

  addTemplate(): void {
    this.manufacturers.unshift({name: ''});
  }

  loadManufacturers(): Observable<Manufacturer[]> {
    return this.http.get<Manufacturer[]>(apiAddress + '/manufacturers')
      .pipe(
        tap(response => this.manufacturers = response.reverse())
      );
  }

  deleteManufacturer(name: string): Observable<number> {
    return this.http.get<number>(apiAddress + `/manufacturers/${name}/delete`);
  }

  saveManufacturer(manufacturer: Manufacturer): Observable<number> {
    return this.http.put<number>(apiAddress + `/manufacturers/create`, manufacturer);
  }
}
