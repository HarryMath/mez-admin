import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Category} from './categories.service';
import {apiAddress} from './response.codes';
import {Manufacturer} from './manufacturers.service';

export interface CategoryPreview {
  name: string;
  photo: string|null;
  shortDescription: string;
}

export interface EnginePreview {
  id: number|null;
  name: string;
  manufacturer: string;
  type: string;
  price: number;
  mass: number;
  photo: string|null;
  characteristics: Characteristics[];
}

export interface EngineDetails {
  id: number|null;
  name: string;
  manufacturer: string;
  price: number;
  mass: number;
  photo: string|null;
  type: Category;
  characteristics: Characteristics[];
  photos: string[];
}

export interface EngineUpload {
  id: number|null;
  name: string;
  type: string;
  manufacturer: string;
  price: number;
  mass: number;
  photo: string|null;
  characteristics: Characteristics[];
  photos: string[];
}

export class Characteristics {
  engineId: number|null = null;
  power: number|null = null;
  frequency: number|null = null;
  efficiency: number|null = null;
  cosFi: number|null = null;
  electricityNominal220: number|null = null;
  electricityNominal380: number|null = null;
  electricityRatio: number|null = null;
  momentsRatio: number|null = null;
  momentsMaxRatio: number|null = null;
  momentsMinRatio: number|null = null;
}

@Injectable({providedIn: 'root'})
export class CatalogService {
  engines: EngineDetails[] = [];
  categories: CategoryPreview[] = [];
  manufacturers: Manufacturer[] = [];

  constructor(private http: HttpClient) {}

  loadEngines(): Observable<EngineDetails[]> {
    return this.http.get<EngineDetails[]>(apiAddress + '/engines?withDetails=true')
      .pipe(
        tap(response => this.engines = response.reverse() )
      );
  }

  loadCategories(): Observable<CategoryPreview[]> {
    return this.http.get<CategoryPreview[]>(apiAddress + '/categories?withDetails=false')
      .pipe(
        tap(response => this.categories = response )
      );
  }

  loadManufacturers(): Observable<Manufacturer[]> {
    return this.http.get<Manufacturer[]>(apiAddress + '/manufacturers?withDetails=false')
      .pipe(
        tap(response => this.manufacturers = response )
      );
  }

  addEngineTemplate(): void {
    this.engines.unshift({
      id: null, name: '', type: {
        name: '', shortDescription: '', fullDescription: '', photo: null
      }, manufacturer: '', price: 0, mass: 0, photo: '',
      characteristics: [new Characteristics()],
      photos: []
    });
  }

  createEngine(engine: EngineDetails): Observable<number> {
    const payload: EngineUpload = {
      id: engine.id, name: engine.name, type: engine.type.name,
      manufacturer: engine.manufacturer, price: engine.price, mass: engine.mass, photo: engine.photo,
      characteristics: engine.characteristics, photos: engine.photos
    };
    return this.http.put<number>(apiAddress + '/engines/create', payload);
  }

  reloadEngine(id: number|null): void {
    if (id == null) { return; }
    this.http.get<EngineDetails>(apiAddress + `/engines/${id}?withDetails=true`)
      .subscribe(response => {
        if (response !== null) {
          for (let i = 0; i < this.engines.length; i++) {
            if (this.engines[i].id === id) {
              this.engines[i] = response;
            }
          }
        }
      });
  }

  deleteEngine(id: number): Observable<number> {
    return this.http.get<number>(apiAddress + `/engines/${id}/delete`);
  }
}
