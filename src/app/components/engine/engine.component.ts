import {Component, Input, OnInit} from '@angular/core';
import {CatalogService, EngineDetails, EngineUpload} from '../../shared/catalog.service';
import {HttpEventType, HttpResponse} from '@angular/common/http';

@Component({
  selector: 'app-engine',
  templateUrl: './engine.component.html',
  styleUrls: ['./engine.component.css']
})
export class EngineComponent implements OnInit {

  @Input() engine!: EngineDetails;
  avatar: File|null = null;
  photos: File[] = [];
  type = '';

  isNew = false;
  onEdit = false;

  constructor(public catalogService: CatalogService) { }

  ngOnInit(): void {
    if (this.engine.price === 0) {
      this.isNew = true;
    }
    this.type = this.engine.type.name;
  }

  getClass(): string {
    return this.isNew ? 'new' :
      this.onEdit ? 'editable' : '';
  }

  handleAvatarChange(event: Event): void { // @ts-ignore
    console.log(event.target.files);
    // @ts-ignore
    if (event.target.files.length > 0) { // @ts-ignore
      const file = event.target.files[0];
      if (!file.type.toLowerCase().startsWith('image')) { // @ts-ignore
        message.show('только изображения');
        return;
      } else if (file.size / 1000000 > 2) { // @ts-ignore
        message.show('файл слишком большой');
        return;
      }
      this.avatar = file;
      const reader: FileReader = new FileReader();
      reader.onload = () => { // @ts-ignore
          this.engine.photo = reader.result;
        }; // @ts-ignore
      reader.readAsDataURL(this.avatar);
    }
  }

  handlePhotoAdd(event: Event): void { // @ts-ignore
    if (event.target.files.length > 0) { // @ts-ignore
      const file = event.target.files[0];
      if (!file.type.toLowerCase().startsWith('image')) { // @ts-ignore
        message.show('только изображения');
        return;
      }
      const reader: FileReader = new FileReader();
      reader.onload = () => { // @ts-ignore
        this.engine.photos.push(reader.result);
        this.photos.push(file);
      }; // @ts-ignore
      reader.readAsDataURL(file);
    }
  }

  getPhotoCss(): string {
    if (this.engine.photo === null || this.engine.photo === 'null') {
      return 'border: none';
    }
    return this.engine.photo.length > 0 ?
      `background-image: url(${this.engine.photo}); border: none` : '';
  }

  isEditable(): boolean {
    return this.isNew || this.onEdit;
  }

  save(): void {
    if (this.engine.name.trim().length > 2 &&
      this.type.trim().length > 3 &&
      this.engine.manufacturer.trim().length > 3 &&
      this.engine.price > 10 &&
      this.engine.characteristics.length > 0)
    {
      const engine: EngineUpload = {
        id: null, name: this.engine.name, type: this.type,
        manufacturer: this.engine.manufacturer, price: this.engine.price, mass: this.engine.mass, photo: null,
        characteristics: this.engine.characteristics, photos: []};
      const handleResponse = (response: number) => {
        if (response > 0) { // @ts-ignore
          window.message.show('двигатель создан');
          this.engine.id = response;
          this.isNew = false; this.onEdit = false;
        } else { // @ts-ignore
          window.message.show('не удалось создать двигатель');
        }};
      if (this.avatar !== null) {
        this.catalogService.uploadPhoto(this.avatar)
          .subscribe(event => {
            if (event instanceof HttpResponse) {
              console.log(event); // @ts-ignore
              engine.photo = event.body.url;
              this.engine.photo = engine.photo;
              this.catalogService.createEngine(engine).subscribe(handleResponse);
            }});
      } else {
        this.catalogService.createEngine(engine).subscribe(handleResponse);
      }
    } else { // @ts-ignore
      message.show('заполните имя, тип, производилея и сохраните характеристики');
    }
  }

  edit(): void {
    this.onEdit = true;
  }

  cancel(): void {
    if (this.isNew) {
      const index = this.catalogService.engines.indexOf(this.engine);
      if (index >= 0) {
        this.catalogService.engines.splice(index, 1);
      }
    }
    this.onEdit = false;
  }

  delete(): void { // @ts-ignore
    this.catalogService.deleteEngine(this.engine.id)
      .subscribe(response => {
        if (response === 1) {
          const index = this.catalogService.engines.indexOf(this.engine);
          if (index >= 0) {
            this.catalogService.engines.splice(index, 1);
          }
        } else { // @ts-ignore
          window.message.show('удалить не удалось. Перезагрузите страницу и попробуйте еще раз');
        }
      });
  }
}
