import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { User } from '../../../../service/user.service';
import { Server, ServerUserRole } from '../../../../model/server/server';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ManageServerComponent } from '../manageServer.component';
import { defer, of, take } from 'rxjs';
import { Utils } from '../../../../service/utils.service';

@Component({
  selector: 'app-aside-menu-manage-server',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './aside-menu.component.html',
  styleUrl: './aside-menu.component.scss'
})
export class AsideMenuManageServerComponent {
  @Input({required: true}) user!: User;

  server!: Server;
  ServerUserRole = ServerUserRole;

  hasHelperPermission: boolean = false;
  hasModeratorPermission: boolean = false;
  hasAdminPermission: boolean = false;
  hasOwnerPermission: boolean = false;

  constructor(private parent: ManageServerComponent) {
    defer(() => this.parent.server ? of(null) : this.parent.serverInitialized).pipe(take(1)).subscribe(() => {
      this.server = parent.server;

      this.hasHelperPermission = this.hasPermission(this.server.role, ServerUserRole.HELPER);
      this.hasModeratorPermission = this.hasPermission(this.server.role, ServerUserRole.MODERATOR);
      this.hasAdminPermission = this.hasPermission(this.server.role, ServerUserRole.ADMINISTRATOR);
      this.hasOwnerPermission = this.hasPermission(this.server.role, ServerUserRole.OWNER);
    })
  }

  getRole(roleKey: string): string {
    return ServerUserRole[roleKey as keyof typeof ServerUserRole] || 'Użytkownik';
  }

  hasPermission(role: string, minPermission: ServerUserRole): boolean {
    return Utils.convertServerRoleToValue(ServerUserRole[role as keyof typeof ServerUserRole]) >= Utils.convertServerRoleToValue(minPermission);
  }

  
}
