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
  tags: string;
}

@Injectable({providedIn: 'root'})
export class NewsService {
  news: Post[] = [];
  avatar: File|null = null;

  constructor(private http: HttpClient) {
  }

  addTemplate(): void {
    this.news.unshift({id: null, title: '', date: '', beforePhotoText: '', photo: null, afterPhotoText: '', tags: ''});
  }

  loadNews(): Observable<Post[]> {
    return this.http.get<Post[]>(apiAddress + '/news?withDetails=true')
      .pipe(
        tap(response => this.news = response.reverse())
      );
  }

  deletePost(id: number): Observable<number> {
    return this.http.get<number>(apiAddress + `/news/${id}/delete`);
  }

  savePost(post: Post, isNew: boolean): Observable<number> {
    const method = isNew ? 'create' : 'update';
    return this.http.put<number>(apiAddress + `/news/${method}`, post);
  }
}
