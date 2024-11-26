import { Component, Input, OnInit } from '@angular/core';
import { LottieComponent } from 'ngx-lottie';
import { PlayerRating } from '../../../../../../model/server/server';

@Component({
  selector: 'app-rating-category',
  standalone: true,
  imports: [LottieComponent],
  templateUrl: './rating-category.component.html',
  styleUrl: './rating-category.component.scss'
})
export class RatingCategoryComponent implements OnInit {
  @Input({required: true}) header: string = "";
  @Input({required: true}) ratings: PlayerRating[] = [];

  @Input() reversed: boolean = false;

  starAmount: number[] = [0, 0, 0, 0, 0];
  totalRatings: number = 0;
  averageRating: number = 0;

  ngOnInit(): void {
    this.ratings.forEach(rating => {
      this.starAmount[rating.rating - 1]++;
    });

    const sum = this.starAmount.reduce((sum, amount, index) => {
      return sum + (amount * (index + 1));
    });

    this.totalRatings = this.starAmount.reduce((sum, amount, index) => {
      return sum + amount;
    });

    if (this.totalRatings > 0) {
      this.averageRating = sum / this.totalRatings;
    }
  }
}
