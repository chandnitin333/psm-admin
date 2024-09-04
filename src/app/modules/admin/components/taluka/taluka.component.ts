
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';

import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subject, Subscription, switchMap } from 'rxjs';
import { ApiService } from '../../../../services/api.service';
import { TalukaService } from '../../../../services/taluka.service';
import { TranslateService } from '../../../../services/translate.service';
import { ConfirmationDialogModule } from '../../module/confirmation-dialog/confirmation-dialog.module';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { PaginationComponent } from '../pagination/pagination.component';



@Component({
	selector: 'app-taluka',
	standalone: true,
	imports: [
		RouterLink,
		FormsModule,
		HttpClientModule,
		PaginationComponent,
		CommonModule,
		ReactiveFormsModule,
		ConfirmationDialogModule // Ensure this is included
	],
	templateUrl: './taluka.component.html',
	styleUrls: ['./taluka.component.css']
})
export class TalukaComponent {
	@ViewChild('confirmationDialog') confirmationDialog!: ConfirmationDialogComponent;
	talukaName: string = '';
	marathiText: string = '';
	taluka: any = {};

	items: any[] = [];
	currentPage: number = 1;
	itemsPerPage: number = 5;
	searchValue: string = '';
	totalItems: number = 0;
	commonText: string = ''
	debounceTimeout: any;
	districts: any = [];
	selectedDistrict = "";
	searchControl = new FormControl();
	private searchTerms = new Subject<string>();
	private subscription: Subscription = new Subscription();
	isSubmitted: boolean = false;
	isEdit: boolean = false;
	modifyTaluka: any = {};
	talukaForm = new FormGroup({
		district_id: new FormControl(''),
		name: new FormControl('')
	});
	deleteTalukaName: string = '';
	constructor(private titleService: Title, private translate: TranslateService, private apiService: ApiService, private talukaService: TalukaService, private toastr: ToastrService) { }
	ngOnInit(): void {
		this.titleService.setTitle('Taluka');
		this.getTalukas();
		this.getAllDistricts();

		this.subscription = this.searchControl.valueChanges.pipe(
			debounceTime(1000),
			distinctUntilChanged(),
			switchMap((query) => this.talukaService.getTalukas({ pageNumber: this.currentPage, searchText: this.searchValue })) // Switch to new observable
		).subscribe(item => {
			let data = item as any;
			this.items = data?.data?.talukas;
		});

	}

	ngAfterViewInit() {
		// Use jQuery to select the element and initialize Select2

	}

	translateText(event: Event) {

		const input = event.target as HTMLInputElement;

		let text = input.value;
		input.value = (text.trim() != '') ? text : ' ';

		clearTimeout(this.debounceTimeout);
		this.debounceTimeout = setTimeout(() => {
			if (text.trim() != '') {
				this.translate.translate(text).subscribe({
					next: (res: any) => {

						if (res && res.data && res.data.translations && res.data.translations.length > 0) {
							this.marathiText = res.data.translations[0].translatedText;

							setTimeout(() => {
								this.updateText(this.marathiText, input);
							}, 400);
						} else {
							console.error('Unexpected API response format:', res);
						}
					},
					error: (err) => {
						console.error('Translation API error:', err);
					},
					complete: () => {
						console.log('Translation completed');
					}
				});
			}
		}, 200); // Adjust the debounce delay as per your requirement
	}

	onKeydown(event: KeyboardEvent, controlName: string) {
		if (event.key === 'Enter') {
			event.preventDefault(); // Prevent the default Enter key behavior
			const control = this.talukaForm.get(controlName) as FormControl;
			const text = control.value;

			if (text && text.trim() !== '') {
				clearTimeout(this.debounceTimeout);
				this.debounceTimeout = setTimeout(() => {
					this.translate.translate(text).subscribe({
						next: (res: any) => {
							if (res && res.data && res.data.translations && res.data.translations.length > 0) {
								const translatedText = res.data.translations[0].translatedText;
								this.updateText1(translatedText, control);
							} else {
								console.error('Unexpected API response format:', res);
							}
						},
						error: (err) => {
							console.error('Translation API error:', err);
						},
						complete: () => {
							console.log('Translation completed');
						}
					});
				}, 200); // Adjust the debounce delay as per your requirement
			}
		}
	}

	updateText1(text: string, field: FormControl) {
		field.setValue(text); // Set the new value
		field.markAsDirty(); // Mark the field as dirty
		field.markAsTouched(); // Mark the field as touched
	}

	updateText(text: string, field: any) {
		this.commonText = '';
		field.value = '';
		field.value = text;
		this.commonText = text;
		this.marathiText = '';
	}


	getTalukas(pageNumber: number = 1) {
		this.searchValue = (this.commonText != '') ? this.commonText : this.searchValue;
		setTimeout(() => {
			this.apiService.post('/talukas', { pageNumber: pageNumber, searchText: this.searchValue }).subscribe({
				next: (res: any) => {
					this.items = res?.data?.talukas;
					this.totalItems = res?.data?.totalCount;
				},
				error: (err) => {
					console.error('API error:', err);
				},
				complete: () => {

				}
			});
		});
	}

	onPageChange(page: number): void {

		this.currentPage = page;
		this.getTalukas(this.currentPage);

	}
	get paginatedItems(): any[] {
		const start = (this.currentPage - 1) * this.itemsPerPage;
		const end = start + this.itemsPerPage;

		return this.items;
	}

	getSerialNumber(index: number): number {
		return (this.currentPage - 1) * this.itemsPerPage + index + 1;
	}

	search(): void {
		this.searchTerms.next("search"); // 
	}

	getAllDistricts() {
		// Get all districts
		this.apiService.get('/districts_ddl').subscribe({
			next: (res: any) => {
				this.districts = res.data;

			},
			error: (err: Error) => {
				console.error('Error getting districts:', err);
			}
		});
	}
	ngOnDestroy(): void {
		this.subscription.unsubscribe(); // Clean up the subscription on component destroy
	}

	addTaluka() {
		// console.log('Taluka:', this.talukaForm.value);
		if (this.talukaForm.valid && this.talukaForm.value.district_id != null || undefined || '' && this.talukaForm.value.name != null || undefined || '') {
			let params = this.talukaForm.value;
			this.apiService.post('create-taluka', params).subscribe({
				next: (res: any) => {
					this.getTalukas();
					this.reset();
					this.isSubmitted = true;
					this.toastr.success('Taluka has been successfully added.', 'Success');
				},
				error: (err: Error) => {
					console.error('Error adding taluka:', err);
					this.toastr.error('There was an error adding the taluka.', 'Error');
				}
			});
		} else {
			this.toastr.warning('Please fill all required fields.', 'warning');
			return;
		}
	}

	getTaluka(id: number) {
		let taluka = this.items.find((item) => item.id == id);
		if (!taluka) {
			this.toastr.error('Taluka not found.', 'Error');
			return;
		}
		this.isEdit = true;
		this.talukaForm.get('district_id')?.setValue(taluka.district_id);
		this.talukaForm.get('name')?.setValue(taluka.name);

		this.modifyTaluka = {
			id: id,
			district_id: this.talukaForm.value.district_id || 0,
			name: this.talukaName
		};
		console.log('Taluka:', this.modifyTaluka);
	}

	reset() {
		this.talukaForm.reset();
		this.isEdit = false;
	}
	editTaluka() {

		let data = {
			id: this.modifyTaluka.id,
			district_id: this.talukaForm?.value?.district_id,
			name: this.talukaForm?.value?.name,
		};

		this.apiService.put('update-taluka', data).subscribe({
			next: (res: any) => {
				this.getTalukas();
				this.reset();
				this.toastr.success('Taluka has been successfully updated.', 'Success');
			},
			error: (err: Error) => {
				console.error('Error updating taluka:', err);
				this.toastr.error('There was an error updating the taluka.', 'Error');
			}
		});
	}
	onConfirmed(confirmed: boolean) {
		if (confirmed) {
			// Perform the delete action
			console.log('Taluka deleted');
		} else {
			console.log('Delete action cancelled');
		}
	}
	deleteTaluka(id: number, name = '') {
		this.deleteTalukaName = name;
		if (this.confirmationDialog) {
			this.confirmationDialog.open();
			this.confirmationDialog.confirmed.subscribe((confirmed) => {
				if (confirmed) {
					if (id === 0) {
						this.toastr.error('This taluka cannot be deleted.', 'Error');
						return;
					}
					this.apiService.delete(`delete-taluka/${id}`).subscribe({
						next: () => {
							this.toastr.success('Taluka has been successfully deleted.', 'Success');
							this.getTalukas();
						},
						error: (err: Error) => {
							console.error('Error deleting taluka:', err);
							this.toastr.error('There was an error deleting the taluka.', 'Error');
						}
					});
				}
			});
		} else {
			console.error('ConfirmationDialogComponent is not initialized');
		}
	}
}
