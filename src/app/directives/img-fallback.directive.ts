import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'img[handleImgError]',
  standalone: true,
})
export class HandleImgErrrorDirective {
  @Input()
  handleImgError?: string;

  @HostListener('error', ['$event'])
  handleImageError(event: Event): void {
    const image = event.target as HTMLInputElement;
    image.src = this.handleImgError ?? '../../assets/default.png';
  }
}
