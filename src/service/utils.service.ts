import { Injectable } from '@angular/core';
import { ServerVersion } from './serverVersion.service';
import { ServerUserRole } from '../model/server/server';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class Utils {
  static backendDomain = "http://localhost:8080";

  static getImageUrl(path: string) {
    return this.backendDomain + path;
  }


  static copyToClipboard(text: string, notificationService: NotificationService) {
    navigator.clipboard.writeText(text).then(() => {
      notificationService.showNotification("Skopiowano " + text + " do schowka");
    })
  }

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

  static getRoleNumber(role: string): number {
    if (!isNaN(Number(role))) {
      return Number(role);
    }
    else {
      return ServerUserRole[role as keyof typeof ServerUserRole];
    }
  }

  static getServerRoleDisplay(roleKey: string): string {
    switch (this.getRoleNumber(roleKey)) {
      case 500:
        return "Pomocnik";
      case 750:
        return "Moderator";
      case 1000:
        return "Administrator";
      case 5000:
        return "Właściciel";
    }

    return "Użytkownik";
  }

  static scrollToTop(smooth: boolean = false) {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: smooth ? 'smooth' : 'auto',
    });
  }
}
