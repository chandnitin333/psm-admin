import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sarpanchimages',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sarpanchimages.component.html',
  styleUrl: './sarpanchimages.component.css'
})
export class SarpanchimagesComponent {
constructor(private titleService: Title) {}
   ngOnInit(): void {
    this.titleService.setTitle('SarpanchImages List');
  }
}
