import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-malmatta',
  standalone: true,
  imports: [],
  templateUrl: './malmatta.component.html',
  styleUrl: './malmatta.component.css'
})
export class MalmattaComponent {
constructor(private titleService: Title) {}
   ngOnInit(): void {
    this.titleService.setTitle('Malmatta');
  }
}
