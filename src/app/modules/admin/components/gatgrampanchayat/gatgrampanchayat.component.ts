
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ITEM_PER_PAGE } from '../../constants/admin.constant';
import { GatGramPanchayatService } from '../../services/gat-gram-panchayat.service';
import { GramPanchayatService } from '../../services/gram-panchayat.service';
import Util from '../../utils/utils';
import { PaginationComponent } from '../pagination/pagination.component';
import { SortingTableComponent } from '../sorting-table/sorting-table.component';
@Component({
	selector: 'app-gatgrampanchayat',
	standalone: true,
	imports: [CommonModule, FormsModule, ReactiveFormsModule, PaginationComponent, SortingTableComponent],
	templateUrl: './gatgrampanchayat.component.html',
	styleUrl: './gatgrampanchayat.component.css'
})
export class GatgrampanchayatComponent {
	isSubmitted: boolean = false;
	currentPage: number = 1;
	districts: any = [];
	talukas: any = [];
	isEdit: boolean = false;
	public gramPanchayatList: any = [];
	private gatgramPanchayatData: any = [];
	items: any = [];
	itemsPerPage: number = ITEM_PER_PAGE;
	totalItems: number = 0;
	searchValue: string = '';
	gatPanchayatId: number = 0;
	marathiText: string = '';
	gatGramFrom = new FormGroup({
		district_id: new FormControl<string | null>(null),
		taluka_id: new FormControl<string | null>(null),
		grampanchayat_id: new FormControl<string | null>(null),
		name: new FormControl<string | null>(null),
	});

	displayedColumns: any = [
		{ key: 'sr_no', label: 'अनुक्रमांक' },
		{ key: 'DISTRICT_NAME', label: 'जिल्हा' },
		{ key: 'TALUKA_NAME', label: 'तालुका' },
		{ key: 'PANCHAYAT_NAME', label: 'ग्राम पंचायत' },
		{ key: 'GATGRAMPANCHAYAT_NAME', label: 'गट ग्राम पंचायत' },
	];
	keyName: string = 'GATGRAMPANCHAYAT_ID';
	constructor(private titleService: Title,
		private util: Util,
		private gramPanchayt: GramPanchayatService,
		private gatGramPanchayatService: GatGramPanchayatService,
		private toastr: ToastrService

	) { }
	ngOnInit(): void {
		this.titleService.setTitle('Gat Gram Panchayat');
		this.getAllDistricts();
		this.fetchGatGramPanchayatData();
	}

	ngAfterViewInit(): void {
		$('.my-select2').select2();

		$('#mySelect').on('change', (event) => {
			const selectedValue: string = String($(event.target).val());
			this.getTalukaByDistrict(selectedValue);
			if (selectedValue) {
				this.gatGramFrom.get('district_id')?.setValue(selectedValue || '');
			}
		});

		$('#taluka').on('change', (event) => {
			const selectedValue: string = String($(event.target).val());
			if (selectedValue) {
				this.gatGramFrom.get('taluka_id')?.setValue(selectedValue || '');
				this.getGramPanchayByTaluka(Number(selectedValue));

			}
		});

		$('#gramPanchayat').on('change', (event) => {
			const selectedValue: string = String($(event.target).val());
			if (selectedValue) {
				this.gatGramFrom.get('grampanchayat_id')?.setValue(selectedValue || '');
			}
		});


	}

	ngOnDestroy(): void {
		// Destroy the Select2 instance to avoid memory leaks
		$('#mySelect').select2('destroy');
		// Remove keyup event listener from search field
		$('.select2-search__field').off('keyup');
	}
	async getAllDistricts() {
		this.districts = await this.util.getDistrictDDL();
	}
	getTalukaByDistrict(id: any) {

		this.gramPanchayt.getTalukaById({ id: id }).subscribe((res: any) => {
			this.talukas = res.data ?? [];
		});

	}

	getGramPanchayByTaluka(talikaId: any) {

		this.gatGramPanchayatService.getGatGramTalukaById({ id: talikaId }).subscribe((res: any) => {
			
			this.gramPanchayatList = res?.data ?? [];
			console.log("gramPanchayatList=========Test", this.gramPanchayatList);

		});

	}

	addGatGramPanchayat() {
		this.isSubmitted = true;
		if (this.gatGramFrom.invalid) {
			return;
		}
		const data = this.gatGramFrom.value;
		this.gatGramPanchayatService.createGatGramPanchayat(data).subscribe({
			next: (res: any) => {
				if (res.status == 201) {
					this.toastr.success(res?.message, 'Success');
					this.isSubmitted = false;
					this.fetchGatGramPanchayatData();
					this.reset();
				} else {
					this.toastr.success(res?.message, 'Error');
				}
			},
			error: (err: any) => {
				this.toastr.error('Failed to add Gat Gram Panchayat', 'Error');
				console.log("error: addGatGramPanchayat ::", err);
				this.isSubmitted = false;
			}

		});
	}

	keyDownText(event: KeyboardEvent, controlName: string): void {
		this.util.onKeydown(event, controlName, this.gatGramFrom);
	}
	reset() {
		this.gatGramFrom.reset();
		$('#taluka').val('').trigger('change');
		$('#mySelect').val('').trigger('change');
		$('#gramPanchayat').val('').trigger('change');
		this.talukas = [];
		// this.districts = [];
		this.gramPanchayatList = [];
		this.isEdit = false;
	}
	fetchGatGramPanchayatData() {
		this.gatGramPanchayatService.getGatGramPanchayatList({ page_number: this.currentPage, search_text: this.searchValue }).subscribe({
			next: (res: any) => {
				this.items = res?.data ?? [];
				this.gatgramPanchayatData = res?.data ?? [];
				this.totalItems = res?.totalRecords;
			},
			error: (err: any) => {
				console.error('Error fetching Gat Gram Panchayat data:', err);
			}
		});
	}

	get paginatedItems() {
		return this.gatgramPanchayatData;
	}

	srNo(index: number): number {
		return (this.currentPage - 1) * ITEM_PER_PAGE + index + 1;
	}

	onPageChange(page: number): void {
		this.currentPage = page;
		this.fetchGatGramPanchayatData();
	}


	filterData() {

		this.currentPage = 1;
		this.debounceFetchDistrictData();

	}

	private debounceFetchDistrictData = this.debounce(() => {
		this.fetchGatGramPanchayatData();
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

	resetFilter(event: Event) {
		this.searchValue = '';
		this.fetchGatGramPanchayatData();
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

	editInfo(id: number) {
		if (!id) {
			this.toastr.error("Gat Panchayat Id is required", "Error")
		}

		this.gatGramFrom.reset();
		this.gatGramPanchayatService.getGatGramPanchayatById(id).subscribe((res: any) => {
			this.gatPanchayatId = id;

			this.isEdit = true;

			console.log("Edit  res======", res.data);
			this.gatGramFrom.get('district_id')?.setValue('');
			this.gatGramFrom.get('taluka_id')?.setValue('')
			this.gatGramFrom.get('grampanchayat_id')?.setValue('');
			this.gatGramFrom.get('name')?.setValue('');
			if (res.status == 200) {
				// this.gatGramFrom.get('grampanchayat_id')?.setValue('');
				this.gatGramFrom.get('district_id')?.setValue(res.data.DISTRICT_ID);
				this.gatGramFrom.get('taluka_id')?.setValue(res.data.TALUKA_ID)
				this.gatGramFrom.get('grampanchayat_id')?.setValue("" + res.data.PANCHAYAT_ID);
				this.gatGramFrom.get('name')?.setValue(res.data.GATGRAMPANCHAYAT_NAME);
				$("#mySelect").val(res.data.DISTRICT_ID).trigger('change');
				$("#taluka").val(res.data.TALUKA_ID).trigger('change');
				setTimeout(() => {
					$("#mySelect").val(res.data.DISTRICT_ID).trigger('change');
					$("#taluka").val(res.data.TALUKA_ID).trigger('change');
				}, 200)





			} else {
				this.toastr.error(res.message, "Error");
			}

		});

	}

	updateGatGramPanchayat() {
		this.isSubmitted = true;

		if (this.gatGramFrom.invalid) {
			return;
		}
		const data: any = this.gatGramFrom.value;
		data.gatgrampanchayat_id = this.gatPanchayatId;
		this.gatGramPanchayatService.updateGatGramPanchayat(data).subscribe({
			next: (res: any) => {
				console.log("updateGatGramPanchayat res===", res);
				if (res.status == 200) {
					this.toastr.success(res?.message, 'यश');
					this.isSubmitted = false;
					this.fetchGatGramPanchayatData();
					this.reset();
				} else {
					this.toastr.error(res?.message, 'त्रुटी');
				}
			},
			error: (err: any) => {
				this.toastr.error('Failed to update Gat Gram Panchayat', 'Error');
				console.log("error: updateGatGramPanchayat ::", err);
				this.isSubmitted = false;
			}

		});
	}
	deleteGatGramPanchayat(id: number) {
		this.util.showConfirmAlert().then((res) => {
			if (!id) {
				this.toastr.error("Gat Panchayat Id is required", "Error");
				return
			}
			if (res) {
				this.gatGramPanchayatService.deleteGatGramPanchayat(id).subscribe({
					next: (res: any) => {
						if (res.status == 200) {
							this.toastr.success(res.message, "Success");
							this.fetchGatGramPanchayatData();
						} else {
							this.toastr.error(res.message, "Error");
						}
					},
					error: (err: Error) => {
						console.error('Error deleting Gat Gram Panchayat:', err);
						this.toastr.error('There was an error deleting the Gat Gram Panchayat.', 'Error');
					}
				});
			}
		});
	}
}
