import {Component, Input, OnInit} from '@angular/core';
import {MenuService} from '../../shared/menu.service';


export interface Section {
  name: string;
  label: string;
  icon: string;
}


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  @Input() activeSection!: string;
  sections: Section[] = [
    { name: 'engines', label: 'Двишатели', icon: 'engine'},
    { name: 'categories', label: 'Типы двигателей', icon: 'category'},
    { name: 'manufacturers', label: 'Производители', icon: 'manufacture'},
    { name: 'news', label: 'Новости', icon: 'news'},
    { name: 'mails', label: 'Рассылка', icon: 'mail'},
  ];

  constructor(public menuService: MenuService) { }

  ngOnInit(): void {
  }

}
