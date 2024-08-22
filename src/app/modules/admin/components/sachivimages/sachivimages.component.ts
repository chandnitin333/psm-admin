import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sachivimages',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sachivimages.component.html',
  styleUrl: './sachivimages.component.css'
})
export class SachivimagesComponent {
constructor(private titleService: Title) {}
   ngOnInit(): void {
    this.titleService.setTitle('Sachiv Images List');
  }
}
