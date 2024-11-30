import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BharankRatesService } from '../../services/bharank-rates.service';
import Util from '../../utils/utils';
import { ITEM_PER_PAGE } from '../../constants/admin.constant';
import { PaginationComponent } from '../pagination/pagination.component';
import { SortingTableComponent } from '../sorting-table/sorting-table.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../../services/api.service';
@Component({
  selector: 'app-bharankdar',
  standalone: true,
  imports: [PaginationComponent, SortingTableComponent, FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './bharankdar.component.html',
  styleUrl: './bharankdar.component.css'
})
export class BharankdarComponent {
  isLoading: boolean = true;
  isEdit: boolean = false;
  isSubmitted: boolean = false;
  private bharnakId: number = 0;
  
  currentPage: number = 1;
  searchValue: string = '';
  items: any = [];
  malmattechePrakarsList: any = [];
  totalItems: number = 0;
  itemsPerPage: number = ITEM_PER_PAGE
  displayedColumns: any = [
    { key: 'sr_no', label: 'अनुक्रमांक' },
    { key: 'MILKAT_VAPAR_NAME', label: 'मालमत्तेचे वर्णन' },
    { key: 'BUILDINGWEIGHTS_NAME', label: 'भारांक' }


  ];

  keyName: string = 'BUILDINGWEIGHTS_ID';
  marathiText: string = '';
  bharankDarForm = new FormGroup({
		milkat_vapar_id: new FormControl<string | null>(null),
		bharank_name: new FormControl(undefined)
	});

  constructor(private titleService: Title, private bharank: BharankRatesService, private util: Util, private toastr: ToastrService,private apiService: ApiService,) { }

  ngOnInit(): void {
    this.titleService.setTitle('Bharank Dar');
    this.fetchData();
    this.getAllMalmattechePrakar();
  }


  fetchData() {
    this.bharank.fetchBharankRatesList({ page_number: this.currentPage, search_text: this.searchValue }).subscribe({
      next: (res: any) => {
        this.items = res?.data ?? [];
        this.totalItems = res?.totalRecords;
      },
      error: (err: any) => {
        console.error('Error get Open Plot List:', err);
      }
    });

  }
  onKeydown(event: KeyboardEvent, controlName: string) {
		this.util.onKeydown(event, controlName, this.bharankDarForm);
	}
  async getAllMalmattechePrakar() {
		this.malmattechePrakarsList = await this.util.getMalmattechePrakartDDL('get-malmatteche-prakar-all-list')
        // console.log('malmattechePrakarsList', this.malmattechePrakarsList);
	}


 submitData() {
        this.isSubmitted = true;
        // console.log(this.milkatVaparForm.value);
        if (this.bharankDarForm.valid && this.bharankDarForm.value.milkat_vapar_id && this.bharankDarForm.value.bharank_name) {
            let params: any = {
                milkat_vapar_id: this.bharankDarForm.value.milkat_vapar_id,
                bharank_name: this.bharankDarForm.value.bharank_name
            }
             this.apiService.post('add-bharank-dar', params).subscribe((res: any) => {
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
        this.bharankDarForm.reset();
        $('#mySelect').val('').trigger('change');
        this.isEdit = false;
    }
    updateData() {
        this.isSubmitted = true;
        if (this.bharankDarForm.valid && this.bharankDarForm.value.milkat_vapar_id && this.bharankDarForm.value.bharank_name) {
            let params: any = {
                milkat_vapar_id: this.bharankDarForm.value.milkat_vapar_id,
                bharank_name: this.bharankDarForm.value.bharank_name,
                bharank_id: this.bharnakId
            }
            this.apiService.put("update-bharank-dar",params).subscribe({
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
                    console.error('Error updating bharank dar:', err);
                    this.toastr.error('There was an error updating Bharank Dar.', 'Error');
                }
            });
        } else {
            this.toastr.error('Please fill all the fields', 'Error');
        }

    }

    editInfo(id: number) {
        this.apiService.get("bharank-dar-by-id/"+id).subscribe((res: any) => {
            this.bharnakId = id;
            this.isEdit = true;
            // console.log("REs", res)
            if (res.status == 200) {
                this.bharankDarForm.get('milkat_vapar_id')?.setValue(res.data.MILKAT_VAPAR_ID);
                $("#mySelect").val(res.data.MILKAT_VAPAR_ID).trigger('change');
                this.bharankDarForm.get('bharank_name')?.setValue(res.data.BUILDINGWEIGHTS_NAME);

            } else {
                this.toastr.error(res.message, "Error");
            }

        });
    }

    deleteInfo(id: number) {
        this.util.showConfirmAlert().then((res) => {
            if (id === 0) {
                this.toastr.error('This bharank dar cannot be deleted.', 'Error');
                return;
            }
            if (res) {
               this.apiService.delete("delete-bharank-dar/"+id).subscribe({
                    next: (res: any) => {
                        if (res.status == 200) {
                            this.toastr.success(res.message, "Success");
                            this.fetchData();
                        } else {
                            this.toastr.error(res.message, "Error");
                        }
                    },
                    error: (err: Error) => {
                        console.error('Error deleting bharank dar:', err);
                        this.toastr.error('There was an error deleting the bharank dar.', 'Error');
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

}
