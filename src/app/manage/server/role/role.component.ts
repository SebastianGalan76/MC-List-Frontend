import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ServerRole, ServerUserRole } from '../../../../model/server/server';
import { ManageServerComponent } from '../manageServer.component';
import { ApiService } from '../../../../service/api.service';
import { NotificationService, NotificationType } from '../../../../service/notification.service';
import { PopupService } from '../../../../service/popup.service';
import { defer, of, take } from 'rxjs';
import { RoleCreatorPopupComponent } from '../../../shared/popup/manage/server/role-creator/role-creator.component';
import { ObjectResponse } from '../../../../model/response/ObjectResponse';
import { Response } from '../../../../model/response/Response';
import { Utils } from '../../../../service/utils.service';

@Component({
  selector: 'app-role-manage-server',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss'
})
export class RoleManageServerComponent {
  roles: ServerRole[] = [];

  selectedRole: ServerRole | null = null;
  ServerUserRole = ServerUserRole;

  constructor(
    public parent: ManageServerComponent,
    private apiService: ApiService,
    private notificationService: NotificationService,
    private popupService: PopupService,
  ) {
    defer(() => this.parent.server ? of(null) : this.parent.serverInitialized).pipe(take(1)).subscribe(() => {
      this.roles = this.parent.server.roles;
    })
  }

  addRole() {
    this.popupService.showPopup(RoleCreatorPopupComponent, [{ name: "component", value: this }]);
  }

  createRole(email: string, role: ServerUserRole) {
    this.popupService.closePopup();
    this.apiService.post<ObjectResponse<ServerRole>>("/server/" + this.parent.server.id + "/manage/role", {
      email: email,
      role: role,
    }, { withCredentials: true }).subscribe({
      next: (response) => {
        this.notificationService.showNotification(response.message)

        var userRole = this.roles.find(role => role.email == email);
        if(userRole){
          userRole.role = role;
        }
        else{
          this.roles.push({
            email: email,
            role: role
          })
        }
      },
      error: (response) => {
        if (response.error) {
          this.notificationService.showNotification(response.error.message, NotificationType.ERROR);
        }
      }
    })
  }

  removeRole(linkToRemove: ServerRole, event: MouseEvent) {
    event.stopPropagation();

    this.apiService.post<Response>("/server/" + this.parent.server.id + "/manage/role/delete", linkToRemove, { withCredentials: true }).subscribe({
      next: (response) => {
        this.roles = this.roles.filter((link) => link !== linkToRemove);
        this.notificationService.showNotification(response.message)
      },
      error: (response) => {
        if (response.error) {
          this.notificationService.showNotification(response.error.message, NotificationType.ERROR);
        }
      }
    })
  }

  getRoleDisplay(roleKey: string): string {
    return Utils.getServerRoleDisplay(roleKey)
  }
}
