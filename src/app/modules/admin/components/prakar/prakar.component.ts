import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-prakar',
  standalone: true,
  imports: [],
  templateUrl: './prakar.component.html',
  styleUrl: './prakar.component.css'
})
export class PrakarComponent {
constructor(private titleService: Title) {}
   ngOnInit(): void {
    this.titleService.setTitle('Prakar');
  }
}
