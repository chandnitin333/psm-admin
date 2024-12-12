
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';

import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subject, Subscription, switchMap } from 'rxjs';
import { TranslateService } from '../../../../services/translate.service';
import { ITEM_PER_PAGE } from '../../constants/admin.constant';
import { ConfirmationDialogModule } from '../../module/confirmation-dialog/confirmation-dialog.module';
import { TalukaService } from '../../services/taluka.service';
import Util from '../../utils/utils';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';

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
		SkeletonLoaderComponent,
		SweetAlert2Module,
		ConfirmationDialogModule // Ensure this is included
	],
	templateUrl: './taluka.component.html',
	styleUrls: ['./taluka.component.css']
})
export class TalukaComponent implements OnInit {
	@ViewChild('confirmationDialog') confirmationDialog!: ConfirmationDialogComponent;
	talukaName: string = '';
	marathiText: string = '';
	taluka: any = {};
	errorMessage: string | null = null;
    errorButton: boolean = false;

	items: any[] = [];
	currentPage: number = 1;
	itemsPerPage: number = ITEM_PER_PAGE;
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
		district_id: new FormControl<string | null>(null),
		name: new FormControl(undefined)
	});
	deleteTalukaName: string = '';
	isLoading: boolean = false;
	private destroy$ = new Subject<void>();
	constructor(
		private titleService: Title,
		private translate: TranslateService,
		private talukaService: TalukaService,
		private util: Util,
		private toastr: ToastrService) {
		this.titleService.setTitle('Taluka');
	}
	ngOnInit(): void {

		this.getTalukas();

		this.getAllDistricts();
		this.subscription = this.searchControl.valueChanges.pipe(
			debounceTime(1000),
			distinctUntilChanged(),
			switchMap((query) => this.talukaService.getTalukas('taluka-list', { page_number: this.currentPage, search_text: this.searchValue })) // Switch to new observable
		).subscribe(item => {
			let data = item as any;
			this.items = data?.data?.talukas;
			this.isLoading = true
		});
	}

	ngAfterViewInit(): void {
		$('.my-select2').select2();

		$('#mySelect').on('change', (event) => {
			let selectedValue: string = $(event.target).val() as string;
			this.talukaForm.get('district_id')?.setValue(selectedValue || '');
		});
	}

	translateText(event: Event) {
		this.util.getTranslateText(event, this.marathiText).subscribe({
			next: (translatedText: string) => {
				this.marathiText = translatedText;
			},
			error: (error: any) => {
				console.error('Error translating text:', error);
			},
		});

	}

	onKeydown(event: KeyboardEvent, controlName: string) {
		this.util.onKeydown(event, controlName, this.talukaForm);
	}


	resetFilter($event: Event) {

		this.searchValue = '';
		this.currentPage = 1;
		this.getTalukas();
	}

	getTalukas(pageNumber: number = 1) {

		this.currentPage = pageNumber;
		this.debounceFetchDistrictData();
	}

	fetchDistrictData() {

		this.talukaService.getTalukas('taluka-list', { page_number: this.currentPage, search_text: this.searchValue }).subscribe({
			next: (res: any) => {
				// console.log('Talukas:', res);
				this.items = res?.data;
				this.totalItems = res?.totalRecords;
				this.isLoading = false;
			},
			error: (err) => {
				console.error('API error:', err);
			},
			complete: () => {

			}
		});
	}
	private debounceFetchDistrictData = this.debounce(() => {
		this.fetchDistrictData();
	}, 1000);

	private debounce(func: Function, wait: number) {
		let timeout: any;
		return (...args: any[]) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				func.apply(this, args);
			}, wait);
		};
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

	srNo(index: number): number {
		return (this.currentPage - 1) * this.itemsPerPage + index + 1;
	}

	async getAllDistricts() {
		this.districts = await this.util.getDistrictDDL('district-list-ddl')
	}
	ngOnDestroy(): void {
		this.subscription.unsubscribe(); // Clean up the subscription on component destroy
		// $('#mySelect').select2('destroy');
	}

	addTaluka() {

		if (this.talukaForm.valid && this.talukaForm.value.district_id && this.talukaForm.value.name) {
			let params = {
				district_id: this.talukaForm.value.district_id,
				taluka_name: this.talukaForm.value.name

			};

			this.isLoading = true;
			this.talukaService.createTaluka('taluka', params).subscribe({
				next: (res: any) => {
					this.getTalukas();
					this.reset();
					this.isSubmitted = true;
					this.toastr.success('Taluka has been successfully added.', 'Success');
					this.isLoading = false;
				},
				error: (err: Error) => {
					console.error('Error adding taluka:', err);
					this.toastr.error('There was an error adding the taluka.', 'Error');
				}
			});
		} else {
			this.toastr.warning('कृपया सर्व आवश्यक फील्ड भरा.', 'warning');
			return;
		}
	}

	getTaluka(id: number) {
		this.isLoading = true;
		let taluka = this.items.find((item) => item.TALUKA_ID == id);
		if (!taluka) {
			this.toastr.error('Taluka not found.', 'Error');
			return;
		}
		this.isEdit = true;
		this.talukaForm.get('district_id')?.patchValue(taluka.DISTRICT_ID);

		this.talukaForm.get('name')?.setValue(taluka.TALUKA_NAME);
		$('#mySelect').val(taluka.DISTRICT_ID).trigger('change');
		this.modifyTaluka = {
			id: id,
			district_id: this.talukaForm.value.district_id || 0,
			name: this.talukaName
		};
		this.isLoading = false;
	}

	reset() {
		this.talukaForm.reset();
		$('#mySelect').val('').trigger('change');
		this.isEdit = false;
		this.errorMessage = "";
        this.errorButton = false;
	}
	editTaluka() {

		let data = {
			taluka_id: this.modifyTaluka.id,
			district_id: this.talukaForm?.value?.district_id,
			taluka_name: this.talukaForm?.value?.name,
		};
		this.isLoading = true;
		this.talukaService.UpdateTaluka('update-taluka', data).subscribe({
			next: (res: any) => {
				this.getTalukas();
				this.reset();
				this.toastr.success('तालुका यशस्वीरित्या अद्ययावत करण्यात आला आहे.', 'Success');
			},
			error: (err: Error) => {
				console.error('Error updating taluka:', err);
				this.toastr.error('There was an error updating the taluka.', 'Error');
			}
		});
	}

	onConfirmed(confirmed: boolean) {
		if (confirmed) {
			this.fetchDistrictData();
		} else {
			console.log('Delete action cancelled');
		}
	}
	deleteTaluka(id: number, name = '') {
		this.util.showConfirmAlert().then((res) => {
		this.isLoading = true;
			if (res) {
				if (id === 0) {
					this.toastr.error('This taluka cannot be deleted.', 'Error');
					return;
				}
				this.talukaService.deleteTaluka(`taluka/${id}`).subscribe({
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
		}
		);
	}

	async onValidate(event:any)
    {
        let status = this.util.validateStringWithSpaces(event.target.value);
        if(await status){
            this.errorMessage = "Please enter string only";
            this.errorButton = false;
        } else {
            this.errorButton = true;
            this.errorMessage = "";
        }
    }
}
