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

  uploadFile(event: Event): void { // @ts-ignore
    if (event != null && event.target != null && event.target.files.length > 0) { // @ts-ignore
      const file = event.target.files[0];
      if (!file.name.endsWith('.xls') && !file.name.endsWith('.xlsx')) { // @ts-ignore
        window.message.show('поддерживаются только excel-файлы');
        return;
      }
      this.catalogService.uploadFile(file);
    }
  }
}
