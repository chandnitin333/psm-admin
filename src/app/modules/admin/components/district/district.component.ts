import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-district',
  standalone: true,
  imports: [RouterOutlet,RouterLink],
  templateUrl: './district.component.html',
  styleUrl: './district.component.css'
})
export class DistrictComponent {
constructor(private titleService: Title) {}
   ngOnInit(): void {
    this.titleService.setTitle('District');
  }
}
