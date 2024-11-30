import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { GatGramPanchayatService } from '../../services/gat-gram-panchayat.service';
import { GramPanchayatService } from '../../services/gram-panchayat.service';
import Util from '../../utils/utils';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  districts: any = [];
  talukas: any = [];
  gramPanchayatList: any = [];
  adminFrm = new FormGroup({
		district_id: new FormControl<string | null>(null),
		taluka_id: new FormControl<string | null>(null),
		grampanchayat_id: new FormControl<string | null>(null),
		name: new FormControl<string | null>(null),
	});
  constructor(private titleService: Title
    , private util: Util,
    private gramPanchayt: GramPanchayatService,
    private gatGramPanchayatService: GatGramPanchayatService,
    private toastr: ToastrService
  ) { }
  ngOnInit(): void {
    this.titleService.setTitle('Admin');
  }

  ngAfterViewInit(): void {
    $('.my-select2').select2();

    $('#mySelect').on('change', (event) => {
      const selectedValue: string = String($(event.target).val());
      this.getTalukaByDistrict(selectedValue);
      if (selectedValue) {
        this.adminFrm.get('district_id')?.setValue(selectedValue || '');
      }
    });

    $('#taluka').on('change', (event) => {
      const selectedValue: string = String($(event.target).val());
      if (selectedValue) {
        this.adminFrm.get('taluka_id')?.setValue(selectedValue || '');
        this.getGramPanchayByTaluka(Number(selectedValue));

      }
    });

    $('#gramPanchayat').on('change', (event) => {
      const selectedValue: string = String($(event.target).val());
      if (selectedValue) {
        this.adminFrm.get('grampanchayat_id')?.setValue(selectedValue || '');
      }
    });


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

    });

  }
}
