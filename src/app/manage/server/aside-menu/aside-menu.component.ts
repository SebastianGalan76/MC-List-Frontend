import { Component, Input } from '@angular/core';
import { User } from '../../../../service/user.service';
import { Server, ServerUserRole } from '../../../../model/server/server';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aside-menu-manage-server',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './aside-menu.component.html',
  styleUrl: './aside-menu.component.scss'
})
export class AsideMenuManageServerComponent {
  @Input({required: true}) user!: User;
  @Input({required: true}) server!: Server;

  ServerUserRole = ServerUserRole;

  getRoleDisplay(roleKey: string): string {
    return ServerUserRole[roleKey as keyof typeof ServerUserRole] || 'Użytkownik';
  }
}
