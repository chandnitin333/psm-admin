import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ITEM_PER_PAGE } from '../../constants/admin.constant';
import { MilkatVaparService } from '../../services/milkat-vapar.service';
import Util from '../../utils/utils';
import { PaginationComponent } from '../pagination/pagination.component';
import { SortingTableComponent } from '../sorting-table/sorting-table.component';

@Component({
    selector: 'app-milkatvapar',
    standalone: true,
    imports: [PaginationComponent, SortingTableComponent, FormsModule],
    templateUrl: './milkatvapar.component.html',
    styleUrl: './milkatvapar.component.css'
})
export class MilkatvaparComponent {
    currentPage: number = 1;
    searchValue: string = '';
    items: any = [];
    totalItems: number = 0;
    itemsPerPage: number = ITEM_PER_PAGE
    displayedColumns: any = [
        { key: 'sr_no', label: 'अनुक्रमांक' },
        { key: 'MILKAT_VAPAR_NAME', label: 'मालमत्तेचे प्रकार' },
       
    ];

    keyName: string = 'MILKAT_VAPAR_ID';
    marathiText: string = '';
    constructor(private titleService: Title, private milkatVapar: MilkatVaparService, private util: Util) { }


    ngOnInit(): void {
        this.titleService.setTitle('Milkat Vapar');
        this.fetchData();
    }

    fetchData() {
        this.milkatVapar.getMilkatVaparList({ page_number: this.currentPage, search_text: this.searchValue }).subscribe({
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
