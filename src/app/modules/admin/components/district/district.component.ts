import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';


@Component({
  selector: 'app-district',
  standalone: true,
  imports: [RouterOutlet, RouterLink, SkeletonLoaderComponent, CommonModule],
  templateUrl: './district.component.html',
  styleUrls: ['./district.component.css']
})
export class DistrictComponent implements OnInit {
  district: any = [];
  isLoading: boolean = true;

  constructor(private titleService: Title, private apiService: ApiService) { }

  ngOnInit(): void {
    this.titleService.setTitle('District');
    this.fetchDistrictData();
  }

  fetchDistrictData(): void {
    this.apiService.get('districts_ddl').subscribe(item => {
      this.district = (item as any)?.data;
      setTimeout(() => {
        this.isLoading = false;
      }, 3000);

    });
  }
}