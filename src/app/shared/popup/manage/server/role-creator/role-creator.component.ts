import { Component, Input } from '@angular/core';
import { RoleManageServerComponent } from '../../../../../manage/server/role/role.component';
import { PopupService } from '../../../../../../service/popup.service';
import { NotificationService, NotificationType } from '../../../../../../service/notification.service';
import { Utils } from '../../../../../../service/utils.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServerUserRole } from '../../../../../../model/server/server';

@Component({
  selector: 'app-role-creator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './role-creator.component.html',
  styleUrl: './role-creator.component.scss'
})
export class RoleCreatorPopupComponent {
  @Input() email: string = "";

  @Input() component!: RoleManageServerComponent;

  selectedRole: ServerUserRole = ServerUserRole.HELPER;

  constructor(
    private popupService: PopupService,
    private notificationService: NotificationService
  ) { }

  closePopup(){
    this.popupService.closePopup();
  }

  performAction(){
    this.email = this.email.trim();

    if(this.email.length==0){
      this.notificationService.showNotification("Wprowadź e-mail użytkownika", NotificationType.ERROR);
      return;
    }

    this.component.createRole(this.email, this.selectedRole);
  }
}
