import { Component } from '@angular/core';
import { RatingCategoryComponent } from "./rating-category/rating-category.component";
import { ServerComponent } from '../../server.component';
import { LottieComponent } from 'ngx-lottie';
import { PlayerRating } from '../../../../../model/server/server';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../../../service/user.service';
import { PopupService } from '../../../../../service/popup.service';
import { RateServerPopupComponent } from '../../../../shared/popup/server/rate/rate.component';

@Component({
  selector: 'app-ratings',
  standalone: true,
  imports: [RatingCategoryComponent, LottieComponent, RouterLink],
  templateUrl: './ratings.component.html',
  styleUrl: './ratings.component.scss'
})
export class ServerRatingsComponent {
  averageRating: number = 0;

  ratingsByCategory: number[] = [0, 0, 0, 0, 0];
  ratingsAmoutnByCategory: number[] = [0, 0, 0, 0, 0];
  averageRatings: number[] = [0, 0, 0, 0, 0];

  constructor(
    private parent: ServerComponent,
    public userService: UserService,
    private popupService: PopupService,
  ) {
    this.parent.server.ratings.forEach(rating => {
      const categoryIndex = rating.category.id - 1;
      this.ratingsByCategory[categoryIndex] += rating.rating;
      this.ratingsAmoutnByCategory[categoryIndex]++;
    });

    this.averageRatings.forEach((sA, index) => {
      if (this.ratingsAmoutnByCategory[index] != 0) {
        sA = this.ratingsByCategory[index] / this.ratingsAmoutnByCategory[index];
        this.averageRatings[index] = sA;
      }
    });

    const totalAverageRating = this.averageRatings.reduce((sum, amount, index) => {
      return sum + (amount * index);
    });

    this.averageRating = totalAverageRating / 5;
  }

  rateServer(){
    this.popupService.showPopup(RateServerPopupComponent, [{ name: "serverId", value: this.parent.server.id }]);
  }

  getRatingsByCategoryId(id: number) {
    return this.parent.server.ratings.filter(r => r.category.id == id);
  }
}
