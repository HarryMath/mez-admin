import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest, HttpResponse} from '@angular/common/http';
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
  name: string;
  manufacturer: string;
  type: string;
  minPrice: number;
  mass: number;
  axisHeight: number;
  photo: string|null;
  characteristics: Characteristics[];
}

export interface EngineDetails {
  name: string;
  manufacturer: string;
  priceLapy: number;
  priceCombi: number;
  priceFlanets: number;
  mass: number;
  axisHeight: number;
  photo: string|null;
  type: Category;
  characteristics: Characteristics[];
  photos: string[];
}

export interface EngineUpload {
  name: string;
  manufacturer: string;
  priceLapy: number;
  priceCombi: number;
  priceFlanets: number;
  mass: number;
  axisHeight: number;
  characteristics: Characteristics[];
  photos: string[];
  type: string;
  photo: string|null;
}

export class Characteristics {
  engineId: number|null = null;
  power: number|null = null;
  frequency: number|null = null;
  efficiency: number|null = null;
  cosFi: number|null = null;
  electricityNominal115: number|null = null;
  electricityNominal220: number|null = null;
  electricityNominal380: number|null = null;
  electricityRatio: number|null = null;
  momentsRatio: number|null = null;
  momentsMaxRatio: number|null = null;
  momentsMinRatio: number|null = null;
  voltage115: number|null = null;
  // tslint:disable-next-line:variable-name
  voltage220_230: number|null = null;
  capacity115: number|null = null;
  capacity220: number|null = null;
  capacity230: number|null = null;
  criticalSlipping: number|null = null;
}

@Injectable({providedIn: 'root'})
export class CatalogService {
  engines: EngineDetails[] = [];
  categories: CategoryPreview[] = [];
  manufacturers: Manufacturer[] = [];
  loadingEngines = false;

  constructor(private http: HttpClient) {}

  loadEngines(): Observable<EngineDetails[]> {
    this.loadingEngines = true;
    return this.http.get<EngineDetails[]>(apiAddress + '/engines?withDetails=true')
      .pipe(tap(response => {
        this.engines = response.reverse();
        this.loadingEngines = false;
      }));
  }

  uploadFile(file: File): void {
    const data = new FormData();
    data.append('file', file);
    const uploadRequest = new HttpRequest(
      'PUT',
      apiAddress + '/engines/loadFromFile',
      data);
    this.loadingEngines = true;
    this.http.request(uploadRequest).subscribe(event => {
      if (event instanceof HttpResponse) {
        this.loadingEngines = false;
        const response = parseInt(event.body + '', 0);
        console.log(response); // @ts-ignore
        window.message.show('загружено ' + response + ' двигателей');
        this.loadEngines().subscribe();
      }
    });
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
      axisHeight: 0, priceCombi: 0, priceFlanets: 0, priceLapy: 0,
      name: '', type: {
        name: '', shortDescription: '', fullDescription: '', photo: null, pageOrder: 0
      }, manufacturer: '', mass: 0, photo: '',
      characteristics: [new Characteristics()],
      photos: []
    });
  }

  saveEngine(engine: EngineDetails, isNew: boolean): Observable<number> {
    const payload: EngineUpload = {
      name: engine.name, type: engine.type.name, priceLapy: engine.priceLapy,
      priceCombi: engine.priceCombi, priceFlanets: engine.priceFlanets,
      manufacturer: engine.manufacturer, mass: engine.mass, photo: engine.photo,
      characteristics: engine.characteristics, photos: engine.photos,
      axisHeight: engine.axisHeight
    };
    const action = isNew ? 'create' : 'update';
    return this.http.put<number>(apiAddress + '/engines/' + action, payload);
  }

  reloadEngine(name: string): void {
    this.http.get<EngineDetails>(apiAddress + `/engines/${name}?withDetails=true`)
      .subscribe(response => {
        if (response !== null) {
          for (let i = 0; i < this.engines.length; i++) {
            if (this.engines[i].name === name) {
              this.engines[i] = response;
            }
          }
        }
      });
  }

  deleteEngine(name: string): Observable<number> {
    return this.http.get<number>(apiAddress + `/engines/${name}/delete`);
  }
}
