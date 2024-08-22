import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-malmattecheprakar',
  standalone: true,
  imports: [],
  templateUrl: './malmattecheprakar.component.html',
  styleUrl: './malmattecheprakar.component.css'
})
export class MalmattecheprakarComponent {
constructor(private titleService: Title) {}
   ngOnInit(): void {
    this.titleService.setTitle('Malmatteche Prakar');
  }
}
