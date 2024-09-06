import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grampanchayat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grampanchayat.component.html',
  styleUrl: './grampanchayat.component.css'
})
export class GrampanchayatComponent implements OnInit, AfterViewInit{
 options = [
    { value: '1', text: 'Option 1' },
    { value: '2', text: 'Option 2' },
    { value: '3', text: 'Option 3' }
  ];

  select2Config = {
    placeholder: 'Select an option',
    allowClear: true
  };
constructor(private titleService: Title) {
  this.titleService.setTitle('Gram Panchayat');
}
   ngOnInit(): void {
  
  }
  ngAfterViewInit(): void {
    $('#my-select2').select2();
  }
}
