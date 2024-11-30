import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ITEM_PER_PAGE } from '../../constants/admin.constant';
import { GatGramPanchayatService } from '../../services/gat-gram-panchayat.service';
import { GramPanchayatService } from '../../services/gram-panchayat.service';
import { UsersService } from '../../services/users.service';
import Util from '../../utils/utils';
import { PaginationComponent } from '../pagination/pagination.component';
import { SortingTableComponent } from '../sorting-table/sorting-table.component';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [RouterLink, CommonModule, ReactiveFormsModule, PaginationComponent, SortingTableComponent],
    templateUrl: './users.component.html',
    styleUrl: './users.component.css'
})
export class UsersComponent {
    districts: any = [];
    talukas: any = [];
    gramPanchayatList: any = [];
    gatGramPanchayat: any = [];
    usrFrm = new FormGroup({
        district_id: new FormControl<number | null>(null, Validators.required),
        taluka_id: new FormControl<number | null>(null, Validators.required),
        panchayat_id: new FormControl<number | null>(null, Validators.required),
        gatgrampanchayat_id: new FormControl<number | null>(null, Validators.required),
        name: new FormControl<string>('', Validators.required),
        username: new FormControl<string>('', Validators.required),
        pwd: new FormControl<string>('', Validators.required),
        user_type: new FormControl<string>('', Validators.required),
        // surname: new FormControl<string>(''),
        id: new FormControl<string>(''),

    });

    isSubmitted: boolean = false;
    isEdit: boolean = false;
    userDistrict: any = [];

    currentPage: number = 1;
    searchValue: string = '';
    items: any = [];
    totalItems: number = 0;
    itemsPerPage: number = ITEM_PER_PAGE
    displayedColumns: any = [
        { key: 'sr_no', label: 'अनुक्रमांक' },
        { key: 'DISTRICT_NAME', label: 'जिल्हा' },
        { key: 'TALUKA_NAME', label: 'तालुका' },
        { key: 'PANCHAYAT_NAME', label: 'ग्राम पंचायत' },
        { key: 'GATGRAMPANCHAYAT_NAME', label: 'गट ग्राम पंचायत' },
        { key: 'NAME', label: 'नाव' },
        { key: 'USERNAME', label: 'युजरनेम' },

    ];

    keysList: any = ['USER_ID', 'FERFARUSER_ID', 'FERFARUSERPDF_ID', 'VASULIUSER_ID']
    keyName: string = 'USER_ID';
    marathiText: string = '';
    userList: any = [];
    selectTab: number = 0;
    collapsedDistricts: { [district: string]: boolean } = {};
    groupedData: any = [];
    selectedDistrict: any;
    userInfo: any = [];
    new_user: boolean = true;
    ferfar_user: boolean = false;
    ferfar_pdf_user: boolean = false;
    vasuli_user: boolean = false;
    selectedTabInd: number = 1;
    userTypeList = ['', 'new_user', 'ferfar_user', 'ferfar_pdf_user', 'vasuli_user'];
    selectUserType: string = 'new_user'
    tabTitleList: any = ['नविन यूजर जोडा', 'फेरफार यूजर जोडा', 'फेरफार PDF यूजर जोडा', 'वसुली यूजर जोडा']
    tabTitle: string = 'नविन यूजर जोडा'
    constructor(private titleService: Title,
        private util: Util,
        private gramPanchayt: GramPanchayatService,
        private gatGramPanchayatService: GatGramPanchayatService,
        private user: UsersService,
        private toastr: ToastrService

    ) { }
    ngOnInit(): void {
        this.titleService.setTitle('Users');
        this.getAllDistricts();
        this.getUserDistrict();

        this.selectUserType = this.userTypeList[this.selectedTabInd].toString();
        this.usrFrm.get('user_type')?.setValue(this.selectUserType)

    }

    getUserList(districtId: any) {
        console.log("districtId==", districtId)
        this.setValueToggle(districtId);
        try {
            this.user.getAllUserList({
                "page_number": this.currentPage,
                "search_text": this.searchValue,
                "user_type": this.selectUserType,
                "district_id": districtId
            }).subscribe((res: any) => {
                this.userList = res?.data ?? [];
                this.items = res.data ?? [];
                this.totalItems = res.totalRecords ?? 0;
                console.log("userList==", this.userList)
            })
        } catch (error) {
            console.log("getUserList:: error :: ", error)
        }

    }

    getUserDistrict() {
        this.user.getUserDistrict({ "user_type": this.selectUserType }).subscribe((res: any) => {
            this.userDistrict = res?.data ?? [];

        })
    }
    ngAfterViewInit(): void {
        $('.my-select2').select2();

        $('#district').on('change', (event) => {
            const selectedValue: string = String($(event.target).val());
            this.getTalukaByDistrict(selectedValue);
            if (selectedValue) {
                this.usrFrm.get('district_id')?.setValue(Number(selectedValue));
            }
        });

        $('#taluka').on('change', (event) => {
            const selectedValue: string = String($(event.target).val());
            if (selectedValue) {
                this.usrFrm.get('taluka_id')?.setValue(Number(selectedValue));
                this.getGramPanchayByTaluka(Number(selectedValue));

            }
        });

        $('#gramPanchayat').on('change', (event) => {
            const selectedValue: string = String($(event.target).val());
            if (selectedValue) {
                this.getGatGramPanchayat(Number(selectedValue))
                this.usrFrm.get('panchayat_id')?.setValue(Number(selectedValue));
            }
        });

        $('#gatGramPanchayt').on('change', (event) => {
            const selectedValue: string = String($(event.target).val());
            if (selectedValue) {
                this.usrFrm.get('gatgrampanchayat_id')?.setValue(Number(selectedValue));
            }
        });

    }

    getGatGramPanchayat(id: number) {
        this.user.getGatGramPanchayt(id).subscribe((res: any) => {
            console.log("gatGramPanchayat==", this.gatGramPanchayat)
            this.gatGramPanchayat = res?.data ?? [];
        })

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

    reset() {

        this.usrFrm.get('district_id')?.setValue(0);
        this.usrFrm.get('taluka_id')?.setValue(0);
        this.usrFrm.get('panchayat_id')?.setValue(0);
        this.usrFrm.get('gatgrampanchayat_id')?.setValue(0);
        this.usrFrm.get('name')?.setValue('');
        this.usrFrm.get('username')?.setValue('');
        this.usrFrm.get('pwd')?.setValue('');
        $('#taluka').val('').trigger('change');
        $('#district').val('').trigger('change');
        $('#gramPanchayat').val('').trigger('change');
        $('#gatGramPanchayt').val('').trigger('change');
        this.talukas = [];
        this.gramPanchayatList = [];
        this.gatGramPanchayat = [];
        this.getUserList(this.selectedDistrict);
        this.isEdit = false;
    }
    submit() {
        this.isSubmitted = true;
        const data = this.usrFrm.value;
        console.log(this.usrFrm.value)
        if (this.usrFrm.invalid) {

            return;
        }

        this.user.addUsers(data).subscribe({
            next: (res: any) => {
                if (res.status == 201) {

                    this.toastr.success(res?.message, 'Success');
                    this.isSubmitted = false;
                    this.reset();

                } else {
                    this.toastr.success(res?.message, 'Error');
                }
            },
            error: (err: any) => {
                this.toastr.error('Failed to add User', 'Error');
                console.log("error: Add User ::", err);
                this.isSubmitted = false;
            }

        });
    }

    keyDownText(event: KeyboardEvent, controlName: string): void {
        this.util.onKeydown(event, controlName, this.usrFrm);
    }

    setValueToggle(district: string) {

        for (const key in this.collapsedDistricts) {

            if (key.toString() == district) {
                this.collapsedDistricts[key] = true;

            } else {
                this.collapsedDistricts[key] = false;
            }
        }

    }
    toggleCollapse(district: string) {

        if (this.selectedDistrict != district) {
            this.collapsedDistricts[district] = !this.collapsedDistricts[district];
            this.currentPage = 1;
            this.selectedDistrict = district;
            this.getUserList(district);
        } else {

            this.collapsedDistricts[district] = !this.collapsedDistricts[district];
        }
        console.log("collapsedDistricts==", this.collapsedDistricts)
    }

    editInfo(id: number) {
        let user_type = this.usrFrm.get('user_type')?.value
        this.user.getUserById({ id: id, user_type: user_type }).subscribe((res: any) => {
            this.userInfo = res?.data ?? [];
            this.usrFrm.get('id')?.setValue(this.userInfo[this.keyName] || '');
            this.usrFrm.get('name')?.setValue(this.userInfo?.NAME || '');
            this.usrFrm.get('username')?.setValue(this.userInfo?.USERNAME || '');
            this.usrFrm.get('pwd')?.setValue(this.userInfo.pwd || '');
            this.selectedDistrict = this.userInfo.DISTRICT_ID;
            this.usrFrm.get('district_id')?.setValue(this.userInfo.DISTRICT_ID || '');
            $('#district').trigger('change')

            setTimeout(() => {
                this.usrFrm.get('taluka_id')?.setValue(this.userInfo.TALUKA_ID || '');
                $('#taluka').trigger('change')

            }, 400);

            setTimeout(() => {
                this.usrFrm.get('panchayat_id')?.setValue(this.userInfo.PANCHAYAT_ID || '');
                $('#gramPanchayat').trigger('change')


            }, 500);

            setTimeout(() => {
                this.usrFrm.get('gatgrampanchayat_id')?.setValue(this.userInfo.GATGRAMPANCHAYAT_id || '');
                $('#gatGramPanchayt').trigger('change')
            }, 800)
            this.isEdit = true;
        })
    }
    update() {
        this.isSubmitted = true;
        if (this.usrFrm.invalid) {
            return;
        }

        const data = this.usrFrm.value;
        this.user.updateUser(data).subscribe({
            next: (res: any) => {
                if (res.status == 200) {

                    this.toastr.success(res?.message, 'Success');
                    this.reset();
                    this.isSubmitted = false;
                    this.getUserList(this.selectedDistrict);
                } else {
                    this.toastr.success(res?.message, 'Error');
                }
            },
            error: (err: any) => {
                this.toastr.error('Failed to Update User', 'Error');
                console.log("error: Update User ::", err);
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
                    this.user.deleteUser({ id: id, user_type: "new_user" }).subscribe((res: any) => {
                        if (res.status == 200) {
                            this.toastr.success(res?.message, 'Success');
                            this.isSubmitted = false;
                            this.getUserList(this.selectedDistrict);
                        } else {
                            this.toastr.success(res?.message, 'Error');
                        }
                    })
                }
            });
        } catch (error) {
            console.log("Error:: ", error)
        }
    }

    onPageChange(page: number) {
        this.currentPage = page;
        this.getUserList(this.selectedDistrict);
    }

    activeTab(tabId: number) {
        this.reset();
        this.setValueToggle('0');

        this.selectedTabInd = tabId;
        this.selectUserType = this.userTypeList[this.selectedTabInd].toString();
        setTimeout(() => {
            this.usrFrm.get('user_type')?.setValue(this.selectUserType);
            this.tabTitle = this.tabTitleList[tabId - 1];
            this.keyName = this.keysList[tabId - 1];
            this.getAllDistricts();
            this.getUserList(this.selectedDistrict);
            this.getUserDistrict();
            console.log("keyName==", this.keyName)
        }, 700);


    }

}
