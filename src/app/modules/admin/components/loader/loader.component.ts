import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loader-overlay" *ngIf="loading">
      <div class="loader"></div>
    </div>
  `,
  styleUrl: './loader.component.css'
})
export class LoaderComponent {

  @Input() loading: boolean = false;


}
