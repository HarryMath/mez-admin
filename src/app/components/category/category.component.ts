import {Component, Input, OnInit} from '@angular/core';
import {CategoriesService, Category} from '../../shared/categories.service';
import {HttpResponse} from '@angular/common/http';
import {ResponseCodes} from '../../shared/response.codes';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  @Input() category!: Category;

  isNew = false;
  onEdit = false;
  isLoading = false;
  avatar: File|null = null;

  constructor(public categoriesService: CategoriesService) { }

  ngOnInit(): void {
    if (this.category.name === '' && this.category.shortDescription === '') {
      this.isNew = true;
    }
  }

  isEditable(): boolean {
    return this.isNew || this.onEdit;
  }

  getPhotoCss(): string {
    let style = '';
    if (!this.isEditable()) {
      style += 'border: none; ';
    }
    if (this.category.photo !== null && this.category.photo !== 'null' && this.category.photo.length > 3) {
      style += `background-image: url(${this.category.photo})`;
    }
    return style;
  }

  getClass(): string {
    return this.isNew ? 'new' :
      this.onEdit ? 'editable' : '';
  }

  handleAvatarChange(event: Event): void { // @ts-ignore
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
        this.category.photo = reader.result;
      }; // @ts-ignore
      reader.readAsDataURL(this.avatar);
    }
  }

  save(): void {
    if (this.category.name.trim().length > 2 && this.category.shortDescription.trim().length > 4) {
        this.saveChanges();
    } else { // @ts-ignore
      message.show('заполните название и короткое описание');
    }
  }

  saveChanges(): void {
    const handleResponse = (response: number) => {
      this.isLoading = false;
      if (response === ResponseCodes.SUCCESS) { // @ts-ignore
        window.message.show('категория сохранёна');
        this.isNew = false; this.onEdit = false;
      } else if (response === ResponseCodes.ALREADY_EXISTS){ // @ts-ignore
        window.message.show('такая категория уже существует');
      } else {
        console.log(response); // @ts-ignore
        window.message.show('не удалось сохранить категорию');
      }
    };

    if (this.avatar !== null) {
      this.categoriesService.uploadPhoto(this.avatar)
        .subscribe(event => {
          if (event instanceof HttpResponse) { // @ts-ignore
            this.category.photo = event.body.url;
            this.categoriesService.saveCategory(this.category, this.isNew).subscribe(handleResponse);
          }});
    } else {
      this.categoriesService.saveCategory(this.category, this.isNew).subscribe(handleResponse);
    }
  }

  edit(): void {
    this.onEdit = true;
  }

  cancel(): void {
    if (this.isNew) {
      this.remove();
    } else {
      this.isLoading = true;
      this.categoriesService.reloadCategory(this.category.name);
    }
    this.onEdit = false;
  }

  delete(): void {
    if (this.isNew) {
      this.remove();
      return;
    }
    this.isLoading = true;
    this.categoriesService.deleteCategory(this.category.name)
      .subscribe(response => {
        if (response === ResponseCodes.SUCCESS) { // @ts-ignore
          window.message.show('категория удалена');
          this.remove();
        } else if (response === ResponseCodes.NOT_EMPTY) { // @ts-ignore
          window.message.show('в этой категории есть двигатели. удалить нельзя');
        } else { // @ts-ignore
          window.message.show('удалить не удалось. Перезагрузите страницу и попробуйте еще раз');
        }
        this.isLoading = false;
      });
  }

  remove(): void {
    const index = this.categoriesService.categories.indexOf(this.category);
    if (index >= 0) {
      this.categoriesService.categories.splice(index, 1);
    }
  }

}
