import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [RouterLink, ReactiveFormsModule, CommonModule],
	templateUrl: './login.component.html',
	styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

	loginFrom = new FormGroup({
		email: new FormControl(''),
		password: new FormControl('')
	});

	constructor(private auth: AuthService, private router: Router) {

	}
	ngOnInit(): void {
		if (this.auth.isLoggedIn()) {
			this.router.navigate(['admin'])
		}
	}

	onSubmit(): void {
		if (this.loginFrom.valid) {
			this.auth.login(this.loginFrom.value).subscribe(
				(result) => {
					this.router.navigate(['admin']);
				}, (err: Error) => {
					alert(err.message);
				}
			)
		}
	}
}
