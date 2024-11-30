import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ConfirmationDialogModule } from '../../../module/confirmation-dialog/confirmation-dialog.module';
import { GatGramPanchayatService } from '../../../services/gat-gram-panchayat.service';
import { GramPanchayatService } from '../../../services/gram-panchayat.service';
import { OtherTaxService } from '../../../services/other-tax.service';
import { TalukaService } from '../../../services/taluka.service';
import Util from '../../../utils/utils';
import { PaginationComponent } from '../../pagination/pagination.component';
import { SkeletonLoaderComponent } from '../../skeleton-loader/skeleton-loader.component';
import { SortingTableComponent } from '../../sorting-table/sorting-table.component';
@Component({
    selector: 'app-othertax',
    standalone: true,
    imports: [
        PaginationComponent,
        SortingTableComponent,
        ConfirmationDialogModule,
        SkeletonLoaderComponent,
        CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './othertax.component.html',
    styleUrl: './othertax.component.css'
})
export class OthertaxComponent {
    districts: any = [];
    talukas: any = [];
    gramPanchayatList: any = [];
    selectDistrict: number = 0;
    selectTaluka: number = 0;
    selectGramPanchayat: number = 0;
    otherTaxList: any = [];
    currentPage: number = 1;
    taxList: any = [];

    taxtNameList: any = []
    taxtNameSet: any;
    isManula: boolean = true
    taxData: any = {
        taxid1: 0,
        taxid2: 0,
        taxid3: 0,
        taxid4: 0,
        taxid5: 0,
        taxrate1: 0,
        taxrate2: 0,
        taxrate3: 0,
        taxrate4: 0,
        taxrate5: 0

    };
    isEdit: boolean = false;
    otherTaxFrm = new FormGroup({
        district_id: new FormControl<string | null>(null, Validators.required),
        grampanchayat_id: new FormControl<string | null>(null, Validators.required),
        taluka_id: new FormControl<string | null>(null, Validators.required),
        othertax_id: new FormControl<number | string>(''),
        taxid1: new FormControl<number | string>(''),
        taxid2: new FormControl<number | string>(''),
        taxid3: new FormControl<number | string>(''),
        taxid4: new FormControl<number | string>(''),
        taxid5: new FormControl<number | string>(''),
        taxrate1: new FormControl<number | string>(''),
        taxrate2: new FormControl<number | string>(''),
        taxrate3: new FormControl<number | string>(''),
        taxrate4: new FormControl<number | string>(''),
        taxrate5: new FormControl<number | string>('')
    })
    constructor(private titleService: Title, private taluka: TalukaService, private util: Util, private gramPanchayt: GramPanchayatService, private gatGramPanchayatService: GatGramPanchayatService, private otherTax: OtherTaxService, private fb: FormBuilder) {

    }
    ngOnInit(): void {
        this.titleService.setTitle('Other Tax');
        this.getDistrictList();
        this.getTaxList();
    }

    ngAfterViewInit(): void {
        $('.my-select2').select2();

        $('#mySelect').on('change', (event) => {
            const selectedValue: string = String($(event.target).val());
            this.selectDistrict = Number(selectedValue);
            this.getTalukaByDistrict(selectedValue);
            if (selectedValue) {
                this.otherTaxFrm.get('district_id')?.setValue(selectedValue || '');
            }
        });

        $('#taluka').on('change', (event) => {
            const selectedValue: string = String($(event.target).val());
            this.selectTaluka = Number(selectedValue);
            if (selectedValue) {
                this.otherTaxFrm.get('taluka_id')?.setValue(selectedValue || '');
                this.getGramPanchayByTaluka(Number(selectedValue));

            }
        });


        $('#gramPanchayat').on('change', (event) => {
            const selectedValue: string = String($(event.target).val());
            this.selectGramPanchayat = Number(selectedValue);
            if (this.selectGramPanchayat) {
                this.otherTaxFrm.get('grampanchayat_id')?.setValue(selectedValue.toString());
                this.fetchData(Number(this.selectGramPanchayat));

            }
        });
    }

    getTaxList() {
        this.taxtNameSet = new Set();
        this.otherTax.fetchTaxList().subscribe((res: any) => {

            let data = res?.data ?? [];
            data.forEach((element: any) => {
                for (const key in element) {

                    this.taxList[element['OTHERTAX_ID']] = element['OTHERTAX_NAME'];
                    const data = {
                        id: element['OTHERTAX_ID'] ?? '',
                        tax_name: element['OTHERTAX_NAME'] ?? '',
                        isChecked: false
                    };

                    if (!this.taxtNameSet.has(data.id)) {
                        this.taxtNameList.push(data);
                        this.taxtNameSet.add(data.id); // Add ID to the Set
                    }

                }
            });

        })

        console.log("Tax taxtNameList=====", this.taxtNameList);
    }

    fetchData(id: Number) {

        this.otherTax.fetchOtherTaxList({ page_number: this.currentPage, search_text: '', panchayat_id: id }).subscribe((res: any) => {
            this.otherTaxList = res?.data ?? [];
            if (this.otherTaxList.length == 0) {
                this.isManula = false
            }
            let data: any = [];
            let taxData = res?.data[0];
            for (const key in taxData) {
                if (key.startsWith('TAXID')) {
                    let id = taxData[key] ?? '';

                    let obj = { name: this.taxList[taxData[key]], tax_rate: taxData[key.replace('TAXID', 'TAXRATE')] ?? 0, tax_id: id ?? '', isChecked: false };
                    data.push(obj);
                    this.isManula = true
                }
            }
            this.otherTaxList = { ...taxData, data };
            console.log("otherTaxList=", this.otherTaxList);
        });

    }
    getTalukaByDistrict(id: any) {

        this.gramPanchayt.getTalukaById({ id: id }).subscribe((res: any) => {
            this.talukas = res.data ?? [];

        });

    }
    async getDistrictList() {
        this.districts = await this.util.getDistrictDDL();
    }
    getGramPanchayByTaluka(talikaId: any) {
        this.gatGramPanchayatService.getGatGramTalukaById({ id: talikaId }).subscribe((res: any) => {
            this.gramPanchayatList = res?.data ?? [];
        });

    }
    toggleCheck(event: Event, data: any) {

        const isChecked = (event.target as HTMLInputElement).checked;
        const tax = this.otherTaxList.data.find((el: any) => el.tax_id === data?.tax_id);
        if (tax) {
            tax.isChecked = isChecked;
        }
    }

    toggleChecktax(event: Event, data: any) {

        const isChecked = (event.target as HTMLInputElement).checked;
        const tax = this.taxtNameList.find((el: any) => el.id === data?.id);
        if (tax) {
            tax.isChecked = isChecked;
        }
    }
    restrictText(event: Event, ele: any, i: number): void {
        const element = event.target as HTMLInputElement;
        console.log("ele===", ele)
        // Allow only numbers (0-9) and the character 'n'
        element.value = element.value.replace(/[^0-9n.]/g, '');

        // Update the ngModel with the filtered value, keeping 2 decimals
        this.taxData[element.name] = element.value;
        console.log("iii==",i)
        this.taxData['taxid' + i+1] = ele.id;
        console.log("taxData===", this.taxData)

    }

    formatTaxRate(taxRate: any): string {
        if (taxRate !== undefined && taxRate !== null) {
            return parseFloat(taxRate).toFixed(2);  // Ensures 2 decimal places
        }
        return '0.00';
    }



    changeTaxById(event: KeyboardEvent): void {
        const content = (event.target as HTMLElement).innerText;
        console.log('Contenteditable value:', content);
    }

    submit() {
        console.log("taxData==", this.taxData)
        console.log("otherTaxFrm==", this.otherTaxFrm.value)
    }

    update() {

    }
}
