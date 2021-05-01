import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {CatalogService} from '../../shared/catalog.service';
import {MenuService} from '../../shared/menu.service';

@Component({
  selector: 'app-engines-page',
  templateUrl: './engines-page.component.html',
  styleUrls: ['./engines-page.component.css']
})
export class EnginesPageComponent implements OnInit {

  enginesLoaded = false;
  categoriesLoaded = false;

  constructor(router: Router, public catalogService: CatalogService, public menuService: MenuService) {
    if (false) {
      router.navigate(['/']).then(err => console.log(err));
    }
  }

  ngOnInit(): void {
    this.catalogService.loadManufacturers().subscribe();
    this.catalogService.loadCategories().subscribe(() => {
      this.categoriesLoaded = true;
      this.catalogService.loadEngines().subscribe(() => {
        this.enginesLoaded = true;
      });
    });
  }
}
