import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ITEM_PER_PAGE } from '../../constants/admin.constant';
import { MilkatVaparService } from '../../services/milkat-vapar.service';
import Util from '../../utils/utils';
import { PaginationComponent } from '../pagination/pagination.component';
import { SortingTableComponent } from '../sorting-table/sorting-table.component';
import { ConfirmationDialogModule } from '../../module/confirmation-dialog/confirmation-dialog.module';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged, Subject, Subscription, switchMap } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../../services/api.service';

@Component({
    selector: 'app-milkatvapar',
    standalone: true,
    imports: [PaginationComponent, SortingTableComponent, FormsModule, ConfirmationDialogModule, SkeletonLoaderComponent, ReactiveFormsModule, CommonModule, HttpClientModule, RouterLink],
    templateUrl: './milkatvapar.component.html',
    styleUrl: './milkatvapar.component.css'
})
export class MilkatvaparComponent{
    isLoading: boolean = true;
    isEdit: boolean = false;
    isSubmitted: boolean = false;
    private milkatVaparId: number = 0;
    malmattechePrakarsList: any = [];
    milkatId: number = 0;
    private subscription: Subscription = new Subscription();

    currentPage: number = 1;
    searchValue: string = '';
    items: any = [];
    totalItems: number = 0;
    itemsPerPage: number = ITEM_PER_PAGE
    displayedColumns: any = [
        { key: 'sr_no', label: 'अनुक्रमांक' },
        { key: 'MILKAT_VAPAR_NAME', label: 'मालमत्तेचे वर्णन' },
        { key: 'MILKAT_NAME', label: 'मिलकत' },
       
    ];
    milkatVaparForm = new FormGroup({
		malmatteche_prakar_id: new FormControl<string | null>(null),
		name: new FormControl(undefined)
	});

    keyName: string = 'MILKAT_ID';
    marathiText: string = ''
    constructor(private titleService: Title, private milkatVapar: MilkatVaparService, private util: Util, private toastr: ToastrService,private apiService: ApiService,) { }


    ngOnInit(): void {
        this.titleService.setTitle('Milkat Vapar');
        this.getAllMalmattechePrakar();
        this.fetchData();
    }
    ngAfterViewInit(): void {
		$('.my-select2').select2();
		$('#mySelect').on('change', (event) => {
			// let selectedValue: string = $(event.target).val() as string; 
            const selectedValue: string = String($(event.target).val());
            if (selectedValue) {
			    this.milkatVaparForm.get('malmatteche_prakar_id')?.setValue(selectedValue || '');
            }
		});

	}
    fetchData() {
        this.milkatVapar.getMilkatVaparList({ page_number: this.currentPage, search_text: this.searchValue }).subscribe({
            next: (res: any) => {

                this.items = res?.data ?? [];
                this.totalItems = res?.totalRecords;
                this.isLoading = false;
            },
            error: (err: any) => {
                console.error('Error get Milkat Vapar List Data:', err);
            }
        });
    }

    async getAllMalmattechePrakar() {
		this.malmattechePrakarsList = await this.util.getMalmattechePrakartDDL('get-malmatteche-prakar-all-list')
        // console.log('malmattechePrakarsList', this.malmattechePrakarsList);
	}

    submitData() {
        this.isSubmitted = true;
        console.log(this.milkatVaparForm.value);
        if (this.milkatVaparForm.valid && this.milkatVaparForm.value.malmatteche_prakar_id && this.milkatVaparForm.value.name) {
            let params: any = {
                malmatta_id: this.milkatVaparForm.value.malmatteche_prakar_id,
                name: this.milkatVaparForm.value.name
            }
             this.apiService.post('milkat-vapar', params).subscribe((res: any) => {
                if (res.status == 201) {
                    this.toastr.success(res.message, "Success");
                    this.reset();
                    this.isSubmitted = false;
                    this.fetchData();
                } else {
                    this.toastr.error(res.message, "Error");
                }
            });
        } else {
            this.toastr.error('Please fill all the fields','Error');
        }
    }

    reset() {
        this.milkatVaparForm.reset();
        $('#mySelect').val('').trigger('change');
        this.isEdit = false;
    }
    updateData() {
        this.isSubmitted = true;
        if (this.milkatVaparForm.valid && this.milkatVaparForm.value.malmatteche_prakar_id && this.milkatVaparForm.value.name) {
            let params: any = {
                malmatta_id: this.milkatVaparForm.value.malmatteche_prakar_id,
                name: this.milkatVaparForm.value.name,
                vapar_id: this.milkatId
            }
            this.apiService.put("update-milkat-vapar",params).subscribe({
                next: (res: any) => {
                    if (res.status == 200) {
                        this.reset();
                        this.isSubmitted = false;
                        this.toastr.success(res?.message, 'Success');
                        this.fetchData();
                    } else {
                        this.toastr.warning(res?.message, 'Success');
                    }
                },
                error: (err: Error) => {
                    console.error('Error updating milkat vapar:', err);
                    this.toastr.error('There was an error updating milkat vapar.', 'Error');
                }
            });
        } else {
            this.toastr.error('Please fill all the fields', 'Error');
        }

    }

    editInfo(id: number) {
        this.apiService.get("milkat-vapar/"+id).subscribe((res: any) => {
            this.milkatId = id;
            this.isEdit = true;
            console.log("REs", res)
            if (res.status == 200) {
                this.milkatVaparForm.get('malmatteche_prakar_id')?.setValue(res.data.MILKAT_VAPAR_ID);
                $("#mySelect").val(res.data.MILKAT_VAPAR_ID).trigger('change');
                this.milkatVaparForm.get('name')?.setValue(res.data.MILKAT_NAME);

            } else {
                this.toastr.error(res.message, "Error");
            }

        });
    }

    deleteInfo(id: number) {
        this.util.showConfirmAlert().then((res) => {
            if (id === 0) {
                this.toastr.error('This milkat vapar cannot be deleted.', 'Error');
                return;
            }
            if (res) {
               this.apiService.delete("delete-milkat-vapar/"+id).subscribe({
                    next: (res: any) => {
                        if (res.status == 200) {
                            this.toastr.success(res.message, "Success");
                            this.fetchData();
                        } else {
                            this.toastr.error(res.message, "Error");
                        }
                    },
                    error: (err: Error) => {
                        console.error('Error deleting Milkat vapar:', err);
                        this.toastr.error('There was an error deleting the milkat vapar.', 'Error');
                    }
                });
            }
        });
    }
    onConfirmed(confirmed: boolean) {
        if (confirmed) {
            console.log('मिलकत वापर deleted', confirmed);
        } else {
            console.log('Delete action cancelled');
        }
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
    onKeydown(event: KeyboardEvent, controlName: string) {
		this.util.onKeydown(event, controlName, this.milkatVaparForm);
	}

     filterData() {

        this.currentPage = 1;
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
        this.fetchData();
    }
    
    ngOnDestroy(): void {
		this.subscription.unsubscribe(); // Clean up the subscription on component destroy
		$('#mySelect').select2('destroy');
	}

}
