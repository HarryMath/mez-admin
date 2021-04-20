import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

export interface Category {
  name: string;
  photo: string|null;
  shortDescription: string;
  fullDescription: string;
}

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
  // apiAddress = 'http://localhost';
  apiAddress = 'https://mez-api.herokuapp.com';

  constructor(private http: HttpClient) {}

  loadEngines(): Observable<EngineDetails[]> {
    return this.http.get<EngineDetails[]>(this.apiAddress + '/engines?amount=24&offset=0&withDetails=true')
      .pipe(
        tap(response => this.engines = response.reverse() )
      );
  }

  addEngineTemplate(): void {
    this.engines.unshift({
      id: null, name: '', type: {
        name: '', shortDescription: '', fullDescription: '', photo: null
      }, manufacturer: 'ОАО «Могилевлифтмаш»', price: 0, mass: 0, photo: '',
      characteristics: [new Characteristics()],
      photos: []
    });
  }

  createEngine(engine: EngineUpload): Observable<number> {
    return this.http.put<number>(this.apiAddress + '/engines/create', engine);
  }

  reloadEngine(id: number|null): void {
    if (id == null) { return; }
    this.http.get<EngineDetails>(this.apiAddress + `/engines/${id}?withDetails=true`)
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
    return this.http.get<number>(this.apiAddress + `/engines/${id}/delete`);
  }

  uploadPhoto(photo: File): Observable<HttpEvent<unknown>> {
    const photoData = new FormData();
    photoData.append('photo', photo);
    const photoRequest = new HttpRequest(
      'PUT',
      this.apiAddress + '/images/save',
      photoData);
    return this.http.request(photoRequest);
  }

  loadCategories(): Observable<CategoryPreview[]> {
    return this.http.get<CategoryPreview[]>(this.apiAddress + '/categories?withDetails=false')
      .pipe(
        tap(response => this.categories = response )
      );
  }
}
