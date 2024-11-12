import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { GatGramPanchayatService } from '../../../services/gat-gram-panchayat.service';
import { GramPanchayatService } from '../../../services/gram-panchayat.service';
import { OtherTaxService } from '../../../services/other-tax.service';
import { TalukaService } from '../../../services/taluka.service';
import Util from '../../../utils/utils';
@Component({
    selector: 'app-othertax',
    standalone: true,
    imports: [CommonModule],
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
    form: FormGroup;

    constructor(private titleService: Title, private taluka: TalukaService, private util: Util, private gramPanchayt: GramPanchayatService, private gatGramPanchayatService: GatGramPanchayatService, private otherTax: OtherTaxService, private fb: FormBuilder) {
        this.form = this.fb.group({
            districtName: [''],
            taluka_id: [''],
            panchayat_id: ['']
        });
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
                //this.gramFrom.get('districtName')?.setValue(selectedValue || '');
            }
        });

        $('#taluka').on('change', (event) => {
            const selectedValue: string = String($(event.target).val());
            this.selectTaluka = Number(selectedValue);
            if (selectedValue) {
                // this.gatGramFrom.get('taluka_id')?.setValue(selectedValue || '');
                this.getGramPanchayByTaluka(Number(selectedValue));

            }
        });


        $('#gramPanchayat').on('change', (event) => {
            const selectedValue: string = String($(event.target).val());
            this.selectGramPanchayat = Number(selectedValue);
            if (this.selectGramPanchayat) {
                // this.gatGramFrom.get('taluka_id')?.setValue(selectedValue || '');
                this.fetchData(Number(this.selectGramPanchayat));

            }
        });
    }

    getTaxList() {

        this.otherTax.fetchTaxList().subscribe((res: any) => {

            let data = res?.data ?? [];
            data.forEach((element: any) => {
                for (const key in element) {
                    this.taxList[element['OTHERTAX_ID']] = element['OTHERTAX_NAME']
                }
            });

        })
    }

    fetchData(id: Number) {

        this.otherTax.fetchOtherTaxList({ page_number: this.currentPage, search_text: '', panchayat_id: id }).subscribe((res: any) => {
            this.otherTaxList = res?.data ?? [];
            console.log('taxList==', this.taxList);
            let data: any = [];
            let taxData = res?.data[0];
            for (const key in taxData) {
                if (key.startsWith('TAXID')) {
                    let id = taxData[key] ?? '';
                    console.log('id==', taxData[key]);
                    let obj = { name: this.taxList[taxData[key]], tax_rate: taxData[key.replace('TAXID', 'TAXRATE')] ?? 0, tax_id: id ?? '', isChecked: false };
                    data.push(obj);
                }
            }
            this.otherTaxList = { ...taxData, data };
            console.log('otherTaxList==', this.otherTaxList);
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
    restrictText(event: Event): void {
        const element = event.target as HTMLElement;
        
        // Optional: Restrict to a single line (remove line breaks)
        element.innerText = element.innerText.replace(/\n/g, '');
        
        // Optional: Limit text length (e.g., max 10 characters)
        const maxLength = 10;
        if (element.innerText.length > maxLength) {
          element.innerText = element.innerText.substring(0, maxLength);
        }
      }
}
