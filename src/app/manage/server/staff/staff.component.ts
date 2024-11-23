import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ServerStaff, ServerStaffPlayer } from '../../../../model/server/server';
import { ManageServerComponent } from '../manageServer.component';
import { ApiService } from '../../../../service/api.service';
import { NotificationService, NotificationType } from '../../../../service/notification.service';
import { PopupService } from '../../../../service/popup.service';
import { defer, of, take } from 'rxjs';
import { Response } from '../../../../model/response/Response';
import { ObjectResponse } from '../../../../model/response/ObjectResponse';
import { RankCreatorPopupComponent } from '../../../shared/popup/manage/server/rank-creator/rank-creator.component';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-staff-manage-server',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.scss'
})
export class StaffManageServerComponent {
  staff: ServerStaff[] = [];

  selectedRank: ServerStaff | null = null;

  constructor(
    public parent: ManageServerComponent,
    private apiService: ApiService,
    private notificationService: NotificationService,
    private popupService: PopupService,
  ) {
    defer(() => this.parent.server ? of(null) : this.parent.serverInitialized).pipe(take(1)).subscribe(() => {
      this.staff = this.parent.server.staff;
    })
  }

  addRank() {
    this.popupService.showPopup(RankCreatorPopupComponent, [{ name: "component", value: this }]);
  }

  editRank(rank: ServerStaff) {
    this.selectedRank = rank;

    this.popupService.showPopup(RankCreatorPopupComponent, [
      { name: "component", value: this },
      { name: "editMode", value: true },
      { name: "name", value: rank.name },
      { name: "color", value: rank.color },
      { name: "players", value: rank.players },
    ]);
  }

  createRank(name: string, color: string, players: ServerStaffPlayer[]) {
    this.popupService.closePopup();
    const index = this.staff.length;

    this.apiService.post<ObjectResponse<ServerStaff>>("/server/" + this.parent.server.id + "/manage/staff", {
      name: name,
      color: color,
      players: players,
      index: index,
    }, { withCredentials: true }).subscribe({
      next: (response) => {
        this.notificationService.showNotification(response.message)

        this.staff.push({
          name: name,
          color: color,
          id: response.object.id,
          index: index,
          players: response.object.players,
        })
      },
      error: (response) => {
        if (response.error) {
          this.notificationService.showNotification(response.error.message, NotificationType.ERROR);
        }
      }
    })
  }

  edit(name: string, color: string, players: ServerStaffPlayer[]) {
    this.popupService.closePopup();

    if (!this.selectedRank) {
      return;
    }

    this.apiService.put<Response>("/server/" + this.parent.server.id + "/manage/staff", {
      id: this.selectedRank.id,
      name: name,
      color: color,
      players: players,
      index: this.selectedRank.index,
    }, { withCredentials: true }).subscribe({
      next: (response) => {
        this.notificationService.showNotification(response.message)

        if (this.selectedRank) {
          this.selectedRank.name = name;
          this.selectedRank.color = color;
          this.selectedRank.players = players;

          this.selectedRank = null;
        }
      },
      error: (response) => {
        if (response.error) {
          this.notificationService.showNotification(response.error.message, NotificationType.ERROR);
        }
      }
    })
  }

  removeRank(staffToRemove: ServerStaff, event: MouseEvent) {
    event.stopPropagation();

    this.apiService.post<Response>("/server/" + this.parent.server.id + "/manage/staff/delete", staffToRemove, { withCredentials: true }).subscribe({
      next: (response) => {
        this.staff = this.staff.filter((rank) => rank !== staffToRemove);
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
    this.apiService.post<Response>("/server/" + this.parent.server.id + "/manage/staff/all", this.staff, { withCredentials: true }).subscribe({
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

  onDrop(event: CdkDragDrop<ServerStaff[]>) {
    const previousIndex = this.staff.findIndex((rank) => rank === event.item.data);
    const currentIndex = event.currentIndex;

    if (previousIndex !== currentIndex) {
      const movedItem = this.staff[previousIndex];
      this.staff.splice(previousIndex, 1);
      this.staff.splice(currentIndex, 0, movedItem);
    }
  }
}
