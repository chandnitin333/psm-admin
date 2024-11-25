import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ITEM_PER_PAGE } from '../../constants/admin.constant';
import { TaxService } from '../../services/tax.service';
import Util from '../../utils/utils';
import { PaginationComponent } from '../pagination/pagination.component';
import { SortingTableComponent } from '../sorting-table/sorting-table.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../../services/api.service';
import { ConfirmationDialogModule } from '../../module/confirmation-dialog/confirmation-dialog.module';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tax',
  standalone: true,
  imports: [PaginationComponent, SortingTableComponent, FormsModule, ConfirmationDialogModule, SkeletonLoaderComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './tax.component.html',
  styleUrl: './tax.component.css'
})
export class TaxComponent {
  isLoading: boolean = true;
  isEdit: boolean = false;
  isSubmitted: boolean = false;
  private tax_id: number = 0;
  currentPage: number = 1;
  searchValue: string = '';
  items: any = [];
  totalItems: number = 0;
  itemsPerPage: number = ITEM_PER_PAGE
  displayedColumns: any = [
    { key: 'sr_no', label: 'अनुक्रमांक' },
    { key: 'OTHERTAX_NAME', label: 'करांची नावे' },

  ];

  keyName: string = 'OTHERTAX_ID';
  marathiText: string = '';
  otherTaxForm = new FormGroup({
      name: new FormControl(undefined),
  });
  constructor(private titleService: Title, private tax: TaxService, private util: Util, private toastr: ToastrService,private apiService: ApiService,) { }
  @ViewChild('confirmationDialog') confirmationDialog!: ConfirmationDialogComponent;
  ngOnInit(): void {
    this.titleService.setTitle('Tax');
    this.fetchData();
  }


  fetchData() {
    this.tax.getTaxList({ page_number: this.currentPage, search_text: this.searchValue }).subscribe({
      next: (res: any) => {
        // console.log(res)
        this.items = res?.data ?? [];
        this.totalItems = res?.totalRecords;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error get TaxList Data:', err);
      }
    });

  }
  keyDownText(event: KeyboardEvent, controlName: string): void {
        this.util.onKeydown(event, controlName, this.otherTaxForm);
  }

  submitData():void{
    if (!this.otherTaxForm.invalid && this.otherTaxForm.value.name != null) {
            this.isLoading = true;
            let params = {
                name: this.otherTaxForm.value.name,
            };
            this.apiService.post('tax', params).subscribe({
                next: (res: any) => {
                    if(res.status !== 400)
                    {
                        this.reset();
                        this.toastr.success(res.message,'Success');
                        this.isSubmitted = true;
                        this.fetchData();
                    }
                    else{
                        this.toastr.warning("This Tax Name is already exits. please try another one.",'Warning');
                    }
                    this.isLoading = false;
                },
                error: (err: Error) => {
                    console.error('Error adding Tax:', err);
                    this.toastr.error('There was an error adding the Tax.', 'Error');
                },
            });
        } else {
            this.toastr.warning('Please fill all required fields.', 'warning');
        }
  }

  reset() {
    this.otherTaxForm.reset();
    this.isEdit = false;
  }
  updateData():void{
     if (!this.otherTaxForm.invalid && this.otherTaxForm.value.name != null) {
            this.isLoading = true;
            let params = {
                name: this.otherTaxForm.value.name,
                tax_id: this.tax_id,
            };
            this.apiService.put('update-tax', params).subscribe({
                next: (res: any) => {
                    if(res.status !== 400)
                    {
                        this.reset();
                        this.isSubmitted = true;
                        this.toastr.success(res.message, 'Success');
                        this.searchValue = '';
                        this.fetchData();
                    }
                    else
                    {
                        this.toastr.warning("Updated tax name already exists. Please choose a different name",'Warning');
                    }
                    this.isLoading = false;
                },
                error: (err: Error) => {
                    console.error('Error updating tax:', err);
                    this.toastr.error('There was an error updating the tax.', 'Error');
                },
            });
        } else {
            this.toastr.warning('Please fill all required fields.', 'warning');
        }
  }

  

  editInfo(id: number) {
    console.log(id,"Kundan")
    this.isLoading = true;
        this.apiService.get('tax/' + id).subscribe({
            next: (res: any) => {
                this.otherTaxForm.patchValue({
                    name: res?.data?.OTHERTAX_NAME,
                });

                this.tax_id = res?.data?.OTHERTAX_ID;
                this.isEdit = true;
                this.isLoading = false;
            },
            error: (err: Error) => {
                console.error('Error getting tax:', err);
                this.toastr.error('There was an error getting the tax.', 'Error');
            },
        });
  }

  deleteInfo(id: number) {
    this.util.showConfirmAlert().then((res) => {
            if (id === 0) {
                this.toastr.error('This Tax cannot be deleted.', 'Error');
                return;
            }
            if (res) {
                 this.apiService.delete('/delete-tax/' + id).subscribe({
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
                        console.error('Error deleting tax:', err);
                        this.toastr.error('There was an error deleting the tax.', 'Error');
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
            console.log('Tax deleted', confirmed);
        } else {
            console.log('Delete action cancelled');
        }
    }
}
