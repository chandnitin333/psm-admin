import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../../services/api.service';
import { ITEM_PER_PAGE } from '../../constants/admin.constant';
import { ConfirmationDialogModule } from '../../module/confirmation-dialog/confirmation-dialog.module';
import { Util } from '../../utils/utils';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';
import { SortingTableComponent } from '../sorting-table/sorting-table.component';

@Component({
    selector: 'app-district',
    standalone: true,
    imports: [
        RouterOutlet,
        RouterLink,
        SkeletonLoaderComponent,
        CommonModule,
        SortingTableComponent,
        PaginationComponent,
        ReactiveFormsModule,
        ConfirmationDialogModule,
        FormsModule
    ],
    templateUrl: './district.component.html',
    styleUrls: ['./district.component.css'],
})
export class DistrictComponent implements OnInit {
    district: any = [];
    isLoading: boolean = true;
    currentPage: number = 1;
    itemsPerPage: number = ITEM_PER_PAGE;
    isSubmitted: boolean = false;

    isEdit: boolean = false;
    items: any[] = [];
    searchValue: string = '';
    totalItems: number = 0;
    districtForm = new FormGroup({
        districtName: new FormControl(undefined),
    });
    private marathiText: string = '';
    private districtId: number = 0;

    constructor(
        private titleService: Title,
        private apiService: ApiService,
        private toastr: ToastrService,
        private util: Util,
        private cdr: ChangeDetectorRef,
        private toast: ToastrService
    ) { }
    @ViewChild('confirmationDialog') confirmationDialog!: ConfirmationDialogComponent;
    ngOnInit(): void {
        this.titleService.setTitle('District');
        this.fetchDistrictData();
    }

    fetchDistrictData(): void {
        let pageNumber: number = this.currentPage;
        this.apiService
            .post('district-list', {
                page_number: pageNumber,
                limit: this.itemsPerPage,
                searchText: this.searchValue,
            })
            .subscribe((res: any) => {
                this.district = res?.data;
                this.items = res?.data;
                this.totalItems = res?.total_count ?? 0;
                this.itemsPerPage = res?.limit;
                setTimeout(() => {
                    this.isLoading = false;
                }, 1000);
            });
    }
    onPageChange(page: number): void {
        this.currentPage = page;
        this.fetchDistrictData();
    }
    get paginatedItems(): any[] {
        return this.items;
    }

    getSerialNumber(index: number): number {

        return (this.currentPage - 1) * this.itemsPerPage + index + 1;
    }

    addDistrict(): void {
        if (
            !this.districtForm.invalid &&
            this.districtForm.value.districtName != null
        ) {

            this.isLoading = true;
            let params = {
                district_name: this.districtForm.value.districtName,
            };
            this.apiService.post('district', params).subscribe({
                next: (res: any) => {
                    this.reset();
                    this.isSubmitted = true;
                    this.toastr.success(
                        'District has been successfully added.',
                        'Success'
                    );
                    this.isLoading = false;
                    this.fetchDistrictData();
                },
                error: (err: Error) => {
                    console.error('Error adding district:', err);
                    this.toastr.error('There was an error adding the district.', 'Error');
                },
            });
        } else {
            this.toastr.warning('Please fill all required fields.', 'warning');
        }
    }

    reset() {
        this.districtForm.reset();
        this.isEdit = false;

    }

    resetFilter(event: Event) {
        this.searchValue = '';
        this.currentPage = 1;
        this.fetchDistrictData();
    }

    keyDownText(event: KeyboardEvent, controlName: string): void {
        this.util.onKeydown(event, controlName, this.districtForm);
    }

    handleInput(event: Event) {

        this.util.getTranslateText(event, this.marathiText).subscribe({
            next: (translatedText: string) => {
                this.marathiText = translatedText;
            },
            error: (error: any) => {
                console.error('Error translating text:', error);
            },
        });
    }

    getDistrict(districtId: number) {
        this.apiService.get('get-district/' + districtId).subscribe({
            next: (res: any) => {
                this.districtForm.setValue({
                    districtName: res?.data?.DISTRICT_NAME,
                });


                this.districtId = res?.data?.DISTRICT_ID;
                this.isEdit = true;
            },
            error: (err: Error) => {
                console.error('Error getting district:', err);
                this.toastr.error('There was an error getting the district.', 'Error');
            },
        });
    }


    updateDistrict(): void {
        if (!this.districtForm.invalid && this.districtForm.value.districtName != null) {
            this.isLoading = true;
            let params = {
                district_name: this.districtForm.value.districtName,
                district_id: this.districtId,
            };
            this.apiService.put('update-district', params).subscribe({
                next: (res: any) => {
                    this.reset();
                    this.isSubmitted = true;
                    this.toastr.success('District has been successfully updated.', 'Success');
                    this.isLoading = false;
                    this.searchValue = '';
                    this.fetchDistrictData();

                },
                error: (err: Error) => {
                    console.error('Error updating district:', err);
                    this.toastr.error('There was an error updating the district.', 'Error');
                },
            });
        } else {
            this.toastr.warning('Please fill all required fields.', 'warning');
        }
    }


    deleteDistrict(districtId: number): void {

        this.util.showConfirmAlert().then((res) => {
            if (!districtId) {
                this.toast.warning("Gat Sachive Id is required", "Warning!");
                return
            }
            if (res) {
                this.isLoading = true;
                this.apiService.delete('district/' + districtId).subscribe({
                    next: () => {
                        this.isSubmitted = true;
                        this.toastr.success('District has been successfully deleted.', 'Success');
                        this.isLoading = false;
                        this.district = this.district.filter((dist: any) => {
                            return dist.DISTRICT_ID !== districtId;
                        });
                        this.items = this.district;
                        this.confirmationDialog.close();

                    },
                    error: (err: Error) => {
                        this.isLoading = false;
                        console.error('Error deleting district:', err);
                        this.toastr.error('There was an error deleting the district.', 'Error');

                    },
                });
            }
        });

    }

    onConfirmed(confirmed: boolean) {
        if (confirmed) {
            // Perform the delete action
            console.log('Taluka deleted');
        } else {
            console.log('Delete action cancelled');
        }
    }

    filterDistricts(event: Event) {
        const searchText = (event.target as HTMLInputElement).value.toLowerCase();
        console.log('searchText', searchText);
        this.currentPage = 1;
        this.searchValue = searchText;
        this.debounceFetchDistrictData();
    }

    private debounceFetchDistrictData = this.debounce(() => {
        this.fetchDistrictData();
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
}


