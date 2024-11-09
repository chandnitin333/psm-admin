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
    // Ensure the loader is hidden after the view has been fully initialized
    setTimeout(() => {
      this.loading = false;
    }, 2000);

    $(document).on('select2:open', () => {
      // Delegate the event to the document to capture dynamically created search fields in all select2 instances
      $(document).on('keyup', '.select2-search__field', async (event) => {
        if (event.key === 'Enter') {  // Check if the key pressed is 'Enter'
          const searchTerm = $(event.target).val();
          console.log('Enter key pressed. Search term:', searchTerm);

          // Assuming translateText is a function that returns a Promise for the translation
          try {
            let convertText: any = await this.translateText(event as unknown as Event);
            console.log('Translated Text:', convertText);

            // Update the search field with the translated text
            $(event.target).val(convertText);

            // Trigger the input event to refresh the select2 results with the translated search term
            $(event.target).trigger('input');
          } catch (error) {
            console.error('Error in translation:', error);
          }
        }
      });
    });


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
