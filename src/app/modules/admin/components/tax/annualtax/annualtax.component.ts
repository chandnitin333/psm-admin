import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import $ from 'jquery'; // Import jQuery
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../../../services/api.service';
import { ITEM_PER_PAGE } from '../../../constants/admin.constant';
import { AnualTaxService } from '../../../services/anual-tax.service';
import Util from '../../../utils/utils';
import { PaginationComponent } from '../../pagination/pagination.component';
import { SortingTableComponent } from '../../sorting-table/sorting-table.component';

@Component({
    selector: 'app-annualtax',
    standalone: true,
    imports: [FormsModule, CommonModule, PaginationComponent, SortingTableComponent, ReactiveFormsModule],
    templateUrl: './annualtax.component.html',
    styleUrl: './annualtax.component.css'
})
export class AnnualtaxComponent {
    isLoading: boolean = true;
    isEdit: boolean = false;
    isSubmitted: boolean = false;
    private annualTaxId: number = 0;

    currentPage: number = 1;
    searchValue: string = '';
    items: any = [];
    totalItems: number = 0;
    itemsPerPage: number = ITEM_PER_PAGE
    displayedColumns: any = [
        { key: 'sr_no', label: 'अनुक्रमांक' },
        { key: 'DISTRICT_NAME', label: 'जिल्हा' },
        { key: 'DESCRIPTION_NAME', label: 'मालमत्तेचे प्रकार' },
        { key: 'MILKAT_VAPAR_NAME', label: 'मालमत्तेचे वर्णन' },
        { key: 'ANNUALPRICE_NAME', label: 'वार्षिक मूल्य दर' },
        { key: 'LEVYRATE_NAME', label: 'आकारणी दर' },
    ];

    keyName: string = 'ANNUALTAX_ID';
    marathiText: string = '';
    districtList: any = [];
    malmattaList: any = [];
    malmattaVarnanList: any = [];
    selectTab: number = 0;
    collapsedDistricts: { [district: string]: boolean } = {};
    groupedData: any = [];
    selectedDistrict: any;
    annualTaxForm = new FormGroup({
        district_id: new FormControl<number | null>(null),
        malmattaId: new FormControl<number | null>(null),
        malmattaPrakarId: new FormControl<number | null>(null),
        mulyaDar: new FormControl(undefined),
        aakarniDar: new FormControl(undefined),
    });
    userDistrict: any = [];
    constructor(private titleService: Title, private anual: AnualTaxService, private util: Util, private apiService: ApiService, private toastr: ToastrService,) { }
    ngOnInit(): void {
        this.titleService.setTitle('Annual Tax');
        // this.getAllDistricts();
        this.fetchDistrict();
        this.fetchMalmattechePrakar();
        this.getAllMalmattaVarnanList();
        this.fetchDistristAnula();


    }
    fetchDistrict() {
        this.apiService.post("district-list-ddl", {}).subscribe({
            next: (res: any) => {
                this.districtList = res.data;
                this.districtList.forEach((item: any) => {
                    this.collapsedDistricts[item.DISTRICT_ID] = false;
                });
            },
            error: (err: any) => {
                console.error('Error::  fetch District List :', err);
            }
        });
    }

    // async getAllDistricts() {
    // 	this.districtList = await this.util.getDistrictDDL('district-list-ddl')
    // }

    async getAllMalmattaVarnanList() {
        this.malmattaVarnanList = await this.util.getMalmattechePrakartDDL('get-malmatteche-prakar-all-list')
    }

    fetchMalmattechePrakar() {
        let params = {};
        this.apiService.post('malmatta-list-ddl', params).subscribe({
            next: (res: any) => {
                this.malmattaList = res.data;
            },
            error: (err: any) => {
                console.error('Error::  fetch District List :', err);
            }
        });
    }

    fetchDistristAnula() {
        this.anual.getDistrictList().subscribe((res: any) => {
            this.userDistrict = res?.data;
        })
    }
    submitData() {
        this.isSubmitted = true;

        // console.log(this.milkatVaparForm.value);
        if (this.annualTaxForm.valid && this.annualTaxForm.value.district_id && this.annualTaxForm.value.malmattaId && this.annualTaxForm.value.malmattaPrakarId && this.annualTaxForm.value.mulyaDar && this.annualTaxForm.value.aakarniDar) {
            let params: any = {
                district_id: this.annualTaxForm.value.district_id,
                malmatta_id: this.annualTaxForm.value.malmattaId,
                milkat_vapar_id: this.annualTaxForm.value.malmattaPrakarId,
                annualprice_name: this.annualTaxForm.value.mulyaDar,
                levyrate_name: this.annualTaxForm.value.aakarniDar
            }
            this.apiService.post('add-annual-tax', params).subscribe((res: any) => {
                if (res.status !== 400) {
                    // console.log("id", this.annualTaxForm.value.district_id)
                    // console.log("param", params.district_id)
                    this.fetchData(this.annualTaxForm.value.district_id);
                    this.reset();
                    this.toastr.success(res.message, 'Success');
                    this.isSubmitted = true;
                    // this.fetchDistrict();
                }
                else {
                    this.toastr.warning("Annual Tax already exits. please try another one.", 'Warning');
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
            this.toastr.error('Please fill all the fields', 'Error');
        }
    }

    reset() {
        this.annualTaxForm.reset();
        $('#mySelect').val('').trigger('change');
        $('#malmatta_id').val('').trigger('change');
        $('#malmattache_varnan').val('').trigger('change');
        this.isEdit = false;
    }
    updateData() {
        this.isSubmitted = true;
        if (this.annualTaxForm.valid && this.annualTaxForm.value.district_id && this.annualTaxForm.value.malmattaId && this.annualTaxForm.value.malmattaPrakarId && this.annualTaxForm.value.mulyaDar && this.annualTaxForm.value.aakarniDar) {
            let params: any = {
                district_id: this.annualTaxForm.value.district_id,
                malmatta_id: this.annualTaxForm.value.malmattaId,
                milkat_vapar_id: this.annualTaxForm.value.malmattaPrakarId,
                annualprice_name: this.annualTaxForm.value.mulyaDar,
                levyrate_name: this.annualTaxForm.value.aakarniDar,
                annualtax_id: this.annualTaxId
            }
            this.apiService.put("update-annual-tax", params).subscribe({
                next: (res: any) => {
                    if (res.status == 200) {
                        this.isSubmitted = false;
                        this.toastr.success(res?.message, 'Success');
                        this.fetchData(this.annualTaxForm.value.district_id);
                        this.reset();
                        //  this.fetchDistrict();
                    } else {
                        this.toastr.warning(res?.message, 'Success');
                    }
                },
                error: (err: Error) => {
                    console.error('Error updating annual tax:', err);
                    this.toastr.error('There was an error updating annual tax.', 'Error');
                }
            });
        } else {
            this.toastr.error('Please fill all the fields', 'Error');
        }

    }
    onKeydown(event: KeyboardEvent, controlName: string): void {
        this.util.onKeydown(event, controlName, this.annualTaxForm);
    }

    ngAfterViewInit(): void {
        // Initialize jQuery click handlers
        this.initializeCollapsibleRows();

    }

    ngOnDestroy(): void {
        $('.toggle-nested').off('click');
    }

    private initializeCollapsibleRows(): void {
        $('.toggle-nested').on('click', function () {
            var $button = $(this);
            var $nestedTable = $button.closest('tr').nextUntil('tr:not(.nested-table)', '.nested-table');

            if ($nestedTable.is(':visible')) {
                $nestedTable.hide().addClass('d-none'); // Hide and add d-none class
                $button.removeClass('mdi mdi-minus-circle toggle-neste')
                $button.addClass('mdi mdi-plus-circle toggle-nested')
            } else {
                $nestedTable.show().removeClass('d-none'); // Show and remove d-none class
                $button.removeClass('mdi mdi-plus-circle toggle-neste')
                $button.addClass('mdi mdi-minus-circle toggle-nested')
            }
        });
    }

    fetchData(districtId: any) {
        this.setValueToggle(districtId);
        this.anual.getAnualTaxDetailsByDistrict({ page_number: this.currentPage, search_text: this.searchValue, district_id: districtId }).subscribe({
            next: (res: any) => {
                this.groupedData = res.data ?? []
                this.items = res?.data ?? [];
                this.totalItems = res?.totalRecords;
                console.log('groupedData==', this.groupedData);



            }, error: (err: any) => {

            }
        });
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

    toggleCollapse(district: string) {
        if (this.selectedDistrict != district) {
            this.currentPage = 1;
            this.selectedDistrict = district;
            this.fetchData(district);
        } else {
            this.collapsedDistricts[district] = !this.collapsedDistricts[district];
        }
    }

    editInfo(id: number) {
        this.apiService.get("get-annual-tax/" + id).subscribe((res: any) => {
            this.annualTaxId = id;
            this.isEdit = true;
            console.log("REs", res)
            if (res.status == 200) {
                this.annualTaxForm.get('district_id')?.setValue(res.data.DISTRICT_ID);
                $("#mySelect").val(res.data.DISTRICT_ID).trigger('change');

                this.annualTaxForm.get('malmattaId')?.setValue(res.data.MALMATTA_ID);
                $("#malmatta_id").val(res.data.MALMATTA_ID).trigger('change');

                this.annualTaxForm.get('malmattaPrakarId')?.setValue(res.data.MILKAT_VAPAR_ID);
                $("#malmattache_varnan").val(res.data.MILKAT_VAPAR_ID).trigger('change');

                this.annualTaxForm.get('mulyaDar')?.setValue(res.data.ANNUALPRICE_NAME);
                this.annualTaxForm.get('aakarniDar')?.setValue(res.data.LEVYRATE_NAME);

            } else {
                this.toastr.error(res.message, "Error");
            }

        });
    }

    deleteInfo(id: number) {
        this.util.showConfirmAlert().then((res) => {
            if (id === 0) {
                this.toastr.error('This annual tax cannot be deleted.', 'Error');
                return;
            }
            if (res) {
                this.apiService.delete("delete-annual-tax/" + id).subscribe({
                    next: (res: any) => {
                        if (res.status == 200) {
                            this.toastr.success(res.message, "Success");
                            this.fetchData(parseInt(res.data.DISTRICT_ID));
                        } else {
                            this.toastr.error(res.message, "Error");
                        }
                    },
                    error: (err: Error) => {
                        console.error('Error deleting annual tax:', err);
                        this.toastr.error('There was an error deleting the annual tax.', 'Error');
                    }
                });
            }
        });
    }

    onPageChange(page: number) {
        this.currentPage = page;
        this.fetchData(this.selectedDistrict);
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

    }

    resetFilter(event: Event) {

    }
}