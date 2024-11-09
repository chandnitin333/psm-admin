import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BharankRatesService } from '../../services/bharank-rates.service';
import Util from '../../utils/utils';
import { ITEM_PER_PAGE } from '../../constants/admin.constant';
import { PaginationComponent } from '../pagination/pagination.component';
import { SortingTableComponent } from '../sorting-table/sorting-table.component';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-bharankdar',
  standalone: true,
  imports: [PaginationComponent, SortingTableComponent, FormsModule],
  templateUrl: './bharankdar.component.html',
  styleUrl: './bharankdar.component.css'
})
export class BharankdarComponent {
  currentPage: number = 1;
  searchValue: string = '';
  items: any = [];
  totalItems: number = 0;
  itemsPerPage: number = ITEM_PER_PAGE
  displayedColumns: any = [
    { key: 'sr_no', label: 'अनुक्रमांक' },
    { key: 'MILKAT_VAPAR_NAME', label: 'मालमत्तेचे वर्णन' },
    { key: 'BUILDINGWEIGHTS_NAME', label: 'भारांक' }


  ];

  keyName: string = 'BUILDINGWEIGHTS_ID';
  marathiText: string = '';
  constructor(private titleService: Title, private bharank: BharankRatesService, private util: Util) { }

  ngOnInit(): void {
    this.titleService.setTitle('Bharank Dar');
    this.fetchData();
  }


  fetchData() {
    this.bharank.fetchBharankRatesList({ page_number: this.currentPage, search_text: this.searchValue }).subscribe({
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
