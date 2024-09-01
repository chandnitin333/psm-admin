
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { TranslateService } from '../../../../services/translate.service';
import { PaginationComponent } from '../pagination/pagination.component';


@Component({
  selector: 'app-taluka',
  standalone: true,
  imports: [RouterLink, FormsModule, HttpClientModule, PaginationComponent, CommonModule],
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
  constructor(private titleService: Title, private translate: TranslateService, private apiService: ApiService) { }
  ngOnInit(): void {
    this.titleService.setTitle('Taluka');
    this.getTalukas();
    this.getAllDistricts();

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
    this.apiService.post('taluka/talukas', { pageNumber: pageNumber, searchText: this.searchValue }).subscribe({
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
    clearTimeout(this.debounceTimeout);
    setTimeout(() => {
      this.searchValue = this.commonText;
      this.getTalukas();
    }, 3000);

  }

  getAllDistricts() {
    // Get all districts
    this.apiService.get('district/districts_ddl').subscribe({
      next: (res: any) => {
        this.districts = res.data;

      },
      error: (err: Error) => {
        console.error('Error getting districts:', err);
      }
    });
  }
}
