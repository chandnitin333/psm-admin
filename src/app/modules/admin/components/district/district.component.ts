import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-district',
  standalone: true,
  imports: [RouterOutlet,RouterLink],
  templateUrl: './district.component.html',
  styleUrl: './district.component.css'
})
export class DistrictComponent {

}
