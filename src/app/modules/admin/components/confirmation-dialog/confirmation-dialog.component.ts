import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent {
  @Input() message: string = 'Are you sure?';
  @Output() confirmed = new EventEmitter<boolean>();
  isVisible = false;

  open() {
    this.isVisible = true;
  }

  close() {
    this.isVisible = false;
    this.confirmed.emit(false);
  }

  confirm() {
    this.isVisible = false;
    this.confirmed.emit(true);
  }
}