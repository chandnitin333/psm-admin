
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, Subscription, switchMap } from 'rxjs';
import { ApiService } from '../../../../services/api.service';
import { TalukaService } from '../../../../services/taluka.service';
import { TranslateService } from '../../../../services/translate.service';
import { PaginationComponent } from '../pagination/pagination.component';


@Component({
  selector: 'app-taluka',
  standalone: true,
  imports: [RouterLink, FormsModule, HttpClientModule, PaginationComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './taluka.component.html',
  styleUrl: './taluka.component.css'
})
export class TalukaComponent {
  englishText: string = '';
  marathiText: string = '';
  taluka: any = {};

  items: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  searchValue: string = '';
  totalItems: number = 0;
  commonText: string = ''
  debounceTimeout: any;
  districts: any = [];
  selectedOption = "";
  searchControl = new FormControl();
  private searchTerms = new Subject<string>();
  private subscription: Subscription = new Subscription();
  constructor(private titleService: Title, private translate: TranslateService, private apiService: ApiService, private talukaService: TalukaService) { }
  ngOnInit(): void {
    this.titleService.setTitle('Taluka');
    this.getTalukas();
    this.getAllDistricts();

    this.subscription = this.searchControl.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap((query) => this.talukaService.getTalukas({ pageNumber: this.currentPage, searchText: this.searchValue })) // Switch to new observable
    ).subscribe(item => {
      let data = item as any;
      this.items = data?.data?.talukas;
    });

  }

  ngAfterViewInit() {
    // Use jQuery to select the element and initialize Select2

  }

  translateText(event: Event) {

    const input = event.target as HTMLInputElement;

    let text = input.value;
    input.value = (text.trim() != '') ? text : ' ';
    console.log('Translating text:', text);

    // Debouncing logic
    clearTimeout(this.debounceTimeout);
    this.debounceTimeout = setTimeout(() => {
      if (text.trim() != '') {
        this.translate.translate(text).subscribe({
          next: (res: any) => {

            if (res && res.data && res.data.translations && res.data.translations.length > 0) {
              this.marathiText = res.data.translations[0].translatedText;

              setTimeout(() => {
                this.updateText(this.marathiText, input);
              }, 400);
            } else {
              console.error('Unexpected API response format:', res);
            }
          },
          error: (err) => {
            console.error('Translation API error:', err);
          },
          complete: () => {
            console.log('Translation completed');
          }
        });
      }
    }, 200); // Adjust the debounce delay as per your requirement
  }


  updateText(text: string, field: any) {
    this.commonText = '';
    field.value = '';
    console.log('Updating text:', text);
    field.value = text;
    this.commonText = text;
    this.marathiText = '';

  }


  getTalukas(pageNumber: number = 1) {
    this.apiService.post('/talukas', { pageNumber: pageNumber, searchText: this.searchValue }).subscribe({
      next: (res: any) => {
        this.items = res?.data?.talukas;
        this.totalItems = res?.data?.totalCount;
      },
      error: (err) => {
        console.error('API error:', err);
      },
      complete: () => {

      }
    });
  }

  onPageChange(page: number): void {

    this.currentPage = page;
    this.getTalukas(this.currentPage);

  }
  get paginatedItems(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;

    return this.items;
  }

  getSerialNumber(index: number): number {
    return (this.currentPage - 1) * this.itemsPerPage + index + 1;
  }

  search(): void {
    console.log('Search value:', this.searchValue);

    // clearTimeout(this.debounceTimeout);
    // setTimeout(() => {
    //   this.searchValue = (this.commonText != '') ? this.commonText : this.searchValue;
    //   this.getTalukas();
    // }, 3000);
    this.searchTerms.next("search"); // 
  }

  getAllDistricts() {
    // Get all districts
    this.apiService.get('/districts_ddl').subscribe({
      next: (res: any) => {
        this.districts = res.data;

      },
      error: (err: Error) => {
        console.error('Error getting districts:', err);
      }
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // Clean up the subscription on component destroy
  }
}
