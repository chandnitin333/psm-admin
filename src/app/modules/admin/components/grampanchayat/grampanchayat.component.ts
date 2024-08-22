import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-grampanchayat',
  standalone: true,
  imports: [],
  templateUrl: './grampanchayat.component.html',
  styleUrl: './grampanchayat.component.css'
})
export class GrampanchayatComponent {
constructor(private titleService: Title) {}
   ngOnInit(): void {
    this.titleService.setTitle('Gram Panchayat');
  }
}
