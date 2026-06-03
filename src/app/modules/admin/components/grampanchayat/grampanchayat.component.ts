import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ITEM_PER_PAGE } from '../../constants/admin.constant';
import { GramPanchayatService } from '../../services/gram-panchayat.service';
import Util from '../../utils/utils';
import { PaginationComponent } from "../pagination/pagination.component";
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';
import { LoaderComponent } from '../loader/loader.component';
import { ApiService } from '../../../../services/api.service';

@Component({
    selector: 'app-grampanchayat',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, PaginationComponent, SkeletonLoaderComponent, LoaderComponent],
    templateUrl: './grampanchayat.component.html',
    styleUrl: './grampanchayat.component.css'
})
export class GrampanchayatComponent implements OnInit, AfterViewInit {
    gramFrom = new FormGroup({
        districtName: new FormControl<string | null>(null),
        talukaName: new FormControl<string | null>(null),
        gramPanchayatName: new FormControl<string | null>(null),
        // घरकर bank details
        ghar_bank_name: new FormControl<string | null>(null),
        ghar_ifsc: new FormControl<string | null>(null),
        ghar_account_no: new FormControl<string | null>(null),
        ghar_account_holder: new FormControl<string | null>(null),
        ghar_upi_id: new FormControl<string | null>(null),
        // पाणी कर bank details
        pani_bank_name: new FormControl<string | null>(null),
        pani_ifsc: new FormControl<string | null>(null),
        pani_account_no: new FormControl<string | null>(null),
        pani_account_holder: new FormControl<string | null>(null),
        pani_upi_id: new FormControl<string | null>(null),
    });

    bankFieldKeys: string[] = [
        'ghar_bank_name', 'ghar_ifsc', 'ghar_account_no', 'ghar_account_holder', 'ghar_upi_id',
        'pani_bank_name', 'pani_ifsc', 'pani_account_no', 'pani_account_holder', 'pani_upi_id',
    ];
    errorMessage: string | null = null;
    errorButton: boolean = true;

    isSubmitted: boolean = false;
    private currentPage: number = 1;
    districts: any = [];
    talukas: any = [];
    isEdit: boolean = false;
    private gramPanchaytData: any = [];
    itemsPerPage: number = ITEM_PER_PAGE;
    totalItems: number = 0;
    searchValue: string = '';
    panchayatId: number = 0;
    marathiText: string = '';
    isLoading: boolean = true;

    gharTaxScannerFile: File | null = null;
    paniTaxScannerFile: File | null = null;
    gharTaxScannerPreview: string | null = null;
    paniTaxScannerPreview: string | null = null;
    existingGharTaxScannerUrl: string = '';
    existingPaniTaxScannerUrl: string = '';

    constructor(private titleService: Title, private util: Util, private gramPanchayt: GramPanchayatService, private toastr: ToastrService, private apiService: ApiService) {
        this.titleService.setTitle('Gram Panchayat');
    }
    ngOnInit(): void {
        this.isLoading = false;
        this.fetchGramPanchayatData();
        this.getAllDistricts();

    }
    ngAfterViewInit(): void {
        $('.my-select2').select2();

        $('#mySelect').on('change', (event) => {
            const selectedValue: string = String($(event.target).val());
            // this.isLoading = true;
            this.getTalukaByDistrict(selectedValue);
            // this.isLoading = false;
            if (selectedValue) {
                this.gramFrom.get('districtName')?.setValue(selectedValue || '');
                 
            }
        });

        $('#taluka').on('change', (event) => {
            const selectedValue: string = String($(event.target).val());
            if (selectedValue) {
                this.gramFrom.get('talukaName')?.setValue(selectedValue || '');
            }
        });

    }

    fetchGramPanchayatData() {
        //  this.isLoading=true;
        this.gramPanchayt.getGramPanchayatList({ page_number: this.currentPage, search_text: this.searchValue }).subscribe((res: any) => {
            this.gramPanchaytData = res.data ?? [];
            this.totalItems = res.totalRecords;
            this.isLoading = false;
        });
    }
    get paginatedItems() {
        return this.gramPanchaytData;
    }
    async getAllDistricts() {
        this.districts = await this.util.getDistrictDDL();
    }

    getTalukaByDistrict(id: any) {

        this.gramPanchayt.getTalukaById({ id: id }).subscribe((res: any) => {
            this.talukas = res.data ?? [];
        });
        this.isLoading = false;
    }

    keyDownText(event: KeyboardEvent, controlName: string): void {
        this.util.onKeydown(event, controlName, this.gramFrom);
    }

    addGramPanyachayt() {
        this.isSubmitted = true;
        if (this.gramFrom.valid && this.gramFrom.value.districtName && this.gramFrom.value.talukaName && this.gramFrom.value.gramPanchayatName) {
            const formData = new FormData();
            formData.set('district_id', String(this.gramFrom.value.districtName));
            formData.set('taluka_id', String(this.gramFrom.value.talukaName));
            formData.set('name', String(this.gramFrom.value.gramPanchayatName));
            if (this.gharTaxScannerFile) {
                formData.set('ghar_tax_scanner', this.gharTaxScannerFile, this.gharTaxScannerFile.name);
            }
            if (this.paniTaxScannerFile) {
                formData.set('pani_tax_scanner', this.paniTaxScannerFile, this.paniTaxScannerFile.name);
            }
            this.appendBankFields(formData);
            this.gramPanchayt.createGramPanchayat(formData).subscribe((res: any) => {
                if (res.status == 201) {
                    this.toastr.success(res.message, "Success");
                    this.reset();
                    this.isSubmitted = false;
                    this.fetchGramPanchayatData();
                } else {
                    this.toastr.error(res.message, "Error");
                }
            });
        } else {
            this.toastr.error('Please fill all the fields','Error');
        }
    }

    reset() {
        this.gramFrom.reset();
        $('#mySelect').val('').trigger('change');
        $('#taluka').val('').trigger('change');
        this.isEdit = false;
         $('.my-select2').select2();
         this.errorMessage = "";
        this.errorButton = true;
        this.gharTaxScannerFile = null;
        this.paniTaxScannerFile = null;
        this.gharTaxScannerPreview = null;
        this.paniTaxScannerPreview = null;
        this.existingGharTaxScannerUrl = '';
        this.existingPaniTaxScannerUrl = '';
        const gharInput = document.getElementById('ghar_tax_scanner') as HTMLInputElement | null;
        if (gharInput) gharInput.value = '';
        const paniInput = document.getElementById('pani_tax_scanner') as HTMLInputElement | null;
        if (paniInput) paniInput.value = '';
    }

    scannerUrl(filename: string): string {
        return this.apiService.file_baseUrl + filename;
    }

    private appendBankFields(formData: FormData): void {
        for (const key of this.bankFieldKeys) {
            const val = (this.gramFrom.value as any)[key];
            formData.set(key, val != null ? String(val) : '');
        }
    }

    onGharTaxScannerSelected(event: Event): void {
        this.gharTaxScannerFile = this.readFile(event, (preview) => this.gharTaxScannerPreview = preview);
    }

    onPaniTaxScannerSelected(event: Event): void {
        this.paniTaxScannerFile = this.readFile(event, (preview) => this.paniTaxScannerPreview = preview);
    }

    private readFile(event: Event, setPreview: (val: string) => void): File | null {
        const input = event.target as HTMLInputElement;
        if (!input?.files?.length) return null;
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = () => setPreview(String(reader.result));
        reader.readAsDataURL(file);
        return file;
    }

    srNo(index: number): number {
        return (this.currentPage - 1) * ITEM_PER_PAGE + index + 1;
    }

    onPageChange(page: number): void {
        this.currentPage = page;
        this.fetchGramPanchayatData();

    }
    editInfo(id: number) {
        this.gramPanchayt.getGramPanchayatById(id).subscribe((res: any) => {
            this.panchayatId = id;
            this.isEdit = true;
            if (res.status == 200) {
                this.gramFrom.get('districtName')?.setValue(res.data.DISTRICT_ID);
                setTimeout(() => {
                    $("#mySelect").val(res.data.DISTRICT_ID).trigger('change');
                    this.gramFrom.get('talukaName')?.setValue(res.data.TALUKA_ID);
                    this.gramFrom.get('gramPanchayatName')?.setValue(res.data.PANCHAYAT_NAME);
                }, 300)

                this.gharTaxScannerFile = null;
                this.paniTaxScannerFile = null;
                this.gharTaxScannerPreview = null;
                this.paniTaxScannerPreview = null;
                this.existingGharTaxScannerUrl = res.data.GHAR_TAX_SCANNER
                    ? this.apiService.file_baseUrl + res.data.GHAR_TAX_SCANNER : '';
                this.existingPaniTaxScannerUrl = res.data.PANI_TAX_SCANNER
                    ? this.apiService.file_baseUrl + res.data.PANI_TAX_SCANNER : '';
                // Bank/UPI details
                this.gramFrom.patchValue({
                    ghar_bank_name: res.data.GHAR_BANK_NAME ?? null,
                    ghar_ifsc: res.data.GHAR_IFSC ?? null,
                    ghar_account_no: res.data.GHAR_ACCOUNT_NO ?? null,
                    ghar_account_holder: res.data.GHAR_ACCOUNT_HOLDER ?? null,
                    ghar_upi_id: res.data.GHAR_UPI_ID ?? null,
                    pani_bank_name: res.data.PANI_BANK_NAME ?? null,
                    pani_ifsc: res.data.PANI_IFSC ?? null,
                    pani_account_no: res.data.PANI_ACCOUNT_NO ?? null,
                    pani_account_holder: res.data.PANI_ACCOUNT_HOLDER ?? null,
                    pani_upi_id: res.data.PANI_UPI_ID ?? null,
                });
                const gharInput = document.getElementById('ghar_tax_scanner') as HTMLInputElement | null;
                if (gharInput) gharInput.value = '';
                const paniInput = document.getElementById('pani_tax_scanner') as HTMLInputElement | null;
                if (paniInput) paniInput.value = '';
            } else {
                this.toastr.error(res.message, "Error");
            }

        });
    }

    updateGramPanchayat() {
        this.isSubmitted = true;
        if (this.gramFrom.valid && this.gramFrom.value.districtName && this.gramFrom.value.talukaName && this.gramFrom.value.gramPanchayatName) {
            const formData = new FormData();
            formData.set('district_id', String(this.gramFrom.value.districtName));
            formData.set('taluka_id', String(this.gramFrom.value.talukaName));
            formData.set('name', String(this.gramFrom.value.gramPanchayatName));
            formData.set('grampanchayat_id', String(this.panchayatId));
            if (this.gharTaxScannerFile) {
                formData.set('ghar_tax_scanner', this.gharTaxScannerFile, this.gharTaxScannerFile.name);
            }
            if (this.paniTaxScannerFile) {
                formData.set('pani_tax_scanner', this.paniTaxScannerFile, this.paniTaxScannerFile.name);
            }
            this.appendBankFields(formData);
            this.gramPanchayt.updateGramPanchayat(formData).subscribe({
                next: (res: any) => {
                    if (res.status == 200) {
                        this.reset();
                        this.isSubmitted = false;
                        this.toastr.success(res?.message, 'Success');
                        this.fetchGramPanchayatData();
                    } else {
                        this.toastr.warning(res?.message, 'Success');
                    }
                },
                error: (err: Error) => {
                    console.error('Error updating Gram Panchayat:', err);
                    this.toastr.error('There was an error updating the Gram Panchayat.', 'Error');
                }
            });
        } else {
            this.toastr.error('Please fill all the fields', 'Error');
        }

    }


    deleteGramPanchayat(id: number) {
        this.util.showConfirmAlert().then((res) => {
             this.isLoading = true;
            if (id === 0) {
                this.toastr.error('This taluka cannot be deleted.', 'Error');
                return;
            }
            if (res) {
                this.gramPanchayt.deleteGramPanchayat(id).subscribe({
                    next: (res: any) => {
                        if (res.status == 200) {
                            this.toastr.success(res.message, "Success");
                            this.fetchGramPanchayatData();
                            this.reset();
                        } else {
                            this.toastr.error(res.message, "Error");
                        }
                    },
                    error: (err: Error) => {
                        console.error('Error deleting Gram Panchayat:', err);
                        this.toastr.error('There was an error deleting the Gram Panchayat.', 'Error');
                    }
                });
            }
        });
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
        this.debounceFetchDistrictData();

    }

    private debounceFetchDistrictData = this.debounce(() => {
        this.fetchGramPanchayatData();
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
        this.fetchGramPanchayatData();
    }
    async onValidate(event:any)
    {
        let status = this.util.validateStringWithSpaces(event.target.value);
        if(await status){
            // this.errorMessage = "Please enter string only";
            this.errorButton = true;
        }  else if(event.target.value == ""){
			this.errorButton = true;
            // this.errorMessage = "This field must be required";
		} else {
            this.errorButton = true;
            this.errorMessage = "";
        }
    }
}
