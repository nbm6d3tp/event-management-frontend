import { Directive, HostListener, input } from '@angular/core';

@Directive({
  selector: 'img[handleImgError]',
  standalone: true,
})
export class HandleImgErrrorDirective {
  handleImgError = input<string>();

  @HostListener('error', ['$event'])
  handleImageError(event: Event): void {
    const image = event.target as HTMLInputElement;
    image.src = this.handleImgError() ?? '../../assets/default.jpeg';
  }
}
