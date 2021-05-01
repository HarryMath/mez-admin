import {Component, Input, OnInit} from '@angular/core';
import {CatalogService, Characteristics, EngineDetails, EngineUpload} from '../../shared/catalog.service';
import {HttpResponse} from '@angular/common/http';
import {CategoriesService} from '../../shared/categories.service';
import {ImagesService} from '../../shared/images.service';

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
  characteristicsValid = true;

  isNew = false;
  onEdit = false;
  isLoading = false;

  constructor(public catalogService: CatalogService,
              public imagesService: ImagesService) { }

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

  handleCharacteristicsChange(): void {
    let length = this.engine.characteristics.length;
    this.characteristicsValid = true;
    for (let i = 0; i < length - 1; i++) {
      if (!this.isRowValid(i)) {
        if (this.isRowEmpty(i)) {
           this.engine.characteristics.splice(i--, 1);
           length--;
        } else {
          this.characteristicsValid = false;
          break;
        }
      }
    }
    if (this.characteristicsValid) {
      if (this.isRowValid(length - 1)) {
        this.engine.characteristics.push(new Characteristics());
      } else {
        this.characteristicsValid = this.isRowEmpty(length - 1);
      }
    } else if (this.isRowEmpty(length - 1)) {
      this.engine.characteristics.pop();
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

  removePhoto(i: number): void {
    this.engine.photos.splice(i, 1);
  }

  getPhotoCss(): string {
    let style = '';
    if (!this.isEditable()) {
      style += 'border: none; ';
    }
    if (this.engine.photo !== null && this.engine.photo !== 'null' && this.engine.photo.length > 3) {
      style += `background-image: url(${this.engine.photo})`;
    }
    return style;
  }

  isEditable(): boolean {
    return this.isNew || this.onEdit;
  }

  isRowValid(i: number): boolean {
    const properties = (Object.keys(this.engine.characteristics[i]) as Array<keyof Characteristics>);
    for (const key of properties) {
      if (key !== 'engineId' && this.engine.characteristics[i][key] === null) {
        return false;
      }
    }
    return true;
  }

  isRowEmpty(i: number): boolean {
    const properties = (Object.keys(this.engine.characteristics[i]) as Array<keyof Characteristics>);
    for (const key of properties) {
      if (key !== 'engineId' && this.engine.characteristics[i][key] !== null) {
        return false;
      }
    }
    return true;
  }


  save(): void {
    if (this.engine.name.trim().length > 2 &&
      this.type.trim().length > 3 &&
      this.engine.manufacturer.trim().length > 3 &&
      this.engine.price > 10)
    {
      const rowsAmount = this.engine.characteristics.length;
      if (this.isRowEmpty(rowsAmount - 1)) {
        this.engine.characteristics.splice(rowsAmount - 1, 1);
      }
      if (this.engine.characteristics.length > 0 && this.characteristicsValid) {
        this.isLoading = true;
        this.saveChanges();
      } else { // @ts-ignore
        message.show('заполните характеристики');
        this.handleCharacteristicsChange();
      }
    } else { // @ts-ignore
      message.show('заполните имя, тип, массу и производилея');
    }
  }

  saveChanges(): void {
    const engine: EngineUpload = {
      id: this.engine.id, name: this.engine.name, type: this.type,
      manufacturer: this.engine.manufacturer, price: this.engine.price, mass: this.engine.mass, photo: this.engine.photo,
      characteristics: this.engine.characteristics, photos: []};
    const handleResponse = (response: number) => {
      this.isLoading = false;
      if (response > 0) { // @ts-ignore
        window.message.show('двигатель сохранён');
        this.engine.id = response;
        this.isNew = false; this.onEdit = false;
        this.handleCharacteristicsChange();
      } else { // @ts-ignore
        window.message.show('не удалось сохранить двигатель');
      }};

    if (this.avatar !== null) {
      this.imagesService.uploadPhoto(this.avatar)
        .subscribe(event => {
          if (event instanceof HttpResponse) { // @ts-ignore
            engine.photo = event.body.url;
            this.engine.photo = engine.photo;
            this.catalogService.createEngine(engine).subscribe(handleResponse);
          }});
    } else {
      this.catalogService.createEngine(engine).subscribe(handleResponse);
    }
  }

  edit(): void {
    this.onEdit = true;
    this.handleCharacteristicsChange();
  }

  cancel(): void {
    if (this.isNew) {
      this.remove();
    } else {
      this.isLoading = true;
      this.catalogService.reloadEngine(this.engine.id);
    }
    this.onEdit = false;
  }

  delete(): void {
    if (this.isNew) {
      this.remove();
      return;
    }
    this.isLoading = true; // @ts-ignore
    this.catalogService.deleteEngine(this.engine.id)
      .subscribe(response => {
        if (response === 1) { // @ts-ignore
          window.message.show('двигатель удалён');
          this.remove();
        } else { // @ts-ignore
          window.message.show('удалить не удалось. Перезагрузите страницу и попробуйте еще раз');
          this.isLoading = false;
        }
      });
  }

  remove(): void {
    const index = this.catalogService.engines.indexOf(this.engine);
    if (index >= 0) {
      this.catalogService.engines.splice(index, 1);
    }
  }
}
