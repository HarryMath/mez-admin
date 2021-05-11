import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {apiAddress} from './response.codes';
import {tap} from 'rxjs/operators';

export interface Post {
  id: number|null;
  title: string;
  date: string;
  beforePhotoText: string;
  photo: string|null;
  afterPhotoText: string;
  views: number;
  tags: string;
}

@Injectable({providedIn: 'root'})
export class NewsService {
  news: Post[] = [];
  avatar: File|null = null;

  constructor(private http: HttpClient) {
  }

  addTemplate(): void {
    this.news.unshift(
      {id: null, title: '', date: '', beforePhotoText: '', photo: null, afterPhotoText: '', tags: '', views: 0});
  }

  loadNews(): Observable<Post[]> {
    return this.http.get<Post[]>(apiAddress + '/news?withDetails=true')
      .pipe(
        tap(response => this.news = response.reverse())
      );
  }

  reloadPost(id: number|null): void {
    if (id == null) { return; }
    this.http.get<Post>(apiAddress + '/news/' + id)
      .subscribe(response => {
        if (response !== null) {
          for (let i = 0; i < this.news.length; i++) {
            if (this.news[i].id === id) {
              this.news[i] = response;
            }
          }
        }
      });
  }

  deletePost(id: number): Observable<number> {
    return this.http.get<number>(apiAddress + `/news/${id}/delete`);
  }

  savePost(post: Post, isNew: boolean): Observable<number> {
    const method = isNew ? 'create' : 'update';
    return this.http.put<number>(apiAddress + `/news/${method}`, post);
  }
}
