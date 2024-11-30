import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-oopsarpanchimages',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './oopsarpanchimages.component.html',
  styleUrl: './oopsarpanchimages.component.css'
})
export class OopsarpanchimagesComponent {
constructor(private titleService: Title) {}
   ngOnInit(): void {
    this.titleService.setTitle('OOpSarpanchImages');
  }
}
