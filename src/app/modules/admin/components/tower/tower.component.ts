import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-tower',
  standalone: true,
  imports: [],
  templateUrl: './tower.component.html',
  styleUrl: './tower.component.css'
})
export class TowerComponent {
constructor(private titleService: Title) {}
   ngOnInit(): void {
    this.titleService.setTitle('Tower');
  }
}
