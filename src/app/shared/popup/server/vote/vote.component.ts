import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PopupService } from '../../../../../service/popup.service';
import { ApiService } from '../../../../../service/api.service';
import { NotificationService, NotificationType } from '../../../../../service/notification.service';
import { Response } from '../../../../../model/response/Response';

@Component({
  selector: 'app-vote',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './vote.component.html',
  styleUrl: './vote.component.scss'
})
export class VoteServerPopupComponent {
  @Input({required: true}) serverId!: number;

  nick: string = "";

  constructor(
    private popupService: PopupService,
    private apiService: ApiService,
    private notificationService: NotificationService
  ){}

  submit(){
    this.apiService.post<Response>('/vote', {
      'serverId': this.serverId,
      'nick': this.nick
    }, {withCredentials: true}).subscribe({
      next: (response) => {
        this.notificationService.showNotification(response.message);
        this.closePopup();
      },
      error: (response) => {
        if(response.error){
          this.notificationService.showNotification(response.error.message, NotificationType.ERROR);
          this.closePopup();
        }
      }
    })
  }

  closePopup(){
    this.popupService.closePopup();
  }
}
