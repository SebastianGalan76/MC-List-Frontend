import { Component } from '@angular/core';
import { ManageServerComponent } from '../manageServer.component';
import { ApiService } from '../../../../service/api.service';
import { NotificationService, NotificationType } from '../../../../service/notification.service';
import { defer, of, take } from 'rxjs';
import { PopupService } from '../../../../service/popup.service';
import { LinkCreatorPopupComponent } from '../../../shared/popup/manage/server/link-creator/link-creator.component';
import { ServerLink } from '../../../../model/server/server';

import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Response } from '../../../../model/response/Response';
import { ObjectResponse } from '../../../../model/response/ObjectResponse';

@Component({
  selector: 'app-link-manage-server',
  standalone: true,
  imports: [DragDropModule, CommonModule],
  templateUrl: './link.component.html',
  styleUrl: './link.component.scss'
})
export class LinkManageServerComponent {
  links: ServerLink[] = [];

  selectedLink: ServerLink | null = null;

  constructor(
    public parent: ManageServerComponent,
    private apiService: ApiService,
    private notificationService: NotificationService,
    private popupService: PopupService,
  ) {
    defer(() => this.parent.server ? of(null) : this.parent.serverInitialized).pipe(take(1)).subscribe(() => {
      this.links = this.parent.server.links;
    })
  }

  addNewLink() {
    this.popupService.showPopup(LinkCreatorPopupComponent, [{ name: "linkPanel", value: this }]);
  }

  editLink(link: ServerLink) {
    this.popupService.showPopup(LinkCreatorPopupComponent, [
      { name: "editMode", value: true },
      { name: "linkName", value: link.name },
      { name: "linkUrl", value: link.url },
      { name: "linkPanel", value: this }
    ]);

    this.selectedLink = link;
  }

  onDrop(event: CdkDragDrop<ServerLink[]>) {
    const previousIndex = this.links.findIndex((link) => link === event.item.data);
    const currentIndex = event.currentIndex;

    if (previousIndex !== currentIndex) {
      const movedItem = this.links[previousIndex];
      this.links.splice(previousIndex, 1);
      this.links.splice(currentIndex, 0, movedItem);
    }
  }

  createServerLink(linkName: string, linkUrl: string) {
    const index = this.links.length;
    
    if(this.links.find(link => link.name.toLowerCase() == linkName.toLocaleLowerCase())){
      this.notificationService.showNotification("Wprowadzona nazwa linku jest już zajęta.", NotificationType.ERROR);
      return;
    }

    this.popupService.closePopup();
    this.apiService.post<ObjectResponse<ServerLink>>("/server/" + this.parent.server.id + "/manage/link", {
      index: index,
      name: linkName,
      url: linkUrl,
    }, { withCredentials: true }).subscribe({
      next: (response) => {
        this.notificationService.showNotification(response.message)

        this.links.push({
          name: response.object.name,
          url: response.object.url,
          id: response.object.id,
          index: response.object.index,
        })
      },
      error: (response) => {
        if (response.error) {
          this.notificationService.showNotification(response.error.message, NotificationType.ERROR);
        }
      }
    })
  }

  editServerLink(linkName: string, linkUrl: string) {
    this.popupService.closePopup();

    const linkByName = this.links.find(link => link.name.toLowerCase() == linkName.toLocaleLowerCase());
    if(linkByName != null && linkByName != this.selectedLink){
      this.notificationService.showNotification("Wprowadzona nazwa linku jest już zajęta.", NotificationType.ERROR);
      return;
    } 

    this.apiService.put<Response>("/server/" + this.parent.server.id + "/manage/link", {
      name: linkName,
      url: linkUrl,
      index: this.selectedLink?.index,
      id: this.selectedLink?.id
    }, { withCredentials: true }).subscribe({
      next: (response) => {
        if (this.selectedLink) {
          this.selectedLink.name = linkName;
          this.selectedLink.url = linkUrl;
        }

        this.notificationService.showNotification(response.message)
      },
      error: (response) => {
        if (response.error) {
          this.notificationService.showNotification(response.error.message, NotificationType.ERROR);

          if(response.error.errorCode == 3){
            this.links = this.links.filter((link) => link !== this.selectedLink);
          }
        }
      }
    })
  }

  removeServerLink(linkToRemove: ServerLink, event: MouseEvent) {
    event.stopPropagation();

    this.apiService.post<Response>("/server/" + this.parent.server.id + "/manage/link/delete", linkToRemove, { withCredentials: true }).subscribe({
      next: (response) => {
        this.links = this.links.filter((link) => link !== linkToRemove);
        this.notificationService.showNotification(response.message)
      },
      error: (response) => {
        if (response.error) {
          this.notificationService.showNotification(response.error.message, NotificationType.ERROR);
        }
      }
    })
  }

  save() {
    this.apiService.post<Response>("/server/" + this.parent.server.id + "/manage/link/all", this.links, { withCredentials: true }).subscribe({
      next: (response) => {
        this.notificationService.showNotification(response.message)
      },
      error: (response) => {
        if (response.error) {
          this.notificationService.showNotification(response.error.message, NotificationType.ERROR);
        }
      }
    })
  }
}
