import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ITEM_PER_PAGE } from '../../constants/admin.constant';
import { TowerService } from '../../services/tower.service';
import Util from '../../utils/utils';
import { PaginationComponent } from '../pagination/pagination.component';
import { SortingTableComponent } from '../sorting-table/sorting-table.component';

@Component({
    selector: 'app-tower',
    standalone: true,
    imports: [PaginationComponent, SortingTableComponent, FormsModule, ReactiveFormsModule],
    templateUrl: './tower.component.html',
    styleUrl: './tower.component.css'
})
export class TowerComponent {
    currentPage: number = 1;
    searchValue: string = '';
    items: any = [];
    totalItems: number = 0;
    itemsPerPage: number = ITEM_PER_PAGE
    displayedColumns: any = [
        { key: 'sr_no', label: 'अनुक्रमांक' },
        { key: 'MANORAMASTER_NAME', label: 'टावर प्रकार' },

    ];

    keyName: string = 'MANORAMASTER_ID';
    marathiText: string = '';
    towerFrm = new FormGroup({
        name: new FormControl<number | null>(null, Validators.required),
        tower_id: new FormControl<number | string>(''),

    })
    isSubmitted: boolean = false;
    isEdit: boolean = false;
    infoData: any = []
    constructor(private titleService: Title, private util: Util, private tower: TowerService, private toast: ToastrService) { }
    ngOnInit(): void {
        this.titleService.setTitle('Tower');
        this.fetchData();
    }

    fetchData() {
        this.tower.getTowerList({ page_number: this.currentPage, search_text: this.searchValue }).subscribe({
            next: (res: any) => {
                this.items = res?.data ?? [];
                this.totalItems = res?.totalRecords;
            },
            error: (err: any) => {
                console.error('Error get TaxList Data:', err);
            }
        });

    }


    submit() {
        this.isSubmitted = true;
        const data = this.towerFrm.value;

        if (this.towerFrm.invalid) {
            return;
        }

        this.tower.addTower(data).subscribe({
            next: (res: any) => {
                if (res.status == 201) {

                    this.toast.success(res?.message, 'Success');
                    this.isSubmitted = false;
                    this.fetchData();
                    this.reset();

                } else {
                    this.toast.success(res?.message, 'Error');
                }
            },
            error: (err: any) => {
                this.toast.error('Failed to update tower', 'Error');
                console.log("error: Update Tower ::", err);
                this.isSubmitted = false;
            }

        });
    }

    reset() {
        this.towerFrm.reset();
    }

    editInfo(id: number) {
        this.tower.getTowerById(id).subscribe((res: any) => {
            // this.infoData = res?.data ?? [];
            this.towerFrm.get('tower_id')?.setValue(res?.data.MANORAMASTER_ID ?? '');
            this.towerFrm.get('name')?.setValue(res?.data.MANORAMASTER_NAME ?? '');
            this.isEdit = true;
        })
    }

    update() {
        this.isSubmitted = true;
        const data = this.towerFrm.value;

        if (this.towerFrm.invalid) {
            return;
        }

        this.tower.updateTower(data).subscribe({
            next: (res: any) => {
                if (res.status == 200) {
                    this.toast.success(res?.message, 'Success');
                    this.isSubmitted = false;
                    this.fetchData();
                    this.reset();

                } else {
                    this.toast.success(res?.message, 'Error');
                }
            },
            error: (err: any) => {
                this.toast.error('Failed to update tower', 'Error');
                console.log("error: Add User ::", err);
                this.isSubmitted = false;
            }
        });
    }
    deleteInfo(id: number) {
        try {
            this.util.showConfirmAlert().then((res) => {
                if (!id) {
                    this.toast.error("Use Id is required", "Error");
                    return
                }
                if (res) {
                    this.tower.deleteTower(id).subscribe((res: any) => {
                        if (res.status == 200) {
                            this.toast.success(res?.message, 'Success');
                            this.isSubmitted = false;
                            this.fetchData()
                        } else {
                            this.toast.success(res?.message, 'Error');
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
