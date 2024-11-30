import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-addnewsarpanch',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './addnewsarpanch.component.html',
  styleUrl: './addnewsarpanch.component.css'
})
export class AddnewsarpanchComponent {
constructor(private titleService: Title) {}
   ngOnInit(): void {
    this.titleService.setTitle('Add new sarpanch');
  }
}
