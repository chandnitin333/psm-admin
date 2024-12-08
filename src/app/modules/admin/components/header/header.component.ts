import { Component } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { DomService } from '../../../../services/dom.service';
import { CommonModule } from '@angular/common';
// import $ from 'jquery'; // Import jQuery
declare var $: any;
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
 loggedInUser:any;
 isSidebarOpen: boolean = true; // Track whether the sidebar is open
 isNotificationOpen: boolean = false; // Track whether the notification panel is open
  constructor(private auth:AuthService,private domService: DomService){
    let userDetails = localStorage.getItem('userDetals');
    if (userDetails) {
      this.loggedInUser = JSON.parse(userDetails);
      console.log('Retrieved User Details:', this.loggedInUser);
    }
    // console.log("userDetals", userDetails)
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
  toggleNotification(): void {
    this.isNotificationOpen = !this.isNotificationOpen;
    if(this.isNotificationOpen) {
      this.isSidebarOpen = false;
    } else {
      this.isSidebarOpen = true;
    }
  }
  
}
