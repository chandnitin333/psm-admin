import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Select2Directive } from '../../directives/select2.directive';
import { HttpHeaderInterceptor } from '../../http.interceptor';
import { ApiService } from '../../services/api.service';
import { AdminRoutingModule } from './admin-routing.module';
import { LoaderComponent } from './components/loader/loader.component';
import { AnualTaxService } from './services/anual-tax.service';
import { BdoService } from './services/bdo.service';
import { BharankRatesService } from './services/bharank-rates.service';
import { FloorService } from './services/floor.service';
import { GatGramPanchayatService } from './services/gat-gram-panchayat.service';
import { GhasaraRatesService } from './services/ghasara-rates.service';
import { GramPanchayatService } from './services/gram-panchayat.service';
import { KamkajKametiService } from './services/kamkaj-kameti.service';
import { KaryaKaraniKametiService } from './services/karya-karani-kameti.service';
import { MalamataPrakarService } from './services/malamata-prakar.service';
import { MalmataService } from './services/malmata.service';
import { MilkatVaparService } from './services/milkat-vapar.service';
import { OpenPlotRatesService } from './services/open-plot-rates.service';
import { OtherTaxService } from './services/other-tax.service';
import { PrakarService } from './services/prakar.service';
import { SachiveImagesService } from './services/sachive-images.service';
import { TalukaService } from './services/taluka.service';
import { TawarService } from './services/tawar.service';
import { TaxService } from './services/tax.service';
import { TowerService } from './services/tower.service';
import { UploadFileService } from './services/upload-file.service';
import { UsersService } from './services/users.service';




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
    FloorService,
    PrakarService,
    MalamataPrakarService,
    MilkatVaparService,
    MalmataService,
    TaxService,
    OtherTaxService,
    AnualTaxService,
    OpenPlotRatesService,
    GhasaraRatesService,
    BharankRatesService,
    TawarService,
    KaryaKaraniKametiService,
    KamkajKametiService,
    ToastrService,
    BdoService,
    SachiveImagesService,
    UploadFileService,
    UsersService,
    TowerService
    ,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpHeaderInterceptor,
      multi: true
    }
  ],
})
export class AdminModule { }
