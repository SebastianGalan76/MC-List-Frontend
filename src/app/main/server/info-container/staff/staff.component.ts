import { Component } from '@angular/core';
import { ServerComponent } from '../../server.component';
import { NotificationService } from '../../../../../service/notification.service';

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.scss'
})
export class ServerStaffComponent {

  constructor(
    public parent: ServerComponent,
    private notificationService: NotificationService
  ) {
    
  }

  copy(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.notificationService.showNotification("Skopiowano " + text + " do schowka");
    })
  }
}
