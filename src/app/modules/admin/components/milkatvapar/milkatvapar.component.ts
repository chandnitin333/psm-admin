import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-milkatvapar',
  standalone: true,
  imports: [],
  templateUrl: './milkatvapar.component.html',
  styleUrl: './milkatvapar.component.css'
})
export class MilkatvaparComponent {
constructor(private titleService: Title) {}
   ngOnInit(): void {
    this.titleService.setTitle('Milkat Vapar');
  }
}
