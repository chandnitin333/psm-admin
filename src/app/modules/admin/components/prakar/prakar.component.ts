import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../../services/api.service';
import { ITEM_PER_PAGE } from '../../constants/admin.constant';
import { ConfirmationDialogModule } from '../../module/confirmation-dialog/confirmation-dialog.module';
import { PrakarService } from '../../services/prakar.service';
import Util from '../../utils/utils';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';
import { SortingTableComponent } from '../sorting-table/sorting-table.component';

@Component({
    selector: 'app-prakar',
    standalone: true,
    imports: [PaginationComponent, SortingTableComponent, FormsModule, ConfirmationDialogModule, SkeletonLoaderComponent, ReactiveFormsModule, CommonModule],
    templateUrl: './prakar.component.html',
    styleUrl: './prakar.component.css'
})
export class PrakarComponent {
    isLoading: boolean = true;
    isEdit: boolean = false;
    isSubmitted: boolean = false;
    currentPage: number = 1;
    searchValue: string = '';
    private prakarId: number = 0;
    items: any = [];
    totalItems: number = 0;
    itemsPerPage: number = ITEM_PER_PAGE
    displayedColumns: any = [
        { key: 'sr_no', label: 'अनुक्रमांक' },
        { key: 'PRAKAR_NAME', label: 'प्रकार' }
    ];

    prakarForm = new FormGroup({
        prakarName: new FormControl(undefined),
    });

    keyName: string = 'PRAKAR_ID';
    marathiText: string = '';

    constructor(private titleService: Title, private prakar: PrakarService, private util: Util, private toastr: ToastrService, private apiService: ApiService,) { }

    @ViewChild('confirmationDialog') confirmationDialog!: ConfirmationDialogComponent;
    ngOnInit(): void {
        this.titleService.setTitle('Prakar');
        this.fetchData();
    }

    fetchData() {
        this.prakar.fetchPrakarList({ page_number: this.currentPage, search_text: this.searchValue }).subscribe({
            next: (res: any) => {
                this.items = res?.data ?? [];
                this.totalItems = res?.totalRecords;
                this.isLoading = false;
            },
            error: (err: any) => {
                console.error('Error fetch Parkar Data:', err);
            }
        });
    }

    keyDownText(event: KeyboardEvent, controlName: string): void {
        this.util.onKeydown(event, controlName, this.prakarForm);
    }
    addPrakar(): void {
        if (!this.prakarForm.invalid && this.prakarForm.value.prakarName != null) {
            this.isLoading = true;
            let params = {
                name: this.prakarForm.value.prakarName,
            };
            this.apiService.post('prakar', params).subscribe({
                next: (res: any) => {
                    if (res.status !== 400) {
                        this.reset();
                        this.toastr.success('Prakar has been successfully added.', 'Success');
                        this.isSubmitted = true;
                        this.fetchData();
                    }
                    else {
                        this.toastr.warning("Prakar already exits. please try another one.", 'Warning');
                    }
                    this.isLoading = false;
                },
                error: (err: Error) => {
                    console.error('Error adding Prakar:', err);
                    this.toastr.error('There was an error adding the Prakar.', 'Error');
                },
            });
        } else {
            this.toastr.warning('Please fill all required fields.', 'warning');
        }
    }

    reset() {
        this.prakarForm.reset();
        this.isEdit = false;
    }

    updatePrakar() {
        if (!this.prakarForm.invalid && this.prakarForm.value.prakarName != null) {
            this.isLoading = true;
            let params = {
                name: this.prakarForm.value.prakarName,
                prakar_id: this.prakarId,
            };
            this.apiService.put('update-prakar', params).subscribe({
                next: (res: any) => {
                    if (res.status !== 400) {
                        this.reset();
                        this.isSubmitted = true;
                        this.toastr.success('Prakar has been successfully updated.', 'Success');
                        this.searchValue = '';
                        this.fetchData();
                    }
                    else {
                        this.toastr.warning("Updated prakar name already exists. Please choose a different name", 'Warning');
                    }
                    this.isLoading = false;
                },
                error: (err: Error) => {
                    console.error('Error updating prakar:', err);
                    this.toastr.error('There was an error updating the prakar.', 'Error');
                },
            });
        } else {
            this.toastr.warning('Please fill all required fields.', 'warning');
        }
    }

    editInfo(id: number) {
        this.isLoading = true;
        this.apiService.get('prakar/' + id).subscribe({
            next: (res: any) => {
                this.prakarForm.patchValue({
                    prakarName: res?.data?.PRAKAR_NAME,
                });

                this.prakarId = res?.data?.PRAKAR_ID;
                this.isEdit = true;
                this.isLoading = false;
            },
            error: (err: Error) => {
                console.error('Error getting prakar:', err);
                this.toastr.error('There was an error getting the prakar.', 'Error');
            },
        });
    }

    deleteInfo(id: number) {
        this.util.showConfirmAlert().then((res) => {
            if (id === 0) {
                this.toastr.error('This Prakar cannot be deleted.', 'Error');
                return;
            }
            if (res) {
                this.apiService.delete('/delete-prakar/' + id).subscribe({
                    next: (res: any) => {
                        if (res.status == 200) {
                            this.toastr.success(res.message, "Success");
                            this.fetchData();

                        } else {
                            this.toastr.error(res.message, "Error");
                        }
                        // this.isLoading = false;
                    },
                    error: (err: Error) => {
                        console.error('Error deleting Prakar:', err);
                        this.toastr.error('There was an error deleting the Prakar.', 'Error');
                    }
                });
            }
        });
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

    filterData(event: Event) {
        const searchText = (event.target as HTMLInputElement).value.toLowerCase();
        this.currentPage = 1;
        this.searchValue = searchText;
        this.debounceFetchData();
    }
    private debounceFetchData = this.debounce(() => {
        this.fetchData();
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
        this.fetchData();
    }

    onConfirmed(confirmed: boolean) {
        if (confirmed) {
            console.log('prakar deleted', confirmed);
        } else {
            console.log('Delete action cancelled');
        }
    }
}
