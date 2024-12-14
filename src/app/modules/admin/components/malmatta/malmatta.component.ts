import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ITEM_PER_PAGE } from '../../constants/admin.constant';
import { MalmataService } from '../../services/malmata.service';
import Util, { onlyStringAndSpacesValidator } from '../../utils/utils';
import { PaginationComponent } from '../pagination/pagination.component';
import { SortingTableComponent } from '../sorting-table/sorting-table.component';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../../services/api.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogModule } from '../../module/confirmation-dialog/confirmation-dialog.module';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';
@Component({
  selector: 'app-malmatta',
  standalone: true,
  imports: [PaginationComponent, SortingTableComponent, FormsModule, ConfirmationDialogModule, SkeletonLoaderComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './malmatta.component.html',
  styleUrl: './malmatta.component.css'
})

export class MalmattaComponent {
  isLoading: boolean = true;
  isEdit: boolean = false;
  isSubmitted: boolean = false;
  private malmmataId: number = 0;

  currentPage: number = 1;
  searchValue: string = '';
  items: any = [];
  totalItems: number = 0;
  itemsPerPage: number = ITEM_PER_PAGE
  displayedColumns: any = [
    { key: 'sr_no', label: 'अनुक्रमांक' },
    { key: 'DESCRIPTION_NAME', label: 'मालमत्तेचे प्रकार' },
    {key:'DESCRIPTION_NAME_EXTRA', label:'मालमत्तेचे विवरण'},

  ];
  malmattaForm = new FormGroup({
      malmatteche_prakar: new FormControl<string>('', [
    Validators.required,
    onlyStringAndSpacesValidator
  ]),
      milkat_varnan: new FormControl<string>('',  [
    Validators.required,
    onlyStringAndSpacesValidator
  ])
  });
  keyName: string = 'MALMATTA_ID';
  marathiText: string = '';
  constructor(private titleService: Title, private malamata: MalmataService, private util: Util,private toastr: ToastrService,private apiService: ApiService,) { }
@ViewChild('confirmationDialog') confirmationDialog!: ConfirmationDialogComponent;
  ngOnInit(): void {
    this.titleService.setTitle('Malmatta');
    this.fetchData();
  }

  fetchData() {
    this.malamata.getMalmataList({ page_number: this.currentPage, search_text: this.searchValue }).subscribe({
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
  submitData(): void
  {
      if (this.malmattaForm.invalid) {

          return;
      }
    if (!this.malmattaForm.invalid && this.malmattaForm.value.malmatteche_prakar != null &&  this.malmattaForm.value.milkat_varnan != null) {
            this.isLoading = true;
            let params = {
                desc: this.malmattaForm.value.malmatteche_prakar,
                extra:this.malmattaForm.value.milkat_varnan,
            };
            this.apiService.post('add-malmatta', params).subscribe({
                next: (res: any) => {
                    if(res.status !== 400)
                    {
                        this.reset();
                        this.toastr.success(res.message,'Success');
                        this.isSubmitted = true;
                        this.fetchData();
                    }
                    else{
                        this.toastr.warning("Malmatta already exits. please try another one.",'Warning');
                    }
                    this.isLoading = false;
                },
                error: (err: Error) => {
                    console.error('Error adding Malmatta:', err);
                    this.toastr.error('There was an error adding the Malmatta.', 'Error');
                },
            });
        } else {
            this.toastr.warning('Please fill all required fields.', 'warning');
        }
  }

  reset() {
    this.malmattaForm.reset();
    this.isEdit = false;
  }

  updateData(): void
  {
    if (!this.malmattaForm.invalid && this.malmattaForm.value.malmatteche_prakar != null &&  this.malmattaForm.value.milkat_varnan != null) {
            this.isLoading = true;
            let params = {
                desc: this.malmattaForm.value.malmatteche_prakar,
                extra:this.malmattaForm.value.milkat_varnan,
                id: this.malmmataId,
            };
            this.apiService.put('update-malmatta', params).subscribe({
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
                        this.toastr.warning("Updated Malmatta name already exists. Please choose a different name",'Warning');
                    }
                    this.isLoading = false;
                },
                error: (err: Error) => {
                    console.error('Error updating Malmatta:', err);
                    this.toastr.error('There was an error updating the Malmatta.', 'Error');
                },
            });
    } else {
        this.toastr.warning('Please fill all required fields.', 'warning');
    }
}
  editInfo(id: number) {
    this.isLoading = true;
        this.apiService.get('get-malmatta-by-id/' + id).subscribe({
            next: (res: any) => {
                this.malmattaForm.patchValue({
                    malmatteche_prakar: res?.data?.DESCRIPTION_NAME,
                    milkat_varnan: res?.data?.DESCRIPTION_NAME_EXTRA,
                });

                this.malmmataId = res?.data?.MALMATTA_ID;
                this.isEdit = true;
                this.isLoading = false;
            },
            error: (err: Error) => {
                console.error('Error getting Malmatta:', err);
                this.toastr.error('There was an error getting the Malmatta.', 'Error');
            },
        });
  }

  deleteInfo(id: number) {

      this.util.showConfirmAlert().then((res) => {
            if (id === 0) {
                this.toastr.error('This malmatta cannot be deleted.', 'Error');
                return;
            }
            if (res) {
                 this.apiService.delete('/delete-malmatta/' + id).subscribe({
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
                        console.error('Error deleting malmmatta:', err);
                        this.toastr.error('There was an error deleting the malmmatta.', 'Error');
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
   keyDownText(event: KeyboardEvent, controlName: string): void {
        this.util.onKeydown(event, controlName, this.malmattaForm);
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
            console.log('malmmata deleted', confirmed);
        } else {
            console.log('Delete action cancelled');
        }
    }
}
