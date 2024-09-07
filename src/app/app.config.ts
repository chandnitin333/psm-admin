import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { routes } from './app.routes';
import { HttpHeaderInterceptor } from './http.interceptor';
import { ApiService } from './services/api.service';
import { TalukaService } from './modules/admin/services/taluka.service';
export const appConfig: ApplicationConfig = {

  providers: [
    provideRouter(routes),
    provideHttpClient(),
    ApiService,
    TalukaService,
    ToastrService,
    provideAnimations(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpHeaderInterceptor,
      multi: true
    }
  ]
};