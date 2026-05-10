import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ITEM_PER_PAGE } from '../../constants/admin.constant';
import { SutDandService } from '../../services/sut-dand.service';
import Util from '../../utils/utils';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
    selector: 'app-sutdand',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, PaginationComponent],
    templateUrl: './sutdand.component.html',
    styleUrl: './sutdand.component.css'
})
export class SutDandComponent implements OnInit, AfterViewInit {
    sutDandForm = new FormGroup({
        district_id: new FormControl<string | null>(null, Validators.required),
        taluka_id: new FormControl<string | null>(null, Validators.required),
        grampanchayat_id: new FormControl<string | null>(null, Validators.required),
        kar_type: new FormControl<string | null>(null, Validators.required),
        gruhkar_v_bhumikar_5: new FormControl<number | null>(null),
        viz_v_divabatti_kar_5: new FormControl<number | null>(null),
        aarogya_rakshan_kar_5: new FormControl<number | null>(null),
        safae_kar_5: new FormControl<number | null>(null),
        samanya_pani_kar_5: new FormControl<number | null>(null),
        vishesh_pani_kar_5: new FormControl<number | null>(null),
    });

    districts: any[] = [];
    talukas: any[] = [];
    panchayats: any[] = [];
    karTypes = [
        { value: 'chalu', label: 'चालू' },
        { value: 'magil', label: 'मागील' },
    ];

    items: any[] = [];
    totalItems: number = 0;
    itemsPerPage: number = ITEM_PER_PAGE;
    currentPage: number = 1;
    isEdit: boolean = false;
    isSubmitted: boolean = false;
    editId: number = 0;
    searchValue: string = '';

    taxFields: { field: string, label: string }[] = [
        { field: 'gruhkar_v_bhumikar_5', label: 'गृहकर व भूमिकर' },
        { field: 'viz_v_divabatti_kar_5', label: 'विज व दिवाबत्ती कर' },
        { field: 'aarogya_rakshan_kar_5', label: 'आरोग्य रक्षण कर' },
        { field: 'safae_kar_5', label: 'सफाई कर' },
        { field: 'samanya_pani_kar_5', label: 'सामान्य पाणी कर' },
        { field: 'vishesh_pani_kar_5', label: 'विशेष पाणी कर' },
    ];

    constructor(
        private titleService: Title,
        private sutDand: SutDandService,
        private util: Util,
        private toastr: ToastrService,
    ) {
        this.titleService.setTitle('Sut Dand');
    }

    async ngOnInit(): Promise<void> {
        this.districts = await this.util.getDistrictDDL();
        this.fetchData();
    }

    ngAfterViewInit(): void {
        $('.my-select2').select2();

        $('#district_id').on('change', (event) => {
            const v = String($(event.target).val() || '');
            this.sutDandForm.get('district_id')?.setValue(v || null);
            this.sutDandForm.get('taluka_id')?.setValue(null);
            this.sutDandForm.get('grampanchayat_id')?.setValue(null);
            this.talukas = [];
            this.panchayats = [];
            $('#taluka_id').val('').trigger('change');
            $('#grampanchayat_id').val('').trigger('change');
            if (v) this.loadTalukas(Number(v));
        });

        $('#taluka_id').on('change', (event) => {
            const v = String($(event.target).val() || '');
            this.sutDandForm.get('taluka_id')?.setValue(v || null);
            this.sutDandForm.get('grampanchayat_id')?.setValue(null);
            this.panchayats = [];
            $('#grampanchayat_id').val('').trigger('change');
            if (v) this.loadPanchayats(Number(v));
        });

        $('#grampanchayat_id').on('change', (event) => {
            const v = String($(event.target).val() || '');
            this.sutDandForm.get('grampanchayat_id')?.setValue(v || null);
        });

        $('#kar_type').on('change', (event) => {
            const v = String($(event.target).val() || '');
            this.sutDandForm.get('kar_type')?.setValue(v || null);
        });
    }

    private async loadTalukas(districtId: number) {
        const res: any = await this.util.getTalukaById({ id: districtId });
        this.talukas = res?.data ?? [];
    }

    private async loadPanchayats(talukaId: number) {
        const res: any = await this.util.getGatGramTalukaById({ id: talukaId });
        this.panchayats = res?.data ?? [];
    }

    fetchData() {
        const v = this.sutDandForm.value;
        this.sutDand.list({
            page_number: this.currentPage,
            search_text: this.searchValue,
            district_id: v.district_id || null,
            taluka_id: v.taluka_id || null,
            grampanchayat_id: v.grampanchayat_id || null,
            kar_type: v.kar_type || null,
        }).subscribe({
            next: (res: any) => {
                this.items = res?.data ?? [];
                this.totalItems = res?.totalRecords ?? 0;
            },
            error: (err: any) => {
                console.error('Sut Dand list error:', err);
                this.toastr.error('Error fetching list', 'Error');
            }
        });
    }

    onPageChange(page: number) {
        this.currentPage = page;
        this.fetchData();
    }

    submit() {
        this.isSubmitted = true;
        const v = this.sutDandForm.value;
        if (!v.district_id || !v.taluka_id || !v.grampanchayat_id || !v.kar_type) {
            this.toastr.error('Please fill District, Taluka, Gram Panchayat and Kar Type', 'Error');
            return;
        }
        const payload = this.buildPayload();
        if (!this.isEdit) {
            this.sutDand.create(payload).subscribe({
                next: (res: any) => {
                    if (res.status == 201) {
                        this.toastr.success(res.message, 'Success');
                        this.reset();
                        this.fetchData();
                    } else {
                        this.toastr.error(res.message || 'Could not save', 'Error');
                    }
                },
                error: (err: any) => {
                    console.error('Sut Dand create error:', err);
                    this.toastr.error('Could not save', 'Error');
                }
            });
        } else {
            this.sutDand.update(this.editId, payload).subscribe({
                next: (res: any) => {
                    if (res.status == 200) {
                        this.toastr.success(res.message, 'Success');
                        this.reset();
                        this.fetchData();
                    } else {
                        this.toastr.error(res.message || 'Could not update', 'Error');
                    }
                },
                error: (err: any) => {
                    console.error('Sut Dand update error:', err);
                    this.toastr.error('Could not update', 'Error');
                }
            });
        }
    }

    private buildPayload() {
        const v: any = this.sutDandForm.value;
        return {
            district_id: v.district_id,
            taluka_id: v.taluka_id,
            grampanchayat_id: v.grampanchayat_id,
            kar_type: v.kar_type,
            gruhkar_v_bhumikar_5: v.gruhkar_v_bhumikar_5,
            viz_v_divabatti_kar_5: v.viz_v_divabatti_kar_5,
            aarogya_rakshan_kar_5: v.aarogya_rakshan_kar_5,
            safae_kar_5: v.safae_kar_5,
            samanya_pani_kar_5: v.samanya_pani_kar_5,
            vishesh_pani_kar_5: v.vishesh_pani_kar_5,
        };
    }

    edit(id: number) {
        this.sutDand.getById(id).subscribe({
            next: async (res: any) => {
                if (res.status !== 200 || !res.data) {
                    this.toastr.error(res.message || 'Record not found', 'Error');
                    return;
                }
                const d = res.data;
                this.isEdit = true;
                this.editId = id;
                if (d.district_id) await this.loadTalukas(Number(d.district_id));
                if (d.taluka_id) await this.loadPanchayats(Number(d.taluka_id));
                this.sutDandForm.patchValue({
                    district_id: d.district_id != null ? String(d.district_id) : null,
                    taluka_id: d.taluka_id != null ? String(d.taluka_id) : null,
                    grampanchayat_id: d.grampanchayat_id != null ? String(d.grampanchayat_id) : null,
                    kar_type: d.kar_type ?? null,
                    gruhkar_v_bhumikar_5: d.gruhkar_v_bhumikar_5,
                    viz_v_divabatti_kar_5: d.viz_v_divabatti_kar_5,
                    aarogya_rakshan_kar_5: d.aarogya_rakshan_kar_5,
                    safae_kar_5: d.safae_kar_5,
                    samanya_pani_kar_5: d.samanya_pani_kar_5,
                    vishesh_pani_kar_5: d.vishesh_pani_kar_5,
                });
                setTimeout(() => {
                    $('#district_id').val(this.sutDandForm.value.district_id ?? '').trigger('change.select2');
                    $('#taluka_id').val(this.sutDandForm.value.taluka_id ?? '').trigger('change.select2');
                    $('#grampanchayat_id').val(this.sutDandForm.value.grampanchayat_id ?? '').trigger('change.select2');
                    $('#kar_type').val(this.sutDandForm.value.kar_type ?? '').trigger('change.select2');
                }, 200);
            },
            error: (err: any) => {
                console.error('Sut Dand get error:', err);
                this.toastr.error('Could not load record', 'Error');
            }
        });
    }

    deleteItem(id: number) {
        this.util.showConfirmAlert().then((ok) => {
            if (!ok) return;
            this.sutDand.delete(id).subscribe({
                next: (res: any) => {
                    if (res.status == 200) {
                        this.toastr.success(res.message, 'Success');
                        this.fetchData();
                    } else {
                        this.toastr.error(res.message || 'Could not delete', 'Error');
                    }
                },
                error: (err: any) => {
                    console.error('Sut Dand delete error:', err);
                    this.toastr.error('Could not delete', 'Error');
                }
            });
        });
    }

    reset() {
        this.sutDandForm.reset();
        this.isEdit = false;
        this.editId = 0;
        this.isSubmitted = false;
        this.talukas = [];
        this.panchayats = [];
        $('#district_id').val('').trigger('change.select2');
        $('#taluka_id').val('').trigger('change.select2');
        $('#grampanchayat_id').val('').trigger('change.select2');
        $('#kar_type').val('').trigger('change.select2');
    }

    srNo(index: number): number {
        return (this.currentPage - 1) * this.itemsPerPage + index + 1;
    }

    karTypeLabel(value: string): string {
        return this.karTypes.find(k => k.value === value)?.label ?? value;
    }
}
