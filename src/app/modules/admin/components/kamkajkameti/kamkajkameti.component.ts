import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-kamkajkameti',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './kamkajkameti.component.html',
  styleUrl: './kamkajkameti.component.css'
})
export class KamkajkametiComponent {
constructor(private titleService: Title) {}
   ngOnInit(): void {
    this.titleService.setTitle('Kamkaj Kameti List');
  }
}
