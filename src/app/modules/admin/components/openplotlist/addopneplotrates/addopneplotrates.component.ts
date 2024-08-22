import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-addopneplotrates',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './addopneplotrates.component.html',
  styleUrl: './addopneplotrates.component.css'
})
export class AddopneplotratesComponent {
constructor(private titleService: Title) {}
   ngOnInit(): void {
    this.titleService.setTitle('Add new open plot rates');
  }
}
