import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {LoginPageComponent} from './pages/login-page/login-page.component';
import {EnginesPageComponent} from './pages/engines-page/engines-page.component';
import {CategoriesPageComponent} from './pages/categories-page/categories-page.component';
import {ManufacturersPageComponent} from './pages/manufaturers-page/manufacturers-page.component';
import {NewsPageComponent} from './pages/news-page/news-page.component';

const routes = [
  { path: '', component: LoginPageComponent },
  { path: 'engines', component: EnginesPageComponent, pathMatch: 'full' },
  { path: 'categories', component: CategoriesPageComponent, pathMatch: 'full' },
  { path: 'manufacturers', component: ManufacturersPageComponent, pathMatch: 'full' },
  { path: 'news', component: NewsPageComponent, pathMatch: 'full' },
  { path: 'engines/:id', component: EnginesPageComponent, pathMatch: 'prefix' },
  { path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
