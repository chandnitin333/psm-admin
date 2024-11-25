import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ITEM_PER_PAGE } from '../../constants/admin.constant';
import { PrakarService } from '../../services/prakar.service';
import Util from '../../utils/utils';
import { PaginationComponent } from '../pagination/pagination.component';
import { SortingTableComponent } from '../sorting-table/sorting-table.component';

@Component({
  selector: 'app-prakar',
  standalone: true,
  imports: [PaginationComponent, SortingTableComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './prakar.component.html',
  styleUrl: './prakar.component.css'
})
export class PrakarComponent {


  currentPage: number = 1;
  searchValue: string = '';
  items: any = [];
  totalItems: number = 0;
  itemsPerPage: number = ITEM_PER_PAGE
  displayedColumns: any = [
    { key: 'sr_no', label: 'अनुक्रमांक' },
    { key: 'PRAKAR_NAME', label: 'वाणिज्य नाव' }
  ];

  keyName: string = 'PRAKAR_ID';
  marathiText: string = '';
  parkarFrm = new FormGroup({
    name: new FormControl<number | null>(null, Validators.required),
    prakar_id: new FormControl<number | string>(''),

  })
  isSubmitted: boolean = false;
  isEdit: boolean = false;
  infoData: any = []

  constructor(private titleService: Title, private prakar: PrakarService, private util: Util, private toast: ToastrService) { }

  ngOnInit(): void {
    this.titleService.setTitle('Prakar');
    this.fetchData();
  }

  fetchData() {
    this.prakar.fetchPrakarList({ page_number: this.currentPage, search_text: this.searchValue }).subscribe({
      next: (res: any) => {

        this.items = res?.data ?? [];
        this.totalItems = res?.totalRecords;
      },
      error: (err: any) => {
        console.error('Error fetch Parkar Data:', err);
      }
    });
  }
  submit() {
    this.isSubmitted = true;
    const data = this.parkarFrm.value;

    if (this.parkarFrm.invalid) {
      return;
    }

    this.prakar.addPrakar(data).subscribe({
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
        this.toast.error('Failed to update floor', 'Error');
        console.log("error: Update floor ::", err);
        this.isSubmitted = false;
      }

    });
  }

  reset() {
    this.parkarFrm.reset();
  }

  editInfo(id: number) {
    this.prakar.getPrakarById(id).subscribe((res: any) => {
      console.log("resss", res.data)
      this.parkarFrm.get('prakar_id')?.setValue(res?.data.PRAKAR_ID ?? '');
      this.parkarFrm.get('name')?.setValue(res?.data.PRAKAR_NAME ?? '');
      this.isEdit = true;
    })
  }
  update() {
    this.isSubmitted = true;
    const data = this.parkarFrm.value;

    if (this.parkarFrm.invalid) {
      return;
    }

    this.prakar.updatePrakar(data).subscribe({
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
        this.toast.error('Failed to update floor', 'Error');
        console.log("error: update floor ::", err);
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
          this.prakar.deletePrakar(id).subscribe((res: any) => {
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
