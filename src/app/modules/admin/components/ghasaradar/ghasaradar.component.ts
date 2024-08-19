import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-ghasaradar',
  standalone: true,
  imports: [],
  templateUrl: './ghasaradar.component.html',
  styleUrl: './ghasaradar.component.css'
})
export class GhasaradarComponent {
constructor(private titleService: Title) {}
   ngOnInit(): void {
    this.titleService.setTitle('Ghasara Dar');
  }
}
