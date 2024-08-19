import { Component } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { DomService } from '../../../../services/dom.service';
// import $ from 'jquery'; // Import jQuery
declare var $: any;
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
 isSidebarOpen: boolean = false; // Track whether the sidebar is open
  constructor(private auth:AuthService,private domService: DomService){

  }
  logout(){
    this.auth.logout();
  }
  addClassToBody(): void {
    this.domService.addBodyClass('sidebar-minified-out');
    this.domService.removeBodyClass('sidebar-minified');
  }

  removeClassFromBody(): void {
    this.domService.removeBodyClass('sidebar-minified-out');
    this.domService.addBodyClass('sidebar-minified');
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
    if(this.isSidebarOpen) {
      this.addClassToBody();
    } else {
      this.removeClassFromBody();
    }
  }
  
}
