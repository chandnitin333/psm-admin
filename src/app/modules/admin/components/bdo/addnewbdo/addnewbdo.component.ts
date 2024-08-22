import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-addnewbdo',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './addnewbdo.component.html',
  styleUrl: './addnewbdo.component.css'
})
export class AddnewbdoComponent {
constructor(private titleService: Title) {}
   ngOnInit(): void {
    this.titleService.setTitle('Add New BDO');
  }
}
