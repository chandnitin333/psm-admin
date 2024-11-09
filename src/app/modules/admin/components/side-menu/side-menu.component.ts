import { CommonModule } from '@angular/common';
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [RouterLink,FormsModule,CommonModule],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css'
})
export class SideMenuComponent {

  @ViewChild('myUserElement') myUserElement!: ElementRef;
  @ViewChild('myTaxElement') myTaxlement!: ElementRef;
  @ViewChild('myDarElement') myDarlement!: ElementRef;
  @ViewChild('myCamiteeElement') myCamiteeElement!: ElementRef;
  @ViewChild('myImagesElement') myImagesElement!: ElementRef;

  constructor(private renderer: Renderer2,public router: Router) { }

  toggleClass(labels: string): void {
    let element: Element | undefined = undefined; // Initialize element with a default value
    if (labels === 'user') {
      element = this.myUserElement.nativeElement;

      let tax = this.myTaxlement.nativeElement;
      let dar = this.myDarlement.nativeElement;
      let camitee = this.myCamiteeElement.nativeElement;
      let images = this.myImagesElement.nativeElement;
      this.renderer.removeClass(tax, 'expand');
      this.renderer.removeClass(dar, 'expand');
      this.renderer.removeClass(camitee, 'expand');
      this.renderer.removeClass(images, 'expand');
      this.renderer.removeClass(tax, 'active');
      this.renderer.removeClass(dar, 'active');
      this.renderer.removeClass(camitee, 'active');
      this.renderer.removeClass(images, 'active');

    } else if (labels == 'tax') {
      element = this.myTaxlement.nativeElement;

      let user = this.myUserElement.nativeElement;
      let dar = this.myDarlement.nativeElement;
      let camitee = this.myCamiteeElement.nativeElement;
      let images = this.myImagesElement.nativeElement;
      this.renderer.removeClass(user, 'expand');
      this.renderer.removeClass(dar, 'expand');
      this.renderer.removeClass(camitee, 'expand');
      this.renderer.removeClass(images, 'expand');
      this.renderer.removeClass(user, 'active');
      this.renderer.removeClass(dar, 'active');
      this.renderer.removeClass(camitee, 'active');
      this.renderer.removeClass(images, 'active');

    } else if (labels == 'dar') {
      element = this.myDarlement.nativeElement;
      let user = this.myUserElement.nativeElement;
      let tax = this.myTaxlement.nativeElement;
      let camitee = this.myCamiteeElement.nativeElement;
      let images = this.myImagesElement.nativeElement;
      this.renderer.removeClass(user, 'expand');
      this.renderer.removeClass(tax, 'expand');
      this.renderer.removeClass(camitee, 'expand');
      this.renderer.removeClass(images, 'expand');
      this.renderer.removeClass(user, 'active');
      this.renderer.removeClass(tax, 'active');
      this.renderer.removeClass(camitee, 'active');
      this.renderer.removeClass(images, 'active');
    } else if (labels == 'camitee') {
      element = this.myCamiteeElement.nativeElement;
      let user = this.myUserElement.nativeElement;
      let tax = this.myTaxlement.nativeElement;
      let dar = this.myDarlement.nativeElement;
      let images = this.myImagesElement.nativeElement;
      this.renderer.removeClass(user, 'expand');
      this.renderer.removeClass(tax, 'expand');
      this.renderer.removeClass(dar, 'expand');
      this.renderer.removeClass(images, 'expand');
      this.renderer.removeClass(user, 'active');
      this.renderer.removeClass(tax, 'active');
      this.renderer.removeClass(dar, 'active');
      this.renderer.removeClass(images, 'active');
    } else if (labels == 'images') {
      element = this.myImagesElement.nativeElement;
      let user = this.myUserElement.nativeElement;
      let tax = this.myTaxlement.nativeElement;
      let camitee = this.myCamiteeElement.nativeElement;
      let dar = this.myDarlement.nativeElement;
      this.renderer.removeClass(user, 'expand');
      this.renderer.removeClass(tax, 'expand');
      this.renderer.removeClass(camitee, 'expand');
      this.renderer.removeClass(dar, 'expand');
      this.renderer.removeClass(user, 'active');
      this.renderer.removeClass(tax, 'active');
      this.renderer.removeClass(camitee, 'active');
      this.renderer.removeClass(dar, 'active');
    }
    if (element && element.classList.contains('expand')) { // Check if element is defined before accessing its classList
      this.renderer.removeClass(element, 'expand');
      this.renderer.removeClass(element, 'active');
    } else if (element) { // Check if element is defined before accessing its classList
      this.renderer.addClass(element, 'expand');
      this.renderer.addClass(element, 'active');
    }
  }
}
