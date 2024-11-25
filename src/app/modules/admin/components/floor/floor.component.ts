import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ITEM_PER_PAGE } from '../../constants/admin.constant';
import { ConfirmationDialogModule } from '../../module/confirmation-dialog/confirmation-dialog.module';
import { FloorService } from '../../services/floor.service';
import Util from '../../utils/utils';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';
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
    isLoading: boolean = true;
    items: any = [];
    totalItems: number = 0;
    itemsPerPage: number = ITEM_PER_PAGE
    displayedColumns: any = [
        { key: 'sr_no', label: 'अनुक्रमांक' },
        { key: 'FLOOR_NAME', label: 'मजल्याचे नाव' }
    ];
    isEdit: boolean = false;
    isSubmitted: boolean = false;

    keyName: string = 'FLOOR_ID';
    private floorId: number = 0;
    marathiText: string = '';

    constructor(private titleService: Title, private floorService: FloorService, private util: Util) { }


    ngOnInit(): void {
        this.titleService.setTitle('Floor');
        this.fetchData();
    }

    addFloor(): void {
        if (!this.floorForm.invalid && this.floorForm.value.floorName != null) {

            this.isLoading = true;
            let params = {
                name: this.floorForm.value.floorName,
            };
            this.apiService.post('floor', params).subscribe({
                next: (res: any) => {
                    if (res.status !== 400) {
                        this.reset();
                        this.toastr.success('District has been successfully added.', 'Success');
                        this.isSubmitted = true;
                        this.fetchFloorData();
                    }
                    else {
                        this.toastr.warning("Floor already exits. please try another one.", 'Warning');
                    }
                    this.isLoading = false;
                },
                error: (err: Error) => {
                    console.error('Error adding floor:', err);
                    this.toastr.error('There was an error adding the floor.', 'Error');
                },
            });
        } else {
            this.toastr.warning('Please fill all required fields.', 'warning');
        }
    }

    reset() {
        this.floorForm.reset();
        this.isEdit = false;
    }

    fetchData() {
        this.floor.getFloorList({ page_number: this.currentPage, search_text: this.searchValue }).subscribe({
            next: (res: any) => {
                this.items = res?.data ?? [];
                this.totalItems = res?.totalRecords;
                this.isLoading = false;
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