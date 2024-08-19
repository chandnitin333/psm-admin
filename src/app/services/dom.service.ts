import { Injectable, Renderer2, Inject, PLATFORM_ID, RendererFactory2 } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DomService {
  private renderer: Renderer2;
  private document: Document | undefined;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private rendererFactory: RendererFactory2
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    if (isPlatformBrowser(this.platformId)) {
      this.document = window.document;
    }
  }

addBodyClass(className: string): void {
    if (isPlatformBrowser(this.platformId) && this.document) {
        this.renderer.addClass(this.document.body, className);
    }
}

removeBodyClass(className: string): void {
    if (isPlatformBrowser(this.platformId) && this.document) {
        this.renderer.removeClass(this.document.body, className);
    }
}
}