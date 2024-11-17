import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PopupService } from '../../../../../../service/popup.service';
import { LinkManageServerComponent } from '../../../../../manage/server/link/link.component';
import { Utils } from '../../../../../../service/utils.service';
import { NotificationService, NotificationType } from '../../../../../../service/notification.service';

@Component({
  selector: 'app-link-creator',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './link-creator.component.html',
  styleUrl: './link-creator.component.scss'
})
export class LinkCreatorPopupComponent {
  @Input() editMode: boolean = false;

  @Input() linkName: string = "";
  @Input() linkUrl: string = "";

  @Input() linkPanel!: LinkManageServerComponent;

  constructor(
    private popupService: PopupService,
    private notificationService: NotificationService
  ) { }

  closePopup(){
    this.popupService.closePopup();
  }

  performAction(){
    this.linkName = this.linkName.trim();

    if(this.linkName.length==0){
      this.notificationService.showNotification("Wprowadź nazwę linku", NotificationType.ERROR);
      return;
    }

    if(!Utils.isLinkValid(this.linkUrl)){
      this.notificationService.showNotification("Wprowadź poprawny adres URL", NotificationType.ERROR);
      return;
    }

    if(this.editMode){
      this.linkPanel.editServerLink(this.linkName, this.linkUrl);
    }
    else{
      this.linkPanel.createServerLink(this.linkName, this.linkUrl);
    }
  }
}
