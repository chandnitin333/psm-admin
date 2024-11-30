import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ITEM_PER_PAGE } from '../../constants/admin.constant';
import { KamkajKametiService } from '../../services/kamkaj-kameti.service';
import { PaginationComponent } from '../pagination/pagination.component';
import { SortingTableComponent } from '../sorting-table/sorting-table.component';
import { ApiService } from '../../../../services/api.service';
import Util from '../../utils/utils';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-kamkajkameti',
  standalone: true,
  imports: [RouterLink, PaginationComponent, SortingTableComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './kamkajkameti.component.html',
  styleUrl: './kamkajkameti.component.css'
})
export class KamkajkametiComponent {

  constructor(private titleService: Title, private kamkaj: KamkajKametiService, private apiService: ApiService,private util: Util,private toastr: ToastrService) { }
  isLoading: boolean = true;
  kamkajId: number = 0;

  userPanchayt: any = [];
  items: any = [];
  DesignationsList: any =[];
  panchayatList: any =[];
  isSubmitted: boolean = false;
  isEdit: boolean = false;

  currentPage: number = 1;
  searchValue: string = '';
  totalItems: number = 0;
  itemsPerPage: number = ITEM_PER_PAGE
  displayedColumns: any = [
    { key: 'sr_no', label: 'अनुक्रमांक' },
    { key: 'NAME_NAME', label: 'नाव' },
    { key: 'DESIGNATION_ID', label: 'पदनाम' },
    { key: 'MOBILE_NO', label: 'संपर्क क्रमांक' }
  ];

  keyName: string = 'MEMBERMASTER_ID';

  selectTab: number = 0;
  selectPunchayId: any;
  collapsedDistricts: { [district: string]: boolean } = {};
  kamkajComiteeForm = new FormGroup({
    panchayatName: new FormControl<string | null>(null),
		first_name: new FormControl(undefined),
    middle_name: new FormControl(undefined),
		last_name: new FormControl(undefined),
    designationName: new FormControl<string | null>(null),
    mobile_no: new FormControl(undefined)
	});
  ngOnInit(): void {
    this.titleService.setTitle('Kamkaj Kameti List');
    this.getPanchayatUser();
    this.fetchData();
    this.fetchPanchayatList();
    this.fetchDesignation();
  }


  getPanchayatUser() {
    this.kamkaj.fetchPanchayatUser().subscribe((res: any) => {
      this.userPanchayt = res?.data;

    })
  }


  fetchData() {
    console.log("this.selectPunchayId", this.selectPunchayId)
    this.setValueToggle(this.selectPunchayId);
    this.kamkaj.fetchKamkajKamethiList({
      "page_number": this.currentPage,
      "search_text": this.searchValue,
      "panchayat_id": this.selectPunchayId
    }).subscribe((res: any) => {
      this.items = res?.data;
      this.totalItems = res?.totalRecords;
      console.log("Kamkaj Kamaeti list", this.items)
    })
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.fetchData();
  }

  ngOnDestroy(): void {
		// Destroy the Select2 instance to avoid memory leaks
		$('#mySelect').select2('destroy');
		// Remove keyup event listener from search field
		$('.select2-search__field').off('keyup');
	}


 submitData() {
        this.isSubmitted = true;
        // console.log(this.kamkajComiteeForm.value);
        if (this.kamkajComiteeForm.valid && 
            this.kamkajComiteeForm.value.panchayatName  &&
            this.kamkajComiteeForm.value.first_name &&
            this.kamkajComiteeForm.value.middle_name &&
            this.kamkajComiteeForm.value.last_name &&
            this.kamkajComiteeForm.value.designationName &&
            this.kamkajComiteeForm.value.mobile_no
          ) {
            let params: any = {
                panchayat_id: this.kamkajComiteeForm.value.panchayatName,
                member_name: this.kamkajComiteeForm.value.first_name,
                member_middle_name: this.kamkajComiteeForm.value.middle_name,
                member_last_name: this.kamkajComiteeForm.value.last_name,
                destination_id: this.kamkajComiteeForm.value.designationName,
                mobile_number: this.kamkajComiteeForm.value.mobile_no
                
            }
             this.apiService.post('add-member', params).subscribe((res: any) => {
                if (res.status == 201) {
                    this.toastr.success(res.message, "Success");
                    this.reset();
                    this.isSubmitted = false;
                    this.selectPunchayId = parseInt(params.panchayat_id);
                    // console.log("id",this.selectPunchayId )
                    this.getPanchayatUser();
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
        this.kamkajComiteeForm.reset();
        $('#panchayat_id').val('').trigger('change');
        $('#designation_id').val('').trigger('change');
        this.isEdit = false;
    }
    updateData() {
        this.isSubmitted = true;
        if (this.kamkajComiteeForm.valid && 
          this.kamkajComiteeForm.value.panchayatName  &&
           this.kamkajComiteeForm.value.first_name &&
           this.kamkajComiteeForm.value.last_name &&
           this.kamkajComiteeForm.value.designationName) {
            let params: any = {
                panchayat_id: this.kamkajComiteeForm.value.panchayatName,
                member_name: this.kamkajComiteeForm.value.first_name,
                member_middle_name: this.kamkajComiteeForm.value.middle_name,
                member_last_name: this.kamkajComiteeForm.value.last_name,
                destination_id: this.kamkajComiteeForm.value.designationName,
                mobile_number: this.kamkajComiteeForm.value.mobile_no,
                vapar_id: this.kamkajId
            }
            this.apiService.put("update-member/"+this.kamkajId,params).subscribe({
                next: (res: any) => {
                    if (res.status == 200) {
                        this.reset();
                        this.isSubmitted = false;
                        this.toastr.success(res?.message, 'Success');
                        this.selectPunchayId = parseInt(params.panchayat_id);
                        this.getPanchayatUser();
                        this.fetchData();
                    } else {
                        this.toastr.warning(res?.message, 'Success');
                    }
                },
                error: (err: Error) => {
                    console.error('Error updating कामकाज कमेटी:', err);
                    this.toastr.error('There was an error updating कामकाज कमेटी.', 'Error');
                }
            });
        } else {
            this.toastr.error('Please fill all the fields', 'Error');
        }

    }

    editInfo(id: number) {
        this.apiService.get("member/"+id).subscribe((res: any) => {
            this.kamkajId = id;
            this.isEdit = true;
            // console.log("REs", res)
            if (res.status == 200) {
                this.kamkajComiteeForm.get('panchayatName')?.setValue(res.data.PANCHAYAT_ID);
                $("#panchayat_id").val(res.data.PANCHAYAT_ID).trigger('change');
                this.kamkajComiteeForm.get('designationName')?.setValue(res.data.DESIGNATION_ID);
                $("#designation_id").val(res.data.DESIGNATION_ID).trigger('change');
                this.kamkajComiteeForm.get('first_name')?.setValue(res.data.NAME_NAME);
                this.kamkajComiteeForm.get('middle_name')?.setValue(res.data.MIDDLE_NAME);
                this.kamkajComiteeForm.get('last_name')?.setValue(res.data.LAST_NAME);
                this.kamkajComiteeForm.get('mobile_no')?.setValue(res.data.MOBILE_NO);

            } else {
                this.toastr.error(res.message, "Error");
            }

        });
    }

    deleteInfo(id: number) {
        this.util.showConfirmAlert().then((res) => {
            if (id === 0) {
                this.toastr.error('This कामकाज कमेटी cannot be deleted.', 'Error');
                return;
            }
            if (res) {
               this.apiService.delete("/delete-member/"+id).subscribe({
                    next: (res: any) => {
                        if (res.status == 200) {
                            this.toastr.success(res.message, "Success");
                            this.getPanchayatUser();
                            this.fetchData()
                        } else {
                            this.toastr.error(res.message, "Error");
                        }
                    },
                    error: (err: Error) => {
                        console.error('Error deleting कामकाज कमेटी:', err);
                        this.toastr.error('There was an error deleting the कामकाज कमेटी.', 'Error');
                    }
                });
            }
        });
    }

  toggleCollapse(district: string) {

    if (this.selectPunchayId != district) {
      this.collapsedDistricts[district] = !this.collapsedDistricts[district];
      this.currentPage = 1;
      this.selectPunchayId = district;
      this.fetchData();
    } else {

      this.collapsedDistricts[district] = !this.collapsedDistricts[district];
    }

  }

  setValueToggle(district: string) {

    for (const key in this.collapsedDistricts) {

      if (key.toString() == district) {
        this.collapsedDistricts[key] = true;

      } else {
        this.collapsedDistricts[key] = false;
      }
    }

  }

  fetchPanchayatList()
  {
      let params = {};
      this.apiService.post('panchayat-list-ddl', params).subscribe({
          next: (res: any) => {
              this.panchayatList = res.data;
              // console.log(this.malmattaList)
          },
          error: (err: any) => {
              console.error('Error::  fetch age of building List :', err);
          }
      });
  }


 fetchDesignation()
  {
      let params = {};
      this.apiService.post('designation-list-ddl', params).subscribe({
          next: (res: any) => {
              this.DesignationsList = res.data;
              // console.log(this.malmattaList)
          },
          error: (err: any) => {
              console.error('Error::  fetch age of building List :', err);
          }
      });
  }

  onKeydown(event: KeyboardEvent, controlName: string): void {
        this.util.onKeydown(event, controlName, this.kamkajComiteeForm);
    }

    ngAfterViewInit(): void {
		  $('.my-select2').select2();
      $('#panchayat_id').on('change', (event) => {
            const selectedValue: string = String($(event.target).val());
            if (selectedValue) {
			        this.kamkajComiteeForm.get('panchayatName')?.setValue(selectedValue || '');
            }
		  });
      $('#designation_id').on('change', (event) => {
            const selectedValue: string = String($(event.target).val());
            if (selectedValue) {
			        this.kamkajComiteeForm.get('designationName')?.setValue(selectedValue || '');
            }
		  });
    }



}
