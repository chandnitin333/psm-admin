import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ITEM_PER_PAGE } from '../../constants/admin.constant';
import { OpenPlotRatesService } from '../../services/open-plot-rates.service';
import Util from '../../utils/utils';
import { PaginationComponent } from '../pagination/pagination.component';
import { SortingTableComponent } from '../sorting-table/sorting-table.component';
import { GatGramPanchayatService } from '../../services/gat-gram-panchayat.service';
import { ToastrService } from 'ngx-toastr';
import { GramPanchayatService } from '../../services/gram-panchayat.service';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-openplotlist',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule, PaginationComponent, SortingTableComponent],
  templateUrl: './openplotlist.component.html',
  styleUrl: './openplotlist.component.css'
})
export class OpenplotlistComponent {
  isSubmitted: boolean = false;
  isLoading: boolean = true;
  isEdit: boolean = false;
  openPlotId: number = 0;

  currentPage: number = 1;
  searchValue: string = '';
  items: any = [];
  districts: any = [];
	talukas: any = [];
  public gramPanchayatList: any = [];
  public gatgramPanchayatList: any = [];
  public prakarList: any = [];
  totalItems: number = 0;
  itemsPerPage: number = ITEM_PER_PAGE
  displayedColumns: any = [
    { key: 'sr_no', label: 'अनुक्रमांक' },
    { key: 'DISTRICT_NAME', label: 'जिल्हा' },
    { key: 'TALUKA_NAME', label: 'तालुका' },
    { key: 'PANCHAYAT_NAME', label: 'ग्राम पंचायत' },
    { key: 'GATGRAMPANCHAYAT_NAME', label: 'गट ग्राम पंचायत' },
    { key: 'PRAKAR_NAME', label: 'वार्षिक मूल्य दर प्रकार' },
    { key: 'ANNUALCOST_NAME', label: 'वार्षिक मूल्य' },
    { key: 'LEVYRATE_NAME', label: 'आकारणी दर' },


  ];
  openPlotRatesForm = new FormGroup({
    taluka_id: new FormControl<string | null>(null),
		panchayat_id: new FormControl<string | null>(null),
    gatgrampanchayat_id: new FormControl<string | null>(null),
		prakar_id: new FormControl<string | null>(null),
    annualcost_name: new FormControl<string | null>(null),
    levyrate_name: new FormControl<string | null>(null),
		district_id: new FormControl<string | null>(null),
	});
  keyName: string = 'OPENPLOT_ID';
  marathiText: string = '';
  constructor(private titleService: Title, private openPlot: OpenPlotRatesService, private util: Util, private gramPanchayt: GramPanchayatService,private apiService: ApiService,private gatGramPanchayatService: GatGramPanchayatService,private toastr: ToastrService,) { }
  ngOnInit(): void {
    this.titleService.setTitle('Open Plot List');
    this.fetchData();
    this.getAllDistricts();
    this.getPrakarDDL();
  }


  fetchData() {
    this.openPlot.getOpenPlotList({ page_number: this.currentPage, search_text: this.searchValue }).subscribe({
      next: (res: any) => {
        this.items = res?.data ?? [];
        this.totalItems = res?.totalRecords;
      },
      error: (err: any) => {
        console.error('Error get Open Plot List:', err);
      }
    });

  }

  async getAllDistricts() {
		this.districts = await this.util.getDistrictDDL();
	}
	getTalukaByDistrict(id: any) {

		this.gramPanchayt.getTalukaById({ id: id }).subscribe((res: any) => {
			this.talukas = res.data ?? [];
		});

	}
  getPrakarDDL() {
		this.apiService.post('prakar-list-ddl', {}).subscribe((res: any) => {
			this.prakarList = res.data ?? [];
      // console.log("this.prakarList", this.prakarList)
		});

	}

	getGramPanchayByTaluka(talikaId: any) {

		this.gatGramPanchayatService.getGatGramTalukaById({ id: talikaId }).subscribe((res: any) => {
			
			this.gramPanchayatList = res?.data ?? [];
			// console.log("gramPanchayatList=========Test", this.gramPanchayatList);

		});

	}

  getGatGramPanchayByPanchayatId(panchayatId: any) {

		this.gatGramPanchayatService.getGatGatGramPanchayatById({ id: panchayatId }).subscribe((res: any) => {
			
			this.gatgramPanchayatList = res?.data ?? [];
			// console.log("gramPanchayatList=========Test", this.gramPanchayatList);

		});

	}
  keyDownText(event: KeyboardEvent, controlName: string): void {
		this.util.onKeydown(event, controlName, this.openPlotRatesForm);
	}
  ngAfterViewInit(): void {
		$('.my-select2').select2();

		$('#mySelect').on('change', (event) => {
			const selectedValue: string = String($(event.target).val());
			this.getTalukaByDistrict(selectedValue);
			if (selectedValue) {
				this.openPlotRatesForm.get('district_id')?.setValue(selectedValue || '');
			}
		});

		$('#taluka').on('change', (event) => {
			const selectedValue: string = String($(event.target).val());
			if (selectedValue) {
				this.openPlotRatesForm.get('taluka_id')?.setValue(selectedValue || '');
				this.getGramPanchayByTaluka(Number(selectedValue));

			}
		});

		$('#gramPanchayat').on('change', (event) => {
			const selectedValue: string = String($(event.target).val());
			if (selectedValue) {
				this.openPlotRatesForm.get('panchayat_id')?.setValue(selectedValue || '');
        this.getGatGramPanchayByPanchayatId(Number(selectedValue));
			}
		});

    $('#gatgramPanchayat').on('change', (event) => {
			const selectedValue: string = String($(event.target).val());
			if (selectedValue) {
				this.openPlotRatesForm.get('gatgrampanchayat_id')?.setValue(selectedValue || '');
			}
		});

     $('#prakar_id').on('change', (event) => {
			const selectedValue: string = String($(event.target).val());
			if (selectedValue) {
				this.openPlotRatesForm.get('prakar_id')?.setValue(selectedValue || '');
			}
		});


	}

	ngOnDestroy(): void {
		// Destroy the Select2 instance to avoid memory leaks
		$('#mySelect').select2('destroy');
		// Remove keyup event listener from search field
		$('.select2-search__field').off('keyup');
	}

 submitData() {
        
        this.isSubmitted = true;
        if (this.openPlotRatesForm.invalid) {
          return;
        }
        // console.log("data",this.openPlotRatesForm.value)
        const data = this.openPlotRatesForm.value;
        
        this.apiService.post("add-open-plot-info",data).subscribe({
          next: (res: any) => {
            if (res.status == 201) {
              this.toastr.success(res?.message, 'Success');
              this.isSubmitted = false;
              this.fetchData();
              this.reset();
            } else {
              this.toastr.success(res?.message, 'Error');
            }
          },
          error: (err: any) => {
            this.toastr.error('Failed to add Gat Gram Panchayat', 'Error');
            console.log("error: addGatGramPanchayat ::", err);
            this.isSubmitted = false;
          }

        });
    }

    reset() {
        this.openPlotRatesForm.reset();
        $('#mySelect').val('').trigger('change');
        $('#taluka').val('').trigger('change');
        $('#gramPanchayat').val('').trigger('change');
        $('#gatgramPanchayat').val('').trigger('change');
        $('#prakar_id').val('').trigger('change');
        this.isEdit = false;
        this.talukas = [];
		    this.gramPanchayatList = [];
        this.gatgramPanchayatList = [];
    }
    updateData() {
        this.isSubmitted = true;
        if (this.openPlotRatesForm.invalid) {
          return;
        }
        const data: any = this.openPlotRatesForm.value;
        this.apiService.put("update-open-plot-info/"+this.openPlotId, data).subscribe({
          next: (res: any) => {
            if (res.status == 200) {
              this.toastr.success(res?.message, 'यश');
              this.isSubmitted = false;
              this.fetchData();
              this.reset();
            } else {
              this.toastr.error(res?.message, 'त्रुटी');
            }
          },
          error: (err: any) => {
            this.toastr.error('Failed to updateopen plot rate', 'Error');
            console.log("error: updateOpen plot  ::", err);
            this.isSubmitted = false;
          }

        });

    }

    editInfo(id: number) {
      console.log("id", id)
        this.apiService.get("get-open-plot-info/"+id).subscribe((res: any) => {
            this.openPlotId = id;
            this.isEdit = true;
            if (res.status == 200) {
                this.openPlotRatesForm.get('district_id')?.setValue(res.data.DISTRICT_ID);
                $("#mySelect").val(res.data.DISTRICT_ID).trigger('change');
                this.openPlotRatesForm.get('taluka_id')?.setValue(res.data.TALUKA_ID)
                                
                setTimeout(() => {
                  $("#taluka").val(res.data.TALUKA_ID).trigger('change');
                }, 300)

                setTimeout(() => {
                  this.openPlotRatesForm.get('panchayat_id')?.setValue("" + res.data.PANCHAYAT_ID);
                  $("#gramPanchayat").val(res.data.PANCHAYAT_ID).trigger('change');
                }, 400)

                setTimeout(() => {
                  this.openPlotRatesForm.get('gatgrampanchayat_id')?.setValue("" + res.data.GATGRAMPANCHAYAT_ID);
                  $("#gatgramPanchayat").val(res.data.GATGRAMPANCHAYAT_ID).trigger('change');
                  
                }, 500)
                this.openPlotRatesForm.get('prakar_id')?.setValue(res.data.PRAKAR_ID);
                $("#prakar_id").val(res.data.PRAKAR_ID).trigger('change');

                this.openPlotRatesForm.get('annualcost_name')?.setValue(res.data.ANNUALCOST_NAME);
                this.openPlotRatesForm.get('levyrate_name')?.setValue(res.data.LEVYRATE_NAME);

            } else {
                this.toastr.error(res.message, "Error");
            }

        });
    }

    deleteInfo(id: number) {
        this.util.showConfirmAlert().then((res) => {
            if (id === 0) {
                this.toastr.error('This Open plot rate cannot be deleted.', 'Error');
                return;
            }
            if (res) {
               this.apiService.delete("delete-open-plot-info/"+id).subscribe({
                    next: (res: any) => {
                        if (res.status == 200) {
                            this.toastr.success(res.message, "Success");
                            this.fetchData();
                        } else {
                            this.toastr.error(res.message, "Error");
                        }
                    },
                    error: (err: Error) => {
                        console.error('Error deleting Open plot rate:', err);
                        this.toastr.error('There was an error deleting the Open plot rate', 'Error');
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
}
