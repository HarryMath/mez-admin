import {Component, Input, OnInit} from '@angular/core';
import {NewsService, Post} from '../../shared/news.service';
import {ImagesService} from '../../shared/images.service';
import {ResponseCodes} from '../../shared/response.codes';
import {HttpResponse} from '@angular/common/http';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  static readonly MONTHS = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

  @Input() post!: Post;

  isNew = false;
  onEdit = false;
  isLoading = false;
  avatar: File|null = null;

  constructor(
    public newsService: NewsService,
    public imagesService: ImagesService) { }

  ngOnInit(): void {
    if (this.post.title === '') {
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
    if (this.post.photo !== null && this.post.photo !== 'null' && this.post.photo.length > 3) {
      style += `background-image: url(${this.post.photo})`;
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
        this.post.photo = reader.result;
      }; // @ts-ignore
      reader.readAsDataURL(this.avatar);
    }
  }

  save(): void {
    if (this.post.title.trim().length > 2 && this.post.beforePhotoText.trim().length > 5) {
      this.isLoading = true;
      this.saveChanges();
    } else { // @ts-ignore
      message.show('заполните заголовок и введение');
    }
  }

  saveChanges(): void {
    const handleResponse = (response: number) => {
      this.isLoading = false;
      if (response > 0) { // @ts-ignore
        window.message.show('новость сохранёна');
        this.post.id = response;
        if (this.isNew) {
          this.post.date = this.getNowDateString();
        }
        this.isNew = false; this.onEdit = false;
      } else {
        console.log(response); // @ts-ignore
        window.message.show('не удалось сохранить новость');
      }
    };

    if (this.avatar !== null) {
      this.imagesService.uploadPhoto(this.avatar)
        .subscribe(event => {
          if (event instanceof HttpResponse) { // @ts-ignore
            this.post.photo = event.body.url;
            this.newsService.savePost(this.post, this.isNew).subscribe(handleResponse);
          }});
    } else {
      this.newsService.savePost(this.post, this.isNew).subscribe(handleResponse);
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
      this.newsService.reloadPost(this.post.id);
    }
    this.onEdit = false;
  }

  delete(): void {
    if (this.isNew || this.post.id == null) {
      this.remove();
      return;
    }
    this.isLoading = true;
    this.newsService.deletePost(this.post.id)
      .subscribe(response => {
        if (response === ResponseCodes.SUCCESS) { // @ts-ignore
          window.message.show('новость удалена');
          this.remove();
        } else { // @ts-ignore
          window.message.show('удалить не удалось. Перезагрузите страницу и попробуйте еще раз');
        }
        this.isLoading = false;
      });
  }

  remove(): void {
    const index = this.newsService.news.indexOf(this.post);
    if (index >= 0) {
      this.newsService.news.splice(index, 1);
    }
  }

  getNowDateString(): string {
    const date = new Date();
    return date.getDate() + PostComponent.MONTHS[date.getMonth()] + date.getFullYear();
  }

}
