import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {MenuService} from '../../shared/menu.service';
import {CategoriesService} from '../../shared/categories.service';

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.css']
})
export class CategoriesPageComponent implements OnInit {

  categoriesLoaded = false;

  constructor(router: Router, public menuService: MenuService, public categoriesService: CategoriesService) {
    if (false) {
      router.navigate(['/']).then(err => console.log(err));
    }
  }

  ngOnInit(): void {
    this.categoriesService.loadCategories().subscribe(() => {
      this.categoriesLoaded = true;
    });
  }

}
