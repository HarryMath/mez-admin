import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {apiAddress} from './response.codes';

export interface Category {
  name: string;
  photo: string|null;
  shortDescription: string;
  fullDescription: string;
}

@Injectable({providedIn: 'root'})
export class CategoriesService {
  categories: Category[] = [];

  constructor(private http: HttpClient) {
  }

  addCategoryTemplate(): void {
    this.categories.unshift({
      name: '', photo: null, shortDescription: '', fullDescription: ''
    });
  }

  loadCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(apiAddress + '/categories?withDetails=true')
      .pipe(
        tap(response => this.categories = response.reverse())
      );
  }

  reloadCategory(name: string|null): void {
    if (name == null) { return; }
    this.http.get<Category>(apiAddress + '/categories/' + name)
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
    return this.http.get<number>(apiAddress + `/categories/${name}/delete`);
  }

  saveCategory(category: Category, isNew: boolean): Observable<number> {
    const method = isNew ? 'create' : 'update';
    return this.http.put<number>(apiAddress + `/categories/${method}`, category);
  }
}
