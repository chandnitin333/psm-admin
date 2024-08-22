import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-bharankdar',
  standalone: true,
  imports: [],
  templateUrl: './bharankdar.component.html',
  styleUrl: './bharankdar.component.css'
})
export class BharankdarComponent {
constructor(private titleService: Title) {}
   ngOnInit(): void {
    this.titleService.setTitle('Bharank Dar');
  }
}
