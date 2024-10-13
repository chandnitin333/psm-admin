
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';


@Component({
  selector: 'app-sorting-table',
  standalone: true,
  imports: [ MatPaginator, MatTableModule, MatSort,CommonModule ],
  templateUrl: './sorting-table.component.html',
  styleUrl: './sorting-table.component.css'
})
export class SortingTableComponent<T> implements OnInit {
  @Input() data: T[] = [];
  @Input() displayedColumns: string[] = [];
  @Input() pageSize: number = 10;
  @Input() pageSizeOptions: number[] = [5, 10, 20];
  @Input() totalLength: number = 0;

  dataSource = new MatTableDataSource<T>(this.data);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  ngOnChanges(): void {
    // Update data source whenever input data changes
    this.dataSource.data = this.data;
    this.totalLength = this.data.length;
  }
}
