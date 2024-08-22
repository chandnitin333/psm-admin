import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-addnewoopsarpanch',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './addnewoopsarpanch.component.html',
  styleUrl: './addnewoopsarpanch.component.css'
})
export class AddnewoopsarpanchComponent {
constructor(private titleService: Title) {}
   ngOnInit(): void {
    this.titleService.setTitle('Add new oopsarpanch');
  }
}
