import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { Select2Directive } from '../../directives/select2.directive';


@NgModule({
  declarations: [Select2Directive],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
