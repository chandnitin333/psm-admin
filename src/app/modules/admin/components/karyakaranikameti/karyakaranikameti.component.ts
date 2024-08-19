import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-karyakaranikameti',
  standalone: true,
  imports: [],
  templateUrl: './karyakaranikameti.component.html',
  styleUrl: './karyakaranikameti.component.css'
})
export class KaryakaranikametiComponent {
constructor(private titleService: Title) {}
   ngOnInit(): void {
    this.titleService.setTitle('Karya Karani Kameti');
  }
}
