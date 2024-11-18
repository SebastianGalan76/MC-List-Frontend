import { Component } from '@angular/core';
import { ServerMode } from '../../../../service/serverMode.service';
import { ManageServerComponent } from '../manageServer.component';
import { ApiService } from '../../../../service/api.service';
import { NotificationService, NotificationType } from '../../../../service/notification.service';
import { PopupService } from '../../../../service/popup.service';
import { defer, of, take } from 'rxjs';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { ObjectResponse } from '../../../../model/response/ObjectResponse';
import { Response } from '../../../../model/response/Response';
import { CommonModule } from '@angular/common';
import { SubServerCreatorPopupComponent } from '../../../shared/popup/manage/server/sub-server-creator/sub-server-creator.component';
import { SubServer } from '../../../../model/server/server';
import { ServerVersion } from '../../../../service/serverVersion.service';

@Component({
  selector: 'app-mode-manage-server',
  standalone: true,
  imports: [DragDropModule, CommonModule],
  templateUrl: './sub-server.component.html',
  styleUrl: './sub-server.component.scss'
})
export class SubServerManageServerComponent {
  subServers: SubServer[] = [];

  selectedSubServer: SubServer | null = null;

  constructor(
    public parent: ManageServerComponent,
    private apiService: ApiService,
    private notificationService: NotificationService,
    private popupService: PopupService,
  ) {
    defer(() => this.parent.server ? of(null) : this.parent.serverInitialized).pipe(take(1)).subscribe(() => {
      this.subServers = this.parent.server.subServers;
    })
  }

  add() {
    this.popupService.showPopup(SubServerCreatorPopupComponent, [{ name: "component", value: this }]);
  }

  edit(subServer: SubServer) {
    this.popupService.showPopup(SubServerCreatorPopupComponent, [
      { name: "editMode", value: true },
      { name: "name", value: subServer.name.name },
      { name: "color", value: subServer.name.color },
      { name: "mode", value: subServer.mode },
      { name: "versions", value: subServer.versions },
      { name: "component", value: this }
    ]);

    this.selectedSubServer = subServer;
  }

  onDrop(event: CdkDragDrop<ServerMode[]>) {
    const previousIndex = this.subServers.findIndex((link) => link === event.item.data);
    const currentIndex = event.currentIndex;

    if (previousIndex !== currentIndex) {
      const movedItem = this.subServers[previousIndex];
      this.subServers.splice(previousIndex, 1);
      this.subServers.splice(currentIndex, 0, movedItem);
    }
  }

  createSubServer(name: string, color: string, mode: ServerMode, versions: ServerVersion[]) {
    const index = this.subServers.length;

    this.popupService.closePopup();
    this.apiService.post<ObjectResponse<SubServer>>("/server/" + this.parent.server.id + "/manage/subserver", {
      index: index,
      name: name,
      color: color,
      mode: mode,
      versions: versions
    }, { withCredentials: true }).subscribe({
      next: (response) => {
        this.notificationService.showNotification(response.message)

        this.subServers.push({
          id: response.object.id,
          index: response.object.index,
          name: response.object.name,
          mode: response.object.mode,
          versions: response.object.versions
        })
      },
      error: (response) => {
        if (response.error) {
          this.notificationService.showNotification(response.error.message, NotificationType.ERROR);
        }
      }
    })
  }

  editSubServer(name: string, color: string, mode: ServerMode, versions: ServerVersion[]) {
    this.popupService.closePopup();

    this.apiService.put<Response>("/server/" + this.parent.server.id + "/manage/subserver", {
      index: this.selectedSubServer?.index,
      id: this.selectedSubServer?.id,
      name: name,
      color: color,
      mode: mode,
      versions: versions
    }, { withCredentials: true }).subscribe({
      next: (response) => {
        if (this.selectedSubServer) {
          this.selectedSubServer.name.name = name;
          this.selectedSubServer.name.color = color;
          this.selectedSubServer.mode = mode;
          this.selectedSubServer.versions = versions;
        }

        this.notificationService.showNotification(response.message)
      },
      error: (response) => {
        if (response.error) {
          this.notificationService.showNotification(response.error.message, NotificationType.ERROR);

          if(response.error.errorCode == 3){
            this.subServers = this.subServers.filter((link) => link !== this.selectedSubServer);
          }
        }
      }
    })
  }

  removeSubServer(itemToRemove: SubServer, event: MouseEvent) {
    event.stopPropagation();

    this.apiService.post<Response>("/server/" + this.parent.server.id + "/manage/subserver/delete", itemToRemove, { withCredentials: true }).subscribe({
      next: (response) => {
        this.subServers = this.subServers.filter((subServer) => subServer !== itemToRemove);
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
    this.apiService.post<Response>("/server/" + this.parent.server.id + "/manage/subserver/all", this.subServers, { withCredentials: true }).subscribe({
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
