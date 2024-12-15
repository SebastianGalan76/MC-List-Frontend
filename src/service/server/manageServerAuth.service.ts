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
    ["remove", ServerUserRole.OWNER],
    ["promote", ServerUserRole.HELPER]
  ]);

  public hasPermission(path: string, role: string): boolean {
    const permission = this.permissionMap.get(path);

    if (permission === undefined) {
      console.error(`Path "${path}" does not exist in permission map.`);
      return false;
    }

    var roleNumber = Utils.getRoleNumber(role);
    return roleNumber >= permission;
  }
}
