import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-taluka',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './taluka.component.html',
  styleUrl: './taluka.component.css'
})
export class TalukaComponent {
  constructor(private titleService: Title) {}
   ngOnInit(): void {
    this.titleService.setTitle('Taluka');
  }
}
