import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ITEM_PER_PAGE } from '../../constants/admin.constant';
import { GhasaraRatesService } from '../../services/ghasara-rates.service';
import Util from '../../utils/utils';
import { PaginationComponent } from '../pagination/pagination.component';
import { SortingTableComponent } from '../sorting-table/sorting-table.component';
import { ApiService } from '../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ghasaradar',
  standalone: true,
  imports: [PaginationComponent, SortingTableComponent, FormsModule, RouterLink,ReactiveFormsModule,CommonModule],
  templateUrl: './ghasaradar.component.html',
  styleUrl: './ghasaradar.component.css'
})
export class GhasaradarComponent {
  isLoading: boolean = true;
  isEdit: boolean = false;
  isSubmitted: boolean = false;
  private ghasaraDarId: number = 0;

  currentPage: number = 1;
  searchValue: string = '';
  items: any = [];
  malmattaList:any =[];
  buildingAgeList:any = [];
  totalItems: number = 0;
  itemsPerPage: number = ITEM_PER_PAGE
  displayedColumns: any = [
    { key: 'sr_no', label: 'अनुक्रमांक' },
    { key: 'AGEOFBUILDING_NAME', label: 'मालमत्तेचे वय व वर्ष' },
    { key: 'MALAMATA_NAME', label: 'मालमत्तेचे वर्णन' },
    { key: 'DEPRECIATION_NAME', label: 'टक्केवारी' }


  ];

  keyName: string = 'DEPRECIATION_ID';
  marathiText: string = '';
  ghasaraDarForm = new FormGroup({
		ageOfBuilding: new FormControl<number | null>(null),
		malmattaId: new FormControl<number | null>(null),
    percentage: new FormControl(undefined)
	});
  constructor(private titleService: Title, private openPlot: GhasaraRatesService, private util: Util,private apiService: ApiService,private toastr: ToastrService,) { }
  ngOnInit(): void {
    this.titleService.setTitle('Ghasara Dar');
    this.fetchData();
    this.fetchMalmattechePrakar();
    this.fetchBuildingAge();
  }


  fetchData() {
    this.openPlot.getGhasaraList({ page_number: this.currentPage, search_text: this.searchValue }).subscribe({
      next: (res: any) => {
        this.items = res?.data ?? [];
        this.totalItems = res?.totalRecords;
      },
      error: (err: any) => {
        console.error('Error get Open Plot List:', err);
      }
    });

  }

  fetchMalmattechePrakar()
  {
      let params = {};
      this.apiService.post('malmatta-list-ddl', params).subscribe({
          next: (res: any) => {
              this.malmattaList = res.data;
              // console.log(this.malmattaList)
          },
          error: (err: any) => {
              console.error('Error::  fetch malmatta prakar List :', err);
          }
      });
  }

  fetchBuildingAge()
  {
      let params = {};
      this.apiService.post('age-of-buildings-ddl', params).subscribe({
          next: (res: any) => {
              this.buildingAgeList = res.data;
              // console.log(this.malmattaList)
          },
          error: (err: any) => {
              console.error('Error::  fetch age of building List :', err);
          }
      });
  }

  submitData() {
        this.isSubmitted = true;

        // console.log(this.milkatVaparForm.value);
        if (this.ghasaraDarForm.valid && this.ghasaraDarForm.value.ageOfBuilding && this.ghasaraDarForm.value.malmattaId && this.ghasaraDarForm.value.percentage ) {
            let params: any = {
                ageofbuilding_id: this.ghasaraDarForm.value.ageOfBuilding,
                malmatta_id: this.ghasaraDarForm.value.malmattaId,
                depreciation_name: this.ghasaraDarForm.value.percentage,
            }
             this.apiService.post('add-ghasara-dar', params).subscribe((res: any) => {
                if(res.status !== 400)
                {
                    // console.log("id", this.annualTaxForm.value.district_id)
                    // console.log("param", params.district_id)
                    this.fetchData();
                    this.reset();
                    this.toastr.success(res.message,'Success');
                    this.isSubmitted = true;
                    // this.fetchDistrict();
                }
                else{
                    this.toastr.warning("Ghasara Dar already exits. please try another one.",'Warning');
                }
                // if (res.status == 201) {
                //     this.toastr.success(res.message, "Success");
                //     this.reset();
                //     this.isSubmitted = false;
                //     // this.fetchData();
                // } else {
                //     this.toastr.error(res.message, "Error");
                // }
            });
        } else {
            this.toastr.error('Please fill all the fields','Error');
        }
    }

    reset() {
        this.ghasaraDarForm.reset();
        $('#age_building').val('').trigger('change');
        $('#malmatta_id').val('').trigger('change');
        this.isEdit = false;
    }
    updateData() {
        this.isSubmitted = true;
        if (this.ghasaraDarForm.valid && this.ghasaraDarForm.value.ageOfBuilding && this.ghasaraDarForm.value.malmattaId && this.ghasaraDarForm.value.percentage) {
            let params: any = {
                ageofbuilding_id: this.ghasaraDarForm.value.ageOfBuilding,
                malmatta_id: this.ghasaraDarForm.value.malmattaId,
                depreciation_name: this.ghasaraDarForm.value.percentage,
                ghasara_id: this.ghasaraDarId
            }
            this.apiService.put("update-ghasara-dar",params).subscribe({
                next: (res: any) => {
                    if (res.status == 200) {
                        this.isSubmitted = false;
                        this.toastr.success(res?.message, 'Success');
                        this.fetchData();
                        this.reset();
                        //  this.fetchDistrict();
                    } else {
                        this.toastr.warning(res?.message, 'Success');
                    }
                },
                error: (err: Error) => {
                    console.error('Error updating ghasara dar:', err);
                    this.toastr.error('There was an error updating ghasara dar.', 'Error');
                }
            });
        } else {
            this.toastr.error('Please fill all the fields', 'Error');
        }

    }
    onKeydown(event: KeyboardEvent, controlName: string): void {
        this.util.onKeydown(event, controlName, this.ghasaraDarForm);
    }

  editInfo(id: number) {
    this.isLoading = true;
        this.apiService.get('ghasara-dar-by-id/' + id).subscribe({
            next: (res: any) => {
                this.ghasaraDarForm.get('ageOfBuilding')?.setValue(res.data.AGEOFBUILDING_ID);
                $("#age_building").val(res.data.AGEOFBUILDING_ID).trigger('change');

                this.ghasaraDarForm.get('malmattaId')?.setValue(res.data.MALMATTA_ID);
                $("#malmatta_id").val(res.data.MALMATTA_ID).trigger('change');
                
                this.ghasaraDarForm.get('percentage')?.setValue(res.data.DEPRECIATION_NAME);

                this.ghasaraDarId = res?.data?.DEPRECIATION_ID;
                this.isEdit = true;
                this.isLoading = false;
            },
            error: (err: Error) => {
                console.error('Error getting ghasara:', err);
                this.toastr.error('There was an error getting the ghasara dar.', 'Error');
            },
        });
  }

  deleteInfo(id: number) {
      this.util.showConfirmAlert().then((res) => {
        if (id === 0) {
            this.toastr.error('This ghasara dar cannot be deleted.', 'Error');
            return;
        }
        if (res) {
              this.apiService.delete('/delete-ghasara-dar/' + id).subscribe({
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
                    console.error('Error deleting ghasara dar:', err);
                    this.toastr.error('There was an error deleting the ghasara dar.', 'Error');
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