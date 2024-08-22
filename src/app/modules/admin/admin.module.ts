import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { HttpHeaderInterceptor } from '../../http.interceptor';
import { ApiService } from '../../services/api.service';
import { AdminRoutingModule } from './admin-routing.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminRoutingModule,
    HttpClientModule
  ],
  providers: [
    ApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpHeaderInterceptor,
      multi: true
    }
  ],
})
export class AdminModule { }
