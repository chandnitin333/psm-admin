import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="box" *ngIf="loading">
      <div class="loader-16"></div>
    </div>
  `,
  styleUrl: './loader.component.css'
})
export class LoaderComponent {

  @Input() loading: boolean = false;


}
