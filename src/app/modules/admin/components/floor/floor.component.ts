import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ITEM_PER_PAGE } from '../../constants/admin.constant';
import { FloorService } from '../../services/floor.service';
import Util from '../../utils/utils';
import { PaginationComponent } from '../pagination/pagination.component';
import { SortingTableComponent } from '../sorting-table/sorting-table.component';

@Component({
    selector: 'app-floor',
    standalone: true,
    imports: [SortingTableComponent, PaginationComponent, FormsModule],
    templateUrl: './floor.component.html',
    styleUrl: './floor.component.css'
})
export class FloorComponent {
    currentPage: number = 1;
    searchValue: string = '';
    items: any = [];
    totalItems: number = 0;
    itemsPerPage: number = ITEM_PER_PAGE
    displayedColumns: any = [
        { key: 'sr_no', label: 'अनुक्रमांक' },
        { key: 'FLOOR_NAME', label: 'मजल्याचे नाव' }
    ];

    keyName: string = 'FLOOR_ID';
    marathiText: string = '';

    constructor(private titleService: Title, private floorService: FloorService, private util: Util) { }


    ngOnInit(): void {
        this.titleService.setTitle('Floor');
        this.fetchFloorData();
    }

    fetchFloorData() {
        this.floorService.getFloorList({ page_number: this.currentPage, search_text: this.searchValue }).subscribe({
            next: (res: any) => {
                console.log("res===", res)
                this.items = res?.data ?? [];
                this.totalItems = res?.totalRecords;
            },
            error: (err: any) => {
                console.error('Error fetch Floor Data:', err);
            }
        });
    }

    editInfo(id: number) {

    }

    deleteInfo(id: number) {

    }

    onPageChange(page: number) {
        this.currentPage = page;
        this.fetchFloorData();
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
