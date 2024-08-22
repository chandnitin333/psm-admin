import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ContactComponent } from './components/contact/contact.component';
import { HomeComponent } from './components/home/home.component';
import { ServiceComponent } from './components/service/service.component';
import { DistrictComponent } from './components/district/district.component';
import { TalukaComponent } from './components/taluka/taluka.component';
import { GrampanchayatComponent } from './components/grampanchayat/grampanchayat.component';
import { GatgrampanchayatComponent } from './components/gatgrampanchayat/gatgrampanchayat.component';
import { FloorComponent } from './components/floor/floor.component';
import { PrakarComponent } from './components/prakar/prakar.component';
import { MalmattecheprakarComponent } from './components/malmattecheprakar/malmattecheprakar.component';
import { MilkatvaparComponent } from './components/milkatvapar/milkatvapar.component';
import { MalmattaComponent } from './components/malmatta/malmatta.component';
import { TaxComponent } from './components/tax/tax.component';
import { OthertaxComponent } from './components/tax/othertax/othertax.component';
import { AnnualtaxComponent } from './components/tax/annualtax/annualtax.component';
import { OpenplotlistComponent } from './components/openplotlist/openplotlist.component';
import { AddopneplotratesComponent } from './components/openplotlist/addopneplotrates/addopneplotrates.component';
import { GhasaradarComponent } from './components/ghasaradar/ghasaradar.component';
import { BharankdarComponent } from './components/bharankdar/bharankdar.component';
import { TowerComponent } from './components/tower/tower.component';
import { KaryakaranikametiComponent } from './components/karyakaranikameti/karyakaranikameti.component';
import { KamkajkametiComponent } from './components/kamkajkameti/kamkajkameti.component';
import { AddnewkamkajkametiComponent } from './components/kamkajkameti/addnewkamkajkameti/addnewkamkajkameti.component';
import { UploadfileComponent } from './components/uploadfile/uploadfile.component';
import { BdoComponent } from './components/bdo/bdo.component';
import { AddnewbdoComponent } from './components/bdo/addnewbdo/addnewbdo.component';
import { SachivimagesComponent } from './components/sachivimages/sachivimages.component';
import { AddnewsachivComponent } from './components/sachivimages/addnewsachiv/addnewsachiv.component';
import { SarpanchimagesComponent } from './components/sarpanchimages/sarpanchimages.component';
import { AddnewsarpanchComponent } from './components/sarpanchimages/addnewsarpanch/addnewsarpanch.component';
import { OopsarpanchimagesComponent } from './components/oopsarpanchimages/oopsarpanchimages.component';
import { AddnewoopsarpanchComponent } from './components/oopsarpanchimages/addnewoopsarpanch/addnewoopsarpanch.component';
import { AdminComponent } from './components/admin/admin.component';
import { UsersComponent } from './components/users/users.component';
import { TitleService } from '../../services/title.service';

const routes: Routes = [
  {
    path: '', component: AdminDashboardComponent, children: [
      { path: 'home', component: HomeComponent},
      { path: 'about', component: AboutComponent },
      { path: 'services', component: ServiceComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'district', component: DistrictComponent },
      { path: 'taluka', component: TalukaComponent },
      { path: 'gram-panchayat', component: GrampanchayatComponent },
      { path: 'gat-gram-panchayat', component: GatgrampanchayatComponent },
      { path: 'users', component: UsersComponent },
      { path: 'floor', component: FloorComponent },
      { path: 'prakar', component: PrakarComponent },
      { path: 'malmatteche-prakar', component: MalmattecheprakarComponent },
      { path: 'milkat-vapar', component: MilkatvaparComponent },
      { path: 'malmatta', component: MalmattaComponent },
      { path: 'tax', component: TaxComponent },
      { path: 'other-tax', component: OthertaxComponent },
      { path: 'annual-tax', component: AnnualtaxComponent },
      { path: 'open-plots-list', component: OpenplotlistComponent },
      { path: 'add-open-plots-rates', component: AddopneplotratesComponent },
      { path: 'ghasara-dar', component: GhasaradarComponent },
      { path: 'bharank-dar', component: BharankdarComponent },
      { path: 'tower', component: TowerComponent },
      { path: 'karya-karani-kameti', component: KaryakaranikametiComponent },
      { path: 'kamkaj-kameti', component: KamkajkametiComponent },
      { path: 'new-kamkaj-kameti', component: AddnewkamkajkametiComponent },
      { path: 'upload-file', component: UploadfileComponent },
      { path: 'bdo', component: BdoComponent },
      { path: 'add-new-bdo', component: AddnewbdoComponent },
      { path: 'sachiv-list', component: SachivimagesComponent },
      { path: 'add-new-sachiv-images', component: AddnewsachivComponent },
      { path: 'sarpanch-list', component: SarpanchimagesComponent },
      { path: 'add-new-sarpanch', component: AddnewsarpanchComponent },
      { path: 'oopsarpanch-list', component: OopsarpanchimagesComponent },
      { path: 'add-new-oopsarpanch', component: AddnewoopsarpanchComponent },
      { path: 'admin', component: AdminComponent },
      { path: '', redirectTo: '/admin/home', pathMatch: 'full' }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [TitleService]
})
export class AdminRoutingModule { }
