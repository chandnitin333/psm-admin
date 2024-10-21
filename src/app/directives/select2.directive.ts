import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import $ from 'jquery';
import 'select2';

@Directive({
  selector: '[appSelect2]'
  //  standalone: true
})
export class Select2Directive implements OnInit, OnDestroy, AfterViewInit {
  @Input() select2Options: any;

  constructor(private el: ElementRef) { }

  ngOnInit() { }

  ngAfterViewInit() {


    $(this.el.nativeElement).select2(this.select2Options);

    // Destroy Select2 on component destroy
    $(this.el.nativeElement).on('select2:open', () => {
      // Any custom behavior or additional setup
    });
  }

  ngOnDestroy() {
    $(this.el.nativeElement).select2('destroy');
  }
}
