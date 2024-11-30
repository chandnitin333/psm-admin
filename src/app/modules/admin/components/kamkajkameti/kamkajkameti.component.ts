import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ITEM_PER_PAGE } from '../../constants/admin.constant';
import { KamkajKametiService } from '../../services/kamkaj-kameti.service';
import { PaginationComponent } from '../pagination/pagination.component';
import { SortingTableComponent } from '../sorting-table/sorting-table.component';

@Component({
  selector: 'app-kamkajkameti',
  standalone: true,
  imports: [RouterLink, PaginationComponent, SortingTableComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './kamkajkameti.component.html',
  styleUrl: './kamkajkameti.component.css'
})
export class KamkajkametiComponent {

  constructor(private titleService: Title, private kamkaj: KamkajKametiService) { }
  userPanchayt: any = [];
  items: any = [];
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
  ngOnInit(): void {
    this.titleService.setTitle('Kamkaj Kameti List');
    this.getDistrict();
    this.fetchData();
  }



  getDistrict() {
    this.kamkaj.fetchDistrict().subscribe((res: any) => {
      this.userPanchayt = res?.data;

    })
  }


  fetchData() {
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

  submit() {

  }
  update() {
  }

  editInfo(id: number) {
  }
  deleteInfo(id: number) {
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



}
