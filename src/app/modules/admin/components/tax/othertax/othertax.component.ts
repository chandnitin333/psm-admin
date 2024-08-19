import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-othertax',
  standalone: true,
  imports: [],
  templateUrl: './othertax.component.html',
  styleUrl: './othertax.component.css'
})
export class OthertaxComponent {
constructor(private titleService: Title) {}
   ngOnInit(): void {
    this.titleService.setTitle('Other Tax');
  }
}
