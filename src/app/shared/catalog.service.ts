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

export interface Characteristics {
  engineId: number;
  power: number;
  frequency: number;
  efficiency: number;
  cosFi: number;
  electricityNominal220: number;
  electricityNominal380: number;
  electricityRatio: number;
  momentsRatio: number;
  momentsMaxRatio: number;
  momentsMinRatio: number;
}

@Injectable({providedIn: 'root'})
export class CatalogService {
  engines: EngineDetails[] = [];
  categories: CategoryPreview[] = [];
  apiAddressTest = 'http://localhost';
  apiAddress = 'https://mez-api.herokuapp.com';

  constructor(private http: HttpClient) {}

  loadEngines(): Observable<EngineDetails[]> {
    return this.http.get<EngineDetails[]>(this.apiAddressTest + '/engines?amount=24&offset=0&withDetails=true')
      .pipe(
        tap(response => this.engines = response.reverse() )
      );
  }

  addEngineTemplate(): void {
    this.engines.unshift({
      id: null, name: '', type: {
        name: '', shortDescription: '', fullDescription: '', photo: null
      }, manufacturer: 'ОАО «Могилевлифтмаш»', price: 0, mass: 0, photo: '',
      characteristics: [{ power: 0, frequency: 0, efficiency: 0, cosFi: 1,
        electricityNominal220: 0, electricityNominal380: 0, electricityRatio: 0,
        momentsRatio: 0, momentsMaxRatio: 0, momentsMinRatio: 0, engineId: 0
      }],
      photos: []
    });
  }

  createEngine(engine: EngineUpload): Observable<number> {
    return this.http.put<number>(this.apiAddressTest + '/engines/create', engine);
  }

  deleteEngine(id: number): Observable<number> {
    return this.http.get<number>(this.apiAddressTest + `/engines/${id}/delete`);
  }

  uploadPhoto(photo: File): Observable<HttpEvent<unknown>> {
    const photoData = new FormData();
    photoData.append('photo', photo);
    const photoRequest = new HttpRequest(
      'PUT',
      this.apiAddressTest + '/images/save',
      photoData);
    return this.http.request(photoRequest);
  }

  loadCategories(): Observable<CategoryPreview[]> {
    return this.http.get<CategoryPreview[]>(this.apiAddressTest + '/categories?withDetails=false')
      .pipe(
        tap(response => this.categories = response )
      );
  }
}
