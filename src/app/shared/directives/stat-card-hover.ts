import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[statCardHover]',
  standalone: true
})
export class StatCardHover {

  constructor(private element: ElementRef<HTMLElement>) {}

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.element.nativeElement.style.backgroundColor = '#E8F2EC';
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.element.nativeElement.style.backgroundColor = 'white';
  }
}
