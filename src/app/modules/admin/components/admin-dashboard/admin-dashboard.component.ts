import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { LoaderComponent } from '../loader/loader.component';
import { SideMenuComponent } from "../side-menu/side-menu.component";

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterOutlet, SideMenuComponent, LoaderComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  loading = false;
  constructor(private titleService: Title, private router: Router) {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loading = true;
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.loading = true;
      }
    });
  }
  ngOnInit(): void {
    this.titleService.setTitle('Dashbaord');
  }
  ngAfterViewInit(): void {
    // Ensure the loader is hidden after the view has been fully initialized
    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }



}
