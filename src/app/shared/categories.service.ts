import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {EngineDetails, EngineUpload} from './catalog.service';

export interface Category {
  name: string;
  photo: string|null;
  shortDescription: string;
  fullDescription: string;
}

@Injectable({providedIn: 'root'})
export class CategoriesService {
  categories: Category[] = [];
  apiAddress = 'http://localhost';

  // apiAddress = 'https://mez-api.herokuapp.com';

  constructor(private http: HttpClient) {
  }

  addCategoryTemplate(): void {
    this.categories.unshift({
      name: '', photo: null, shortDescription: '', fullDescription: ''
    });
  }

  loadCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiAddress + '/categories?withDetails=true')
      .pipe(
        tap(response => this.categories = response.reverse())
      );
  }

  reloadCategory(name: string|null): void {
    if (name == null) { return; }
    this.http.get<Category>(this.apiAddress + `/categories/${name}?withDetails=true`)
      .subscribe(response => {
        if (response !== null) {
          for (let i = 0; i < this.categories.length; i++) {
            if (this.categories[i].name === name) {
              this.categories[i] = response;
            }
          }
        }
      });
  }

  deleteCategory(name: string): Observable<number> {
    return this.http.get<number>(this.apiAddress + `/categories/${name}/delete`);
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

  saveCategory(category: Category, isNew: boolean): Observable<number> {
    const method = isNew ? 'create' : 'update';
    return this.http.put<number>(this.apiAddress + `/categories/${method}`, category);
  }
}
