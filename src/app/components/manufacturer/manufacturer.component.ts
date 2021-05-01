import {Component, Input, OnInit} from '@angular/core';
import {Manufacturer, ManufacturersService} from '../../shared/manufacturers.service';
import {ResponseCodes} from '../../shared/response.codes';
import {HttpResponse} from '@angular/common/http';

@Component({
  selector: 'app-manufacturer',
  templateUrl: './manufacturer.component.html',
  styleUrls: ['./manufacturer.component.css']
})
export class ManufacturerComponent implements OnInit {

  @Input() manufacturer!: Manufacturer;

  isNew = false;
  isLoading = false;

  constructor(public manufacturersService: ManufacturersService) { }

  ngOnInit(): void {
    if (this.manufacturer.name.trim().length < 1) {
      this.isNew = true;
    }
  }

  save(): void {
    if (this.manufacturer.name.trim().length > 2) {
      this.isLoading = true;
      this.manufacturersService.saveManufacturer(this.manufacturer)
        .subscribe(response => {
          this.isLoading = false;
          if (response === ResponseCodes.SUCCESS) { // @ts-ignore
            window.message.show('категория сохранёна');
            this.isNew = false;
          } else if (response === ResponseCodes.ALREADY_EXISTS){ // @ts-ignore
            window.message.show('такая категория уже существует');
          } else {
            console.log(response); // @ts-ignore
            window.message.show('не удалось сохранить категорию');
          }
        });
    } else { // @ts-ignore
      message.show('заполните название');
    }
  }

  delete(): void {
    if (this.isNew) {
      this.remove();
      return;
    }
    this.isLoading = true;
    this.manufacturersService.deleteManufacturer(this.manufacturer.name)
      .subscribe(response => {
        if (response === ResponseCodes.SUCCESS) { // @ts-ignore
          window.message.show('производитель удален');
          this.remove();
        } else if (response === ResponseCodes.NOT_EMPTY) { // @ts-ignore
          window.message.show('есть двигатели этого производителя. удалить нельзя');
        } else { // @ts-ignore
          window.message.show('удалить не удалось. Перезагрузите страницу и попробуйте еще раз');
        }
        this.isLoading = false;
      });
  }

  remove(): void {
    const index = this.manufacturersService.manufacturers.indexOf(this.manufacturer);
    if (index >= 0) {
      this.manufacturersService.manufacturers.splice(index, 1);
    }
  }

}
