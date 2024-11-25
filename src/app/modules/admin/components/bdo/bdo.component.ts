import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ITEM_PER_PAGE } from '../../constants/admin.constant';
import { BdoService } from '../../services/bdo.service';
import { GramPanchayatService } from '../../services/gram-panchayat.service';
import Util from '../../utils/utils';
import { PaginationComponent } from '../pagination/pagination.component';
import { SortingTableComponent } from '../sorting-table/sorting-table.component';
@Component({
    selector: 'app-bdo',
    standalone: true,
    imports: [PaginationComponent, SortingTableComponent, CommonModule, ReactiveFormsModule, FormsModule],
    templateUrl: './bdo.component.html',
    styleUrl: './bdo.component.css'
})
export class BdoComponent implements AfterViewInit {
    public email = "kundan@gmail.com";
    currentPage: number = 1;
    searchValue: string = '';
    items: any = [];
    totalItems: number = 0;
    itemsPerPage: number = ITEM_PER_PAGE
    displayedColumns: any = [
        { key: 'sr_no', label: 'अनुक्रमांक' },
        { key: 'DISTRICT_NAME', label: 'जिल्हा' },
        { key: 'TALUKA_NAME', label: 'तालुका' },
        { key: 'NAME_NAME', label: 'नाव' },
        { key: 'USER_NAME', label: 'वापरकर्ता' }
    ];

    keyName: string = 'BDOUser_ID';
    marathiText: string = '';
    frmBDO = new FormGroup({
        district_id: new FormControl<number | string>('', Validators.required),
        taluka_id: new FormControl<number | string>('', Validators.required),
        username: new FormControl<string>('', Validators.required),
        password: new FormControl<string>('', Validators.required),
        email: new FormControl<string>('', [Validators.required, Validators.email]),
        name: new FormControl<string>('', Validators.required),
        id: new FormControl<string>(''),

    });
    districts: any = [];
    talukas: any = [];
    isSubmitted: boolean = false;
    isEdited: boolean = false;
    userInfo: any = [];
    selectedDistrict: number = 0;
    isEdit: boolean = false;
    constructor(private titleService: Title, private bdo: BdoService, private util: Util, private gramPanchayt: GramPanchayatService, private toastr: ToastrService) { }

    ngOnInit(): void {
        this.titleService.setTitle('BDO List');
        this.fetchData();
        this.getAllDistricts();
    }

    ngAfterViewInit() {
        $('.my-select2').select2();

        $('#district').on('change', (event) => {
            const selectedValue: string = String($(event.target).val());
            this.getTalukaByDistrict(selectedValue);
            if (selectedValue) {
                this.frmBDO.get('district_id')?.setValue(Number(selectedValue));
                this.frmBDO.get('taluka_id')?.setValue("");
            }
        });

        $('#taluka').on('change', (event) => {
            const selectedValue: string = String($(event.target).val());
            if (selectedValue) {
                this.frmBDO.get('taluka_id')?.setValue(Number(selectedValue));

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

    fetchData() {
        this.bdo.fetchBdoUserList({ page_number: this.currentPage, search_text: this.searchValue }).subscribe({
            next: (res: any) => {
                this.items = res?.data ?? [];
                this.totalItems = res?.totalRecords;
            },
            error: (err: any) => {
                console.error('Error::  fetch Bdo User List :', err);
            }
        });

    }

    submit() {
        this.isSubmitted = true;
        const data = this.frmBDO.value;
        console.log(this.frmBDO.value)
        if (this.frmBDO.invalid) {

            return;
        }

        this.bdo.addBDOUser(data).subscribe({
            next: (res: any) => {
                if (res.status == 201) {

                    this.toastr.success(res?.message, 'Success');
                    this.isSubmitted = false;
                    this.reset();
                    this.fetchData();

                } else {
                    this.toastr.success(res?.message, 'Error');
                }
            },
            error: (err: any) => {
                this.toastr.error('Failed to add  BDOUser', 'Error');
                console.log("error: Add  BDO ::", err);
                this.isSubmitted = false;
            }

        });
    }

    reset() {
        this.frmBDO.reset();
        $('#district').trigger('change');
        $('#taluka').trigger('change');
    }
    editInfo(id: number) {
        let user_type = this.frmBDO.get('user_type')?.value
        this.bdo.getUserId(id).subscribe((res: any) => {
            this.userInfo = res?.data ?? [];
            this.frmBDO.get('id')?.setValue(this.userInfo[this.keyName] || '');
            this.frmBDO.get('name')?.setValue(this.userInfo?.NAME_NAME || '');
            this.frmBDO.get('username')?.setValue(this.userInfo?.USER_NAME || '');
            this.frmBDO.get('password')?.setValue(this.userInfo.PASSWORD_NAME || '');
            this.frmBDO.get('email')?.setValue(this.userInfo.EMAIL_NAME || '');
            this.selectedDistrict = this.userInfo.DISTRICT_ID;
            this.frmBDO.get('district_id')?.setValue(this.userInfo.DISTRICT_ID || '');
            $('#district').trigger('change')

            setTimeout(() => {
                this.frmBDO.get('taluka_id')?.setValue(this.userInfo.TALUKA_ID || '');
                $('#taluka').trigger('change')

            }, 400);
            this.isEdit = true;
        })
    }

    update() {
        this.isSubmitted = true;
        const data = this.frmBDO.value;
        if (this.frmBDO.invalid) {
            return;
        }

        this.bdo.updateUser(data).subscribe({
            next: (res: any) => {
                if (res.status == 200) {

                    this.toastr.success(res?.message, 'Success');
                    this.isSubmitted = false;
                    this.reset();
                    this.fetchData();

                } else {
                    this.toastr.success(res?.message, 'Error');
                }
            },
            error: (err: any) => {
                this.toastr.error('Failed to Update  BDOUser', 'Error');
                console.log("error: Update  BDO ::", err);
                this.isSubmitted = false;
            }

        });
    }
    deleteInfo(id: number) {
        try {
            this.util.showConfirmAlert().then((res) => {
                if (!id) {
                    this.toastr.error("Use Id is required", "Error");
                    return
                }
                if (res) {
                    this.bdo.deleteUser(id).subscribe((res: any) => {
                        if (res.status == 200) {
                            this.toastr.success(res?.message, 'Success');
                            this.isSubmitted = false;
                            this.fetchData();
                        } else {
                            this.toastr.success(res?.message, 'Error');
                        }
                    })
                }
            });
        } catch (error) {

        }
    }

    onPageChange(page: number) {
        this.currentPage = page;
        this.fetchData();
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

    filterData() {

        this.currentPage = 1;
        this.debounceFetchDistrictData();

    }

    private debounceFetchDistrictData = this.debounce(() => {
        this.fetchData();
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
        this.fetchData();
    }

}
