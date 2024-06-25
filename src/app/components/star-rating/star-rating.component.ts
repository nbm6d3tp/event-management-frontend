import { Component, input, model, signal } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.scss',
})
export class StarRatingComponent {
  rating = model.required<number>();
  readonly = input(false);
  ratingArr = signal<number[]>([]);

  onClick(rating: number) {
    if (this.readonly() === false) {
      this.rating.set(rating);
    }
  }

  showIcon(index: number) {
    if (this.rating() >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }
}
