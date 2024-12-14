import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import Util from '../../utils/utils';
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
  marathiText: string = ''

  constructor(private titleService: Title, private router: Router, private util: Util) {

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
    setTimeout(() => {
      this.loading = false;
    }, 2000);

  }

  translateText(event: Event) {
    this.util.getTranslateText(event, this.marathiText).subscribe({
      next: (translatedText: string) => {
        this.marathiText = translatedText;
      },
      error: (error: any) => {
        console.error('Error translating text:', error);
      },
    });

  }



}
