import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {LoginPageComponent} from './pages/login-page/login-page.component';
import {EnginesPageComponent} from './pages/engines-page/engines-page.component';

const routes = [
  { path: '', component: LoginPageComponent },
  { path: 'engines', component: EnginesPageComponent, pathMatch: 'full' },
  { path: 'engines/:id', component: EnginesPageComponent, pathMatch: 'prefix' },
  { path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
