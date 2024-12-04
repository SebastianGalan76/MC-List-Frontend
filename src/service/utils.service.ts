import { Injectable } from '@angular/core';
import { ServerVersion } from './serverVersion.service';
import { ServerUserRole } from '../model/server/server';

@Injectable({
  providedIn: 'root'
})
export class Utils {

  static isLinkValid(input: string) {
    if (!input) {
      return false;
    }

    var URL_REGEX = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return URL_REGEX.test(input);
  }

  static checkBannerFile(file: File | null): number {
    if (!file) {
      return 1;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return 2;
    }

    if (file.size > 4 * 1024 * 1024) {
      return 3;
    }

    return -1;
  }

  static isPortValid(port: number | null): boolean {
    if (port == null) {
      return true;
    }

    if (port < 0 || port > 65535) {
      return false;
    }

    return true;
  }

  static isAddressValid(address: string): boolean {
    const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (ipv4Regex.test(address)) {
      return true;
    }

    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    if (ipv6Regex.test(address)) {
      return true;
    }

    const domainRegex = /^[a-zA-Z0-9]+([\-\.]{1}[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;
    return domainRegex.test(address);
  }

  static convertVersions(versions: ServerVersion[]): string | null {
    if (versions != null && versions.length > 0) {
      const sortedArray = versions.sort((a, b) => a.id - b.id);

      const minValue = sortedArray[0];
      const maxValue = sortedArray[sortedArray.length - 1];

      if (minValue.id == maxValue.id) {
        return minValue.name;
      }
      else {
        return minValue.name + " - " + maxValue.name;
      }
    }
    return null;
  }

  static convertServerRoleToValue(roleKey: ServerUserRole): number {
    if (roleKey === ServerUserRole.HELPER) {
      return 500;
    }
    if (roleKey === ServerUserRole.MODERATOR) {
      return 750;
    }
    if (roleKey === ServerUserRole.ADMINISTRATOR) {
      return 1000;
    }
    if (roleKey === ServerUserRole.OWNER) {
      return 5000;
    }

    return 0;
  }

  static scrollToTop(smooth: boolean = false) {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: smooth ? 'smooth' : 'auto',
    });
  }
}
