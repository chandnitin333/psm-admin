import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ITEM_PER_PAGE } from '../../constants/admin.constant';
import { KaryaKaraniKametiService } from '../../services/karya-karani-kameti.service';
import Util from '../../utils/utils';
import { PaginationComponent } from '../pagination/pagination.component';
import { SortingTableComponent } from '../sorting-table/sorting-table.component';
@Component({
  selector: 'app-karyakaranikameti',
  standalone: true,
  imports: [PaginationComponent, SortingTableComponent, FormsModule],
  templateUrl: './karyakaranikameti.component.html',
  styleUrl: './karyakaranikameti.component.css'
})
export class KaryakaranikametiComponent {
  currentPage: number = 1;
  searchValue: string = '';
  items: any = [];
  totalItems: number = 0;
  itemsPerPage: number = ITEM_PER_PAGE
  displayedColumns: any = [
    { key: 'sr_no', label: 'अनुक्रमांक' },
    { key: 'DESIGNATION_NAME', label: 'पद' },
  ];

  keyName: string = 'DESIGNATION_ID';
  marathiText: string = '';
  constructor(private titleService: Title, private karkani: KaryaKaraniKametiService, private util: Util) { }

  ngOnInit(): void {
    this.titleService.setTitle('Karya Karani Kameti');
    this.fetchData();
  }


  fetchData() {
    this.karkani.fetchKarkaraniKamethi({ page_number: this.currentPage, search_text: this.searchValue }).subscribe({
      next: (res: any) => {
        this.items = res?.data ?? [];
        this.totalItems = res?.totalRecords;
      },
      error: (err: any) => {
        console.error('Error get Open Plot List:', err);
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

