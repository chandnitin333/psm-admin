import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Select2Directive } from '../../directives/select2.directive';
import { HttpHeaderInterceptor } from '../../http.interceptor';
import { ApiService } from '../../services/api.service';
import { AdminRoutingModule } from './admin-routing.module';
import { LoaderComponent } from './components/loader/loader.component';
import { GatGramPanchayatService } from './services/gat-gram-panchayat.service';
import { GramPanchayatService } from './services/gram-panchayat.service';
import { TalukaService } from './services/taluka.service';




@NgModule({

  declarations: [
    Select2Directive
  ],
  imports: [
    LoaderComponent,
    CommonModule,
    AdminRoutingModule,
    HttpClientModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      timeOut: 5000,
      closeButton: true, // Optionally add a close button
      progressBar: true, // Optionally add a progress bar
      toastClass: 'ngx-toastr custom-toast', // Apply custom toast class
      titleClass: 'custom-toast-title', // Apply custom title class
      messageClass: 'custom-toast-message' // Apply custom message class
    }),


  ],
  providers: [
    ApiService,
    TalukaService,
    GramPanchayatService,
    GatGramPanchayatService,
    ToastrService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpHeaderInterceptor,
      multi: true
    }
  ],
})
export class AdminModule { }
