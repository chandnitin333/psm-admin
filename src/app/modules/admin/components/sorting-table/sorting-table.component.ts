
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ITEM_PER_PAGE } from '../../constants/admin.constant';
import Util from '../../utils/utils';

@Component({
  selector: 'app-sorting-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sorting-table.component.html',
  styleUrl: './sorting-table.component.css'
})
export class SortingTableComponent<T> implements OnInit {
  @Input() data: [] = [];
  @Input() columns: { key: string; label: string }[] = [];
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  @Input() currentPage: number = 1;
  @Input() searchValue: string = '';
  @Input() keyName: string = '';
  constructor(private util: Util) { }
  searchTerm: string = '';
  filteredData: any[] = [];
  marathiText: string = '';

  ngOnInit(): void {
    // console.log('data', this.data);
    this.filteredData = this.data;
  }

  ngAfterViewInit() {

  }
  ngOnChanges(): void {

  }

  onEdit(item: any): void {
    this.edit.emit(item[this.keyName]);
  }

  onDelete(item: any): void {

    this.delete.emit(item[this.keyName]);
  }

  srNo(index: number): number {
    return (this.currentPage - 1) * ITEM_PER_PAGE + index + 1;
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
}
