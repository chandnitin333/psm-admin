import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InactivityService } from './services/Inactivity.service';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
	constructor(private inactivityService: InactivityService) {}
	title = 'psm';
	ngOnInit(): void {
		this.inactivityService.startMonitoring();
	}
}
