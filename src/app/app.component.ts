import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { InactivityService } from './services/Inactivity.service';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
	constructor(private inactivityService: InactivityService, private router: Router) {}
	title = 'psm';
	ngOnInit(): void {
		this.inactivityService.startMonitoring();
		const userSession = sessionStorage.getItem('userDetals');
		// console.log("user", userSession)
		if (!userSession) {
			this.router.navigate(['/login']); // Redirect to login if session does not exist
		}
	}
}
