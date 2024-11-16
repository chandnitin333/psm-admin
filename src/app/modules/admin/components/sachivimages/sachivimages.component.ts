import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ITEM_PER_PAGE } from '../../constants/admin.constant';
import { SachiveImagesService } from '../../services/sachive-images.service';
import Util from '../../utils/utils';
import { PaginationComponent } from '../pagination/pagination.component';
import { SortingTableComponent } from '../sorting-table/sorting-table.component';
@Component({
  selector: 'app-sachivimages',
  standalone: true,
  imports: [RouterLink, PaginationComponent, SortingTableComponent, FormsModule],
  templateUrl: './sachivimages.component.html',
  styleUrl: './sachivimages.component.css'
})
export class SachivimagesComponent {

  currentPage: number = 1;
  searchValue: string = '';
  items: any = [];
  totalItems: number = 0;
  itemsPerPage: number = ITEM_PER_PAGE
  displayedColumns: any = [
    { key: 'sr_no', label: 'अनुक्रमांक' },
    { key: 'DISTRICT_NAME', label: 'जिल्हा' },
    { key: 'TALUKA_NAME', label: 'तालुका' },
    { key: 'PANCHAYAT_NAME', label: 'ग्राम पंचायत' },
    { key: 'FILE_NAME', label: 'सचिव नाव' },
  ];

  keyName: string = 'INCOME_ID';
  marathiText: string = '';

  constructor(private titleService: Title, private sachive: SachiveImagesService, private util: Util) { }
  ngOnInit(): void {
    this.titleService.setTitle('Sachiv Images List');
    this.fetchData();
  }


  fetchData() {
    this.sachive.fetchSachiveImagesList({ page_number: this.currentPage, search_text: this.searchValue }).subscribe({
      next: (res: any) => {
        this.items = res?.data ?? [];
        this.totalItems = res?.totalRecords;
      },
      error: (err: any) => {
        console.error('Error get TaxList Data:', err);
      }
    });

  }


  editInfo(id: number) {

  }

  deleteInfo(id: number) {

  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.fetchData();
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

  filterData() {

  }

  resetFilter(event: Event) {

  }

}