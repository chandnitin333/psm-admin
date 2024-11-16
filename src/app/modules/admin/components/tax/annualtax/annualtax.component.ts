import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import $ from 'jquery'; // Import jQuery
import { ITEM_PER_PAGE } from '../../../constants/admin.constant';
import { AnualTaxService } from '../../../services/anual-tax.service';
import Util from '../../../utils/utils';
import { PaginationComponent } from '../../pagination/pagination.component';
import { SortingTableComponent } from '../../sorting-table/sorting-table.component';

@Component({
    selector: 'app-annualtax',
    standalone: true,
    imports: [FormsModule, CommonModule, PaginationComponent, SortingTableComponent],
    templateUrl: './annualtax.component.html',
    styleUrl: './annualtax.component.css'
})
export class AnnualtaxComponent {
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
    selectTab: number = 0;
    collapsedDistricts: { [district: string]: boolean } = {};
    groupedData: any = [];
    selectedDistrict: any;
    constructor(private titleService: Title, private anual: AnualTaxService, private util: Util) { }
    ngOnInit(): void {
        this.titleService.setTitle('Annual Tax');
        this.fetchDistrict();
        // this.fetchAnualList();


    }
    fetchDistrict() {
        this.anual.getDistrictList().subscribe({
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

    }

    deleteInfo(id: number) {

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