import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';
import Util from '../../modules/admin/utils/utils';
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
		username: new FormControl(''),
		password: new FormControl('')
	});

	constructor(private auth: AuthService, private router: Router, private util: Util) {

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
					// this.toast.success('Login Successful.', 'Success');

					if (result) {
						this.util.showAlertMessage("Login Success!", "Login", 'success');
						this.router.navigate(['admin']);
					} else {

					}
				}, (err: Error) => {
					this.util.showAlertMessage("Login Failed", "Login", 'error');
					// this.toast.error('Login Failed..!', 'Failed');
				}
			)
		}
	}
}
