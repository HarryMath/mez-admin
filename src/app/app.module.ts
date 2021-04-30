import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './common/header/header.component';
import { MenuComponent } from './common/menu/menu.component';
import { EnginesPageComponent } from './pages/engines-page/engines-page.component';
import { EngineComponent } from './components/engine/engine.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { CategoriesPageComponent } from './pages/categories-page/categories-page.component';
import { CategoryComponent } from './components/category/category.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MenuComponent,
    EnginesPageComponent,
    EngineComponent,
    LoginPageComponent,
    CategoriesPageComponent,
    CategoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
