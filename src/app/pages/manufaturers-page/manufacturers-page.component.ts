import { Component, OnInit } from '@angular/core';
import {MenuService} from '../../shared/menu.service';
import {ManufacturersService} from '../../shared/manufacturers.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-manufaturers-page',
  templateUrl: './manufacturers-page.component.html',
  styleUrls: ['./manufacturers-page.component.css']
})
export class ManufacturersPageComponent implements OnInit {

  manufacturersLoaded = false;

  constructor(router: Router,
              public menuService: MenuService,
              public manufacturersService: ManufacturersService) {
    if (false) {
      router.navigate(['/']).then(err => console.log(err));
    }
  }

  ngOnInit(): void {
    this.manufacturersService.loadManufacturers().subscribe(() => {
      this.manufacturersLoaded = true;
    });
  }

}
