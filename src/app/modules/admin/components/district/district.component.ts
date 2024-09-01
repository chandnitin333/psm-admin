import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-district',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './district.component.html',
  styleUrl: './district.component.css'
})
export class DistrictComponent {
  district: any = [];
  constructor(private titleService: Title, private apiService: ApiService) { }
  ngOnInit(): void {
    this.titleService.setTitle('District');
    
  }


 
}
