import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ITEM_PER_PAGE } from '../../constants/admin.constant';
import { MalamataPrakarService } from '../../services/malamata-prakar.service';
import Util from '../../utils/utils';
import { PaginationComponent } from '../pagination/pagination.component';
import { SortingTableComponent } from '../sorting-table/sorting-table.component';
import { ConfirmationDialogModule } from '../../module/confirmation-dialog/confirmation-dialog.module';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-malmattecheprakar',
  standalone: true,
  imports: [PaginationComponent, SortingTableComponent, FormsModule, ConfirmationDialogModule, SkeletonLoaderComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './malmattecheprakar.component.html',
  styleUrl: './malmattecheprakar.component.css'
})
export class MalmattecheprakarComponent {
  isLoading: boolean = true;
  isEdit: boolean = false;
  isSubmitted: boolean = false;
  private prakarId: number = 0;

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

  malmattechePrakarForm = new FormGroup({
      malmattechePrakarName: new FormControl(undefined),
  });
  constructor(private titleService: Title, private malamata: MalamataPrakarService, private util: Util,private apiService: ApiService,private toastr: ToastrService,) { }

  @ViewChild('confirmationDialog') confirmationDialog!: ConfirmationDialogComponent;
  ngOnInit(): void {
    this.titleService.setTitle('Malmatteche Prakar');
    this.fetchData();
  }


  fetchData() {
    this.malamata.getMilkatPrakar({ page_number: this.currentPage, search_text: this.searchValue }).subscribe({
      next: (res: any) => {
        // console.log("res===", res)
        this.items = res?.data ?? [];
        this.totalItems = res?.totalRecords;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error get malmaatteche prakar List Data:', err);
      }
    });

  }
  addPrakar(): void
  {
    if (!this.malmattechePrakarForm.invalid && this.malmattechePrakarForm.value.malmattechePrakarName != null) {
            this.isLoading = true;
            let params = {
                name: this.malmattechePrakarForm.value.malmattechePrakarName,
            };
            this.apiService.post('add-malmatteche-prakar', params).subscribe({
                next: (res: any) => {
                    if(res.status !== 400)
                    {
                        this.reset();
                        this.toastr.success('मालमत्तेचे प्रकार has been successfully added.','Success');
                        this.isSubmitted = true;
                        this.fetchData();
                    }
                    else{
                        this.toastr.warning("मालमत्तेचे प्रकार already exits. please try another one.",'Warning');
                    }
                    this.isLoading = false;
                },
                error: (err: Error) => {
                    console.error('Error adding मालमत्तेचे प्रकार:', err);
                    this.toastr.error('There was an error adding the मालमत्तेचे प्रकार.', 'Error');
                },
            });
        } else {
            this.toastr.warning('Please fill all required fields.', 'warning');
        }
  }
 reset() {
    this.malmattechePrakarForm.reset();
    this.isEdit = false;
  }
   updatePrakar()
  {
    if (!this.malmattechePrakarForm.invalid && this.malmattechePrakarForm.value.malmattechePrakarName != null) {
            this.isLoading = true;
            let params = {
                name: this.malmattechePrakarForm.value.malmattechePrakarName,
                prakar_id: this.prakarId,
            };
            this.apiService.put('update-malmatteche-prakar', params).subscribe({
                next: (res: any) => {
                    if(res.status !== 400)
                    {
                        this.reset();
                        this.isSubmitted = true;
                        this.toastr.success('मालमत्तेचे प्रकार has been successfully updated.', 'Success');
                        this.searchValue = '';
                        this.fetchData();
                    }
                    else
                    {
                        this.toastr.warning("Updated मालमत्तेचे प्रकार name already exists. Please choose a different name",'Warning');
                    }
                    this.isLoading = false;
                },
                error: (err: Error) => {
                    console.error('Error updating मालमत्तेचे प्रकार:', err);
                    this.toastr.error('There was an error updating the मालमत्तेचे प्रकार.', 'Error');
                },
            });
        } else {
            this.toastr.warning('Please fill all required fields.', 'warning');
        }
  }

  editInfo(id: number) {
    this.isLoading = true;
        this.apiService.get('get-malmatteche-prakar-by-id/' + id).subscribe({
            next: (res: any) => {
                this.malmattechePrakarForm.patchValue({
                    malmattechePrakarName: res?.data?.MILKAT_VAPAR_NAME,
                });

                this.prakarId = res?.data?.MILKAT_VAPAR_ID;
                this.isEdit = true;
                this.isLoading = false;
            },
            error: (err: Error) => {
                console.error('Error getting मालमत्तेचे प्रकार:', err);
                this.toastr.error('There was an error getting the मालमत्तेचे प्रकार.', 'Error');
            },
        });
  }

  deleteInfo(id: number) {
    this.util.showConfirmAlert().then((res) => {
            if (id === 0) {
                this.toastr.error('This malmattache Prakar cannot be deleted.', 'Error');
                return;
            }
            if (res) {
                 this.apiService.delete('/delete-malmatteche-prakar/' + id).subscribe({
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
                        console.error('Error deleting malmmatteche Prakar:', err);
                        this.toastr.error('There was an error deleting the malmmatteche Prakar.', 'Error');
                    }
                });
            }
        });
  }
  onConfirmed(confirmed: boolean) {
        if (confirmed) {
            console.log('prakar deleted', confirmed);
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
   keyDownText(event: KeyboardEvent, controlName: string): void {
        this.util.onKeydown(event, controlName, this.malmattechePrakarForm);
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
}
