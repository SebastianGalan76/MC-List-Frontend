import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Utils } from '../../../service/utils.service';
import { NotificationService, NotificationType } from '../../../service/notification.service';
import { ApiService } from '../../../service/api.service';
import { BannerService } from '../../../service/banner.service';
import { ObjectResponse } from '../../../model/response/ObjectResponse';
import { Banner } from '../../../model/banner';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.scss'
})
export class BannerPurchaseComponent {
  selectedSize: number = 0;

  url: string = "";
  fileName: string = "Nie wybrano pliku";
  selectedFile?: File;
  imageUrl?: string;

  constructor(
    private apiService: ApiService,
    private bannerService: BannerService,
    private notificationService: NotificationService
  ) {
    Utils.scrollToTop();
  }

  selectBanner(size: number) {
    this.selectedSize = size;
  }

  submit() {
    if (this.selectedSize == 0) {
      this.notificationService.showNotification("Wybierz rozmiar", NotificationType.ERROR);
      return;
    }

    const formData = new FormData();

    if (this.selectedFile) {
      switch (Utils.checkBannerFile(this.selectedFile)) {
        case 1:
          this.notificationService.showNotification("Akceptujemy jedynie rozszerzenia jpeg, png, gif i webp", NotificationType.ERROR);
          return;
        case 2:
          this.notificationService.showNotification("Rozmiar pliku jest za duży", NotificationType.ERROR);
          return;
      }

      formData.append('file', this.selectedFile);
    }
    else {
      this.notificationService.showNotification("Prześlij plik z rozszerzeniem jpeg, png, gif lub webp", NotificationType.ERROR);
      return;
    }

    if (this.isLinkValid(this.url)) {
      formData.append('url', this.url);
    }
    else {
      this.notificationService.showNotification("Wprowadź poprawny docelowy link!", NotificationType.ERROR);
      return;
    }

    formData.append('size', this.selectedSize == 1 ? 'BIG' : 'SMALL');

    this.apiService.post<ObjectResponse<Banner>>('/banner', formData, { withCredentials: true }).subscribe({
      next: (response) => {
        this.notificationService.showNotification(response.message);
        this.bannerService.addBanner(response.object);
      },
      error: (response) => {
        if (response.error) {
          this.notificationService.showNotification(response.error.message, NotificationType.ERROR);
        }
      }
    })
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      if (this.selectedFile) {
        switch (Utils.checkBannerFile(this.selectedFile)) {
          case 1:
            this.notificationService.showNotification("Akceptujemy jedynie rozszerzenia jpeg, png, gif i webp", NotificationType.ERROR);
            return;
          case 2:
            this.notificationService.showNotification("Rozmiar pliku jest za duży", NotificationType.ERROR);
            return;
        }

        this.fileName = this.selectedFile.name;
        this.createImagePreview(this.selectedFile);
      }
    } else {
      this.fileName = 'Nie wybrano pliku';
      this.selectedFile = undefined;
      this.imageUrl = undefined;
    }
  }

  createImagePreview(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  isLinkValid(input: string) {
    if (!input) {
      return true;
    }

    var URL_REGEX = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return URL_REGEX.test(input);
  }
}
