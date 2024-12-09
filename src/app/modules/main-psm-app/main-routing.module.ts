import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './src/components/home/home.component';


const routes: Routes = [
  {
    path: '', component: HomeComponent, children: [
      { path: 'home', component: HomeComponent },
      { path: '', redirectTo: '/main/home', pathMatch: 'full' }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }