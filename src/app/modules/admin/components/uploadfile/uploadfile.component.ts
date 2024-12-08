import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ITEM_PER_PAGE } from '../../constants/admin.constant';
import { CommanTypeService } from '../../services/comman-type.service';
import { UploadFileService } from '../../services/upload-file.service';
import Util from '../../utils/utils';
import { PaginationComponent } from '../pagination/pagination.component';
import { SortingTableComponent } from '../sorting-table/sorting-table.component';

@Component({
  selector: 'app-uploadfile',
  standalone: true,
  imports: [SortingTableComponent, PaginationComponent, FormsModule],
  templateUrl: './uploadfile.component.html',
  styleUrl: './uploadfile.component.css'
})
export class UploadfileComponent {
  currentPage: number = 1;
  searchValue: string = '';
  items: any = [];
  totalItems: number = 0;
  itemsPerPage: number = ITEM_PER_PAGE
  displayedColumns: any = [
    { key: 'sr_no', label: 'अनुक्रमांक' },
    { key: 'FILE_NAME', label: 'फाईलचे नाव' },
    { key: 'inner_html', label: 'डाउनलोड फाइल' }
  ];

  keyName: string = 'UPLOAD_ID';
  marathiText: string = '';
  uploadData: any = [];
  isEdit: boolean = false;
  selectedFileName: string = '';
  selectedFile: any;
  changeFileName: any;
  formData: FormData = new FormData();
  constructor(private titleService: Title, private uploadFile: UploadFileService, private util: Util, private api: CommanTypeService, private toast: ToastrService) { }
  ngOnInit(): void {
    this.titleService.setTitle('Upload File');
    this.fetchUploadData();
  }

  fetchUploadData() {
    this.uploadFile.fetchFileList({ page_number: this.currentPage, search_text: this.searchValue }).subscribe({
      next: (res: any) => {

        this.items = res.data.map((item: any, index: number) => {
          return {
            ...item,
            inner_html: `
              <a href="${item.R_PATH}" class="btn btn-sm btn-outline-primary font-weight-bold" target="_blank">
              <i class="mdi mdi-download"></i> डाउनलोड
              </a> &nbsp;
              <a href="${item.R_PATH}" class="btn btn-sm btn-outline-secondary font-weight-bold" target="_blank">
              <i class="mdi mdi-eye"></i> पूर्वावलोकन
              </a>
            `
          }
        });
        // this.items = res?.data ?? [];
        console.log("res===", this.items)
        this.totalItems = res?.totalRecords;
      },
      error: (err: any) => {
        console.error('Error fetch Floor Data:', err);
      }
    });
  }


  addUploadData() {
    const fileInput: any = document.getElementById('data_file');  // Get file input
    const file = fileInput?.files[0];
    this.formData.set('upload_file', file, file.name);
    this.formData.set('file_name', this.uploadData.file_name);
    this.api.postFormData('add-upload-file', this.formData).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.toast.success(res.message, "Success!");
          this.fetchUploadData();
        } else {
          this.toast.error(res.message, "Error!");
        }

      }
    });
  }

  editInfo(id: number) {
    this.uploadFile.getFileListById(id).subscribe({
      next: (res: any) => {
        this.isEdit = true;
        let data = res.data;
        // this.formData.set('upload_file', data.R_PATH, data.FILE_NAME);

        this.formData.set('file_name', data.FILE_NAME);
        this.uploadData = data;
        this.uploadData.file_name = data.FILE_NAME;
        this.uploadData.data_file = data.R_PATH;
        this.formData.set('upload_file', data.R_PATH);
      },
      error: (err: any) => {
        console.error('Error get TaxList Data:', err);
      }
    });
  }

  updateInfo() {
    const fileInput: any = document.getElementById('data_file');  // Get file input
    const file = fileInput?.files[0];
    if (file) {
      this.formData.set('upload_file', file, file.name);
    }
    this.formData.set('file_name', this.uploadData.file_name);

    this.api.putFormData('update-upload-file/' + this.uploadData.UPLOAD_ID, this.formData).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.toast.success(res.message, "Success!");
          this.fetchUploadData();
        } else {
          this.toast.error(res.message, "Error!");
        }
      }
    });
  }

  deleteInfo(id: number) {
    this.util.showConfirmAlert().then((res) => {
      if (res) {
        this.uploadFile.deleteFile(id).subscribe({
          next: (res: any) => {
            if (res.status) {
              this.toast.success(res.message, "Success!");
              this.fetchUploadData();
            } else {
              this.toast.error(res.message, "Error!");
            }
          }
        });
      }
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.fetchUploadData();
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
    this.debounceFetchData();

  }

  private debounceFetchData = this.debounce(() => {
    this.fetchUploadData();
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
    this.fetchUploadData();
  }
  reset()
  {
    $("#file_name").val("");
    const fileInput = document.getElementById('data_file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; 
    }
  }
}
