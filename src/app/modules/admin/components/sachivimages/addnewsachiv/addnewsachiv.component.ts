import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../../../services/api.service';
import { CommanTypeService } from '../../../services/comman-type.service';
import { SachiveImagesService } from '../../../services/sachive-images.service';
import Util from '../../../utils/utils';

@Component({
    selector: 'app-addnewsachiv',
    standalone: true,
    imports: [RouterLink, FormsModule, CommonModule],
    templateUrl: './addnewsachiv.component.html',
    styleUrl: './addnewsachiv.component.css'
})
export class AddnewsachivComponent {
    talukaList: any = [];
    districtList: any = [];
    panchayatList: any = [];
    selectDistrict: number = 0;
    selectTaluka: number = 0;
    selectPanchayat: number = 0;
    sachivName: string = '';
    sachivimage: any = '';
    marathiText: string = ''
    selectedFile: File | null = null;
    formData: FormData = new FormData();

    recordId: number = 0;
    sachiveData: any = [];
    selectedFileName: string = '';
    showOverlay = false;
    changeFileName: string = '';
    isEdit: boolean = false;
    type: string = '';
    list = ['sachive', 'sarpanch', 'upsarpanch'];
    constructor(private sachive: SachiveImagesService, private route: ActivatedRoute, private titleService: Title, private util: Util, private api: ApiService, private comman: CommanTypeService, private toast: ToastrService, private router: Router) { }
    ngOnInit(): void {
        this.titleService.setTitle('Add new sachiv');
        this.route.queryParamMap.subscribe((params) => {
            this.type = params.get('type') ?? '';
        });
        this.fetchDistrict();
        this.recordId = Number(this.route.snapshot.paramMap.get('id') || 0);
        if (this.recordId) {
            this.getInfo();
        }


    }

    ngAfterViewInit(): void {
        $('#district').select2();
        $('#taluka').select2();
        $('#gramPanchayat').select2();

        $('#district').on('change', (event) => {
            const selectedValue: string = String($(event.target).val());
            this.formData.set('district_id', selectedValue);
            if (selectedValue) {
                this.selectDistrict = Number(selectedValue);
                this.fetchTaluka();
            }
        });

        $('#taluka').on('change', (event) => {
            const selectedValue: string = String($(event.target).val());
            this.formData.set('taluka_id', selectedValue);
            if (selectedValue) {
                this.selectTaluka = Number(selectedValue);
                this.fetchPanchayat();
            }
        });
        $('#gramPanchayat').on('change', (event) => {
            const selectedValue: string = String($(event.target).val());
            this.selectPanchayat = Number(selectedValue);
            this.formData.set('panchayat_id', selectedValue);
        });
    }

    ngOnDestroy(): void {
        $('#district').select2('destroy');
        $('#taluka').select2('destroy');
        $('#gramPanchayat').select2('destroy');
    }

    getInfo() {

        this.sachive.getSachiveImagesById(this.recordId, this.type).subscribe({
            next: (res: any) => {
                this.isEdit = true;
                this.sachiveData = res.data ?? [];
                console.log(this.sachiveData);
                this.selectDistrict = Number(this.sachiveData.DISTRICT_ID);
                $('#district').val(this.selectDistrict).trigger('change');
                this.formData.set('district_id', this.selectDistrict.toString());

                this.selectTaluka = Number(this.sachiveData.TALUKA_ID); // spell-check-disable-line

                this.formData.set('taluka_id', this.selectTaluka.toString());

                this.selectPanchayat = Number(this.sachiveData.PANCHAYAT_ID); // spell-check-disable-line
                this.formData.set('panchayat_id', this.selectPanchayat.toString()); // spell-check-disable-line

                let i = this.list.indexOf(this.type) != 0 ? this.list.indexOf(this.type) == 1 ? 1 : 2 : '';
                this.sachivName = this.sachiveData[`FILE_NAME${i}`];



                this.selectedFileName = this.sachiveData[`R_PATH${i}`];


                setTimeout(() => {
                    $('#taluka').val(this.selectTaluka).trigger('change'); // spell-check-disable-line

                }, 1000);
                this.isEdit = true;

            },
            error: (err: any) => {
                this.toast.error('Record Not available:', "Error");
                console.error('Error get Sachive image Data:', err);
            }
        });
    }

    updateInfo() {

        if (this.selectedFile) {
            const fileInput: any = document.getElementById('sachiv_image');  // Get file input
            const file = fileInput?.files[0];
            this.formData.set('upload_profile', file, file.name);
        }
        this.formData.set('name', this.sachivName);
        this.formData.set('id', this.recordId.toString());
        this.formData.set('type', this.type);
        localStorage.setItem('current_tab', this.type)
        this.comman.putFormData('update-dashboard-data/' + this.recordId, this.formData).subscribe({
            next: (res: any) => {
                this.toast.success('Sachive images updated successfully.', 'Success');
                setTimeout(() => {
                    this.router.navigate(['/admin/sachiv-list']);
                }, 500);
            },
            error: (error: any) => {
                console.error('Error update dashboard data:', error);
                this.toast.success('update Sachive  images has been failed.', 'Error');
            }
        });
    }
    async fetchTaluka() {

        this.util.getTalukaById({ id: this.selectDistrict }).then((res: any) => {
            this.talukaList = res.data;
        }
        );
        console.log(this.talukaList, this.selectDistrict);
    }

    async fetchDistrict() {
        this.districtList = await this.util.getDistrictDDL();
    }


    async fetchPanchayat() {

        this.util.getGatGramTalukaById({ id: this.selectTaluka }).then((res: any) => {
            this.panchayatList = res.data;
        }
        );

    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input?.files?.length) {
            this.selectedFile = input.files[0];
            this.selectedFileName = this.selectedFile.name;
            const reader = new FileReader();
            reader.onload = (e: any) => {
                const previewImage = document.getElementById('sachiv_image') as HTMLImageElement;
                if (previewImage) {
                    previewImage.src = e.target.result;

                }
                this.changeFileName = e.target.result;

            };
            reader.readAsDataURL(this.selectedFile);

        }


    }

    addSachiv() {
        if (!this.selectedFile) {
            console.error('File is required');
            return;
        }
        this.formData.set('name', this.sachivName);
        this.formData.set('type', this.type);
        const fileInput: any = document.getElementById('sachiv_image');  // Get file input
        const file = fileInput?.files[0];
        this.formData.set('upload_profile', file, file.name);
        this.comman.postFormData('add-dashboard-data', this.formData).subscribe({
            next: (res: any) => {
                this.toast.success('Sachive images added successfully.', 'Success');
                setTimeout(() => {
                    this.router.navigate(['/admin/sachiv-list']);
                }, 1000);
            },
            error: (error: any) => {
                console.error('Error adding dashboard data:', error);
                this.toast.success('Add Sachive has been failed.', 'Error');
            }
        });



    }

    translateText(event: Event) {
        // if presess enter key then translate text

        this.util.getTranslateText(event, this.marathiText).subscribe({
            next: (translatedText: string) => {
                this.marathiText = translatedText;
            },
            error: (error: any) => {
                console.error('Error translating text:', error);
            },
        });
    }


}
