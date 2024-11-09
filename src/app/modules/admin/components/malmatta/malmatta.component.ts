import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ITEM_PER_PAGE } from '../../constants/admin.constant';
import { MalmataService } from '../../services/malmata.service';
import Util from '../../utils/utils';
import { PaginationComponent } from '../pagination/pagination.component';
import { SortingTableComponent } from '../sorting-table/sorting-table.component';

@Component({
  selector: 'app-malmatta',
  standalone: true,
  imports: [PaginationComponent, SortingTableComponent, FormsModule],
  templateUrl: './malmatta.component.html',
  styleUrl: './malmatta.component.css'
})
export class MalmattaComponent {
  currentPage: number = 1;
  searchValue: string = '';
  items: any = [];
  totalItems: number = 0;
  itemsPerPage: number = ITEM_PER_PAGE
  displayedColumns: any = [
    { key: 'sr_no', label: 'अनुक्रमांक' },
    { key: 'DESCRIPTION_NAME', label: 'मालमत्तेचे प्रकार' },
    {key:'DESCRIPTION_NAME_EXTRA', label:'मालमत्तेचे विवरण'},

  ];

  keyName: string = 'MALMATTA_ID';
  marathiText: string = '';
  constructor(private titleService: Title, private malamata: MalmataService, private util: Util) { }

  ngOnInit(): void {
    this.titleService.setTitle('Malmatta');
    this.fetchData();
  }

  fetchData() {
    this.malamata.getMalmataList({ page_number: this.currentPage, search_text: this.searchValue }).subscribe({
      next: (res: any) => {
        this.items = res?.data ?? [];
        this.totalItems = res?.totalRecords;
      },
      error: (err: any) => {
        console.error('Error get Milkat Vapar List Data:', err);
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
