import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.css'],
  imports: [CommonModule]
})
export class SkeletonLoaderComponent {
  @Input() rows: number = 3; // Default number of rows
  @Input() columns: number = 3; // Default number of columns
  

}