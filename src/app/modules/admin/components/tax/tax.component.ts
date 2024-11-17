import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ITEM_PER_PAGE } from '../../constants/admin.constant';
import { TaxService } from '../../services/tax.service';
import Util from '../../utils/utils';
import { PaginationComponent } from '../pagination/pagination.component';
import { SortingTableComponent } from '../sorting-table/sorting-table.component';

@Component({
  selector: 'app-tax',
  standalone: true,
  imports: [PaginationComponent, SortingTableComponent, FormsModule],
  templateUrl: './tax.component.html',
  styleUrl: './tax.component.css'
})
export class TaxComponent {
  currentPage: number = 1;
  searchValue: string = '';
  items: any = [];
  totalItems: number = 0;
  itemsPerPage: number = ITEM_PER_PAGE
  displayedColumns: any = [
    { key: 'sr_no', label: 'अनुक्रमांक' },
    { key: 'OTHERTAX_NAME', label: 'करांची नावे' },

  ];

  keyName: string = 'INCOME_ID';
  marathiText: string = '';
  constructor(private titleService: Title, private tax: TaxService, private util: Util) { }
  ngOnInit(): void {
    this.titleService.setTitle('Tax');
    this.fetchData();
  }


  fetchData() {
    this.tax.getTaxList({ page_number: this.currentPage, search_text: this.searchValue }).subscribe({
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
