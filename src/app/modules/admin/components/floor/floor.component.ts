import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../../services/api.service';
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
    imports: [SortingTableComponent, PaginationComponent, FormsModule, ReactiveFormsModule, ConfirmationDialogModule, SkeletonLoaderComponent, CommonModule],
    templateUrl: './floor.component.html',
    styleUrl: './floor.component.css'
})
export class FloorComponent {
    errorMessage: string | null = null;
    errorButton: boolean = false;
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
    floorForm = new FormGroup({
        floorName: new FormControl(undefined),
    });

    constructor(
        private titleService: Title,
        private floorService: FloorService,
        private util: Util,
        private apiService: ApiService,
        private toastr: ToastrService) { }

    @ViewChild('confirmationDialog') confirmationDialog!: ConfirmationDialogComponent;
    ngOnInit(): void {
        this.titleService.setTitle('Floor');
        this.fetchFloorData();
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

    fetchFloorData() {
        this.floorService.getFloorList({ page_number: this.currentPage, search_text: this.searchValue }).subscribe({
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

    updateFloor() {
        if (!this.floorForm.invalid && this.floorForm.value.floorName != null) {
            this.isLoading = true;
            let params = {
                name: this.floorForm.value.floorName,
                floor_id: this.floorId,
            };
            this.apiService.put('update-floor', params).subscribe({
                next: (res: any) => {
                    this.reset();
                    this.isSubmitted = true;
                    this.toastr.success('Floor has been successfully updated.', 'Success');
                    this.isLoading = false;
                    this.searchValue = '';
                    this.fetchFloorData();
                },
                error: (err: Error) => {
                    console.error('Error updating floor:', err);
                    this.toastr.error('There was an error updating the floor.', 'Error');
                },
            });
        } else {
            this.toastr.warning('Please fill all required fields.', 'warning');
        }
    }

    editInfo(id: number) {
        this.isLoading = true;
        this.apiService.get('floor/' + id).subscribe({
            next: (res: any) => {
                this.floorForm.patchValue({
                    floorName: res?.data?.FLOOR_NAME,
                });

                this.floorId = res?.data?.FLOOR_ID;
                this.isEdit = true;
                this.isLoading = false;
            },
            error: (err: Error) => {
                console.error('Error getting floor:', err);
                this.toastr.error('There was an error getting the floor.', 'Error');
            },
        });
    }

    deleteInfo(id: number) {
        this.util.showConfirmAlert().then((res) => {
            if (id === 0) {
                this.toastr.error('This Floor cannot be deleted.', 'Error');
                return;
            }
            if (res) {
                this.apiService.delete('delete-floor/' + id).subscribe({
                    next: (res: any) => {
                        if (res.status == 200) {
                            this.toastr.success(res.message, "Success");
                            this.fetchFloorData();

                        } else {
                            this.toastr.error(res.message, "Error");
                        }
                        // this.isLoading = false;
                    },
                    error: (err: Error) => {
                        console.error('Error deleting Floor:', err);
                        this.toastr.error('There was an error deleting the Floor.', 'Error');
                    }
                });
            }
        });
    }

    onConfirmed(confirmed: boolean) {
        if (confirmed) {
            // Perform the delete action
            console.log('floor deleted', confirmed);
            //  this.fetchDistrictData();
        } else {
            console.log('Delete action cancelled');
        }
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

    keyDownText(event: KeyboardEvent, controlName: string): void {
        this.util.onKeydown(event, controlName, this.floorForm);
    }

    filterData(event: Event) {
        const searchText = (event.target as HTMLInputElement).value.toLowerCase();
        console.log('searchText', searchText);
        this.currentPage = 1;
        this.searchValue = searchText;
        this.debounceFetchFloorData();
    }

    private debounceFetchFloorData = this.debounce(() => {
        this.fetchFloorData();
    }, 1000);

    private debounce(func: Function, wait: number) {
        let timeout: any;
        return (...args: any[]) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(this, args);
            }, wait);
        };
    }

    resetFilter(event: Event) {
        this.searchValue = '';
        this.currentPage = 1;
        this.fetchFloorData();
    }
    async onValidate(event:any)
    {
        if(event.target.value == ""){
			this.errorButton = false;
            this.errorMessage = "This field must be required";
		} else {
            this.errorButton = true;
            this.errorMessage = "";
        }
    }
}