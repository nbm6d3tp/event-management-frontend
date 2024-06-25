import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.scss',
})
export class StarRatingComponent {
  rating = model.required<number>();
  readonly = input(false);

  ratingArr: number[] = [];

  ngOnInit() {
    for (let index = 0; index < 5; index++) {
      this.ratingArr.push(index);
    }
  }
  onClick(rating: number) {
    if (!this.readonly) this.rating.set(rating);
  }

  showIcon(index: number) {
    if (this.rating() >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }
}
