
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ITEM_PER_PAGE } from '../../constants/admin.constant';
import { GramPanchayatService } from '../../services/gram-panchayat.service';
import Util from '../../utils/utils';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../pagination/pagination.component';
import { AfterViewInit, Component, OnInit } from '@angular/core';
@Component({
	selector: 'app-gatgrampanchayat',
	standalone: true,
	imports: [CommonModule,FormsModule, ReactiveFormsModule, PaginationComponent],
	templateUrl: './gatgrampanchayat.component.html',
	styleUrl: './gatgrampanchayat.component.css'
})
export class GatgrampanchayatComponent {
	isSubmitted: boolean = false;
	private currentPage: number = 1;
	districts: any = [];
	talukas: any = [];
	isEdit: boolean = false;
	private gatgramPanchaytData: any = [];
	itemsPerPage: number = ITEM_PER_PAGE;
	totalItems: number = 0;
	searchValue: string = '';
	panchayatId: number = 0;
	marathiText: string = '';
	gatGramFrom = new FormGroup({
		districtName: new FormControl<string | null>(null),
		talukaName: new FormControl<string | null>(null),
		gramPanchayatName: new FormControl<string | null>(null),
		gatGramPanchayatName: new FormControl<string | null>(null),
	});
	constructor(private titleService: Title,
		private util: Util,
		private gramPanchayt: GramPanchayatService
	) { }
	ngOnInit(): void {
		this.titleService.setTitle('Gat Gram Panchayat');
		this.getAllDistricts()
	}

	ngAfterViewInit(): void {
		$('.my-select2').select2();

		$('#mySelect').on('change', (event) => {
			const selectedValue: string = String($(event.target).val());
			this.getTalukaByDistrict(selectedValue);
			if (selectedValue) {
				this.gatGramFrom.get('districtName')?.setValue(selectedValue || '');
			}
		});

		$('#taluka').on('change', (event) => {
			const selectedValue: string = String($(event.target).val());
			if (selectedValue) {
				this.gatGramFrom.get('talukaName')?.setValue(selectedValue || '');
			}
		});

	}

	async getAllDistricts() {
		this.districts = await this.util.getDistrictDDL();
		console.log(this.districts);
	}
	getTalukaByDistrict(id: any) {

		this.gramPanchayt.getTalukaById({ id: id }).subscribe((res: any) => {
			this.talukas = res.data ?? [];
		});

	}
}
