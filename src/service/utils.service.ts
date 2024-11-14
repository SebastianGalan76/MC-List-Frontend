import { Injectable } from '@angular/core';

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

  static checkBannerFile(file: File): number {
    if(!file){
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
}
