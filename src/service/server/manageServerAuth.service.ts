import { Injectable } from '@angular/core';
import { ServerUserRole } from '../../model/server/server';
import { Utils } from '../utils.service';

@Injectable({
  providedIn: 'root'
})
export class ManageServerAuthService {
  permissionMap = new Map<string, ServerUserRole>([
    ["manage/server/:ip", ServerUserRole.HELPER],
    ["info", ServerUserRole.MODERATOR],
    ["description", ServerUserRole.HELPER],
    ["banner", ServerUserRole.MODERATOR],
    ["mode", ServerUserRole.MODERATOR],
    ["link", ServerUserRole.MODERATOR],
    ["staff", ServerUserRole.HELPER],
    ["role", ServerUserRole.ADMINISTRATOR],
    ["remove", ServerUserRole.OWNER]
  ]);

  public hasPermission(path: string, role: ServerUserRole){
    var permission = this.permissionMap.get(path);
    if(!permission){
      return false;
    }

    return Utils.convertServerRoleToValue(this.getEnumValue(this.getRole(role))!) >= Utils.convertServerRoleToValue(this.getEnumValue(permission)!);
  }

  getRole(roleKey: string): string {
    return ServerUserRole[roleKey as keyof typeof ServerUserRole] || 'Użytkownik';
  }

  getEnumValue(value: string): ServerUserRole | undefined {
    return Object.entries(ServerUserRole).find(([key, val]) => val === value)?.[1] as ServerUserRole | undefined;
  }
}
