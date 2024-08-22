import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-addnewsachiv',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './addnewsachiv.component.html',
  styleUrl: './addnewsachiv.component.css'
})
export class AddnewsachivComponent {
constructor(private titleService: Title) {}
   ngOnInit(): void {
    this.titleService.setTitle('Add new sachiv');
  }
}
