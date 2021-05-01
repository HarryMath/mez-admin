import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {MenuService} from '../../shared/menu.service';
import {NewsService} from '../../shared/news.service';

@Component({
  selector: 'app-news-page',
  templateUrl: './news-page.component.html',
  styleUrls: ['./news-page.component.css']
})
export class NewsPageComponent implements OnInit {

  manufacturersLoaded = false;

  constructor(router: Router,
              public menuService: MenuService,
              public newsService: NewsService) {
    if (false) {
      router.navigate(['/']).then(err => console.log(err));
    }
  }

  ngOnInit(): void {
    this.newsService.loadNews().subscribe(() => {
      this.manufacturersLoaded = true;
    });
  }

}
