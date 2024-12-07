import { Component, Input } from '@angular/core';
import { PopupService } from '../../../../../service/popup.service';
import { RateCategoryComponent } from "./category/category.component";
import { ApiService } from '../../../../../service/api.service';
import { Response } from '../../../../../model/response/Response';
import { NotificationService, NotificationType } from '../../../../../service/notification.service';

@Component({
  selector: 'app-rate',
  standalone: true,
  imports: [RateCategoryComponent],
  templateUrl: './rate.component.html',
  styleUrl: './rate.component.scss'
})
export class RateServerPopupComponent {
  @Input({ required: true }) serverId!: number;

  selectedStars: number[] = new Array(5).fill(-1);

  constructor(
    private popupService: PopupService,
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {

  }

  submit() {
    this.apiService.post<Response>('/server/' + this.serverId + "/rate",
      [{ 'categoryId': 1, 'rate': this.selectedStars[0] + 1 },
      { 'categoryId': 2, 'rate': this.selectedStars[1] + 1},
      { 'categoryId': 3, 'rate': this.selectedStars[2] + 1},
      { 'categoryId': 4, 'rate': this.selectedStars[3] + 1},
      { 'categoryId': 5, 'rate': this.selectedStars[4] + 1},
      ], { withCredentials: true }).subscribe({
        next: (response) => {
          this.notificationService.showNotification(response.message);
          this.closePopup();
        },
        error: (response) => {
          if (response.error) {
            this.notificationService.showNotification(response.error.message, NotificationType.ERROR);
          }
        }
      });
  }

  closePopup() {
    this.popupService.closePopup();
  }
}
