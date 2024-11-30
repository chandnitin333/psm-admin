import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { PaginationComponent } from '../pagination/pagination.component';
import { SortingTableComponent } from '../sorting-table/sorting-table.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GhasaraRatesService } from '../../services/ghasara-rates.service';
import Util from '../../utils/utils';
import { ApiService } from '../../../../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-kamkajkameti',
  standalone: true,
  imports: [RouterLink,PaginationComponent, SortingTableComponent, FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './kamkajkameti.component.html',
  styleUrl: './kamkajkameti.component.css'
})
export class KamkajkametiComponent {
  isLoading: boolean = true;
  isEdit: boolean = false;
  isSubmitted: boolean = false;
  private memberId: number = 0;
  panchayatList:any =[];
  DesignationsList: any = [];
  
kamkajComiteeForm = new FormGroup({
		ageOfBuilding: new FormControl<number | null>(null),
		malmattaId: new FormControl<number | null>(null),
    percentage: new FormControl(undefined)
	});
constructor(private titleService: Title, private openPlot: GhasaraRatesService, private util: Util,private apiService: ApiService,private toastr: ToastrService,) {}
   ngOnInit(): void {
    this.titleService.setTitle('Kamkaj Kameti List');
    this.fetchPanchayatList();
    this.fetchDesignation();
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
