import { Component } from '@angular/core';
import { RatingCategoryComponent } from "./rating-category/rating-category.component";
import { ServerComponent } from '../../server.component';
import { LottieComponent } from 'ngx-lottie';
import { RouterLink } from '@angular/router';
import { User, UserService } from '../../../../../service/user.service';
import { PopupService } from '../../../../../service/popup.service';
import { RateServerPopupComponent } from '../../../../shared/popup/server/rate/rate.component';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-ratings',
  standalone: true,
  imports: [RatingCategoryComponent, LottieComponent, RouterLink, AsyncPipe],
  templateUrl: './ratings.component.html',
  styleUrl: './ratings.component.scss'
})
export class ServerRatingsComponent {
  user$: Observable<User | null>;

  averageRating: number = 0;

  ratingsByCategory: number[] = [0, 0, 0, 0, 0];
  ratingsAmoutnByCategory: number[] = [0, 0, 0, 0, 0];
  averageRatings: number[] = [0, 0, 0, 0, 0];

  constructor(
    private parent: ServerComponent,
    public userService: UserService,
    private popupService: PopupService,
  ) {
    this.user$ = userService.getUser();

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
      return sum + amount;
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
