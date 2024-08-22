import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-openplotlist',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './openplotlist.component.html',
  styleUrl: './openplotlist.component.css'
})
export class OpenplotlistComponent {
constructor(private titleService: Title) {}
   ngOnInit(): void {
    this.titleService.setTitle('Open Plot List');
  }
}
