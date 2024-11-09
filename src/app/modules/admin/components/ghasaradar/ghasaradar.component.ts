import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ITEM_PER_PAGE } from '../../constants/admin.constant';
import { GhasaraRatesService } from '../../services/ghasara-rates.service';
import Util from '../../utils/utils';
import { PaginationComponent } from '../pagination/pagination.component';
import { SortingTableComponent } from '../sorting-table/sorting-table.component';

@Component({
  selector: 'app-ghasaradar',
  standalone: true,
  imports: [PaginationComponent, SortingTableComponent, FormsModule, RouterLink],
  templateUrl: './ghasaradar.component.html',
  styleUrl: './ghasaradar.component.css'
})
export class GhasaradarComponent {
  currentPage: number = 1;
  searchValue: string = '';
  items: any = [];
  totalItems: number = 0;
  itemsPerPage: number = ITEM_PER_PAGE
  displayedColumns: any = [
    { key: 'sr_no', label: 'अनुक्रमांक' },
    { key: 'AGEOFBUILDING_NAME', label: 'मालमत्तेचे वय व वर्ष' },
    { key: 'MALAMATA_NAME', label: 'मालमत्तेचे वर्णन' },
    { key: 'DEPRECIATION_NAME', label: 'टक्केवारी' }


  ];

  keyName: string = 'DEPRECIATION_ID';
  marathiText: string = '';
  constructor(private titleService: Title, private openPlot: GhasaraRatesService, private util: Util) { }
  ngOnInit(): void {
    this.titleService.setTitle('Ghasara Dar');
    this.fetchData();
  }


  fetchData() {
    this.openPlot.getGhasaraList({ page_number: this.currentPage, search_text: this.searchValue }).subscribe({
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