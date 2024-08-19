import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-gatgrampanchayat',
  standalone: true,
  imports: [],
  templateUrl: './gatgrampanchayat.component.html',
  styleUrl: './gatgrampanchayat.component.css'
})
export class GatgrampanchayatComponent {
constructor(private titleService: Title) {}
   ngOnInit(): void {
    this.titleService.setTitle('Gat Gram Panchayat');
  }
}
