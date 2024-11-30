import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ITEM_PER_PAGE } from '../../constants/admin.constant';
import { KaryaKaraniKametiService } from '../../services/karya-karani-kameti.service';
import Util from '../../utils/utils';
import { PaginationComponent } from '../pagination/pagination.component';
import { SortingTableComponent } from '../sorting-table/sorting-table.component';
import { ApiService } from '../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogModule } from '../../module/confirmation-dialog/confirmation-dialog.module';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-karyakaranikameti',
  standalone: true,
  imports: [PaginationComponent, SortingTableComponent, FormsModule, ConfirmationDialogModule, SkeletonLoaderComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './karyakaranikameti.component.html',
  styleUrl: './karyakaranikameti.component.css'
})
export class KaryakaranikametiComponent {
  isLoading: boolean = true;
  isEdit: boolean = false;
  isSubmitted: boolean = false;
  private designationId: number = 0;

  currentPage: number = 1;
  searchValue: string = '';
  items: any = [];
  totalItems: number = 0;
  itemsPerPage: number = ITEM_PER_PAGE
  displayedColumns: any = [
    { key: 'sr_no', label: 'अनुक्रमांक' },
    { key: 'DESIGNATION_NAME', label: 'पद' },
  ];

  keyName: string = 'DESIGNATION_ID';
  marathiText: string = '';

  designationForm = new FormGroup({
      name: new FormControl(undefined),
  });
  constructor(private titleService: Title, private karkani: KaryaKaraniKametiService, private util: Util, private toastr: ToastrService,private apiService: ApiService,) { }

  ngOnInit(): void {
    this.titleService.setTitle('Karya Karani Kameti');
    this.fetchData();
  }


  fetchData() {
    this.karkani.fetchKarkaraniKamethi({ page_number: this.currentPage, search_text: this.searchValue }).subscribe({
      next: (res: any) => {
        this.items = res?.data ?? [];
        this.totalItems = res?.totalRecords;
         this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error get Open Plot List:', err);
      }
    });

  }
  keyDownText(event: KeyboardEvent, controlName: string): void {
        this.util.onKeydown(event, controlName, this.designationForm);
  }

   submitData():void{
    if (!this.designationForm.invalid && this.designationForm.value.name != null) {
            this.isLoading = true;
            let params = {
                name: this.designationForm.value.name,
            };
            this.apiService.post('add-karyakarni-commitee', params).subscribe({
                next: (res: any) => {
                    if(res.status !== 400)
                    {
                        this.reset();
                        this.toastr.success(res.message,'Success');
                        this.isSubmitted = true;
                        this.fetchData();
                    }
                    else{
                        this.toastr.warning("This designation name is already exits. please try another one.",'Warning');
                    }
                    this.isLoading = false;
                },
                error: (err: Error) => {
                    console.error('Error adding designation:', err);
                    this.toastr.error('There was an error adding the designation.', 'Error');
                },
            });
        } else {
            this.toastr.warning('Please fill all required fields.', 'warning');
        }
  }

  reset() {
    this.designationForm.reset();
    this.isEdit = false;
  }  
  updateData():void{
     if (!this.designationForm.invalid && this.designationForm.value.name != null) {
            this.isLoading = true;
            let params = {
                name: this.designationForm.value.name,
                id: this.designationId,
            };
            this.apiService.put('update-karyakarni-commitee', params).subscribe({
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
                        this.toastr.warning("Updated designation name already exists. Please choose a different name",'Warning');
                    }
                    this.isLoading = false;
                },
                error: (err: Error) => {
                    console.error('Error updating designation:', err);
                    this.toastr.error('There was an error updating the designation.', 'Error');
                },
            });
        } else {
            this.toastr.warning('Please fill all required fields.', 'warning');
        }
  }


  editInfo(id: number) {
     this.isLoading = true;
      this.apiService.get('get-karyakarni-commitee-by-id/' + id).subscribe({
          next: (res: any) => {
              this.designationForm.patchValue({
                  name: res?.data?.DESIGNATION_NAME,
              });

              this.designationId = res?.data?.DESIGNATION_ID;
              this.isEdit = true;
              this.isLoading = false;
          },
          error: (err: Error) => {
              console.error('Error getting designation:', err);
              this.toastr.error('There was an error getting the designation.', 'Error');
          },
      });
  }

  deleteInfo(id: number) {
    this.util.showConfirmAlert().then((res) => {
        if (id === 0) {
            this.toastr.error('This designation cannot be deleted.', 'Error');
            return;
        }
        if (res) {
              this.apiService.delete('/delete-karyakarni-commitee/' + id).subscribe({
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
                    console.error('Error deleting designation:', err);
                    this.toastr.error('There was an error deleting the designation.', 'Error');
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
            console.log('designation deleted', confirmed);
        } else {
            console.log('Delete action cancelled');
        }
    }

}

