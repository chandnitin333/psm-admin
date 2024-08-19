import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-addnewkamkajkameti',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './addnewkamkajkameti.component.html',
  styleUrl: './addnewkamkajkameti.component.css'
})
export class AddnewkamkajkametiComponent {
constructor(private titleService: Title) {}
   ngOnInit(): void {
    this.titleService.setTitle('Add new kamkaj kameti');
  }
}
